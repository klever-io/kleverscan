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

  it('clears a stale figure when the new period answers with nothing', async () => {
    // The fault is a figure left over from the period before, so the card has
    // to carry one first: rendering straight into an empty answer has nothing
    // to leave behind and would pass either way.
    seriesCall
      .mockResolvedValueOnce(series(30, 100))
      .mockResolvedValueOnce([]);

    const { container } = renderChart();
    await waitFor(() => expect(seriesCall).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(container.textContent).toContain('1,500'));

    screen.getByText('7D').click();
    await waitFor(() => expect(seriesCall).toHaveBeenCalledTimes(2));

    await waitFor(() => expect(container.textContent).not.toContain('1,500'));
  });

  it('reports no percentage when the previous stretch was empty', async () => {
    // Against zero every change is infinite, so getVariation is handed a
    // falsy figure and prints "--" rather than a number.
    const series30 = [
      ...Array.from({ length: 15 }, (_, index) => ({
        key: 1_788_000_000_000 + index * 24 * 60 * 60 * 1000,
        doc_count: 0,
      })),
      ...Array.from({ length: 15 }, (_, index) => ({
        key: 1_788_000_000_000 + (index + 15) * 24 * 60 * 60 * 1000,
        doc_count: 50,
      })),
    ];
    seriesCall.mockResolvedValue(series30);

    const { container } = renderChart();

    // Waited on the call, then on the paint: asserting the text straight away
    // races the render that follows the resolved promise.
    await waitFor(() => expect(seriesCall).toHaveBeenCalled());
    await waitFor(() => expect(container.textContent).toContain('750'));
    expect(container.textContent).toContain('--%');
  });

  it('ignores a response the period has moved on from', async () => {
    // The transition the guard exists for is a period switch, not a teardown:
    // 7D counts fourteen rolling windows while 15D takes one bucket request,
    // so the slower answer can land last and paint itself under the newer
    // label. Unmounting instead proves nothing, because React 19 no longer
    // warns about a state update on an unmounted component.
    let resolveSlow: (value: unknown) => void = () => undefined;
    seriesCall
      .mockReturnValueOnce(
        new Promise(resolve => {
          resolveSlow = resolve;
        }),
      )
      .mockResolvedValueOnce(series(14, 100));

    const { container } = renderChart();
    await waitFor(() => expect(seriesCall).toHaveBeenCalledTimes(1));

    screen.getByText('7D').click();
    await waitFor(() => expect(seriesCall).toHaveBeenCalledTimes(2));
    // The 7D answer is in: seven points of 100 in the current stretch.
    await waitFor(() => expect(container.textContent).toContain('700'));

    // Now the superseded 15D answer arrives, carrying a figure of its own.
    resolveSlow(series(30, 999));
    await new Promise(resolve => setTimeout(resolve, 30));

    expect(container.textContent).toContain('700');
    expect(container.textContent).not.toContain('14,985');
  });
});
