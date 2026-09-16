import {
  ROLLING_WINDOW_MS,
  rollingWindow,
  rollingWindowSpan,
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

describe('rollingWindowSpan', () => {
  const now = 1_788_428_166_129;

  it('spans the number of windows asked for, ending now', () => {
    const { startdate, enddate } = rollingWindowSpan(7, now);

    expect(enddate).toBe(now);
    expect(enddate - startdate).toBe(7 * ROLLING_WINDOW_MS);
  });

  it('never asks for an empty range, whatever it is handed', () => {
    // Zero would make the two ends equal, and the count of an empty range is
    // 0, which a tile would print as a fact.
    expect(
      rollingWindowSpan(0, now).enddate - rollingWindowSpan(0, now).startdate,
    ).toBe(ROLLING_WINDOW_MS);
  });

  it('reads the clock once, so a set of windows cannot drift apart', () => {
    // Two reads a tick apart leave the figures beside each other measuring
    // ranges that overlap or leave a gap.
    const a = rollingWindowSpan(7, now);
    const b = rollingWindow(0, now);

    expect(a.enddate).toBe(b.enddate);
  });
});
