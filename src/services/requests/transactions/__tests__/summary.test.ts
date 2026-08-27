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

/** Newest bucket first, the order the API answers in. */
const buckets = [
  { doc_count: 8447, key: 1787664055000 },
  { doc_count: 7124, key: 1787577655000 },
  { doc_count: 6100, key: 1787491255000 },
];

/** doc_count per contract type index, for the type-filtered count calls. */
const typeCounts: Record<number, number> = {
  0: 5747, // Transfer
  63: 1865, // Smart Contract
  9: 592, // Claim
  4: 228, // Freeze
};

const answerEach = (
  answers: Partial<{ count: unknown; list: unknown; statistics: unknown }>,
  perType: Record<number, number> = typeCounts,
) => {
  mockedGet.mockImplementation(
    ({ route, query }: { route: string; query?: { type?: number } }) => {
      if (route.startsWith('transaction/list/count')) {
        // The breakdown asks the same route once per contract type.
        if (query?.type !== undefined) {
          const count = perType[query.type];
          return Promise.resolve(
            count === undefined
              ? { data: { number_by_day: [] } }
              : { data: { number_by_day: [{ doc_count: count, key: 1 }] } },
          );
        }
        return Promise.resolve(
          answers.count ?? { data: { number_by_day: [] } },
        );
      }
      if (route === 'transaction/statistics') {
        return Promise.resolve(answers.statistics ?? { data: {} });
      }
      return Promise.resolve(answers.list ?? { pagination: {} });
    },
  );
};

describe('transactionsSummaryCall', () => {
  beforeEach(() => jest.clearAllMocks());

  it('reads the rolling windows, the total and the top asset', async () => {
    answerEach({
      count: { data: { number_by_day: buckets } },
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
    answerEach({ count: { data: { number_by_day: buckets } } });

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
    answerEach({ count: { data: { number_by_day: buckets } } }, { 0: 8447 });

    const breakdown = buildBreakdown(8447, await transactionsBreakdownCall());

    expect(breakdown).toEqual([{ name: 'Transfer', count: 8447 }]);
  });

  it('drops the remainder when the named types already fill the window', async () => {
    // Separate requests can answer moments apart, so the parts can exceed
    // the total; a negative remainder must not reach the bar.
    answerEach(
      { count: { data: { number_by_day: [{ doc_count: 100 }] } } },
      {
        0: 90,
        63: 30,
      },
    );

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
      ({ route, query }: { route: string; query?: { type?: number } }) => {
        if (route.startsWith('transaction/list/count')) {
          if (query?.type === 0) return Promise.resolve({ error: 'timeout' });
          if (query?.type !== undefined) {
            return Promise.resolve({
              data: { number_by_day: [{ doc_count: typeCounts[query.type] }] },
            });
          }
          return Promise.resolve({ data: { number_by_day: buckets } });
        }
        return Promise.resolve({ pagination: {} });
      },
    );

    const { last24h } = await transactionsSummaryCall();
    const breakdown = buildBreakdown(8447, await transactionsBreakdownCall());

    // The tile above it still has its figure; only the composition is dropped.
    expect(last24h).toBe(8447);
    expect(breakdown).toEqual([]);
  });

  it('keeps a genuine zero apart from a failure', async () => {
    answerEach({
      count: { data: { number_by_day: [{ doc_count: 0, key: 1 }] } },
      list: { pagination: { totalRecords: 0 } },
    });

    const summary = await transactionsSummaryCall();

    expect(summary.last24h).toBe(0);
    expect(summary.totalTransactions).toBe(0);
  });

  it('treats a null total as absent rather than passing it on', async () => {
    // `!== undefined` upstream lets a null through, and the tile then calls
    // toLocaleString on it in the middle of a render.
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
