import api from '@/services/api';
import { rollingWindow } from '@/services/requests/rollingWindow';

/**
 * The daily series behind the home transactions chart, as `{ key, doc_count }`
 * entries oldest first, twice the period asked for so the caller can split it
 * into the current stretch and the one before it.
 *
 * Two sources, because neither covers the whole range:
 *
 * `transaction/list` counts an explicit window, so a day means the 24 hours
 * ending now rather than one that resets at midnight UTC. It costs a request
 * per point, and the proxy refuses a burst: measured 2026-09-03, 20 parallel
 * requests all answered and 30 drew 429s, so it is used up to the 14 that a
 * week needs and no further.
 *
 * `transaction/list/count/<days>` answers the whole range in one request, but
 * its buckets are UTC days, so the newest is only the day so far: at 19:15
 * UTC it held 4,329 against 8,275 for the day before it.
 */
export const ROLLING_POINT_LIMIT = 14;

export interface ISeriesPoint {
  key: number;
  doc_count: number;
}

const rollingSeries = async (points: number): Promise<ISeriesPoint[]> => {
  // One clock reading for the set, or the windows drift apart by however long
  // the requests take to leave.
  const now = Date.now();

  const counts = await Promise.all(
    Array.from({ length: points }, (_, index) => {
      const window = rollingWindow(points - 1 - index, now);
      return api
        .get({
          route: 'transaction/list',
          query: { limit: 1, minify: true, ...window },
        })
        .then(response => ({
          key: window.enddate,
          total: response?.error
            ? undefined
            : response?.pagination?.totalRecords,
        }));
    }),
  );

  // One refused request would otherwise draw as a day with no transactions.
  if (counts.some(point => !Number.isFinite(point.total))) return [];

  return counts.map(point => ({
    key: point.key,
    doc_count: point.total as number,
  }));
};

const bucketSeries = async (days: number): Promise<ISeriesPoint[]> => {
  const response = await api.get({
    route: `transaction/list/count/${days}`,
  });
  if (response?.error) return [];

  const buckets = response?.data?.number_by_day;
  if (!Array.isArray(buckets)) return [];

  return [...buckets]
    .filter(
      bucket =>
        Number.isFinite(bucket?.key) && Number.isFinite(bucket?.doc_count),
    )
    .sort((a, b) => a.key - b.key);
};

/**
 * `period` is the number of days one stretch covers; the series returned holds
 * two of them, oldest first.
 */
export const transactionSeriesCall = async (
  period: number,
): Promise<ISeriesPoint[]> =>
  period * 2 <= ROLLING_POINT_LIMIT
    ? rollingSeries(period * 2)
    : bucketSeries(period * 2);
