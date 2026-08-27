import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const settled = { value: false };

/**
 * `useDeferred` has its own spec, so here it is replaced by the one bit the
 * hook reads from it. What is under test is the wiring: which of the two
 * requests waits for that signal, and which does not.
 */
jest.mock('@/components/DataList/useDeferred', () => ({
  useDeferred: () => settled.value,
}));

jest.mock('@/services/requests/accounts', () => ({
  genesisTimestampCall: jest.fn(),
  validatorOwnersCall: jest.fn(),
}));

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

import {
  genesisTimestampCall,
  validatorOwnersCall,
} from '@/services/requests/accounts';
import { useAccountBadgeSources } from '../useAccountBadgeSources';

const mockedGenesis = genesisTimestampCall as jest.Mock;
const mockedOwners = validatorOwnersCall as jest.Mock;

const GENESIS_MS = 1656680400000;

const Probe: React.FC<{ eager?: boolean }> = ({ eager }) => {
  const { owners, genesisTimestamp } = useAccountBadgeSources(eager);
  return (
    <span data-testid="state">
      {`${genesisTimestamp ?? '-'}|${owners ? Object.keys(owners).length : '-'}`}
    </span>
  );
};

const renderProbe = (props: { eager?: boolean } = {}) =>
  render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      <Probe {...props} />
    </QueryClientProvider>,
  );

const state = (): string => screen.getByTestId('state').textContent ?? '';

describe('useAccountBadgeSources', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    settled.value = false;
    mockedGenesis.mockResolvedValue(GENESIS_MS);
    mockedOwners.mockResolvedValue({ klv1a: { isGenesis: true, list: 'e' } });
  });

  it('fetches the genesis moment with the table, not after it', async () => {
    // It feeds the only badge that shows on page one, and it is one small
    // request, so it must not wait on the deferral.
    renderProbe();

    await waitFor(() => expect(state()).toBe(`${GENESIS_MS}|-`));
    expect(mockedGenesis).toHaveBeenCalled();
  });

  it('holds the validator set back until the table has settled', async () => {
    renderProbe();

    await waitFor(() => expect(mockedGenesis).toHaveBeenCalled());
    expect(mockedOwners).not.toHaveBeenCalled();
  });

  it('releases the validator set once the table has settled', async () => {
    settled.value = true;
    renderProbe();

    await waitFor(() => expect(state()).toBe(`${GENESIS_MS}|1`));
  });

  it('skips the wait when asked to be eager', async () => {
    // This is the whole contract of the argument. The genesis validator filter
    // decides which rows exist from this set, so deferring it there shows an
    // empty table that fills in afterwards, which reads as "no results".
    settled.value = false;
    renderProbe({ eager: true });

    await waitFor(() => expect(mockedOwners).toHaveBeenCalled());
  });

  it('defers by default, so a caller that passes nothing does not fetch early', async () => {
    // Guards the default value of the parameter itself: `useAccountBadgeSources()`
    // with no argument must behave as the unfiltered list, not as the filter.
    renderProbe({ eager: undefined });

    await waitFor(() => expect(mockedGenesis).toHaveBeenCalled());
    expect(mockedOwners).not.toHaveBeenCalled();
  });
});
