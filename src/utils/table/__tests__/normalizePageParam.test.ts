import { normalizePageParam } from '../index';

/**
 * The URL is the only source for these two, and both feed something that
 * breaks on the wrong shape: the page number goes to the API, and the size
 * goes to `Array(limit)`, which throws on a non-integer or negative length.
 */
describe('normalizePageParam', () => {
  it('passes an ordinary value through', () => {
    expect(normalizePageParam('3', 1)).toBe(3);
    expect(normalizePageParam('50', 10, 100)).toBe(50);
  });

  it('rejects a non-finite value rather than passing it on', () => {
    // `Number('Infinity')` is truthy, so a plain `|| fallback` let it through
    // and the page number reached the API as Infinity.
    expect(normalizePageParam('Infinity', 1)).toBe(1);
    expect(normalizePageParam('-Infinity', 1)).toBe(1);
    expect(normalizePageParam('NaN', 1)).toBe(1);
  });

  it('falls back for anything below one', () => {
    expect(normalizePageParam('-5', 1)).toBe(1);
    expect(normalizePageParam('0', 1)).toBe(1);
    expect(normalizePageParam('0.5', 10, 100)).toBe(10);
  });

  it('floors a fractional value', () => {
    expect(normalizePageParam('2.7', 1)).toBe(2);
    expect(normalizePageParam('3.5', 10, 100)).toBe(3);
  });

  it('falls back for anything that is not a number at all', () => {
    expect(normalizePageParam('abc', 1)).toBe(1);
    expect(normalizePageParam('', 10)).toBe(10);
    expect(normalizePageParam(undefined, 10)).toBe(10);
    expect(normalizePageParam(['3', '4'], 1)).toBe(1);
  });

  it('caps at the maximum when one is given', () => {
    expect(normalizePageParam('200', 10, 100)).toBe(100);
    expect(normalizePageParam('1e9', 10, 100)).toBe(100);
    // And leaves the page number uncapped, because it has no array behind it.
    expect(normalizePageParam('1e9', 1)).toBe(1000000000);
  });
});
