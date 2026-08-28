import { toMilliseconds } from '../index';

/** Block 0 on mainnet, in the two units `address/list` returns it in. */
const GENESIS_MS = 1656680400000;
const GENESIS_S = 1656680400;

describe('toMilliseconds', () => {
  it('leaves a millisecond timestamp alone', () => {
    expect(toMilliseconds(GENESIS_MS)).toBe(GENESIS_MS);
  });

  it('lifts a second timestamp to milliseconds', () => {
    expect(toMilliseconds(GENESIS_S)).toBe(GENESIS_MS);
  });

  it('puts both units on the same instant', () => {
    expect(toMilliseconds(GENESIS_S)).toBe(toMilliseconds(GENESIS_MS));
  });

  it('separates the units either side of the threshold', () => {
    // 1e12 ms is 2001-09-09 and 1e12 seconds is the year 33658, so no real chain timestamp
    // lands near the boundary in either unit; these two are the boundary itself.
    expect(toMilliseconds(1e12)).toBe(1e12);
    expect(toMilliseconds(1e12 - 1)).toBe((1e12 - 1) * 1000);
  });
});
