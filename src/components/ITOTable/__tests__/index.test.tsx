import theme from '@/styles/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
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
// transform; this table needs only the one hook from it.
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
    pathname: '/ito',
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

jest.mock('@/contexts/mobile', () => ({
  useMobile: () => ({ isMobile: false, isTablet: false }),
}));

import Table, { ITable } from '../index';

/** Same pin as the shared Table suite: cell state must survive a re-render,
 *  which the old mount-as-component-type path destroyed (#697). */
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

const makeProps = (): ITable => ({
  type: 'launchPad',
  header: ['Cell'],
  rowSections: () => [{ element: () => <StatefulCell />, span: 1 }],
  request: async () => ({
    data: { items: [{ id: 1 }] },
    error: '',
    code: '',
    pagination: {
      self: 1,
      next: 1,
      previous: 1,
      perPage: 10,
      totalPages: 1,
      totalRecords: 1,
    },
  }),
  dataName: 'items',
  showLimit: false,
  showPagination: false,
});

describe('ITOTable row cells', () => {
  it('updates a cell in place across re-renders, keeping DOM node and state', async () => {
    const client = new QueryClient();
    const wrap = (element: React.ReactElement) => (
      <QueryClientProvider client={client}>
        <ThemeProvider theme={theme}>{element}</ThemeProvider>
      </QueryClientProvider>
    );
    const view = render(wrap(<Table {...makeProps()} />));

    const cell = await screen.findByTestId('stateful-cell');
    fireEvent.click(cell);
    expect(cell).toHaveTextContent('count:1');

    view.rerender(wrap(<Table {...makeProps()} />));

    const cellAfter = screen.getByTestId('stateful-cell');
    expect(cellAfter).toBe(cell);
    expect(cellAfter).toHaveTextContent('count:1');
  });
});
