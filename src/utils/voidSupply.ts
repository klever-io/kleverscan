import { IAsset } from '@/types';

type VoidSupplyFields = Pick<IAsset, 'voidedSupply' | 'netCirculatingSupply'>;

/** Both void figures, once presence has been established. */
export type WithVoidSupply = VoidSupplyFields & {
  voidedSupply: number;
  netCirculatingSupply: number;
};

/**
 * True when the API reports both void figures as numbers, zero included.
 * Older proxy builds omit them entirely. What a caller does with a false
 * answer is its own policy: the overview hides its void rows, the assets list
 * falls back to the raw supply, and the holders table never asks.
 *
 * A type predicate rather than a plain boolean, so the narrowing survives if
 * this check is ever weakened.
 */
export const hasVoidSupply = (
  asset?: VoidSupplyFields,
): asset is WithVoidSupply =>
  typeof asset?.voidedSupply === 'number' &&
  typeof asset?.netCirculatingSupply === 'number';

/**
 * Net circulating supply when the API reports both void figures, otherwise the
 * raw chain figure. Not the basis everywhere: the home market cap, the search
 * preview, the account Proprietary Assets tab, SFT nonce pages and the holders
 * table all deliberately keep the raw `circulatingSupply`. This helper feeds
 * the assets list and the overview staked share.
 */
export const getCirculatingSupply = (asset: IAsset): number =>
  hasVoidSupply(asset) ? asset.netCirculatingSupply : asset.circulatingSupply;

/**
 * What the two void-derived overview rows should do for a given asset.
 *
 * - `loading`: no asset yet, so presence is not knowable and the rows render
 *   their skeletons rather than a value.
 * - `ready`: the API reports both figures, zero included, so the rows show
 *   them. A netCirculatingSupply of 0 is a real answer and stays visible.
 * - `hidden`: a loaded asset from an API build without the fields. The rows
 *   are omitted, because rendering a missing value as 0 is the exact failure
 *   this metric exists to prevent.
 */
export type VoidRowState = 'loading' | 'ready' | 'hidden';

export const voidRowState = (asset?: VoidSupplyFields): VoidRowState => {
  if (!asset) return 'loading';
  return hasVoidSupply(asset) ? 'ready' : 'hidden';
};
