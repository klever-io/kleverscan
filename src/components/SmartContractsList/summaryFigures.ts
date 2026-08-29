import { HotContracts } from '@/types/smart-contract';

export interface IWindowPair {
  /** The last 24 hours: a complete rolling window ending at the request. */
  current: number;
  /** The 24 hours before that, which the change is measured against. */
  previous: number;
}

/**
 * Window-on-window change as a rate, e.g. 0.186 for "+18.6%". Fair at any time
 * of day because both windows are complete; see contractTransactions24hCall.
 *
 * Undefined rather than zero when it cannot be computed: with no previous
 * window there is no rate, and printing "+0%" would state a fact the data does
 * not carry. Growth from nothing is likewise undefined rather than infinite.
 */
export const windowVariation = (
  pair: IWindowPair | undefined,
): number | undefined => {
  if (!pair) return undefined;
  const { current, previous } = pair;
  if (!Number.isFinite(current) || !Number.isFinite(previous)) return undefined;
  if (previous <= 0) return undefined;
  return (current - previous) / previous;
};

export interface IContractShare {
  address: string;
  name?: string;
  count: number;
}

export interface ITopContracts {
  /** The sum over the returned contracts, which is the bar's denominator. */
  total: number;
  segments: IContractShare[];
}

/**
 * The busiest contracts and their share of each other.
 *
 * Deliberately not a share of all contract activity: `sc/statistics` returns
 * the top ten only (`size: 10` in the proxy's aggregation), so the denominator
 * is those ten and nothing wider. The label above the bar has to say so, or a
 * reader takes it for a market share that is not being measured.
 *
 * The counts are all-time. The endpoint accepts an `epoch` parameter that
 * narrows it to one six-hour window, but the frontend does not send one, so
 * there is no time filter at all.
 *
 * Returns undefined when nothing usable arrived, so the bar is left out rather
 * than drawn empty.
 */
export const topContracts = (
  statistics: HotContracts[] | undefined,
  limit = 5,
): ITopContracts | undefined => {
  if (!Array.isArray(statistics) || statistics.length === 0) return undefined;

  const usable = statistics
    .filter(
      entry =>
        entry &&
        typeof entry.address === 'string' &&
        entry.address !== '' &&
        typeof entry.count === 'number' &&
        Number.isFinite(entry.count) &&
        entry.count > 0,
    )
    .map(entry => ({
      address: entry.address,
      name: entry.name || undefined,
      count: entry.count,
    }));

  if (usable.length === 0) return undefined;

  // Sorted here rather than trusted from the API: the bar's segments are drawn
  // in order and a single out-of-order entry reads as a rendering fault.
  const sorted = [...usable].sort((a, b) => b.count - a.count);
  const segments = sorted.slice(0, Math.max(1, limit));
  const total = segments.reduce((sum, entry) => sum + entry.count, 0);

  if (total <= 0) return undefined;

  return { total, segments };
};
