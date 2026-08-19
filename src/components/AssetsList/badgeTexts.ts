/**
 * Translation keys for the tooltip copy shared by the desktop rows and the
 * mobile cards. Keys rather than sentences, because this module is not a
 * component and cannot reach the translator itself; each call site resolves
 * them with its own `t`.
 */
export const ASSET_BADGE_TOOLTIPS = {
  nft: 'assets:List.Tooltips.Nft',
  sft: 'assets:List.Tooltips.Sft',
  paused: 'assets:List.Tooltips.Paused',
  pool: 'assets:List.Tooltips.Pool',
} as const;

export const FPR_TOOLTIP = 'assets:List.Tooltips.Fpr';

export const APR_TOOLTIP = 'assets:List.Tooltips.Apr';

export const APR_CONFIGURED_TOOLTIP = 'assets:List.Tooltips.AprConfigured';
