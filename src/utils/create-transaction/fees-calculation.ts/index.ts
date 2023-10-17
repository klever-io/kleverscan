import { IAsset, ICollectionList } from '@/types';
import { KLV_PRECISION, PERCENTAGE_PRECISION } from '@/utils/globalVariables';

export const calculateTransterPercentageFee = (
  unparsedAmount = 0,
  collection?: ICollectionList,
): number => {
  // fungible
  if (isNaN(unparsedAmount)) {
    return 0;
  }
  const transferPercentage = collection?.royalties?.transferPercentage;
  if (!transferPercentage) {
    return 0;
  }
  const precision = collection?.precision || 0;
  let amount = unparsedAmount * 10 ** precision;
  let royaltySum = 0;

  for (let index = 0; index < transferPercentage.length; index++) {
    const percentage = transferPercentage[index];
    if (amount < percentage.amount) {
      royaltySum +=
        (amount * percentage.percentage) / (100 * 10 ** PERCENTAGE_PRECISION);
      break;
    }

    const royaltyCalc =
      (percentage.amount * percentage.percentage) /
      (100 * 10 ** PERCENTAGE_PRECISION);

    amount -= percentage.amount;
    royaltySum += royaltyCalc;

    if (index == transferPercentage.length - 1 && amount > 0) {
      const lastRoyalty = percentage;
      royaltySum +=
        (amount * lastRoyalty.percentage) / (100 * 10 ** PERCENTAGE_PRECISION);
    }
  }
  return royaltySum / 10 ** precision;
};

export const calculateTransferFixedFee = (
  collection: ICollectionList,
): number => {
  // nft
  if (!collection?.royalties?.transferFixed) {
    return 0;
  }
  return collection.royalties.transferFixed / 10 ** KLV_PRECISION;
};

export const calculateITOBuyFixedFee = (asset: IAsset): number => {
  //nft and fungible
  if (!asset?.royalties?.itoFixed) {
    return 0;
  }
  return asset.royalties.itoFixed / 10 ** KLV_PRECISION;
};

export const calculateMarketBuyFixedFee = (
  collection: ICollectionList,
): number => {
  //nft
  if (!collection?.royalties?.marketFixed) {
    return 0;
  }
  return collection.royalties.marketFixed / 10 ** KLV_PRECISION;
};
