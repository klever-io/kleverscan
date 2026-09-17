import { bandwidthFeeReward } from '../index';

describe('bandwidthFeeReward', () => {
  it('halves the bandwidth fee, the measured 50/50 chain split', () => {
    expect(bandwidthFeeReward(6143952)).toBe(3071976);
  });

  it('reads an absent fee as zero, the shape of a block without transactions', () => {
    expect(bandwidthFeeReward(undefined)).toBe(0);
  });

  it('does not propagate NaN from a malformed field', () => {
    expect(bandwidthFeeReward(NaN)).toBe(0);
  });

  // `(txFees || 0) / 2` let these through: Infinity halves to Infinity and a
  // negative halves to a negative reward, both rendered as if real.
  it('does not propagate Infinity', () => {
    expect(bandwidthFeeReward(Infinity)).toBe(0);
  });

  it('reads a negative fee as nothing rather than a negative reward', () => {
    expect(bandwidthFeeReward(-6143952)).toBe(0);
  });
});
