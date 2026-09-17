import { formatDate } from '@/utils/formatFunctions';

/** Deliberately no mock of `@/utils/timeFunctions`: the first version mocked `getAge`, exactly where
 *  the unguarded scaling loop lived, and certified the bug as fixed. Every case runs the real chain. */
describe('formatDate', () => {
  it.each([
    ['zero', 0],
    ['negative', -1000],
    ['past the Date range', 9e15],
    ['infinite', Infinity],
    ['not a number', NaN],
  ])('returns for a %s timestamp instead of looping', (_label, input) => {
    // `0 * 1000` is 0, so the scaling loop never reached the year 2000 and spun forever,
    // taking the render with it; the out-of-range cases fell through into NaN arithmetic.
    expect(formatDate(input as number)).toContain('01/01/70');
  });

  it('leaves a real timestamp alone', () => {
    expect(formatDate(1656680400000)).toContain('07/01/22');
  });
});
