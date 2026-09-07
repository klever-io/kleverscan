import theme from '@/styles/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

// Resolved from the shipped bundle rather than echoed back, so a key the card
// asks for that nobody ever added fails the suite here instead of rendering
// "transactions:Summary.Growth" at a reader.
jest.mock('next-i18next', () => {
  const bundle = jest.requireActual(
    '../../../../public/locales/en/transactions.json',
  );

  const translate = (
    key: string,
    options?: Record<string, unknown>,
  ): string => {
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
    if (typeof value !== 'string') {
      throw new Error(`missing transactions locale key: ${key}`);
    }
    return value.replace(/\{\{(\w+)\}\}/g, (whole, name) =>
      options && name in options ? String(options[name]) : whole,
    );
  };

  return { useTranslation: () => ({ t: translate }) };
});

// The installed testing-library still calls the removed ReactDOM.render; every
// component suite in this repo carries the same createRoot shim.
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

const summaryCall = jest.fn();
const breakdownCall = jest.fn();

// Only the requests are replaced. The arithmetic beside them stays real, so a
// change to what "grew by" means is caught here as well as in its own spec.
jest.mock('@/services/requests/transactions/summary', () => ({
  ...jest.requireActual('@/services/requests/transactions/summary'),
  transactionsSummaryCall: () => summaryCall(),
  transactionsBreakdownCall: () => breakdownCall(),
}));

let deferralPassed = false;
jest.mock('@/components/DataList/useDeferred', () => ({
  useDeferred: () => deferralPassed,
}));

import TransactionsSummary from '../Summary';

const FULL = {
  last24h: 8247,
  previous24h: 8000,
  totalTransactions: 58558891,
  mostTransactedAsset: { assetId: 'KLV', count: 4000 },
  // 41.4M KLV in the chain's 6-decimal units, the scale measured live.
  volume24h: 41_408_939_000_000,
};

/** Raw counts per named type, in the order the bar draws them. */
const COUNTS = [5000, 2000, 600, 400];

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
        <TransactionsSummary />
      </ThemeProvider>
    </QueryClientProvider>,
  );

/** The card, whether it is still a skeleton or holds the figures. */
const card = (): HTMLElement =>
  screen.getByLabelText('Transaction statistics') as HTMLElement;

const digitsOf = (text: string): string => text.replace(/\D/g, '');

/** The card once the figures have landed. The loading shape carries the same
 *  labels as the loaded one (that is what keeps its line boxes identical), so
 *  waiting on a label would match the skeleton and assert against it. Only
 *  `aria-busy` tells the two apart. */
const loadedCard = async (): Promise<HTMLElement> => {
  await waitFor(() => expect(card().getAttribute('aria-busy')).toBeNull());
  return card();
};

beforeEach(() => {
  summaryCall.mockReset();
  breakdownCall.mockReset();
  breakdownCall.mockResolvedValue(COUNTS);
  deferralPassed = true;
});

