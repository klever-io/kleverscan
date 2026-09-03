import api from '@/services/api';
import {
  buildBreakdown,
  summaryVariation,
  totalGrowth,
  transactionsBreakdownCall,
  transactionsSummaryCall,
} from '../summary';

jest.mock('@/services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

const mockedGet = api.get as jest.Mock;

/**
 * The two windows the tiles report: the last 24 hours and the one before it.
 * Keyed by `offsetWindows`, which is what the request carries now that the
 * figures come from an explicit date range rather than day buckets.
 */
const windowCounts: Record<number, number> = {
  0: 8447,
  1: 7124,
};

/** doc_count per contract type index, for the type-filtered count calls. */
const typeCounts: Record<number, number> = {
  0: 5747, // Transfer
  63: 1865, // Smart Contract
  9: 592, // Claim
  4: 228, // Freeze
};

const DAY_MS = 24 * 60 * 60 * 1000;

interface IQuery {
  type?: number;
  startdate?: number;
  enddate?: number;
  limit?: number;
}

/**
 * Which rolling window a request is asking for, derived from its own dates
 * rather than from call order: 0 is the window ending now, 1 the one before.
 * Reading the dates is the point, since sending seconds instead of
 * milliseconds is the failure this transport can have.
 */
const windowOf = (query: IQuery | undefined): number | undefined => {
  if (query?.startdate === undefined || query?.enddate === undefined)
    return undefined;
  const span = query.enddate - query.startdate;
  if (span !== DAY_MS) return undefined;
  return Math.round((Date.now() - query.enddate) / DAY_MS);
};

const answerEach = (
  answers: Partial<{ count: unknown; list: unknown; statistics: unknown }>,
  perType: Record<number, number> = typeCounts,
) => {
  mockedGet.mockImplementation(
    ({ route, query }: { route: string; query?: IQuery }) => {
      if (route === 'transaction/statistics') {
        return Promise.resolve(answers.statistics ?? { data: {} });
      }
      if (route === 'transaction/list') {
        const window = windowOf(query);
        // The all-time total is the one list call carrying no date range.
        if (window === undefined) {
          return Promise.resolve(answers.list ?? { pagination: {} });
        }
        if (answers.count && typeof answers.count === 'object') {
          const forced = answers.count as { error?: string };
          if (forced.error) return Promise.resolve(forced);
        }
        if (query?.type !== undefined) {
          const count = perType[query.type];
          return Promise.resolve({
            pagination: { totalRecords: count ?? 0 },
          });
        }
        return Promise.resolve({
          pagination: { totalRecords: windowCounts[window] ?? 0 },
        });
      }
      return Promise.resolve(answers.list ?? { pagination: {} });
    },
  );
};

describe('transactionsSummaryCall', () => {
  beforeEach(() => jest.clearAllMocks());

  it('reads the rolling windows, the total and the top asset', async () => {
    answerEach({
      count: undefined,
      list: { pagination: { totalRecords: 58_500_000 } },
      statistics: {
        data: { most_transacted: [{ key: 'KLV', doc_count: 43_564_012 }] },
      },
    });

    const summary = await transactionsSummaryCall();

    expect(summary.last24h).toBe(8447);
    expect(summary.previous24h).toBe(7124);
    expect(summary.totalTransactions).toBe(58_500_000);
    expect(summary.mostTransactedAsset).toEqual({
      assetId: 'KLV',
      count: 43_564_012,
    });
  });

  it('breaks the window down by contract type, largest first', async () => {
    answerEach({});

    const breakdown = buildBreakdown(8447, await transactionsBreakdownCall());

    expect(breakdown).toEqual([
      { name: 'Transfer', count: 5747 },
      { name: 'Smart Contract', count: 1865 },
      { name: 'Claim', count: 592 },
      { name: 'Freeze', count: 228 },
      // 8447 minus the named types: the chain's other 22 types together.
      { name: 'Other', count: 15 },
    ]);
  });

  it('leaves a type out when it did nothing in the window', async () => {
    answerEach({}, { 0: 8447 });

    const breakdown = buildBreakdown(8447, await transactionsBreakdownCall());

    expect(breakdown).toEqual([{ name: 'Transfer', count: 8447 }]);
  });

  it('drops the remainder when the named types already fill the window', async () => {
    // Separate requests can answer moments apart, so the parts can exceed
    // the total; a negative remainder must not reach the bar.
    answerEach({}, { 0: 90, 63: 30 });

    const breakdown = buildBreakdown(100, await transactionsBreakdownCall());

    expect(breakdown.map(share => share.name)).toEqual([
      'Transfer',
      'Smart Contract',
    ]);
  });

  it('answers undefined figures instead of throwing when every call fails', async () => {
    answerEach({
      count: { error: 'boom' },
      list: { error: 'boom' },
      statistics: { error: 'boom' },
    });

    const summary = await transactionsSummaryCall();

    expect(summary).toEqual({
      last24h: undefined,
      previous24h: undefined,
      totalTransactions: undefined,
      mostTransactedAsset: undefined,
    });
  });

  it('never turns one failed call into a zero next to a working one', async () => {
    // The mixed case: a zero here would read as "this chain did nothing in
    // the last 24 hours" while the total right beside it says 58 million.
    answerEach({
      count: { error: 'boom' },
      list: { pagination: { totalRecords: 58_500_000 } },
      statistics: {
        data: { most_transacted: [{ key: 'KLV', doc_count: 43_564_012 }] },
      },
    });

    const summary = await transactionsSummaryCall();

    expect(summary.last24h).toBeUndefined();
    expect(summary.previous24h).toBeUndefined();
    expect(summary.totalTransactions).toBe(58_500_000);
    expect(summary.mostTransactedAsset?.assetId).toBe('KLV');
  });

  it('draws no bar when one type request failed, rather than calling it Other', async () => {
    // The parts are separate requests. Reading a failed one as zero drops its
    // segment and hands its share to the remainder, so a window that is two
    // thirds transfers would draw as two thirds "Other" the one time that
    // single request timed out.
    mockedGet.mockImplementation(
      ({ route, query }: { route: string; query?: IQuery }) => {
        if (route !== 'transaction/list')
          return Promise.resolve({ pagination: {} });
        if (query?.type === 0) return Promise.resolve({ error: 'timeout' });
        if (query?.type !== undefined) {
          return Promise.resolve({
            pagination: { totalRecords: typeCounts[query.type] },
          });
        }
        const window = windowOf(query);
        if (window === undefined) return Promise.resolve({ pagination: {} });
        return Promise.resolve({
          pagination: { totalRecords: windowCounts[window] ?? 0 },
        });
      },
    );

    const { last24h } = await transactionsSummaryCall();
    const breakdown = buildBreakdown(8447, await transactionsBreakdownCall());

    // The tile above it still has its figure; only the composition is dropped.
    expect(last24h).toBe(8447);
    expect(breakdown).toEqual([]);
  });

  it('keeps a genuine zero apart from a failure', async () => {
    answerEach({ list: { pagination: { totalRecords: 0 } } }, {});
    windowCounts[0] = 0;

    const summary = await transactionsSummaryCall();

    expect(summary.last24h).toBe(0);
    expect(summary.totalTransactions).toBe(0);
    windowCounts[0] = 8447;
  });

  it('treats a null total as absent rather than passing it on', async () => {
    // `!== undefined` upstream lets a null through, and the tile then calls toLocaleString on it mid-render.
    answerEach({
      list: { pagination: { totalRecords: null } },
    });

    const summary = await transactionsSummaryCall();

    expect(summary.totalTransactions).toBeUndefined();
  });

  it('survives a statistics answer with no assets in it', async () => {
    answerEach({ statistics: { data: { most_transacted: [] } } });

    expect(
      (await transactionsSummaryCall()).mostTransactedAsset,
    ).toBeUndefined();
  });
});

describe('summaryVariation', () => {
  it('measures the change against the previous window', () => {
    expect(summaryVariation({ last24h: 8447, previous24h: 7124 })).toBeCloseTo(
      0.1857,
      4,
    );
    expect(summaryVariation({ last24h: 500, previous24h: 1000 })).toBe(-0.5);
  });

  it('stays undefined without a baseline, rather than inventing +100%', () => {
    expect(summaryVariation({ last24h: 8447, previous24h: 0 })).toBeUndefined();
  });
});

describe('totalGrowth', () => {
  it('measures the day against the total as it stood a day ago', () => {
    // 100 new on a chain that held 900 before them is 11.1%, not 10%.
    expect(totalGrowth({ last24h: 100, totalTransactions: 1000 })).toBeCloseTo(
      100 / 900,
      6,
    );
  });

  it('handles the real scale without losing the figure to rounding', () => {
    const growth = totalGrowth({
      last24h: 8230,
      totalTransactions: 58_550_000,
    });
    expect(growth).toBeCloseTo(8230 / (58_550_000 - 8230), 9);
  });

  it('stays undefined when either figure is missing', () => {
    expect(totalGrowth({ last24h: 100 })).toBeUndefined();
    expect(totalGrowth({ totalTransactions: 1000 })).toBeUndefined();
  });

  it('stays undefined when there is nothing to have grown from', () => {
    // A chain whose whole history is this window has no yesterday to compare
    // against, and dividing by it would print an infinity.
    expect(
      totalGrowth({ last24h: 1000, totalTransactions: 1000 }),
    ).toBeUndefined();
  });
});
