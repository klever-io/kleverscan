import { formatDate } from '@/utils/formatFunctions';

/**
 * Deliberately no mock of `@/utils/timeFunctions`.
 *
 * The first version of this file mocked `getAge`, which is exactly where the
 * unguarded scaling loop lived, so it asserted a return value for inputs that
 * never returned in production and certified the bug as fixed. Every case here
 * has to run the real chain to mean anything.
 */
describe('formatDate', () => {
  it.each([
    ['zero', 0],
    ['negative', -1000],
    ['past the Date range', 9e15],
    ['infinite', Infinity],
    ['not a number', NaN],
  ])('returns for a %s timestamp instead of looping', (_label, input) => {
    // `0 * 1000` is 0, so the scaling loop never reached the year 2000 and
    // spun forever, taking the render with it. The out-of-range cases fell
    // through both loops into NaN arithmetic instead.
    expect(formatDate(input as number)).toContain('01/01/70');
  });

  it('leaves a real timestamp alone', () => {
    expect(formatDate(1656680400000)).toContain('07/01/22');
  });
});
