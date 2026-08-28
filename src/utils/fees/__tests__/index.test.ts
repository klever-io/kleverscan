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
});
