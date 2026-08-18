/** Tooltip copy shared by the desktop rows and the mobile cards. */
export const ASSET_BADGE_TOOLTIPS = {
  nft: 'Non-fungible collection: unique items, precision 0.',
  sft: 'Semi-fungible collection: items minted in editions.',
  paused: 'Transfers of this asset are currently paused by the owner.',
  pool: 'This asset has a KDA fee pool: network fees can be paid in it. See the Pools tab.',
} as const;

export const FPR_TOOLTIP =
  'Rewards come from a shared fee pool (Flexible Proportional Rewards); the rate varies per epoch.';

export const APR_TOOLTIP =
  'Annual percentage rate from the latest staking epoch.';

export const APR_CONFIGURED_TOOLTIP =
  'APR staking is configured; no rate history reported yet.';
