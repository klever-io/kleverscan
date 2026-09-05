export interface ICapacity {
  /** 0..100 fill of the validator's own delegation cap, or undefined when
   *  there is no cap to fill. */
  fill?: number;
  /** Room left in the cap, in the chain's smallest unit. */
  room: number;
  uncapped: boolean;
}

/**
 * How full a validator's delegation cap is. `maxDelegation === 0` means no cap
 * rather than no room (the two uncapped mainnet validators hold 270T and 120T
 * against roughly 12T for a capped one), so those get `uncapped` instead of a
 * fill with a made-up denominator.
 */
export const validatorCapacity = (
  staked: number,
  maxDelegation: number,
): ICapacity => {
  if (!Number.isFinite(maxDelegation) || maxDelegation <= 0) {
    return { room: 0, uncapped: true };
  }
  // An unusable stake reads as full, not as empty: only empty advertises room
  // that may not be there. A negative stake is a zero stake, not an unknown one.
  let usable = maxDelegation;
  if (staked < 0) usable = 0;
  else if (Number.isFinite(staked)) usable = staked;

  return {
    fill: Math.min((usable / maxDelegation) * 100, 100),
    room: Math.max(maxDelegation - usable, 0),
    uncapped: false,
  };
};
