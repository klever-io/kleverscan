import { ContractsIndex } from '@/types/contracts';
import { IKAppTransferReceipt, ITransferReceipt } from '@/types/receipts';
import { contractsList } from '../contracts';

export const receiverIsSender = (
  sender: string,
  receipt: IKAppTransferReceipt | ITransferReceipt,
): boolean => sender === receipt?.to;

export const renderCorrectPath = (uriKey: string): string => {
  if (uriKey && uriKey.startsWith('https://')) {
    return uriKey;
  }
  return `https://${uriKey}`;
};

/**
 * Verifies not only if an array of strings is empty, but also if it's content is full of empty strings, in that case it will still return true as well.
 * @param data
 * @returns boolean
 */
export const isDataEmpty = (data: string[]): boolean => {
  if (data?.length === 0) {
    return true;
  }

  if (data !== undefined) {
    for (let i = 0; i < data?.length; i++) {
      if (data[i].length > 0) {
        return false;
      }
    }
  }

  return true;
};

export const calculatePermissionOperations = (
  operations: string,
): typeof contractsList => {
  const stringContracts: typeof contractsList = [];
  if (typeof operations === 'string' && operations.match(/^[0-9A-Fa-f]+$/g)) {
    const binaryOperations = parseInt(operations, 16).toString(2);
    const reversedBinaryOperationsArray = binaryOperations.split('').reverse();
    reversedBinaryOperationsArray.forEach((char, index) => {
      if (char === '1') {
        stringContracts.push(ContractsIndex[index]);
      }
    });
  }
  return stringContracts;
};
