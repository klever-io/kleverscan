import theme from '@/styles/theme';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const query: Record<string, string> = {};
const setQuery = jest.fn();

jest.mock('next/router', () => ({
  useRouter: () => ({ query, pathname: '/accounts', push: jest.fn() }),
}));

// next/jest hands an SVG import back as an object, and the shared Filter renders one as a component; React rejects the tree without this.
jest.mock('@/assets/icons', () => ({
  FilterArrowDown: () => null,
}));

jest.mock('@/utils', () => ({
  ...jest.requireActual('@/utils'),
  setQueryAndRouter: (...args: unknown[]) => setQuery(...args),
}));

/** Resolved from the shipped bundle, so an option whose label nobody added fails here rather than rendering "Filters.genesisValidator". */
jest.mock('next-i18next', () => {
  const bundle = jest.requireActual(
    '../../../../public/locales/en/accounts.json',
  );
  const translate = (key: string, options?: { defaultValue?: string }) => {
    const path = key.includes(':') ? key.split(':')[1] : key;
    const value = path
      .split('.')
      .reduce<unknown>(
        (node, part) =>
          node && typeof node === 'object'
            ? (node as Record<string, unknown>)[part]
            : undefined,
        bundle,
      );
    if (typeof value === 'string') return value;
    if (options?.defaultValue) return options.defaultValue;
    throw new Error(`missing accounts locale key: ${key}`);
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
      ReactLib.act(() => root.render(ui));
      return root;
    },
    unmountComponentAtNode: (container: Element) => {
      const root = roots.get(container);
      if (!root) return false;
      ReactLib.act(() => root.unmount());
      roots.delete(container);
      return true;
    },
  };
});

import AccountsFilters from '../Filters';

const renderFilters = () =>
  render(
    <ThemeProvider theme={theme}>
      <AccountsFilters />
    </ThemeProvider>,
  );

/** The option list is only rendered once the selector is opened. */
const open = () => {
  fireEvent.click(screen.getByTestId('selector'));
};

describe('AccountsFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.keys(query).forEach(key => delete query[key]);
  });

  it('offers exactly the two types the data can answer for, plus All', () => {
    const { container } = renderFilters();
    open();

    // The whole option set, not "these two are present": a third option added later slips past a presence check.
    const options = [
      ...container.querySelectorAll('[data-testid="selector-item"]'),
    ]
      .map(node => node.textContent?.trim())
      .filter((text): text is string => !!text);

    expect(new Set(options)).toEqual(
      new Set(['All', 'Foundation', 'Genesis validator']),
    );
    // The plain validator badge exists on rows, but 208 accounts across the whole balance range cannot be listed from validator/list, so it is not offered.
  });

  it('writes the value, not the label, into the query', () => {
    renderFilters();
    open();
    fireEvent.click(screen.getByText('Genesis validator'));

    expect(setQuery).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'genesisValidator' }),
      expect.anything(),
    );
  });

  it('keeps the rest of the query, so a filter does not reset the view', () => {
    // The other tests pass against a filter that writes `{ page: '1' }` and throws
    // the URL away; a reader's page size and date range must survive picking a type.
    query.limit = '50';
    query.startdate = '1787000000000';
    renderFilters();
    open();
    fireEvent.click(screen.getByText('Foundation'));

    expect(setQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        limit: '50',
        startdate: '1787000000000',
        type: 'foundation',
      }),
      expect.anything(),
    );
  });

  it('returns to the first page on every change', () => {
    // A narrower set has fewer pages; staying on page 30 would land on an empty page with no control to get back from.
    query.page = '30';
    renderFilters();
    open();
    fireEvent.click(screen.getByText('Foundation'));

    expect(setQuery).toHaveBeenCalledWith(
      expect.objectContaining({ page: '1' }),
      expect.anything(),
    );
  });

  it('reads All when the URL carries a type the list does not narrow on', () => {
    // Measured in a browser: the control used to echo the URL value back, reading "nonsense"
    // above ten unfiltered rows, the same control-versus-content contradiction the foundation filter had.
    query.type = 'nonsense';
    renderFilters();

    expect(screen.getByTestId('selector')).toHaveTextContent('All');
  });

  it('drops the parameter entirely when All is chosen', () => {
    query.type = 'foundation';
    renderFilters();
    open();
    fireEvent.click(screen.getByText('All'));

    const written = setQuery.mock.calls[0][0];
    expect('type' in written).toBe(false);
    expect(written.page).toBe('1');
  });
});
