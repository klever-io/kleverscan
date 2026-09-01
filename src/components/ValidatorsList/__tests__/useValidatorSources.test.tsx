import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, screen, waitFor } from '@testing-library/react';
import React from 'react';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const mockFetchAll = jest.fn();
const mockHeartbeat = jest.fn();

jest.mock('@/services/requests/validators', () => ({
  fetchAllValidators: (...args: unknown[]) => mockFetchAll(...args),
}));

jest.mock('@/services/requests/heartbeat', () => ({
  fetchHeartbeatStatus: (...args: unknown[]) => mockHeartbeat(...args),
}));

// RTL 12 renders through the legacy `react-dom` entry, which React 19 removed.
// Same shim `DataList/__tests__/useDeferred.test.tsx` uses.
jest.mock('react-dom', () => {
  const actual = jest.requireActual('react-dom');
  const client = jest.requireActual('react-dom/client');
  const ReactLib = jest.requireActual('react');
  const roots = new Map<
    Element,
    { render: (ui: React.ReactNode) => void; unmount: () => void }
  >();

  return {
    ...actual,
    render: (ui: React.ReactNode, container: Element) => {
      let root = roots.get(container);
      if (!root) {
        root = client.createRoot(container);
        roots.set(container, root);
      }
      ReactLib.act(() => {
        root.render(ui);
      });
      return root;
    },
    unmountComponentAtNode: (container: Element) => {
      const root = roots.get(container);
      if (!root) return false;
      ReactLib.act(() => {
        root.unmount();
      });
      roots.delete(container);
      return true;
    },
  };
});

import { useValidatorSources } from '../useValidatorSources';

const list = {
  validators: [{ blsPublicKey: 'BLS1', staked: 10 }],
  totalRecords: 1,
  networkTotalStake: 100,
};

const heartbeat = {
  versionMap: { bls1: 'v1.7.21' },
  latestVersion: 'v1.7.21',
  entries: [{ publicKey: 'BLS1', versionNumber: 'v1.7.21', isActive: true }],
};

/** RTL 12 has no `renderHook`, so the hook is read through a probe, the way
 *  the other hook suites here do it. */
let latest: ReturnType<typeof useValidatorSources>;

const Probe: React.FC<{ poll?: boolean }> = ({ poll = false }) => {
  latest = useValidatorSources(poll);
  return (
    <span data-testid="state">{latest.isLoading ? 'loading' : 'ready'}</span>
  );
};

const renderSources = (poll = false) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <Probe poll={poll} />
    </QueryClientProvider>,
  );
};

const settle = async () =>
  waitFor(() => expect(screen.getByTestId('state').textContent).toBe('ready'));

