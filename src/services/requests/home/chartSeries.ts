import { ISeriesPoint } from '@/services/requests/home/transactionSeries';
import { format } from 'date-fns';

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
): IChartSeries => {
  const parsed = points.reduce((acc, point) => {
    if (!point || !point.key || Number.isNaN(point.doc_count)) return acc;

    const date = new Date(point.key);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());

    const [day, month] = format(date, 'dd MMM').split(' ');

    acc.push({
      date: `${day} ${translateMonth(month)}`,
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
