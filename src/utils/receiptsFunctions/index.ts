import { IBuyReceipt, IReceipt } from '@/types';
import { IBuyContractPayload } from '@/types/contracts';
import { IKAppTransferReceipt, ITransferReceipt } from '@/types/receipts';
import { findNextSiblingReceipt, findPreviousSiblingReceipt } from '../findKey';
import { getPrecision } from '../precisionFunctions';

export const getBuyReceipt = (
  parameter: IBuyContractPayload,
  receipts: IBuyReceipt[],
  contractIndex: number,
  sender: string,
  receiverIsSender: (
    sender: string,
    receipt: IKAppTransferReceipt | ITransferReceipt,
  ) => boolean,
): null | IKAppTransferReceipt | ITransferReceipt => {
  let buyReceipt = null;
  if (parameter?.buyType === 'MarketBuy') {
    buyReceipt = findNextSiblingReceipt(
      receipts,
      contractIndex,
      16,
      14, // in MarketBuy, the formal buy receipt is 16, but it is the 14(kapp transfer) receipt that has that data we want
      [sender],
      receiverIsSender,
    );
  } else if (parameter?.buyType === 'ITOBuy') {
    buyReceipt = findPreviousSiblingReceipt(receipts, contractIndex, 2, 0); // there is no formal buy receipt in ITOBuy, but the data we want is in the 0(transfer) receipt
  }
  return buyReceipt;
};

export const getAmountFromReceipts = async (
  assetId: string,
  contractType: number,
  receipts: IReceipt[] | undefined,
): Promise<number> => {
  if (!receipts || !receipts.length) {
    return 0;
  }
  const correctReceipt: any = receipts.find(
    receipt => receipt.type === contractType,
  );
  const amount = Number(correctReceipt?.amount) || 0;
  const precision = (await getPrecision(assetId)) as number;
  return amount / 10 ** precision;
};
