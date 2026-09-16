import { commissionPercent, ratingPercent } from '../index';

describe('ratingPercent', () => {
  it('scales the chain value to a percentage', () => {
    expect(ratingPercent(10_000_000)).toBe(100);
    expect(ratingPercent(5_000_000)).toBe(50);
  });

  // The guard's other side: both fields are declared required but can be
  // missing from a response, and the raw arithmetic printed NaN%.
  it.each([
    ['undefined', undefined],
    ['NaN', NaN],
    ['Infinity', Infinity],
  ])('answers 0 for %s instead of NaN', (_l, value) => {
    expect(ratingPercent(value as unknown as number)).toBe(0);
  });
});

describe('commissionPercent', () => {
  it('converts basis points', () => {
    expect(commissionPercent(500)).toBe(5);
    expect(commissionPercent(10_000)).toBe(100);
  });

  it.each([
    ['undefined', undefined],
    ['NaN', NaN],
    ['-Infinity', -Infinity],
  ])('answers 0 for %s instead of NaN', (_l, value) => {
    expect(commissionPercent(value as unknown as number)).toBe(0);
  });
});
