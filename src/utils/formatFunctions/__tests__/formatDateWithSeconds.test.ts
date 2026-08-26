import { formatDateWithSeconds } from '..';

describe('formatDateWithSeconds', () => {
  it('renders the full UTC moment including seconds', () => {
    // Date.UTC(2026, 7, 25, 13, 20, 55)
    expect(formatDateWithSeconds(1787664055000)).toBe('08/25/26 13:20:55 UTC');
  });

  it('normalizes a seconds-precision chain timestamp the way formatDate does', () => {
    expect(formatDateWithSeconds(1787664055)).toBe('08/25/26 13:20:55 UTC');
  });

  it('renders the epoch for a missing timestamp instead of looping forever', () => {
    // 0 times 1000 stays 0: without the clamp the year never reaches 2000
    // and the normalization loop hangs the tab.
    expect(formatDateWithSeconds(0)).toBe('01/01/70 00:00:00 UTC');
    expect(formatDateWithSeconds(Number.NaN)).toBe('01/01/70 00:00:00 UTC');
  });
});
