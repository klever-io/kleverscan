export interface ICapacity {
  /** 0..100 fill of the validator's own delegation cap, or undefined when
   *  there is no cap to fill. */
  fill?: number;
  /** Room left in the cap, in the chain's smallest unit. */
  room: number;
  uncapped: boolean;
}

/**
 * How full a validator's delegation cap is.
 *
 * `maxDelegation === 0` means no cap rather than no room: measured on mainnet,
 * the two validators without one hold 270T and 120T against roughly 12T for
 * every capped validator, and both still accept delegation. Those get
 * `uncapped`, not a 0 percent fill, because a fill would need a denominator
 * that does not exist.
 *
 * The cap is the track, so the fill matches the percentage printed beside it:
 * the rule `holdersMath.buildRowBar` states for holder shares.
 */
export const validatorCapacity = (
  staked: number,
  maxDelegation: number,
): ICapacity => {
  if (!Number.isFinite(maxDelegation) || maxDelegation <= 0) {
    return { room: 0, uncapped: true };
  }
  // An unusable stake reads as full, not as empty. Both are wrong, but only
  // one of them advertises room that may not be there, and this figure exists
  // to answer "can I still delegate here". A negative stake is the exception:
  // that is a zero stake, not an unknown one.
  let usable = maxDelegation;
  if (staked < 0) usable = 0;
  else if (Number.isFinite(staked)) usable = staked;

  return {
    fill: Math.min((usable / maxDelegation) * 100, 100),
    room: Math.max(maxDelegation - usable, 0),
    uncapped: false,
  };
};
