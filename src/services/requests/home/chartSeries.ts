import { ISeriesPoint } from '@/services/requests/home/transactionSeries';

/** The keys the locale files carry under `Date.Months`, in calendar order. */
const MONTH_KEYS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const twoDigits = (value: number) => String(value).padStart(2, '0');

/** One plotted point: a formatted date and the count it carries. */
export interface IChartPoint {
  date: string;
  value: number;
}

/** A day in the current stretch paired with its counterpart in the previous one. */
export interface IChartPair {
  valueNow: number;
  dateNow: string;
  txNow: IChartPoint;
  valuePast: number;
  datePast: string;
  txPast: IChartPoint;
}

export interface IChartSeries {
  pairs: IChartPair[];
  /** The current stretch's total, which the card prints beside the period. */
  total: number;
  /** The previous stretch's total, the baseline the percentage is measured against. */
  previousTotal: number;
}

const EMPTY: IChartSeries = { pairs: [], total: 0, previousTotal: 0 };

/**
 * Turns a series of daily counts into the pairs the chart draws.
 *
 * The list holds two stretches back to back, oldest first, so the older half
 * is the previous period and the newer half is the current one.
 *
 * `translateMonth` renders the month name, which is why this takes a function
 * rather than reaching for i18n itself: the caller holds the hook.
 */
export const buildChartSeries = (
  points: ISeriesPoint[],
  translateMonth: (month: string) => string,
  options: { hourly?: boolean } = {},
): IChartSeries => {
  const parsed = points.reduce((acc, point) => {
    if (!point || !point.key || Number.isNaN(point.doc_count)) return acc;

    const date = new Date(point.key);

    // UTC, like every timestamp the explorer prints (formatFunctions reads the
    // UTC fields too). Hourly buckets sit 24 hours apart across the two
    // stretches, so one clock time labels both.
    if (options.hourly) {
      acc.push({
        date: `${twoDigits(date.getUTCHours())}:${twoDigits(date.getUTCMinutes())}`,
        value: point.doc_count,
      });
      return acc;
    }

    acc.push({
      date: `${twoDigits(date.getUTCDate())} ${translateMonth(MONTH_KEYS[date.getUTCMonth()])}`,
      value: point.doc_count,
    });

    return acc;
  }, [] as IChartPoint[]);

  // An odd length would pair a day against the wrong counterpart and leave the
  // newest one without a partner, so the two stretches have to match. A point
  // dropped above is enough to cause it, and the caller cannot tell from the
  // pairs alone.
  if (!parsed.length || parsed.length % 2 !== 0) return EMPTY;

  const half = parsed.length / 2;
  const past = parsed.slice(0, half);
  const now = parsed.slice(half);

  // Paired by index on the route's contract: `points` buckets of one interval
  // each, oldest first, so the i-th of each stretch spans the same time. Count
  // and order are checked at the fetch; the interval itself is not re-measured.
  const pairs = past.map((txPast, index) => ({
    valueNow: now[index].value,
    dateNow: now[index].date,
    txNow: now[index],
    valuePast: txPast.value,
    datePast: txPast.date,
    txPast,
  }));

  return {
    pairs,
    total: pairs.reduce((sum, pair) => sum + pair.valueNow, 0),
    previousTotal: pairs.reduce((sum, pair) => sum + pair.valuePast, 0),
  };
};
