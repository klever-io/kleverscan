/**
 * The rolling 24 hour window the "(24h)" tiles report.
 *
 * `transaction/list/count/<days>` and its histogram sibling answer whole UTC
 * days: bucket [0] is today since midnight, so at 09:00 it holds nine hours
 * under a label saying 24. Measured 2026-09-03 on mainnet, bucket [0] was
 * 2817 against 8165 for the real day.
 *
 * `startdate`/`enddate` on the list routes take epoch MILLIseconds. Seconds
 * are not rejected: the route answers the all-time total instead (58,637,559
 * where the day held 8,165), so a unit slip reads as a plausible number.
 */
export const ROLLING_WINDOW_MS = 24 * 60 * 60 * 1000;

export interface IRollingWindow {
  startdate: number;
  enddate: number;
}

/**
 * The window ending now, or the one before it. `offsetWindows` counts
 * backwards: 0 is the last 24 hours, 1 the 24 hours before that.
 */
export const rollingWindow = (
  offsetWindows = 0,
  now: number = Date.now(),
): IRollingWindow => {
  const enddate = now - offsetWindows * ROLLING_WINDOW_MS;
  return { startdate: enddate - ROLLING_WINDOW_MS, enddate };
};
