import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, screen } from '@testing-library/react';
import React from 'react';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const fetching = { count: 0 };

/**
 * `useIsFetching` is the only thing the hook reads, so it is the only thing
 * replaced. Driving a real query to a controlled in-flight state would test
 * react-query rather than this hook.
 */
jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useIsFetching: () => fetching.count,
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

import { useDeferred } from '../useDeferred';

const Probe: React.FC = () => {
  const ready = useDeferred();
  return <span data-testid="ready">{ready ? 'yes' : 'no'}</span>;
};

const renderProbe = () =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <Probe />
    </QueryClientProvider>,
  );

const state = (): string => screen.getByTestId('ready').textContent ?? '';

describe('useDeferred', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    fetching.count = 0;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('does not release on the idle moment before the page has asked for anything', () => {
    // The hook mounts above the table, so its first effect runs before that
    // table has started fetching. An idle check alone would release here and
    // defer nothing, which is the whole point of the hook.
    renderProbe();

    expect(state()).toBe('no');
  });

  it('stays held while a request is in flight', () => {
    const { rerender } = renderProbe();

    act(() => {
      fetching.count = 1;
      rerender(
        <QueryClientProvider client={new QueryClient()}>
          <Probe />
        </QueryClientProvider>,
      );
    });

    expect(state()).toBe('no');
  });

  it('releases once traffic has been seen and then goes quiet', () => {
    const client = new QueryClient();
    const { rerender } = render(
      <QueryClientProvider client={client}>
        <Probe />
      </QueryClientProvider>,
    );

    act(() => {
      fetching.count = 1;
      rerender(
        <QueryClientProvider client={client}>
          <Probe />
        </QueryClientProvider>,
      );
    });
    expect(state()).toBe('no');

    act(() => {
      fetching.count = 0;
      rerender(
        <QueryClientProvider client={client}>
          <Probe />
        </QueryClientProvider>,
      );
    });

    expect(state()).toBe('yes');
  });

  it('releases on the ceiling even if no request ever happens', () => {
    // Without this a page with nothing of its own to wait on would hold the
    // deferred request forever.
    renderProbe();
    expect(state()).toBe('no');

    act(() => {
      jest.advanceTimersByTime(4000);
    });

    expect(state()).toBe('yes');
  });

  it('does not release on the ceiling while a request is still in flight', () => {
    // The ceiling is for a page that never asked for anything. Firing it on a
    // page whose own request is still running does the one thing this hook
    // exists to prevent, and a slow connection is exactly when it happens.
    const client = new QueryClient();
    fetching.count = 1;
    const { rerender } = render(
      <QueryClientProvider client={client}>
        <Probe />
      </QueryClientProvider>,
    );

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(state()).toBe('no');

    // And it still releases once that request finishes, so the ceiling is not
    // simply disabled for a page that does have traffic.
    act(() => {
      fetching.count = 0;
      rerender(
        <QueryClientProvider client={client}>
          <Probe />
        </QueryClientProvider>,
      );
    });

    expect(state()).toBe('yes');
  });

  it('stays released when a later refetch starts', () => {
    // Paging or the refresh control must not hide badges that are already on
    // screen.
    const client = new QueryClient();
    const wrap = () => (
      <QueryClientProvider client={client}>
        <Probe />
      </QueryClientProvider>
    );
    const { rerender } = render(wrap());

    act(() => {
      fetching.count = 1;
      rerender(wrap());
    });
    act(() => {
      fetching.count = 0;
      rerender(wrap());
    });
    expect(state()).toBe('yes');

    act(() => {
      fetching.count = 2;
      rerender(wrap());
    });

    expect(state()).toBe('yes');
  });

  it('releases at the hard ceiling even while a request is still in flight', () => {
    // The narrowed ceiling above is right, but a queryFn that pages
    // sequentially can hold in-flight state far past any single request's
    // timeout. Late is better than never.
    fetching.count = 1;
    renderProbe();

    act(() => {
      jest.advanceTimersByTime(14000);
    });
    expect(state()).toBe('no');

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(state()).toBe('yes');
  });
});
