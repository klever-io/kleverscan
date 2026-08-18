import { IAsset } from '@/types';

/**
 * Supply figures for the void (burn) address come from the API as
 * `voidedSupply` and `netCirculatingSupply`. Older proxy builds omit both, so
 * every consumer checks presence first and falls back to the raw supply rather
 * than rendering a missing value as zero.
 */
export const hasVoidSupply = (
  asset?: Pick<IAsset, 'voidedSupply' | 'netCirculatingSupply'>,
): boolean =>
  typeof asset?.voidedSupply === 'number' &&
  typeof asset?.netCirculatingSupply === 'number';

/**
 * Supply excluding the void address, which is what "circulating" means across
 * the explorer. Falls back to the raw chain figure where the API does not
 * report the void yet.
 */
export const getCirculatingSupply = (asset: IAsset): number =>
  hasVoidSupply(asset)
    ? (asset.netCirculatingSupply as number)
    : asset.circulatingSupply;

/**
 * Holder shares are measured against the total supply, the void address
 * included, so every row in the holders table gets a percentage and the column
 * adds up to 100%. Measuring against circulating instead would leave the void
 * row without a value and inflate everyone else on heavily burned assets.
 */
export const formatHolderPercentage = (
  totalBalance: number,
  totalSupply: number,
): string =>
  totalSupply > 0
    ? `${((totalBalance / totalSupply) * 100).toFixed(2)}%`
    : '--';
