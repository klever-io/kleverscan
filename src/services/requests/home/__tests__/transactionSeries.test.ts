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
    mockedGet.mockResolvedValue({
      error: '',
      data: { number_by_day: [{ key: 2, doc_count: 5 }, { key: 1, doc_count: 3 }] },
    });

    const series = await transactionSeriesCall(15);

    expect(mockedGet).toHaveBeenCalledTimes(1);
    expect(mockedGet.mock.calls[0][0].route).toBe('transaction/list/count/30');
    // Oldest first, whatever order the route answered in.
    expect(series.map(point => point.key)).toEqual([1, 2]);
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

  it('drops a malformed bucket rather than charting it', async () => {
    mockedGet.mockResolvedValue({
      error: '',
      data: { number_by_day: [{ key: 1, doc_count: 3 }, { key: null, doc_count: 9 }] },
    });

    await expect(transactionSeriesCall(15)).resolves.toEqual([
      { key: 1, doc_count: 3 },
    ]);
  });
});
