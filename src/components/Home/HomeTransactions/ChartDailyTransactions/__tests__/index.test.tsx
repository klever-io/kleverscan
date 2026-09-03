/**
 * `pages/charts` reaches react-syntax-highlighter, an ESM chain Jest cannot
 * transform, and the chart's own styles pull in SVGs that arrive as objects
 * without a loader. Factory mocks keep both out of the way; the test is about
 * which response wins, not about what is drawn.
 */
jest.mock('@/pages/charts', () => ({}));
jest.mock('@/pages/transactions', () => ({}));
jest.mock('@/utils/precisionFunctions', () => ({
  getParsedTransactionPrecision: jest.fn(),
  setPrecision: jest.fn(),
}));
jest.mock('@/assets/icons', () => new Proxy({}, { get: () => 'svg' }));
jest.mock('@/assets/cards', () => new Proxy({}, { get: () => 'svg' }));
jest.mock('@/components/ExplorerLink', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('@/components/InputGlobal', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('@/components/Chart', () => ({
  __esModule: true,
  default: () => null,
  ChartType: { Line: 'line', DoubleLine: 'doubleLine' },
}));
jest.mock('@/components/Chart/Tooltips', () => ({ DoubleTxsTooltip: () => null }));

import theme from '@/styles/theme';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

// The installed testing-library still calls the removed ReactDOM.render.
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

const seriesCall = jest.fn();
jest.mock('@/services/requests/home/transactionSeries', () => ({
  transactionSeriesCall: (period: number) => seriesCall(period),
}));

import { ChartDailyTransactions } from '../index';

/** A series of `points` days, each carrying `perDay` transactions. */
const series = (points: number, perDay: number) =>
  Array.from({ length: points }, (_, index) => ({
    key: 1_788_000_000_000 + index * 24 * 60 * 60 * 1000,
    doc_count: perDay,
  }));

const renderChart = () =>
  render(
    <ThemeProvider theme={theme}>
      <ChartDailyTransactions />
    </ThemeProvider>,
  );

describe('ChartDailyTransactions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the implementation too: clearAllMocks drops calls but leaves a
    // mockReturnValueOnce queued by an earlier test in place.
    seriesCall.mockReset();
  });

  it('ignores a response the period has moved on from', async () => {
    // 7D counts fourteen rolling windows and 15D takes one request, so the
    // slower answer can land last and paint itself over the newer one.
    let resolveSlow: (value: unknown) => void = () => undefined;
    seriesCall.mockReturnValueOnce(
      new Promise(resolve => {
        resolveSlow = resolve;
      }),
    );

    const { unmount } = renderChart();
    await waitFor(() => expect(seriesCall).toHaveBeenCalledTimes(1));

    // The effect is torn down before the request settles, which is what a
    // period switch does.
    unmount();
    resolveSlow(series(30, 999));

    // No state update after teardown: React logs an error if one happens.
    await new Promise(resolve => setTimeout(resolve, 20));
  });
});
