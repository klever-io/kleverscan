import api from '@/services/api';

/**
 * The series behind the home transactions chart, oldest first, twice the
 * period asked for so the caller can split it into the current stretch and the
 * one before it.
 *
 * `transaction/statistics/series` answers the whole range in one request with
 * buckets that end at the moment of the call, so a point covers a whole
 * interval that has elapsed. The per-day routes cannot: they bucket by UTC
 * day, so their newest point holds only the part of today that has happened,
 * which at 19:15 UTC read 4,329 against 8,275 for the day before it.
 *
 * It also guarantees exactly the number of buckets asked for, with a quiet one
 * reported as 0 rather than left out. The count route omits a quiet day and
 * the histogram route truncates leading and trailing ones, which left a caller
 * unable to tell a short answer from a full one.
 */

/** The chart draws the period asked for beside the one before it. */
export const STRETCHES = 2;

/**
 * A day is drawn hour by hour: one point per stretch draws as two dots and no
 * line. The label mode follows from the same answer, so both sides of the
 * chart read it here rather than each testing the period for itself.
 */
export const isHourly = (period: number): boolean => period === 1;

export interface ISeriesPoint {
  key: number;
  doc_count: number;
}

interface ISeriesBucket {
  fromMs?: number;
  toMs?: number;
  count?: number;
}

/**
 * `period` is the number of days one stretch covers. An hour interval is used
 * where a day would give a single point per stretch, which draws as two dots
 * and no line.
 */
export const transactionSeriesCall = async (
  period: number,
): Promise<ISeriesPoint[]> => {
  const hourly = isHourly(period);
  const points = period * STRETCHES * (hourly ? 24 : 1);

  try {
    const response = await api.get({
      route: 'transaction/statistics/series',
      // One attempt. api.get retries three times by default and sleeps 500ms
      // after every attempt including the last, so where the route is not
      // deployed yet a period switch would spin for 1,5 seconds before the
      // empty state appears, for an answer that cannot change.
      tries: 1,
      query: { interval: hourly ? '1h' : '1d', points },
    });
    if (response?.error) return [];

    const buckets = response?.data?.transaction_series?.buckets;
    if (!Array.isArray(buckets) || buckets.length !== points) return [];

    const parsed = buckets.map((bucket: ISeriesBucket) => ({
      key: bucket?.toMs,
      doc_count: bucket?.count,
    }));

    // A malformed bucket cannot be charted as a zero, which would draw as a
    // quiet interval the chain never had, and dropping it would pair every
    // later point against the wrong counterpart. Finite is not enough for the
    // timestamp: past 8.64e15 ms Date is invalid and its label prints NaN.
    const readable = parsed.every(
      point =>
        typeof point.key === 'number' &&
        Number.isFinite(point.key) &&
        Number.isFinite(new Date(point.key).getTime()) &&
        Number.isFinite(point.doc_count),
    );
    if (!readable) return [];

    // Oldest first is what the caller splits on: a reversed or repeated bucket
    // would swap the stretches or pair them off by one, with no visible fault.
    const series = parsed as ISeriesPoint[];
    const ordered = series.every(
      (point, index) => index === 0 || point.key > series[index - 1].key,
    );

    return ordered ? series : [];
  } catch (error) {
    console.error(error);
    return [];
  }
};
