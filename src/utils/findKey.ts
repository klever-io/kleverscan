import { IReceipt } from '../types';

// to be used for unique keys in the array of objects
export const findKey = (arr: any[], keyName: string): any => {
  const result = arr.find(obj => Object.keys(obj).find(key => key === keyName));
  if (result) {
    return result[keyName];
  }
  return null;
};

export const findReceipt = (
  receipts: IReceipt[] | undefined,
  contractIndex: number,
  type: number,
  keyName: string,
): any => {
  if (!receipts) {
    return null;
  }

  const parsedReceiptsByType = receipts.filter(
    receipt => receipt.type === type,
  );

  if (parsedReceiptsByType.length === 0) {
    return null;
  } else {
    const receipt = parsedReceiptsByType.find(
      (_, index) => index === contractIndex,
    );
    if (receipt) {
      return receipt[keyName];
    }
  }
};
