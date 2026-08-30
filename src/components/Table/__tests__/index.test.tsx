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
  options: { refreshKey?: number; smaller?: boolean } = {},
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
