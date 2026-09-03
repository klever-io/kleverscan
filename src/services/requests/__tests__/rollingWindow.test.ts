import {
  ROLLING_WINDOW_MS,
  rollingWindow,
} from '@/services/requests/rollingWindow';

describe('rollingWindow', () => {
  const now = 1_788_428_166_129;

  it('spans exactly 24 hours ending now', () => {
    const { startdate, enddate } = rollingWindow(0, now);

    expect(enddate).toBe(now);
    expect(enddate - startdate).toBe(ROLLING_WINDOW_MS);
  });

  it('steps back a whole window without leaving a gap or an overlap', () => {
    const current = rollingWindow(0, now);
    const previous = rollingWindow(1, now);

    expect(previous.enddate).toBe(current.startdate);
    expect(previous.enddate - previous.startdate).toBe(ROLLING_WINDOW_MS);
  });

  /**
   * The bound that matters: `startdate` in seconds is not rejected by the
   * API, it answers the all-time total instead (58,637,559 against 8,165 for
   * the day, measured 2026-09-03). A window that drifts into seconds would
   * therefore read as a plausible figure rather than an error.
   */
  it('stays in milliseconds, the unit the route reads', () => {
    const { startdate, enddate } = rollingWindow(0, now);

    expect(enddate).toBeGreaterThan(1e12);
    expect(startdate).toBeGreaterThan(1e12);
  });

  it('does not move on its own between calls with the same clock', () => {
    expect(rollingWindow(0, now)).toEqual(rollingWindow(0, now));
  });
});
