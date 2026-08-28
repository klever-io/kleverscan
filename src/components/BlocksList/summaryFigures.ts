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
  // split reports its own number instead of one this file assumes. Capped at
  // the fee it comes from: above it the segment sum would exceed the displayed
  // total and the bar would draw wider than itself.
  const validators = Math.min(finite(day.totalTxRewards), bandwidth);
  const burned = bandwidth - validators;

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

/** Both halves in: the one definition staleTime and the retry share, so the
 *  two cannot drift apart with only one of them under test. */
export const summaryComplete = (
  data: { yesterday?: unknown; total?: unknown } | undefined,
): boolean => Boolean(data?.yesterday && data?.total);

/**
 * How often the summary retries while its answer is incomplete. The stat
 * calls map failures to undefined, so the query "succeeds" with a hole and
 * staleTime alone never refetches a mounted query; without this the card
 * stayed absent until a remount or window focus.
 */
export const summaryRefetchInterval = (
  data: { yesterday?: unknown; total?: unknown } | undefined,
): number | false => (summaryComplete(data) ? false : 30_000);
