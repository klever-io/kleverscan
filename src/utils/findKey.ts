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
  for (let i = 0; i < receipts.length; i++) {
    if (receipts[i].type !== type) continue;

    if (i < contractIndex) continue;

    return receipts[i][keyName];
  }
};
