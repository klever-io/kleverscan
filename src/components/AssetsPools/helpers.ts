import { IAssetPoolRow } from '@/types';
import { KLV_PRECISION } from '@/utils/globalVariables';

/**
 * KDA received per 1 KLV, corrected for precision.
 *
 * The API's `ratio` field is the raw integer ratio of the fixed-rate pair, so
 * it only matches reality when the KDA happens to share KLV's precision of 6.
 * Deriving the rate from the raw pair and both precisions is the only way to
 * get a number that means what it says.
 */
export const getPoolRate = (
  fRatioKLV?: number,
  fRatioKDA?: number,
  kdaPrecision?: number,
): number | undefined => {
  if (
    kdaPrecision === undefined ||
    fRatioKLV === undefined ||
    fRatioKDA === undefined ||
    !Number.isFinite(kdaPrecision) ||
    !Number.isFinite(fRatioKLV) ||
    !Number.isFinite(fRatioKDA) ||
    fRatioKLV <= 0
  ) {
    return undefined;
  }
  const klvUnits = fRatioKLV / 10 ** KLV_PRECISION;
  const kdaUnits = fRatioKDA / 10 ** kdaPrecision;
  if (klvUnits <= 0) return undefined;
  return kdaUnits / klvUnits;
};

/**
 * Rates span six orders of magnitude across the live pools (0.000001 to
 * 100000), so one fixed decimal count cannot serve them: large rates get
 * thousands separators, small ones keep enough decimals to stay non-zero.
 */
export const formatRate = (rate?: number): string => {
  if (rate === undefined || !Number.isFinite(rate) || rate < 0) return '--';
  if (rate === 0) return '0';
  if (rate >= 1) {
    return rate.toLocaleString('en-US', { maximumFractionDigits: 2 });
  }
  if (rate < 0.000001) return '<0.000001';
  return rate.toFixed(6).replace(/0+$/, '').replace(/\.$/, '');
};

/** Owner and admin are the same account on most pools; only differences matter. */
export const hasSeparateAdmin = (pool: IAssetPoolRow): boolean =>
  !!pool.adminAddress && pool.adminAddress !== pool.ownerAddress;

export interface IPoolsSummary {
  total: number;
  active: number;
  /** Combined KLV reserve across all pools, in whole KLV. */
  klvReserves: number;
}

/**
 * Chain-wide pool figures. Only KLV reserves are summed: adding up KDA
 * balances would mix different tokens into a meaningless total.
 */
export const summarizePools = (pools: IAssetPoolRow[]): IPoolsSummary => ({
  total: pools.length,
  active: pools.filter(pool => pool.active).length,
  klvReserves:
    pools.reduce((acc, pool) => acc + (pool.klvBalance || 0), 0) /
    10 ** KLV_PRECISION,
});
