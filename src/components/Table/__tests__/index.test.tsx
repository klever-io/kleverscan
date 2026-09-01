import theme from '@/styles/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

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

// The real module reaches precisionFunctions, whose ESM chain Jest cannot
// transform; the table needs only this one hook from it.
jest.mock('@/utils/hooks', () => {
  const { useEffect, useRef } = jest.requireActual('react');
  return {
    useDidUpdateEffect: (fn: () => void, inputs: unknown[]): void => {
      const didMountRef = useRef(false);
      useEffect(() => {
        if (didMountRef.current) return fn();
        didMountRef.current = true;
      }, inputs);
    },
  };
});

// Same chain, via utils/csv and utils/contracts.
jest.mock('../ExportButton', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('next/router', () => ({
  useRouter: () => ({
    query: {},
    pathname: '/test',
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

jest.mock('@/contexts/mobile', () => ({
  useMobile: () => ({ isMobile: false, isTablet: false }),
}));

import Table, { ITable } from '../index';

/** The state-holding cell content: the bug this suite pins was every cell
 *  remounting per table render, which reset exactly this kind of state. */
const StatefulCell: React.FC = () => {
  const [count, setCount] = React.useState(0);
  return (
    <button
      type="button"
      data-testid="stateful-cell"
      onClick={() => setCount(current => current + 1)}
    >
      count:{count}
    </button>
  );
};

const makeResponse = (items: Array<Record<string, unknown>>) => ({
  data: { items },
  error: '',
  code: '',
  pagination: {
    self: 1,
    next: 1,
    previous: 1,
    perPage: 10,
    totalPages: 1,
    totalRecords: items.length,
  },
});

/**
 * Built fresh per call, exactly as the pages do: every render hands the table
 * new arrow functions for `rowSections` and its cells, the situation that used
 * to give each cell a new component identity and remount it.
 */
const makeProps = (
  request: ITable['request'],
  options: {
    refreshKey?: number;
    smaller?: boolean;
    cardBreakpoint?: number;
    MobileCard?: ITable['MobileCard'];
  } = {},
): ITable => ({
  type: 'accounts',
  header: ['Cell', 'Other'],
  rowSections: () => [
    { element: () => <StatefulCell />, span: 1 },
    {
      element: ({ $smaller }) => (
        <span data-testid="plain-cell">{String(!!$smaller)}</span>
      ),
      span: 1,
    },
  ],
  request,
  dataName: 'items',
  showLimit: false,
  showPagination: false,
  refreshKey: options.refreshKey,
  smaller: options.smaller,
  cardBreakpoint: options.cardBreakpoint,
  MobileCard: options.MobileCard,
});

const renderTable = (ui: React.ReactElement) => {
  const client = new QueryClient();
  const wrap = (element: React.ReactElement) => (
    <QueryClientProvider client={client}>
      <ThemeProvider theme={theme}>{element}</ThemeProvider>
    </QueryClientProvider>
  );
  const view = render(wrap(ui));
  return {
    rerenderTable: (next: React.ReactElement) => view.rerender(wrap(next)),
  };
};

describe('Table row cells', () => {
  it('updates a cell in place across re-renders, keeping DOM node and state', async () => {
    const request = async () => makeResponse([{ id: 1 }]);
    const { rerenderTable } = renderTable(<Table {...makeProps(request)} />);

    const cell = await screen.findByTestId('stateful-cell');
    fireEvent.click(cell);
    expect(cell).toHaveTextContent('count:1');

    rerenderTable(<Table {...makeProps(request)} />);

    const cellAfter = screen.getByTestId('stateful-cell');
    expect(cellAfter).toBe(cell);
    expect(cellAfter).toHaveTextContent('count:1');
  });

  // The opposite direction, so in-place updating cannot overshoot: new data
  // means a new row key, and that remount is what refreshes cell state that
  // was seeded from the old item.
  it('still remounts the row when the item itself changes', async () => {
    let items = [{ id: 1 }];
    const request = async () => makeResponse(items);
    const { rerenderTable } = renderTable(
      <Table {...makeProps(request, { refreshKey: 1 })} />,
    );

    const cell = await screen.findByTestId('stateful-cell');
    fireEvent.click(cell);
    expect(cell).toHaveTextContent('count:1');

    items = [{ id: 2 }];
    rerenderTable(<Table {...makeProps(request, { refreshKey: 2 })} />);

    await waitFor(() => {
      expect(screen.getByTestId('stateful-cell')).toHaveTextContent('count:0');
    });
    expect(screen.getByTestId('stateful-cell')).not.toBe(cell);
  });

  it('hands every cell the $smaller prop', async () => {
    const request = async () => makeResponse([{ id: 1 }]);
    renderTable(<Table {...makeProps(request, { smaller: true })} />);

    expect(await screen.findByTestId('plain-cell')).toHaveTextContent('true');
  });
});

/**
 * The card/row switch a wide list opts into. `useMobile` is mocked false above,
 * so the only thing that can flip it here is the breakpoint, which is the
 * point: this is the path three pages and five call sites depend on, and none
 * of it was executed by a test.
 */
describe('Table cardBreakpoint', () => {
  const realMatchMedia = window.matchMedia;

  const setBelowBreakpoint = (matches: boolean): void => {
    window.matchMedia = ((media: string) => ({
      media,
      matches,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    })) as unknown as typeof window.matchMedia;
  };

  const MobileCardStub: ITable['MobileCard'] = ({ item }) => (
    <div data-testid="mobile-card">{`card:${item.id}`}</div>
  );

  afterEach(() => {
    window.matchMedia = realMatchMedia;
  });

  it('renders cards, and no header, under the breakpoint', async () => {
    setBelowBreakpoint(true);
    const request = async () => makeResponse([{ id: 1 }]);

    renderTable(
      <Table
        {...makeProps(request, {
          cardBreakpoint: 1240,
          MobileCard: MobileCardStub,
        })}
      />,
    );

    expect(await screen.findByTestId('mobile-card')).toHaveTextContent(
      'card:1',
    );
    expect(screen.queryByTestId('table-header')).toBeNull();
    expect(screen.queryByTestId('stateful-cell')).toBeNull();
  });

  /* The other direction, and the one that would break the desktop table for
     every page at once if the hook ever answered true by default. */
  it('renders rows and the header over the breakpoint', async () => {
    setBelowBreakpoint(false);
    const request = async () => makeResponse([{ id: 1 }]);

    renderTable(
      <Table
        {...makeProps(request, {
          cardBreakpoint: 1240,
          MobileCard: MobileCardStub,
        })}
      />,
    );

    expect(await screen.findByTestId('stateful-cell')).toBeInTheDocument();
    expect(screen.getByTestId('table-header')).toBeInTheDocument();
    expect(screen.queryByTestId('mobile-card')).toBeNull();
  });

  /* A table that does not opt in must not consult the viewport at all, or
     every existing list would gain a breakpoint it never asked for. */
  it('leaves a table without the prop on the shared breakpoint', async () => {
    const matchMedia = jest.fn(() => ({
      matches: true,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    }));
    window.matchMedia = matchMedia as unknown as typeof window.matchMedia;
    const request = async () => makeResponse([{ id: 1 }]);

    renderTable(
      <Table {...makeProps(request, { MobileCard: MobileCardStub })} />,
    );

    expect(await screen.findByTestId('stateful-cell')).toBeInTheDocument();
    expect(screen.queryByTestId('mobile-card')).toBeNull();
    expect(matchMedia).not.toHaveBeenCalled();
  });
});
