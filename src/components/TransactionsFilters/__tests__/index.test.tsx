import { buyType, contracts, status } from '@/configs/transactions';
import theme from '@/styles/theme';
import { setQueryAndRouter } from '@/utils';
import { fireEvent, render, screen, within } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const routerQuery: Record<string, string> = {};

let routerIsReady = true;

jest.mock('next/router', () => ({
  useRouter: () => ({
    isReady: routerIsReady,
    query: routerQuery,
    push: jest.fn(),
  }),
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

// Resolved against the real English locale files rather than stubbed, so a key
// this component asks for that nobody ever added fails the suite here instead
// of rendering "transactions:Filters.Status" at a reader.
jest.mock('next-i18next', () => {
  const bundles: Record<string, Record<string, unknown>> = {
    common: jest.requireActual('../../../../public/locales/en/common.json'),
    transactions: jest.requireActual(
      '../../../../public/locales/en/transactions.json',
    ),
  };

  const translate = (
    key: string,
    options?: { defaultValue?: string },
  ): string => {
    const [namespace, path] = key.includes(':')
      ? key.split(':')
      : ['common', key];
    const value = (path ?? '')
      .split('.')
      .reduce<unknown>(
        (node, part) =>
          node && typeof node === 'object'
            ? (node as Record<string, unknown>)[part]
            : undefined,
        bundles[namespace],
      );
    if (typeof value === 'string') return value;
    return options?.defaultValue ?? key;
  };

  return { useTranslation: () => ({ t: translate }) };
});

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
 * filters offer an option named "All". Reached by its identifier rather than
 * its displayed title, which is translated. */
const openFilter = (testId: string): HTMLElement => {
  const container = screen.getByTestId(`filter-${testId}`);
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

    const status = openFilter('status');
    fireEvent.click(within(status).getByText('Fail'));

    expect(mockedSetQuery).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'Fail', page: '1' }),
      expect.anything(),
    );
  });

  it('returns to the first page when a contract type is picked', () => {
    renderFilters({ page: '4' });

    const contract = openFilter('contract');
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

    const status = openFilter('status');
    fireEvent.click(within(status).getByText('All'));

    const [query] = mockedSetQuery.mock.calls[0];
    expect(query.page).toBe('1');
    expect(query).not.toHaveProperty('status');
  });

  it('does not navigate when the current value is picked again', () => {
    renderFilters({ page: '3', status: 'Success' });

    const status = openFilter('status');
    fireEvent.click(within(status).getByText('Success'));

    expect(mockedSetQuery).not.toHaveBeenCalled();
  });
});

describe('TransactionsFilters first paint', () => {
  afterEach(() => {
    routerIsReady = true;
  });

  it('renders the filters before the router is ready, identically on both sides', () => {
    // This branch introduced, and then removed, a hydration mismatch here:
    // the list was built during render while still gated on router.isReady,
    // which the server answers false and the client's first render can answer
    // true. Every other test in this suite mocks isReady true, so putting the
    // gate back would go green without this.
    routerIsReady = false;

    renderFilters({});

    expect(screen.getByTestId('filter-status')).toBeInTheDocument();
    expect(screen.getByTestId('filter-contract')).toBeInTheDocument();
    expect(screen.getByTestId('filter-coin')).toBeInTheDocument();
  });
});

describe('TransactionsFilters Buy Type', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // The only conditional control in the bar. Its condition ran in every other
  // test but was never taken, so the filter itself was never constructed.
  it('appears only once the contract type is Buy', () => {
    renderFilters({ type: '17' });
    expect(screen.getByTestId('filter-buyType')).toBeInTheDocument();
  });

  it('stays away for any other contract type', () => {
    renderFilters({ type: '0' });
    expect(screen.queryByTestId('filter-buyType')).not.toBeInTheDocument();
  });

  it('writes the picked buy type and returns to the first page', () => {
    renderFilters({ type: '17', page: '5' });

    const buyType = openFilter('buyType');
    fireEvent.click(within(buyType).getByText('ITOBuy'));

    expect(mockedSetQuery).toHaveBeenCalledWith(
      expect.objectContaining({ buyType: 'ITOBuy', page: '1' }),
      expect.anything(),
    );
  });

  it('drops the buy type when the contract type moves away from Buy', () => {
    renderFilters({ type: '17', buyType: 'ITOBuy' });

    const contract = openFilter('contract');
    fireEvent.click(within(contract).getByText('Transfer'));

    const [query] = mockedSetQuery.mock.calls[0];
    expect(query).not.toHaveProperty('buyType');
  });
});

describe('TransactionsFilters translation coverage', () => {
  // A value with no key still renders, because the lookup falls back to the
  // value itself. That is the right behaviour at runtime and the wrong thing
  // to find out from a user, so the gap is caught here instead.
  const bundle = jest.requireActual(
    '../../../../public/locales/en/transactions.json',
  );

  it.each([
    ['Contracts', contracts],
    ['Status', status],
    ['BuyTypes', buyType],
  ])('has an English label for every %s value', (section, values) => {
    const missing = (values as string[]).filter(
      value => typeof bundle[section]?.[value] !== 'string',
    );

    expect(missing).toEqual([]);
  });

  it.each([
    ['Contracts', contracts],
    ['Status', status],
    ['BuyTypes', buyType],
  ])(
    'keeps the English %s labels identical to the values they replace',
    (section, values) => {
      // Only `en` is an active locale, so any drift here is a visible copy
      // change smuggled in under a translation, not a translation. It has to
      // cover all three lists: an earlier version checked only the contract
      // names, so renaming "MarketBuy" to "Market Buy" passed.
      const drifted = (values as string[]).filter(
        value => bundle[section]?.[value] !== value,
      );

      expect(drifted).toEqual([]);
    },
  );
});