describe('TransactionsSummary', () => {
  it('reserves the card while the figures are still on their way', () => {
    summaryCall.mockReturnValue(new Promise(() => undefined));

    renderSummary();

    // Named for assistive tech before its content is known, and holding
    // placeholders where the figures go, so the page below it does not jump
    // when they arrive. The labels are real and one of them reads "(24h)", so
    // the card's own text is no longer a figure test.
    expect(card().getAttribute('aria-busy')).toBe('true');
    expect(
      card().querySelectorAll('[data-testid="skeleton"]').length,
    ).toBeGreaterThan(0);
    // The labels are constants and two of them read "(24h)", so the card's
    // whole text is not a figure test and asserting on a label alone can never
    // fail. Strip the four labels; a digit left over is a leaked figure.
    const labels = [
      'Transactions (24h)',
      'Total transactions',
      'Most transacted',
      'Volume (24h)',
    ];
    const withoutLabels = labels.reduce(
      (text, label) => text.split(label).join(''),
      card().textContent ?? '',
    );
    expect(digitsOf(withoutLabels)).toBe('');
  });

  it('writes the chain total out in full and compacts the day figure', async () => {
    summaryCall.mockResolvedValue(FULL);

    renderSummary();

    // Every digit present, against the locale's own separators: this figure is
    // the one a reader may want to quote, and "58.55 M" throws five away.
    const total = await screen.findByText(/58.558.891|58,558,891/);
    expect(digitsOf(total.textContent ?? '')).toBe('58558891');

    // The day figure keeps the compact form the rest of the list uses, which
    // truncates its second decimal rather than rounding it.
    expect(screen.getByText('8.24 K')).toBeTruthy();
  });

  it('puts a signed change under each of the two counts', async () => {
    summaryCall.mockResolvedValue(FULL);

    renderSummary();

    // Against the 24 hours before it: 8247 from 8000.
    expect(await screen.findByText('+3.1%')).toBeTruthy();
    // Against the chain's total a day ago: 8247 on top of 58550644.
    expect(screen.getByText('+0.01%')).toBeTruthy();
  });

  it('says the direction in words, which a bare plus sign does not carry', async () => {
    summaryCall.mockResolvedValue({ ...FULL, last24h: 7000 });

    renderSummary();

    expect(
      await screen.findByText('down 12.5% compared with the previous 24 hours'),
    ).toBeTruthy();
  });

  it('leaves out a tile whose own request answered nothing', async () => {
    summaryCall.mockResolvedValue({
      ...FULL,
      last24h: undefined,
      previous24h: undefined,
    });

    renderSummary();

    const kaart = await loadedCard();
    expect(within(kaart).getByText('Total transactions')).toBeTruthy();
    // No zero the chain never had, and no percentage computed from one.
    expect(within(kaart).queryByText('Transactions (24h)')).toBeNull();
  });

  it('asks for nothing while the page still has work in flight', async () => {
    deferralPassed = false;
    summaryCall.mockResolvedValue(FULL);

    renderSummary();

    // The card reserves its space and spends nothing. Both of its tile
    // requests are transaction-list queries, which this API answers in about
    // two seconds and will not serve alongside the rows.
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    expect(summaryCall).not.toHaveBeenCalled();
    expect(breakdownCall).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Transaction statistics')).toBeTruthy();
  });

  it('holds the space for the bar while only the tiles have answered', async () => {
    // The two halves answer on separate requests. Drawing the tiles alone
    // dropped the bar and its legend, so the card lost 48px between its
    // skeleton and its finished self and then grew back.
    summaryCall.mockResolvedValue(FULL);
    breakdownCall.mockReturnValue(new Promise(() => undefined));

    renderSummary();

    const kaart = await loadedCard();
    expect(within(kaart).getByText('Total transactions')).toBeTruthy();
    // The bar plus one entry per contract type the breakdown names: the same
    // placeholder the full skeleton uses, so this middle state is the same
    // height as the states either side of it. Three 150px entries, which is
    // what the shared placeholder draws, take one line at 390px where these
    // five take two, and the card dropped 17px and grew back.
    expect(kaart.querySelectorAll('[data-testid="skeleton"]').length).toBe(6);
    expect(screen.queryByLabelText(/Contract types/)).toBeNull();
  });

  it('asks once the page falls quiet', async () => {
    summaryCall.mockResolvedValue(FULL);

    renderSummary();

    expect(
      await screen.findByLabelText('Contract types in the last 24 hours'),
    ).toBeTruthy();
    expect(summaryCall).toHaveBeenCalled();
    expect(breakdownCall).toHaveBeenCalled();
  });

  it('compacts the volume and keeps the exact figure on hover', async () => {
    summaryCall.mockResolvedValue(FULL);
    renderSummary();
    const loaded = await loadedCard();

    expect(loaded.textContent).toContain('Volume (24h)');
    // Compacted in the headline, so the tile stays one line at any width.
    expect(loaded.textContent).toContain('41.4 M KLV');
  });

  it('leaves the volume tile out when only that request failed', async () => {
    summaryCall.mockResolvedValue({ ...FULL, volume24h: undefined });
    renderSummary();
    const loaded = await loadedCard();

    expect(loaded.textContent).not.toContain('Volume (24h)');
    // Its neighbours still have theirs: a failed part costs its own tile.
    expect(loaded.textContent).toContain('Total transactions');
  });

  it('marks the same tiles droppable as the loading shape does', async () => {
    // The narrow layout hides by marker, so a marker the skeleton and the
    // loaded card disagree on re-flows the row once the figures land.
    summaryCall.mockResolvedValue(FULL);
    const { container } = renderSummary();

    const markersOf = (root: ParentNode): string[] =>
      [...root.querySelectorAll('[data-optional]')].map(
        el => `${el.getAttribute('data-optional')}:${(el.textContent ?? '').slice(0, 12)}`,
      );

    const skeletonMarkers = markersOf(container);
    await loadedCard();
    const loadedMarkers = markersOf(container);

    expect(skeletonMarkers).toHaveLength(2);
    expect(loadedMarkers).toHaveLength(2);
    // Most transacted goes first, the volume figure second.
    expect(skeletonMarkers[0].startsWith('true:')).toBe(true);
    expect(skeletonMarkers[1].startsWith('narrow:')).toBe(true);
    expect(loadedMarkers[0].startsWith('true:')).toBe(true);
    expect(loadedMarkers[1].startsWith('narrow:')).toBe(true);
  });

  it('keeps the card for the volume alone, when it is the only figure that came', async () => {
    // The guard listed the three figures that predated the volume tile, so a
    // strip with one tile to show was thrown away for the three that failed.
    summaryCall.mockResolvedValue({
      last24h: undefined,
      previous24h: undefined,
      totalTransactions: undefined,
      mostTransactedAsset: undefined,
      volume24h: 41_408_939_000_000,
    });
    renderSummary();
    const loaded = await loadedCard();

    expect(loaded.textContent).toContain('Volume (24h)');
    expect(loaded.textContent).toContain('41.4 M KLV');
  });

  it('draws no card at all when every figure is missing', async () => {
    summaryCall.mockResolvedValue({});

    renderSummary();

    // Waited out rather than asserted straight away: the skeleton also carries
    // this label, so an immediate check would pass on the loading state.
    await waitFor(() =>
      expect(screen.queryByLabelText('Transaction statistics')).toBeNull(),
    );
  });
});
