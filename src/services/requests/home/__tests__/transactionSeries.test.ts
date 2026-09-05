import api from '@/services/api';
import {
  POINTS_PER_STRETCH,
  transactionSeriesCall,
} from '@/services/requests/home/transactionSeries';

jest.mock('@/services/api', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

const mockedGet = api.get as jest.Mock;
const HOUR_MS = 60 * 60 * 1000;

/** `points` buckets ending now, each `count` wide, oldest first as the route answers. */
const buckets = (points: number, count: number, widthMs: number) => {
  const toMs = 1_788_597_852_851;
  return Array.from({ length: points }, (_, index) => ({
    fromMs: toMs - (points - index) * widthMs,
    toMs: toMs - (points - 1 - index) * widthMs,
    count,
  }));
};

const answer = (list: unknown) =>
  mockedGet.mockResolvedValue({
    error: '',
    data: { transaction_series: { buckets: list } },
  });

describe('transactionSeriesCall', () => {
  beforeEach(() => jest.clearAllMocks());

  it('asks for two stretches of days in one request', async () => {
    answer(buckets(14, 100, 24 * HOUR_MS));

    const series = await transactionSeriesCall(7);

    expect(mockedGet).toHaveBeenCalledTimes(1);
    expect(mockedGet.mock.calls[0][0]).toEqual({
      route: 'transaction/statistics/series',
      query: { interval: '1d', points: 7 * POINTS_PER_STRETCH },
    });
    expect(series).toHaveLength(14);
  });

  it('draws a day as hourly points, or it would be two dots and no line', async () => {
    answer(buckets(48, 5, HOUR_MS));

    const series = await transactionSeriesCall(1);

    expect(mockedGet.mock.calls[0][0].query).toEqual({
      interval: '1h',
      points: 48,
    });
    expect(series).toHaveLength(48);
  });

  it('keys each point on the end of its bucket, oldest first', async () => {
    answer(buckets(14, 3, 24 * HOUR_MS));

    const series = await transactionSeriesCall(7);

    expect(series.every(point => point.doc_count === 3)).toBe(true);
    series.slice(1).forEach((point, index) => {
      expect(point.key - series[index].key).toBe(24 * HOUR_MS);
    });
  });

  it('keeps a quiet bucket as zero, which the route reports rather than omits', async () => {
    answer(buckets(14, 0, 24 * HOUR_MS));

    const series = await transactionSeriesCall(7);

    expect(series).toHaveLength(14);
    expect(series.every(point => point.doc_count === 0)).toBe(true);
  });

  it('answers nothing when the route failed', async () => {
    mockedGet.mockResolvedValue({ error: 'boom' });

    await expect(transactionSeriesCall(7)).resolves.toEqual([]);
  });

  it('answers nothing when the request rejected outright', async () => {
    mockedGet.mockRejectedValue(new Error('unreadable body'));

    await expect(transactionSeriesCall(7)).resolves.toEqual([]);
  });

  it('answers nothing when the body carries no bucket list', async () => {
    mockedGet.mockResolvedValue({ error: '', data: {} });

    await expect(transactionSeriesCall(7)).resolves.toEqual([]);
  });

  it('refuses a series shorter than it asked for', async () => {
    // The caller splits the list down the middle, so a short answer would
    // pair every later point against the wrong counterpart. The route
    // guarantees the length; this holds the caller to it.
    answer(buckets(13, 1, 24 * HOUR_MS));

    await expect(transactionSeriesCall(7)).resolves.toEqual([]);
  });

  it('refuses a series with a bucket it cannot read', async () => {
    // A malformed count charted as zero would draw a quiet day the chain
    // never had, and dropping it would misalign the two stretches.
    const list = buckets(14, 1, 24 * HOUR_MS);
    list[5] = { ...list[5], count: undefined as unknown as number };
    answer(list);

    await expect(transactionSeriesCall(7)).resolves.toEqual([]);
  });

  it('refuses a series that runs newest first', async () => {
    // Split down the middle, a reversed list draws the previous stretch as
    // the current one and inverts the percentage, with nothing to see.
    answer([...buckets(14, 1, 24 * HOUR_MS)].reverse());

    await expect(transactionSeriesCall(7)).resolves.toEqual([]);
  });

  it('refuses a series with a repeated bucket', async () => {
    const list = buckets(14, 1, 24 * HOUR_MS);
    list[6] = { ...list[5] };
    answer(list);

    await expect(transactionSeriesCall(7)).resolves.toEqual([]);
  });
});
