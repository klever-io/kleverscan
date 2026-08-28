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

  it('renders the epoch for a timestamp past the Date range', () => {
    // Beyond 8.64e15 a Date is Invalid and every getter answers NaN; both scaling loops
    // fall through (NaN compares false either way) and the output was "NaN/NaN/aN NaN:NaN:NaN UTC".
    expect(formatDateWithSeconds(9e15)).toBe('01/01/70 00:00:00 UTC');
    expect(formatDateWithSeconds(Number.MAX_SAFE_INTEGER)).toBe(
      '01/01/70 00:00:00 UTC',
    );
  });

  it('scales a timestamp above the year 3000 back down', () => {
    // The other half of the normalisation, and the only path that divides.
    // 4e13 ms is the year 3237, inside the Date range, so it reaches the loop rather than the guard.
    expect(formatDateWithSeconds(4e13)).toBe('04/08/71 23:06:40 UTC');
  });
});
