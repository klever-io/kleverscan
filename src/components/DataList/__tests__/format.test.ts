import { exactAmount, formatShare } from '../format';

describe('formatShare', () => {
  it('returns a placeholder for a missing, zero or negative total', () => {
    expect(formatShare(10, 0)).toBe('--');
    expect(formatShare(10, -5)).toBe('--');
  });

  it('returns a placeholder for a non-finite or negative part', () => {
    expect(formatShare(NaN, 100)).toBe('--');
    expect(formatShare(10, Infinity)).toBe('--');
    expect(formatShare(-1, 100)).toBe('--');
  });

  it('formats exact zero without decimals', () => {
    expect(formatShare(0, 1000)).toBe('0%');
  });

  it('floors dust shares instead of rounding them to zero', () => {
    expect(formatShare(1, 1_000_000)).toBe('<0.01%');
  });

  it('uses two decimals below ten percent and one above', () => {
    expect(formatShare(123, 10_000)).toBe('1.23%');
    expect(formatShare(2_623, 10_000)).toBe('26.2%');
  });

  it('drops a trailing zero decimal', () => {
    expect(formatShare(2_604, 10_000)).toBe('26%');
  });

  // A near-total holder rounded up to a flat 100% would claim sole ownership,
  // which on an explorer is a different statement about the asset.
  it('never rounds a near-total share up to a flat 100%', () => {
    expect(formatShare(99_960, 100_000)).toBe('>99.9%');
    expect(formatShare(99_999, 100_000)).toBe('>99.9%');
  });

  it('reserves 100% for a genuine whole, and clamps above it', () => {
    expect(formatShare(1_000, 1_000)).toBe('100%');
    expect(formatShare(2_000, 1_000)).toBe('100%');
  });
});

describe('exactAmount', () => {
  it('renders the exact value with the asset precision', () => {
    expect(exactAmount(9663317768717496, 6)).toBe('9,663,317,768.717496');
    expect(exactAmount(350, 0)).toBe('350');
  });

  it('groups thousands and trims trailing zeros from the fraction', () => {
    expect(exactAmount(1_500_000, 6)).toBe('1.5');
    expect(exactAmount(1_234_567_000_000, 6)).toBe('1,234,567');
    expect(exactAmount(0, 6)).toBe('0');
  });

  // Doubles at or above 1e21 stringify to exponent form. Reading them through
  // BigInt keeps the digit walk working instead of falling back to the float
  // division this function exists to avoid.
  it('stays exact past the magnitude where doubles print as exponents', () => {
    expect(exactAmount(1e21, 6)).toBe('1,000,000,000,000,000');
    expect(exactAmount(1.23e22, 8)).toBe('123,000,000,000,000.01048576');
  });

  it('returns a placeholder for a non-finite or negative amount', () => {
    expect(exactAmount(NaN, 6)).toBe('--');
    expect(exactAmount(-1, 6)).toBe('--');
  });

  it('renders exact digits from a string past what a double can carry', () => {
    // EMT-NO9T live: JSON.parse rounds this to ...000; the string twin from
    // the parse boundary keeps the final 1 (#679).
    expect(exactAmount('100000000000000001', 8)).toBe(
      '1,000,000,000.00000001',
    );
  });

  it('rejects a string that is not pure digits', () => {
    expect(exactAmount('', 6)).toBe('--');
    expect(exactAmount('1.5', 6)).toBe('--');
    expect(exactAmount('-3', 6)).toBe('--');
    expect(exactAmount('1e17', 6)).toBe('--');
    expect(exactAmount('abc', 6)).toBe('--');
  });

  it('walks digit counts far past the double range', () => {
    expect(exactAmount('123456789012345678901234567890', 6)).toBe(
      '123,456,789,012,345,678,901,234.56789',
    );
  });

  it('keeps the full fraction when asked not to trim', () => {
    // The fixed-decimals presentation the asset overview shows in body text.
    expect(exactAmount('9663453870058599', 6, { trimFraction: false })).toBe(
      '9,663,453,870.058599',
    );
    expect(exactAmount('10000000000000000', 8, { trimFraction: false })).toBe(
      '100,000,000.00000000',
    );
    // Precision 0: no fraction exists, trimmed or not.
    expect(exactAmount('123', 0, { trimFraction: false })).toBe('123');
  });
});

describe('klvAmount', () => {
  it('compacts units at KLV precision with a breaking space by default', () => {
    expect(require('../format').klvAmount(6143952)).toBe('6.14 KLV');
  });

  it('binds amount and unit with a non-breaking space on request', () => {
    // One token, so a wrapping card row cannot leave "KLV" alone on the
    // next line, mid-value.
    expect(require('../format').klvAmount(6143952, { nbsp: true })).toBe(
      '6.14\u00A0KLV',
    );
  });

  it('reads an absent amount as zero, the empty-block shape', () => {
    expect(require('../format').klvAmount(undefined)).toBe('0 KLV');
  });
});
