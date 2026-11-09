jest.mock('@/utils/parseValues', () => ({
  parseAddress: (address: string, maxLen: number) =>
    address.length > maxLen
      ? `${address.slice(0, maxLen / 2)}...${address.slice(-(maxLen / 2))}`
      : address,
}));

import { middleFit } from '../fitKey';

const px = (text: string): number => text.length * 10;

const split = (value: string, maxLen: number): string =>
  value.length > maxLen
    ? `${value.slice(0, maxLen / 2)}...${value.slice(-(maxLen / 2))}`
    : value;

describe('middleFit', () => {
  const key = `${'a'.repeat(40)}${'b'.repeat(40)}`;

  it('fills the cell with the start and the end of the key', () => {
    const shown = middleFit(key, 100, px);

    expect(shown).toBe(split(key, 7));
    expect(shown.startsWith(key.slice(0, 3))).toBe(true);
    expect(shown.endsWith(key.slice(-3))).toBe(true);
    expect(px(shown)).toBeLessThanOrEqual(100);
    expect(px(split(key, 8))).toBeGreaterThan(100);
  });

  it('leaves a key that already fits unchanged', () => {
    expect(middleFit('abcd', 100, px)).toBe('abcd');
  });

  it('leaves the key whole when the cell width is not known yet', () => {
    expect(middleFit(key, 0, px)).toBe(key);
  });
});
