import theme from '@/styles/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

// Resolved from the shipped bundles rather than echoed back, so a key the
// card asks for that nobody ever added fails the suite here instead of
// rendering "blocks:List.FeesBurned" at a reader.
jest.mock('next-i18next', () => {
  const bundles: Record<string, unknown> = {
    blocks: jest.requireActual('../../../../public/locales/en/blocks.json'),
    common: jest.requireActual('../../../../public/locales/en/common.json'),
  };
  const translate = (
    key: string,
    options?: Record<string, unknown>,
  ): string => {
    const [ns, path] = key.includes(':') ? key.split(':') : ['blocks', key];
    const value = path
      .split('.')
      .reduce<unknown>(
        (node, part) =>
          node && typeof node === 'object'
            ? (node as Record<string, unknown>)[part]
            : undefined,
        bundles[ns],
      );
    if (typeof value !== 'string') {
      throw new Error(`missing ${ns} locale key: ${key}`);
    }
    return value.replace(/\{\{(\w+)\}\}/g, (whole, name) =>
      options && name in options ? String(options[name]) : whole,
    );
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

// The theme context has no provider in this suite; the hook answers directly.
jest.mock('@/contexts/theme', () => ({
  useTheme: () => ({ theme: jest.requireActual('@/styles/theme').default }),
}));

// Tested exhaustively in its own suite; mocked thin here so its one-second
// interval does not leak real timers into this one.
jest.mock('../UpdatedAgo', () => ({
  __esModule: true,
  default: ({ at }: { at: number }) =>
    at ? <p data-testid="blocks-updated-ago">Updated</p> : null,
}));

const yesterdayCall = jest.fn();
const totalCall = jest.fn();

// Replaced wholesale: the real module also exports blockTransactionsCall,
// whose import chain Jest cannot transform.
jest.mock('@/services/requests/block', () => ({
  blockYesterdayStatsCall: () => yesterdayCall(),
  blockTotalStatsCall: () => totalCall(),
}));

import BlocksSummary from '../Summary';

// 2026-08-27 on mainnet, read from block/statistics-by-day.
const YESTERDAY = {
  date: 1787788800000,
  totalBlocks: 21597,
  totalMinted: 647910000000,
  totalBurned: 145531094085,
  totalBlockRewards: 323955000000,
  totalStakingRewards: 323955000000,
  totalTxFees: 81741289738,
  totalKappsFees: 13415000000,
  totalTxRewards: 40870643872,
};

const TOTAL = {
  totalBlocks: 32728348,
  totalBurned: 158780198162512,
  totalBlockRewards: 476533875000000,
};

const renderSummary = () =>
  render(
    <QueryClientProvider
      client={
        new QueryClient({
          defaultOptions: { queries: { retry: false, gcTime: 0 } },
        })
      }
    >
      <ThemeProvider theme={theme}>
        <BlocksSummary />
      </ThemeProvider>
    </QueryClientProvider>,
  );

beforeEach(() => {
  yesterdayCall.mockReset();
  totalCall.mockReset();
});

describe('BlocksSummary', () => {
  it('holds the card with its real labels while the figures load', () => {
    yesterdayCall.mockReturnValue(new Promise(() => undefined));
    totalCall.mockReturnValue(new Promise(() => undefined));

    renderSummary();

    const card = screen.getByLabelText('Block statistics');
    expect(card.getAttribute('aria-busy')).toBe('true');
    // Real labels, bars only where figures go: no digits yet.
    expect(screen.getByText('Blocks (yesterday)')).toBeTruthy();
    expect(screen.getByText('Fees burned')).toBeTruthy();
    expect(card.textContent).not.toMatch(/\d KLV/);
  });

  it('shows the closed day and splits its fees to the measured halves', async () => {
    yesterdayCall.mockResolvedValue(YESTERDAY);
    totalCall.mockResolvedValue(TOTAL);

    renderSummary();

    expect(await screen.findByTestId('blocks-summary')).toBeTruthy();
    expect(screen.getByText('21,597')).toBeTruthy();
    // Bandwidth plus kApp fees, compacted.
    expect(screen.getByText('95.15 K KLV')).toBeTruthy();
    // The burned share of that total: (txFees - txRewards) / (txFees + kApps).
    expect(screen.getByText('43% of it burned')).toBeTruthy();
    // The legend carries all three segments, and the two halves agree.
    expect(screen.getAllByText('40.87 K KLV')).toHaveLength(2);
    expect(screen.getByText('13.41 K KLV')).toBeTruthy();
    expect(screen.getByTestId('blocks-updated-ago')).toBeTruthy();
  });

  // The regression this suite exists for: with by-day failed and total fine,
  // every tile is gated on `yesterday`, so the card rendered as an empty
  // rectangle holding nothing but the age line in its corner.
  it('renders nothing when the day figures failed, even if the totals arrived', async () => {
    yesterdayCall.mockResolvedValue(undefined);
    totalCall.mockResolvedValue(TOTAL);

    const { container } = renderSummary();

    await waitFor(() => expect(totalCall).toHaveBeenCalled());
    await waitFor(() =>
      expect(screen.queryByLabelText('Block statistics')).toBeNull(),
    );
    expect(container.textContent).toBe('');
  });

  it('keeps the tiles when only the cumulative totals failed', async () => {
    yesterdayCall.mockResolvedValue(YESTERDAY);
    totalCall.mockResolvedValue(undefined);

    renderSummary();

    expect(await screen.findByTestId('blocks-summary')).toBeTruthy();
    expect(screen.getByText('21,597')).toBeTruthy();
    // The sub-lines the totals feed are the only casualties.
    expect(screen.queryByText(/in total/)).toBeNull();
  });

  it('renders nothing when both halves failed', async () => {
    yesterdayCall.mockResolvedValue(undefined);
    totalCall.mockResolvedValue(undefined);

    const { container } = renderSummary();

    await waitFor(() => expect(yesterdayCall).toHaveBeenCalled());
    await waitFor(() =>
      expect(screen.queryByLabelText('Block statistics')).toBeNull(),
    );
    expect(container.textContent).toBe('');
  });
});
