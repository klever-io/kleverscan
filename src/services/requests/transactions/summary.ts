import api from '@/services/api';
import { rollingWindow } from '@/services/requests/rollingWindow';
import { ContractsIndex } from '@/types/contracts';

/**
 * The figures above the transactions list.
 *
 * Counted over an explicit rolling window rather than read off
 * `transaction/list/count/<days>`. That route once answered rolling buckets
 * but now answers whole UTC days, so its bucket [0] is today since midnight:
 * measured 2026-09-03 it read 2817 where the rolling day held 8165.
 */

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
  totalTransactions?: number;
  mostTransactedAsset?: { assetId: string; count: number };
  /** KLV moved in the window, in the chain's own 6-decimal units. */
  volume24h?: number;
}

/**
 * How many transactions fall in one rolling window, optionally of one type.
 * `limit: 1` because only `totalRecords` is read; the page of rows is waste.
 */
const windowCountCall = async (
  offsetWindows: number,
  type?: number,
  now?: number,
): Promise<number | undefined> => {
  const response = await api.get({
    route: 'transaction/list',
    query: {
      limit: 1,
      minify: true,
      ...rollingWindow(offsetWindows, now),
      ...(type === undefined ? {} : { type }),
    },
  });
  if (response?.error) return undefined;
  const total = response?.pagination?.totalRecords;
  return Number.isFinite(total) ? total : undefined;
};

const totalCall = async (): Promise<number | undefined> => {
  const response = await api.get({
    route: 'transaction/list',
    query: { limit: 1, minify: true },
  });
  if (response?.error) return undefined;
  const total = response?.pagination?.totalRecords;
  // A null in the payload survives an `!== undefined` check upstream and
  // would then throw on toLocaleString in the middle of a render.
  return Number.isFinite(total) ? total : undefined;
};

/**
 * KLV moved over the rolling day. Read off `block/statistics/24h`, which sums
 * the transfer receipts and excludes mint and burn (`volumeRangeQuery` in the
 * proxy), so it is value changing hands rather than supply changing size.
 *
 * Its window is the server's, and it is rolling, not a UTC day: measured
 * 2026-09-04 14:52 UTC, `fromMs` sat at 14:52 the day before and the span
 * was 24.0000 hours. The same response's `totalTransactions` read 4,291,
 * identical to a rolling count over `transaction/list` taken at the same
 * moment, so this tile and the count beside it cover the same span.
 */
const volumeCall = async (): Promise<number | undefined> => {
  const response = await api.get({ route: 'block/statistics/24h' });
  if (response?.error) return undefined;
  const volume = response?.data?.block_stats_24h?.totalVolume;
  return Number.isFinite(volume) ? volume : undefined;
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
export const buildBreakdown = (
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
 * The three tiles. One request per figure, in parallel, each answering a
 * neutral value on failure rather than throwing: the summary sits above the
 * transactions table and must never be the reason a reader cannot see it.
 *
 * The composition bar is not here. It costs one request per named type, four
 * of the seven this card used to spend before the list had painted, so it is
 * asked for separately once the page is idle.
 */
export const transactionsSummaryCall =
  async (): Promise<ITransactionsSummary> => {
    // One clock reading for the pair, so the two windows meet exactly rather
    // than overlapping or leaving a gap across a tick.
    const now = Date.now();
    const [
      last24h,
      previous24h,
      totalTransactions,
      mostTransactedAsset,
      volume24h,
    ] = await Promise.all([
      windowCountCall(0, undefined, now),
      windowCountCall(1, undefined, now),
      totalCall(),
      mostTransactedCall(),
      volumeCall(),
    ]);

    return {
      last24h,
      previous24h,
      totalTransactions,
      mostTransactedAsset,
      volume24h,
    };
  };

/**
 * One count per named type, in the order the bar draws them.
 *
 * The window's own total is not needed here and is deliberately not waited
 * for: asking for it first made these four queue behind the tiles, which on a
 * slow answer put the bar six seconds out. `buildBreakdown` folds the two
 * together once both have landed.
 */
export const transactionsBreakdownCall = async (): Promise<
  Array<number | undefined>
> => {
  // Same window as the tiles, so the parts and the total agree. Sharing one
  // definition matters: mixing a rolling total with day-bucket parts drew 66
  // percent as "Other" when measured on 2026-09-03. One clock reading across
  // the four, or the parts count against boundaries that differ from each
  // other by however long the requests take to leave.
  const now = Date.now();
  return Promise.all(
    BREAKDOWN_TYPES.map(type => windowCountCall(0, type, now)),
  );
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
