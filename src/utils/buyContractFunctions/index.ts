import { IBuyReceipt, IReceipt } from '@/types';
import { IBuyContractPayload, IBuyITOsTotalPrices } from '@/types/contracts';
import { BuyReceiptData } from '@/types/receipts';

export const getBuyPrice = (
  parameter: IBuyContractPayload,
  buyReceipt: BuyReceiptData,
): undefined | number => {
  if (parameter?.buyType === 'MarketBuy') {
    return parameter.amount;
  } else if (parameter?.buyType === 'ITOBuy') {
    return buyReceipt?.value;
  }
};

export const getBuyAmount = (
  parameter: IBuyContractPayload,
  buyReceipt: BuyReceiptData,
): undefined | number => {
  if (parameter?.buyType === 'MarketBuy') {
    return buyReceipt?.value;
  } else if (parameter?.buyType === 'ITOBuy') {
    return parameter?.amount;
  }
};

export const getTotalAssetsPrices = (
  ITOBuyPrices: IBuyITOsTotalPrices,
  receipts: IReceipt[],
  sender: string,
): IBuyITOsTotalPrices => {
  receipts.map(receipt => {
    const buyITOReceipt = receipt as unknown as IBuyReceipt;
    if (buyITOReceipt.assetId && buyITOReceipt.from === sender) {
      ITOBuyPrices[buyITOReceipt.assetId].price +=
        (buyITOReceipt?.value ?? 0) /
        10 ** ITOBuyPrices[buyITOReceipt.assetId].precision;
    }
  });
  return ITOBuyPrices;
};
