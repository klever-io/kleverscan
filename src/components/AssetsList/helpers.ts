import { IAsset } from '@/types';
import { getCirculatingSupply } from '@/utils/voidSupply';

export interface IAssetSupplyViews {
  /** What the asset "has in circulation", void holdings excluded. */
  circulating: number;
  /** What the mint cap is measured against, void holdings included. */
  capBasis: number;
}

/**
 * The two supply figures an asset row needs, and the reason they differ.
 *
 * A cap limits minting: tokens parked on the void address were minted and
 * never burned, so they still occupy headroom and the cap is measured gross.
 * The displayed circulating figure excludes them, because they can never move
 * again. Collapsing the two would read BLOCK-31F6 as 2% of its cap used when
 * it is at 99.99%, which is why they are derived here once instead of at each
 * of the two layouts.
 */
export const assetSupplyViews = (asset: IAsset): IAssetSupplyViews => ({
  circulating: getCirculatingSupply(asset),
  capBasis: asset.circulatingSupply,
});

export interface ICapUsage {
  hasCap: boolean;
  /** 0..1 share of the maximum supply currently in circulation. */
  usedShare: number;
}

/**
 * Bar model for the Cap Used column. The cap limits minted minus burned, so
 * pass the gross circulating supply: burned tokens free headroom again on a
 * mintable asset, while tokens parked on the void address do not.
 */
export const getCapUsage = (
  circulatingSupply: number,
  maxSupply: number,
): ICapUsage => {
  if (
    !Number.isFinite(maxSupply) ||
    !Number.isFinite(circulatingSupply) ||
    maxSupply <= 0
  ) {
    return { hasCap: false, usedShare: 0 };
  }
  return {
    hasCap: true,
    usedShare: Math.min(Math.max(circulatingSupply / maxSupply, 0), 1),
  };
};

/** Latest epoch APR as "8.00%"; the API stores percent times 100 (800 = 8.00%). */
export const getLatestAprPercent = (
  staking: IAsset['staking'] | null | undefined,
): string | undefined => {
  const history = staking?.apr;
  if (!history || history.length === 0) return undefined;
  const value = history[history.length - 1]?.value;
  return typeof value === 'number' ? `${(value / 100).toFixed(2)}%` : undefined;
};

export type IRewardsModel =
  | { kind: 'apr'; rate: string }
  | { kind: 'apr-configured' }
  | { kind: 'fpr' }
  | { kind: 'none' };

/**
 * What the Rewards column shows: a real APR rate when the history carries
 * one, the FPR pool marker, or nothing when the asset has no staking.
 */
export const getRewardsModel = (
  staking: IAsset['staking'] | null | undefined,
): IRewardsModel => {
  if (!staking?.interestType) return { kind: 'none' };
  if (staking.interestType === 'APRI') {
    const rate = getLatestAprPercent(staking);
    return rate ? { kind: 'apr', rate } : { kind: 'apr-configured' };
  }
  return { kind: 'fpr' };
};
