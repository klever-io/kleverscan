import api from '@/services/api';
import {
  ROLLING_WINDOW_MS,
  rollingWindow,
} from '@/services/requests/rollingWindow';

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
          // One attempt: api.get retries three times by default with a fixed
          // 500ms gap, so a burst that drew a 429 would come back as three
          // times the requests that caused it. Fourteen is already the
          // measured ceiling.
          tries: 1,
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

  const usable = [...buckets].filter(
    bucket =>
      Number.isFinite(bucket?.key) && Number.isFinite(bucket?.doc_count),
  );
  if (!usable.length) return [];

  // Laid onto the day grid rather than passed through as answered. The route
  // omits a day that carried no data, and the caller splits this list down
  // the middle, so a missing day would pair every later one against the
  // wrong counterpart. Refusing the whole series for that turned one quiet
  // day into a chart that stays empty for the next month; an omitted day is
  // a known zero, not an unknown, so it is filled in as one.
  //
  // A bucket whose key or count was malformed is different: its value cannot
  // be known, and it is dropped above, which the grid then shows as a zero
  // as well. That is the one case where a zero is drawn for a day that may
  // have carried transactions, and it takes a malformed answer to reach it.
  const byKey = new Map(usable.map(bucket => [bucket.key, bucket.doc_count]));
  const newest = Math.max(...usable.map(bucket => bucket.key));
  return Array.from({ length: days }, (_, index) => {
    const key = newest - (days - 1 - index) * ROLLING_WINDOW_MS;
    return { key, doc_count: byKey.get(key) ?? 0 };
  });
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
