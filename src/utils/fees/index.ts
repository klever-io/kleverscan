/**
 * The producer's share of a block's bandwidth fee.
 *
 * The chain splits the bandwidth fee in half: one half burns, the other pays
 * the producer. Measured, not assumed: `txBurnedFees` equalled `txFees / 2`
 * exactly on all 14 blocks carrying transactions in a 100-block mainnet
 * sample, and `totalTxRewards / totalTxFees` held at 0,500000 across 365 days
 * of daily statistics. The API carries no per-block field for this side of
 * the split, so every list that shows it derives it; deriving it here keeps
 * the desktop row, the mobile card and the home page from drifting apart.
 */
export const bandwidthFeeReward = (txFees: number | undefined): number =>
  Number.isFinite(txFees) && (txFees as number) > 0
    ? (txFees as number) / 2
    : 0;
