/**
 * The card's style imports reach `parseValues` -> `precisionFunctions` ->
 * `pages/transactions` -> react-syntax-highlighter, an ESM chain Jest cannot
 * transform. Factory mocks never load the real modules, which is the
 * documented way round it in this repo.
 */
jest.mock('@/pages/transactions', () => ({}));

/**
 * SVGs arrive as objects without a loader, and styled() on one renders as an
 * invalid element type. A plain host element carries the styled() wrapper and
 * occupies the slot, which is all these icons do here.
 */
jest.mock('@/assets/icons', () =>
  new Proxy({}, { get: () => 'svg' }),
);
jest.mock('@/assets/cards', () =>
  new Proxy({}, { get: () => 'svg' }),
);
jest.mock('@/components/ExplorerLink', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('@/components/InputGlobal', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('@/utils/precisionFunctions', () => ({
  getParsedTransactionPrecision: jest.fn(),
  setPrecision: jest.fn(),
}));

import theme from '@/styles/theme';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

// The installed testing-library still calls the removed ReactDOM.render; every
// component suite carries this createRoot shim.
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

jest.mock('next-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('@/contexts/theme', () => ({ useTheme: () => ({ theme }) }));

const homeData = jest.fn();
jest.mock('@/contexts/mainPage', () => ({ useHomeData: () => homeData() }));

import HomeDataCards from '../index';

const base = {
  livePeakTPS: '1.00/2.00',
  metrics: {},
  transactions: [],
  totalAccounts: 176_385,
  totalTransactions: 58_638_879,
  loadingCards: false,
};

const renderCards = () =>
  render(
    <ThemeProvider theme={theme}>
      <HomeDataCards />
    </ThemeProvider>,
  );

describe('HomeDataCards', () => {
  beforeEach(() => jest.clearAllMocks());

  it('reports one rolling window, not a sum of two days', () => {
    homeData.mockReturnValue({
      ...base,
      newTransactions: 6581,
      newAccounts: 9,
    });
    renderCards();

    expect(screen.getByText('+ 6,581/24h')).toBeTruthy();
    expect(screen.getByText('+ 9/24h')).toBeTruthy();
  });

  it('shows a genuine zero, which a quiet day really is', () => {
    // A "0%" string used to stand in for "hide this line", and the render
    // tested for a percent sign to decide, so a real zero vanished.
    homeData.mockReturnValue({
      ...base,
      newTransactions: 0,
      newAccounts: 0,
    });
    renderCards();

    expect(screen.getAllByText('+ 0/24h')).toHaveLength(2);
  });

  it('leaves the line out when the count never arrived', () => {
    // The other direction: undefined is a failed request, and printing it as
    // zero claims a quiet day the chain never reported.
    homeData.mockReturnValue({
      ...base,
      newTransactions: undefined,
      newAccounts: undefined,
    });
    const { container } = renderCards();

    expect(container.textContent).not.toContain('/24h');
    // The totals beside them still show: a missing variation costs its own
    // line, not the card.
    expect(container.textContent).toContain('58,638,879');
  });
});
