import { validatorRates } from '..';

const rates = (
  leader: [number, number],
  signed: [number, number],
): Parameters<typeof validatorRates>[0] => ({
  totalLeaderSuccessRate: { numSuccess: leader[0], numFailure: leader[1] },
  totalValidatorSuccessRate: { numSuccess: signed[0], numFailure: signed[1] },
});

describe('validatorRates', () => {
  it('keeps leader slots apart from the combined total', () => {
    const result = validatorRates(rates([100, 5], [2_000, 35]));
    expect(result.leaderSuccess).toBe(100);
    expect(result.leaderFailure).toBe(5);
    expect(result.totalSuccess).toBe(2_100);
    expect(result.totalFailure).toBe(40);
  });

  // The defect this exists to prevent, measured on mainnet: summing the
  // combined figure over the set gave 687.379.910 against a chain height of
  // 32.806.707, because each block carries ~20 co-signatures. The leader
  // figure tracked the height (32.804.821).
  it('never lets the leader count absorb the signatures', () => {
    const result = validatorRates(rates([1, 0], [20, 0]));
    expect(result.leaderSuccess).toBe(1);
    expect(result.totalSuccess).toBe(21);
    expect(result.leaderSuccess).toBeLessThan(result.totalSuccess);
  });

  it('reads a missing rate object as zero rather than crashing', () => {
    expect(validatorRates({})).toEqual({
      leaderSuccess: 0,
      leaderFailure: 0,
      totalSuccess: 0,
      totalFailure: 0,
    });
  });

  it('reads a half-present rate object as zero for the missing half', () => {
    const result = validatorRates({
      totalLeaderSuccessRate: { numSuccess: 7, numFailure: 1 },
    });
    expect(result.leaderSuccess).toBe(7);
    expect(result.totalSuccess).toBe(7);
    expect(result.totalFailure).toBe(1);
  });

  // These arrive over JSON, so the whole numeric domain can turn up.
  it.each([
    ['NaN', NaN],
    ['Infinity', Infinity],
    ['-Infinity', -Infinity],
    ['undefined', undefined],
  ])('treats a %s count as zero', (_label, value) => {
    const result = validatorRates({
      totalLeaderSuccessRate: {
        numSuccess: value as number,
        numFailure: 3,
      },
    });
    expect(result.leaderSuccess).toBe(0);
    expect(result.leaderFailure).toBe(3);
  });
});
