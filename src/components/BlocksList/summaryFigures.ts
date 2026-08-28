import { IBlockDayStats } from '@/services/requests/block';

export interface IFeeSegment {
  key: 'burned' | 'validators' | 'kapp';
  amount: number;
}

export interface IFeeSplit {
  /** Bandwidth plus kApp fees: what the transactions of that day cost. */
  total: number;
  segments: IFeeSegment[];
}

/**
 * The day's transaction fees and where they went.
 *
 * The bandwidth fee splits in half, verified against mainnet: `txBurnedFees`
 * was exactly `txFees / 2` on all 14 blocks carrying transactions in a sample
 * of 100, and `totalTxRewards / totalTxFees` held at 0,500000 across 365 days.
 * The kApp fee is its own segment because the API does not say where it goes,
 * and it is too big to leave out: 9,4 to 91,1 percent of the total over a year.
 *
 * Returns undefined when nothing usable arrived, so a tile is left out rather
 * than printing a zero the chain never reported.
 */
export const feeSplit = (
  day: IBlockDayStats | undefined,
): IFeeSplit | undefined => {
  if (!day) return undefined;

  const finite = (value: unknown): number =>
    typeof value === 'number' && Number.isFinite(value) && value >= 0
      ? value
      : 0;

  const bandwidth = finite(day.totalTxFees);
  const kapp = finite(day.totalKappsFees);
  // From the field rather than halving `bandwidth`, so a chain that changes the
  // split reports its own number instead of one this file assumes.
  const validators = finite(day.totalTxRewards);
  // The remainder, never negative: `totalTxRewards` above the fee it comes from
  // would otherwise draw a segment running backwards.
  const burned = Math.max(0, bandwidth - validators);

  const total = bandwidth + kapp;
  if (total === 0) return undefined;

  return {
    total,
    segments: [
      { key: 'burned', amount: burned },
      { key: 'validators', amount: validators },
      { key: 'kapp', amount: kapp },
    ],
  };
};
