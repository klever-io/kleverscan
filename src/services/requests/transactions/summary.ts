import api from '@/services/api';
import { ContractsIndex } from '@/types/contracts';

/**
 * The figures above the transactions list.
 *
 * `transaction/list/count/<days>` answers one bucket per rolling 24 hour
 * window ending now, not per calendar day: verified live by calling it twice
 * seconds apart (the bucket keys move with the clock) and by matching its
 * first bucket against a manual `startdate`/`enddate` query over the last 24
 * hours (identical counts). So the first bucket is "the last 24 hours" and
 * the second is the 24 hours before that.
 */

/** Two buckets: the last 24 hours and the 24 hours before it. */
const SUMMARY_WINDOWS = 2;

/**
 * The contract types the composition bar names, in the order it draws them.
 * The rest of the chain's 26 types share a computed "Other" segment: asking
 * for each of them separately would be two dozen requests for slivers.
 */
export const BREAKDOWN_TYPES = [
  ContractsIndex.Transfer,
  ContractsIndex['Smart Contract'],
  ContractsIndex.Claim,
  ContractsIndex.Freeze,
] as const;

export interface ITransactionTypeShare {
  /** Display name, or 'Other' for the computed remainder. */
  name: string;
  count: number;
}

/**
 * Every figure is optional: a failed part answers undefined so the card can
 * leave that tile out, rather than printing a zero the chain never had.
 */
export interface ITransactionsSummary {
  last24h?: number;
  previous24h?: number;
  /** Last 24 hours by contract type, largest first, with the remainder. */
  breakdown: ITransactionTypeShare[];
  totalTransactions?: number;
  mostTransactedAsset?: { assetId: string; count: number };
}

interface ICountBucket {
  doc_count?: number;
  key?: number;
}

const countsCall = async (
  type?: number,
): Promise<ICountBucket[] | undefined> => {
  const response = await api.get({
    route: `transaction/list/count/${SUMMARY_WINDOWS}`,
    ...(type === undefined ? {} : { query: { type } }),
  });
  if (response?.error) return undefined;
  return response?.data?.number_by_day ?? [];
};

const totalCall = async (): Promise<number | undefined> => {
  const response = await api.get({
    route: 'transaction/list',
    query: { limit: 1, minify: true },
  });
  if (response?.error) return undefined;
  return response?.pagination?.totalRecords;
};

const mostTransactedCall = async (): Promise<
  ITransactionsSummary['mostTransactedAsset']
> => {
  const response = await api.get({
    route: 'transaction/statistics',
    query: { assetType: 'Fungible' },
  });
  if (response?.error) return undefined;
  const top = response?.data?.most_transacted?.[0];
  if (!top?.key) return undefined;
  return { assetId: top.key, count: top.doc_count ?? 0 };
};

/**
 * Builds the composition of the last 24 hours: one named share per listed
 * contract type, largest first, plus whatever the chain's other types add
 * up to. The remainder is the honest way to close the bar without asking
 * for two dozen more counts, and it is clamped at zero because its parts
 * are separate requests that can answer moments apart.
 */
const buildBreakdown = (
  total: number | undefined,
  typeCounts: Array<number | undefined>,
): ITransactionTypeShare[] => {
  if (total === undefined) return [];

  // A part that did not answer is not a part that counted zero. Reading it as
  // zero drops its segment and hands its share to the remainder, so a chain
  // that is two thirds transfers would draw as two thirds "Other" the one
  // time that single request timed out. No bar says less, but nothing false.
  if (typeCounts.includes(undefined)) return [];

  const named = BREAKDOWN_TYPES.map((type, index) => ({
    name: String(ContractsIndex[type]),
    count: typeCounts[index] ?? 0,
  }))
    .filter(share => share.count > 0)
    .sort((a, b) => b.count - a.count);

  const other = total - named.reduce((sum, share) => sum + share.count, 0);
  return other > 0 ? [...named, { name: 'Other', count: other }] : named;
};

/**
 * One request per figure, in parallel. Each part answers a neutral value on
 * failure rather than throwing: the summary sits above the transactions
 * table and must never be the reason a reader cannot see the list.
 */
export const transactionsSummaryCall =
  async (): Promise<ITransactionsSummary> => {
    const [buckets, totalTransactions, mostTransactedAsset, ...typeBuckets] =
      await Promise.all([
        countsCall(),
        totalCall(),
        mostTransactedCall(),
        ...BREAKDOWN_TYPES.map(type => countsCall(type)),
      ]);

    const last24h = buckets?.[0]?.doc_count;

    return {
      last24h,
      previous24h: buckets?.[1]?.doc_count,
      breakdown: buildBreakdown(
        last24h,
        // The distinction survives only here: countsCall answers undefined
        // for a request that failed and an empty list for one that succeeded
        // with nothing to report. Read straight off the bucket both look the
        // same, and a failure would be drawn as a genuine zero.
        typeBuckets.map(typeBucket =>
          typeBucket === undefined
            ? undefined
            : (typeBucket[0]?.doc_count ?? 0),
        ),
      ),
      totalTransactions,
      mostTransactedAsset,
    };
  };

/**
 * Change from the previous 24 hours, as a fraction. Undefined when there is
 * no baseline to compare against: "+100%" against zero would be an invented
 * figure.
 */
export const summaryVariation = (
  summary: Pick<ITransactionsSummary, 'last24h' | 'previous24h'>,
): number | undefined => {
  if (!summary.previous24h || summary.last24h === undefined) return undefined;
  return (summary.last24h - summary.previous24h) / summary.previous24h;
};

/**
 * How much the chain's total grew in the last 24 hours, as a fraction of what
 * it was a day ago. Measured against yesterday's total rather than today's,
 * which is what "grew by" means and which the two differ on once the window
 * is a real share of the whole.
 *
 * Undefined when there is nothing to grow from, so a chain with a day's worth
 * of history and nothing before it shows no figure rather than an invented
 * one.
 */
export const totalGrowth = (
  summary: Pick<ITransactionsSummary, 'last24h' | 'totalTransactions'>,
): number | undefined => {
  const { last24h, totalTransactions } = summary;
  if (last24h === undefined || totalTransactions === undefined)
    return undefined;

  const before = totalTransactions - last24h;
  if (before <= 0) return undefined;

  return last24h / before;
};
