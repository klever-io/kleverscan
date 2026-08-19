import theme from '@/styles/theme';
import { setQueryAndRouter } from '@/utils';
import { fireEvent, render, screen, within } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const routerQuery: Record<string, string> = {};

jest.mock('next/router', () => ({
  useRouter: () => ({ isReady: true, query: routerQuery, push: jest.fn() }),
}));

jest.mock('@/utils', () => ({
  setQueryAndRouter: jest.fn(),
}));

// useFetchPartial reaches @/utils/precisionFunctions and from there an ESM
// package Jest cannot transform, so the hook module is replaced wholesale.
// The tuple has to keep a stable identity: the component effects on `assets`,
// so a fresh array per render re-runs them forever.
jest.mock('@/utils/hooks', () => {
  const stable = [[], () => undefined, false, () => undefined];
  return { useFetchPartial: () => stable };
});

// The date filter has its own calendar; stub it out so this suite only
// exercises handleSelected.
jest.mock('@/components/DateFilter', () => ({
  __esModule: true,
  default: () => <div data-testid="date-filter" />,
}));

// SVG imports resolve to an object under Jest, which React cannot render.
jest.mock('@/assets/icons', () => ({
  FilterArrowDown: () => <svg data-testid="arrow" />,
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

import TransactionsFilters from '../index';

const mockedSetQuery = setQueryAndRouter as jest.Mock;

/** Opens one filter and returns it, so options are picked within it: several
 * filters offer an option named "All". */
const openFilter = (title: string): HTMLElement => {
  const container = screen.getByText(title).parentElement as HTMLElement;
  fireEvent.click(
    container.querySelector('[data-testid="selector"]') as Element,
  );

  return container;
};

const renderFilters = (query: Record<string, string>) => {
  Object.keys(routerQuery).forEach(key => delete routerQuery[key]);
  Object.assign(routerQuery, query);

  return render(
    <ThemeProvider theme={theme}>
      <TransactionsFilters />
    </ThemeProvider>,
  );
};

describe('TransactionsFilters page reset', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns to the first page when a status is picked from a later page', () => {
    renderFilters({ page: '3' });

    const status = openFilter('Status');
    fireEvent.click(within(status).getByText('Fail'));

    expect(mockedSetQuery).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'Fail', page: '1' }),
      expect.anything(),
    );
  });

  it('returns to the first page when a contract type is picked', () => {
    renderFilters({ page: '4' });

    const contract = openFilter('Contract');
    fireEvent.click(within(contract).getByText('Transfer'));

    // Transfer is index 0 in ContractsIndex, and the value is what makes this
    // assertion mean something: page alone would pass with type omitted.
    expect(mockedSetQuery).toHaveBeenCalledWith(
      expect.objectContaining({ type: '0', page: '1' }),
      expect.anything(),
    );
  });

  it('drops the filter key but still returns to the first page on All', () => {
    renderFilters({ page: '3', status: 'Fail' });

    const status = openFilter('Status');
    fireEvent.click(within(status).getByText('All'));

    const [query] = mockedSetQuery.mock.calls[0];
    expect(query.page).toBe('1');
    expect(query).not.toHaveProperty('status');
  });

  it('does not navigate when the current value is picked again', () => {
    renderFilters({ page: '3', status: 'Success' });

    const status = openFilter('Status');
    fireEvent.click(within(status).getByText('Success'));

    expect(mockedSetQuery).not.toHaveBeenCalled();
  });
});
