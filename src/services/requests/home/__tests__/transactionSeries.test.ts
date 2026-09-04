import api from '@/services/api';
import {
  ROLLING_POINT_LIMIT,
  transactionSeriesCall,
} from '@/services/requests/home/transactionSeries';

jest.mock('@/services/api', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

const mockedGet = api.get as jest.Mock;
const DAY_MS = 24 * 60 * 60 * 1000;

const dated = () =>
  mockedGet.mock.calls
    .map(([args]) => args.query)
    .filter(query => query?.startdate !== undefined);

describe('transactionSeriesCall', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGet.mockResolvedValue({ error: '', pagination: { totalRecords: 100 } });
  });

  it('counts a rolling window per point for a period it can afford', async () => {
    // A week asks for fourteen points, seven for each stretch the chart draws.
    await transactionSeriesCall(7);

    const windows = dated();
    expect(windows).toHaveLength(ROLLING_POINT_LIMIT);
    windows.forEach(window => {
      expect(window.enddate - window.startdate).toBe(DAY_MS);
      // Milliseconds: seconds are not rejected, the route answers the
      // all-time total instead, so a unit slip reads as a plausible figure.
      expect(window.startdate).toBeGreaterThan(1e12);
    });
  });

  it('leaves no gap between consecutive points', async () => {
    await transactionSeriesCall(7);

    const windows = dated().sort((a, b) => a.enddate - b.enddate);
    expect(windows).toHaveLength(ROLLING_POINT_LIMIT);
    windows.slice(1).forEach((window, index) => {
      expect(window.startdate).toBe(windows[index].enddate);
    });
  });

  it('reads one clock for the whole set, so the windows cannot drift', async () => {
    // A clock read per point would leave each window ending a moment later
    // than the one before, which is what a moving clock exposes.
    let tick = 1_788_428_166_129;
    const spy = jest.spyOn(Date, 'now').mockImplementation(() => {
      tick += 1000;
      return tick;
    });

    await transactionSeriesCall(7);

    const ends = dated().map(window => window.enddate);
    // Every window ends on the same grid, one day apart, from one reading.
    const spacing = new Set(
      ends.sort((a, b) => a - b).slice(1).map((end, i) => end - ends[i]),
    );
    expect(spacing).toEqual(new Set([DAY_MS]));

    spy.mockRestore();
  });

  it('falls back to day buckets once the period costs too many requests', async () => {
    // 15D would need 30 requests, and the proxy refused 30 in a burst while
    // answering 20 (measured 2026-09-03).
    // Keys a day apart, newest first, the way the route answers.
    const newest = 1_788_393_600_000;
    mockedGet.mockResolvedValue({
      error: '',
      data: {
        number_by_day: Array.from({ length: 30 }, (_, index) => ({
          key: newest - index * DAY_MS,
          doc_count: 5,
        })),
      },
    });

    const series = await transactionSeriesCall(15);

    expect(mockedGet).toHaveBeenCalledTimes(1);
    expect(mockedGet.mock.calls[0][0].route).toBe('transaction/list/count/30');
    // Oldest first, whatever order the route answered in.
    expect(series[0].key).toBe(newest - 29 * DAY_MS);
    expect(series).toHaveLength(30);
  });

  it('answers an empty series when one window was refused', async () => {
    // A refused request read as zero would draw as a day with no activity.
    let call = 0;
    mockedGet.mockImplementation(() =>
      Promise.resolve(
        (call += 1) === 1
          ? { error: 'rate limited' }
          : { error: '', pagination: { totalRecords: 100 } },
      ),
    );

    await expect(transactionSeriesCall(7)).resolves.toEqual([]);
  });

  it('answers nothing when the bucket route failed', async () => {
    mockedGet.mockResolvedValue({ error: 'boom' });

    await expect(transactionSeriesCall(15)).resolves.toEqual([]);
  });

  it('answers nothing when the body carries no bucket list', async () => {
    // A malformed success, not a chain with no transactions.
    mockedGet.mockResolvedValue({ error: '', data: {} });

    await expect(transactionSeriesCall(15)).resolves.toEqual([]);
  });

  it('draws a malformed bucket as zero rather than refusing the series', async () => {
    // The one case where a zero can stand for a day that carried
    // transactions: the bucket's value cannot be known, so it is dropped and
    // the grid shows the gap as zero. Preferred over an empty chart, since a
    // single malformed answer would otherwise blank a month.
    const day = 24 * 60 * 60 * 1000;
    const newest = 1_788_393_600_000;
    const buckets = Array.from({ length: 30 }, (_, index) => ({
      key: newest - (29 - index) * day,
      doc_count: 10,
    }));
    buckets[5] = { key: null as unknown as number, doc_count: 9 };
    mockedGet.mockResolvedValue({
      error: '',
      data: { number_by_day: buckets },
    });

    const series = await transactionSeriesCall(15);

    expect(series).toHaveLength(30);
    expect(series[5].doc_count).toBe(0);
  });

  it('fills a day the route omitted with zero, on the day grid', async () => {
    // Its swagger says quiet days are omitted. A quiet day is a known zero,
    // and refusing the whole series for it left the chart empty for as long
    // as that day stayed inside the window: a month, on 1M.
    const day = 24 * 60 * 60 * 1000;
    const newest = 1_788_393_600_000;
    const withGap = Array.from({ length: 30 }, (_, index) => ({
      key: newest - (29 - index) * day,
      doc_count: 10,
    })).filter((_, index) => index !== 20);
    mockedGet.mockResolvedValue({
      error: '',
      data: { number_by_day: withGap },
    });

    const series = await transactionSeriesCall(15);

    expect(series).toHaveLength(30);
    expect(series[20]).toEqual({ key: newest - 9 * day, doc_count: 0 });
    // Every other day keeps its own figure, on its own key.
    expect(series[19].doc_count).toBe(10);
    expect(series[21].doc_count).toBe(10);
    expect(series[29].key).toBe(newest);
  });

  it('keeps a full series, whatever order the route answered in', async () => {
    const newest = 1_788_393_600_000;
    const full = Array.from({ length: 30 }, (_, index) => ({
      key: newest - index * DAY_MS,
      doc_count: 10,
    }));
    mockedGet.mockResolvedValue({ error: '', data: { number_by_day: full } });

    const series = await transactionSeriesCall(15);

    expect(series).toHaveLength(30);
    expect(series[0].key).toBe(newest - 29 * DAY_MS);
    expect(series.every(point => point.doc_count === 10)).toBe(true);
  });
});
