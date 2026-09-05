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

/** Buckets the chart draws per period, one for each stretch it compares. */
export const POINTS_PER_STRETCH = 2;

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
  const hourly = period === 1;
  const points = period * POINTS_PER_STRETCH * (hourly ? 24 : 1);

  try {
    const response = await api.get({
      route: 'transaction/statistics/series',
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
    // later point against the wrong counterpart.
    const readable = parsed.every(
      point => Number.isFinite(point.key) && Number.isFinite(point.doc_count),
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
