import { IAsset } from '@/types';

/**
 * Receive the asset with fpr values to calculate the apr
 * @param asset is required to use the totalStaked and totalAmount values of each epoch
 * @param epochQty  is required and it's the number of epoch to use to calculate the estimared apr, by default it'll use 10 epoch
 * @param start is required to know which epoch should start to calc the before last epoch. This is the last epoch before the 24h ( last 5th epoch)
 * @returns return a number that is the estimated APR
 */
export const calcApr = (
  asset: IAsset,
  epochQty: number,
  start: number,
): number => {
  const values = {
    totalStaked: 0,
    totalAmount: 0,
  };
  for (let index = 1 + start; index <= epochQty + start; index += 1) {
    values.totalStaked +=
      asset?.staking?.fpr[asset?.staking?.fpr.length - index].totalStaked;
    values.totalAmount +=
      asset?.staking?.fpr[asset?.staking?.fpr.length - index].totalAmount;
  }

  values.totalStaked = values.totalStaked / epochQty;
  values.totalAmount = values.totalAmount / epochQty;

  return (values.totalAmount / values.totalStaked) * 4 * 365;
};
