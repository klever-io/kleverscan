import theme from '@/styles/theme';
import { render } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

// Same shims as the sibling suites: parseValues reaches an ESM chain Jest
// cannot transform, and t() resolves against the shipped bundle contract.
jest.mock('@/utils/parseValues', () => ({
  parseAddress: (value: string) => `${String(value).slice(0, 8)}...`,
}));

jest.mock('next-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { defaultValue?: string }) =>
      options?.defaultValue ?? key,
  }),
}));

const mockRouter = {
  pathname: '/smart-contracts',
  query: {} as Record<string, string>,
  push: jest.fn(),
};
jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

// Same react-dom shim as the sibling suites: the pinned testing-library
// release calls the legacy ReactDOM.render, which React 19 no longer ships.
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

import ActiveFilter from '../ActiveFilter';

const renderChip = () =>
  render(
    <ThemeProvider theme={theme}>
      <ActiveFilter />
    </ThemeProvider>,
  );

describe('ActiveFilter', () => {
  beforeEach(() => {
    mockRouter.pathname = '/smart-contracts';
    mockRouter.query = {};
  });

  it('shows the narrowing on the list page', () => {
    mockRouter.query = { deployer: 'klv1someone' };
    const { getByTestId } = renderChip();
    expect(getByTestId('deployer-filter-note').textContent).toContain(
      'Deployed by',
    );
  });

  it('renders nothing without a deployer filter', () => {
    const { container } = renderChip();
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing off the list page, where the parameter is not applied', () => {
    // The account tab reuses the same filter bar but scopes by route
    // segment; a hand-added ?deployer= there must not claim a narrowing the
    // table ignores.
    mockRouter.pathname = '/account/[account]';
    mockRouter.query = { deployer: 'klv1someone', account: 'klv1owner' };
    const { container } = renderChip();
    expect(container.firstChild).toBeNull();
  });
});
