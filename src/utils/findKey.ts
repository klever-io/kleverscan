import { any } from 'cypress/types/bluebird';

// to be used for unique keys in the array of objects
export const findKey = (arr: any[], keyName: string): any => {
  const result = arr.find(obj => Object.keys(obj).find(key => key === keyName));
  if (result) {
    return result[keyName];
  }
  return null;
};

export const findReceipt = (
  receipts: any[],
  contractIndex: number,
  type: number,
  keyName: string,
): any => {
  for (let i = 0; i < receipts.length; i++) {
    if (receipts[i].type !== type) continue;

    if (i < contractIndex) continue;

    return receipts[i][keyName];
  }
};