describe('useValidatorSources', () => {
  beforeEach(() => {
    mockFetchAll.mockReset();
    mockHeartbeat.mockReset();
  });

  it('hands both sources over once they resolve', async () => {
    mockFetchAll.mockResolvedValue(list);
    mockHeartbeat.mockResolvedValue(heartbeat);

    renderSources();
    await settle();

    expect(latest.data.validators).toHaveLength(1);
    expect(latest.data.networkTotalStake).toBe(100);
    expect(latest.data.versionMap).toEqual({ bls1: 'v1.7.21' });
    expect(latest.data.entries).toHaveLength(1);
    expect(latest.data.heartbeatAvailable).toBe(true);
    expect(latest.data.validatorsAvailable).toBe(true);
  });

  // The reason it is `allSettled` and not `all`: either half failing used to
  // take the whole card down, when only one figure depends on each.
  it('keeps the list when the heartbeat throws', async () => {
    mockFetchAll.mockResolvedValue(list);
    mockHeartbeat.mockRejectedValue(new Error('node down'));

    renderSources();
    await settle();

    expect(latest.data.validators).toHaveLength(1);
    expect(latest.data.validatorsAvailable).toBe(true);
    expect(latest.data.heartbeatAvailable).toBe(false);
    expect(latest.data.versionMap).toEqual({});
    expect(latest.data.entries).toEqual([]);
  });

  it('keeps the heartbeat when the list throws', async () => {
    mockFetchAll.mockRejectedValue(new Error('proxy down'));
    mockHeartbeat.mockResolvedValue(heartbeat);

    renderSources();
    await settle();

    expect(latest.data.heartbeatAvailable).toBe(true);
    expect(latest.data.validatorsAvailable).toBe(false);
    expect(latest.data.validators).toEqual([]);
    expect(latest.data.networkTotalStake).toBe(0);
  });

  // `fetchHeartbeatStatus` resolves undefined on failure rather than throwing,
  // so a settled promise is not proof the heartbeat arrived.
  it('reads a resolved undefined heartbeat as unavailable', async () => {
    mockFetchAll.mockResolvedValue(list);
    mockHeartbeat.mockResolvedValue(undefined);

    renderSources();
    await settle();

    expect(latest.data.heartbeatAvailable).toBe(false);
  });

  it('keeps asking while one half is still missing', async () => {
    // The query cannot reject: both halves are settled, so a failed source is
    // a successful answer carrying a fallback and react-query's own retry
    // never fires. Without this interval a transient outage held until the
    // reader navigated away and back.
    jest.useFakeTimers();
    mockFetchAll.mockResolvedValue(list);
    mockHeartbeat.mockResolvedValue(undefined);

    renderSources(true);
    await act(async () => {
      await Promise.resolve();
    });
    const first = mockFetchAll.mock.calls.length;

    await act(async () => {
      jest.advanceTimersByTime(31_000);
      await Promise.resolve();
    });

    expect(mockFetchAll.mock.calls.length).toBeGreaterThan(first);
    jest.useRealTimers();
  });

  it('stops asking once both halves have answered', async () => {
    jest.useFakeTimers();
    mockFetchAll.mockResolvedValue(list);
    mockHeartbeat.mockResolvedValue(heartbeat);

    renderSources(true);
    await act(async () => {
      await Promise.resolve();
    });
    const first = mockFetchAll.mock.calls.length;

    await act(async () => {
      jest.advanceTimersByTime(120_000);
      await Promise.resolve();
    });

    expect(mockFetchAll.mock.calls.length).toBe(first);
    jest.useRealTimers();
  });

  it('does not poll for a reader that did not ask for it', async () => {
    jest.useFakeTimers();
    mockFetchAll.mockResolvedValue(list);
    mockHeartbeat.mockResolvedValue(undefined);

    renderSources();
    await act(async () => {
      await Promise.resolve();
    });
    const first = mockFetchAll.mock.calls.length;

    await act(async () => {
      jest.advanceTimersByTime(120_000);
      await Promise.resolve();
    });

    expect(mockFetchAll.mock.calls.length).toBe(first);
    jest.useRealTimers();
  });

  it('gives up after ten tries rather than polling a dead node forever', async () => {
    // The heartbeat parser returns undefined for a failed request AND for a
    // node that reports no usable entries, and the second may never clear.
    // Without a cap that is a poll for the life of the tab.
    jest.useFakeTimers();
    mockFetchAll.mockResolvedValue(list);
    mockHeartbeat.mockResolvedValue(undefined);

    renderSources(true);
    await act(async () => {
      await Promise.resolve();
    });

    for (let tick = 0; tick < 12; tick += 1) {
      await act(async () => {
        jest.advanceTimersByTime(31_000);
        await Promise.resolve();
      });
    }

    // The mount plus ten polls, and nothing after that.
    expect(mockHeartbeat.mock.calls.length).toBeLessThanOrEqual(11);
    expect(mockHeartbeat.mock.calls.length).toBeGreaterThan(5);
    jest.useRealTimers();
  });

  it('asks each source exactly once for one mount', async () => {
    mockFetchAll.mockResolvedValue(list);
    mockHeartbeat.mockResolvedValue(heartbeat);

    renderSources();
    await settle();

    expect(mockFetchAll).toHaveBeenCalledTimes(1);
    expect(mockHeartbeat).toHaveBeenCalledTimes(1);
  });
});
