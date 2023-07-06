import { IKAppTransferReceipt, ITransferReceipt } from '@/types/receipts';
import { IReceipt } from '../../types';

// to be used for unique keys in the array of objects
export const findKey = (arr: any[], keyName: string): any => {
  const result = arr.find(obj => Object.keys(obj).find(key => key === keyName));
  if (result) {
    return result[keyName];
  }
  return null;
};

/**
 * to be used when we want to find the base receipt(receipt type that matches the contract, see findNextSiblingReceipt func for further understanding)
 * @param receipts receipts array
 * @param contractIndex index of array of contracts(multicontract)
 * @param type type of the receipt
 * @returns null or receipt
 */
export const findReceiptLegacy = (
  receipts: IReceipt[] | undefined,
  contractIndex: number,
  type: number,
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
      return receipt;
    }
  }
  return null;
};

/**
 *
 * @param receipts Array of receipts
 * @param type type of the contract
 * @returns the first receipt that matched the contract type
 */
export const findReceipt = (
  receipts: IReceipt[] | undefined,
  type: number,
): IReceipt | undefined => {
  if (!receipts) {
    return undefined;
  }
  return receipts.find(receipt => receipt.type === type);
};

/**
 *
 * @param receipts Array of receipts
 * @param type type of the contract
 * @param sender sender of the tx
 * @returns the first receipt that matches the contract type and sender
 */
export const findReceiptWithSender = (
  receipts: IReceipt[] | undefined,
  type: number,
  sender: string,
): IReceipt | undefined => {
  if (!receipts) {
    return undefined;
  }
  return receipts.find(receipt => {
    const typedReceipt = receipt as ITransferReceipt | IKAppTransferReceipt;
    return receipt.type === type && typedReceipt?.from === sender;
  });
};

/**
 *
 * @param receipts Array of receipts
 * @param type type of the contract
 * @param receiver receiver of the assetId
 * @returns the first receipt that matches the contract type, receiver and assetId is a NFT
 */

export const findReceiptWithReceiver = (
  receipts: IReceipt[] | undefined,
  type: number,
  receiver: string,
): IReceipt | undefined => {
  if (!receipts) {
    return undefined;
  }
  return receipts.find(receipt => {
    const typedReceipt = receipt as ITransferReceipt | IKAppTransferReceipt;
    return (
      receipt.type === type &&
      typedReceipt?.to === receiver &&
      typedReceipt.assetId.includes('/')
    );
  });
};

/**
 * Used to get the receipts that match the contract index with the receipt ID. For multicontract purpose only.
 * @param receipts
 * @param contractIndex
 * @returns IReceipt[]
 */
export const filterReceipts = (
  receipts: IReceipt[],
  contractIndex: number,
): IReceipt[] => receipts.filter(receipt => receipt.cID === contractIndex);

/**
 * 
 * @param receipts receipts array
 * @param contractIndex index of array of contracts(multicontract)
 * @param baseReceiptType baseReceipt is the main receipt of the contract, e.g. in a freeze contract, the freeze receipt is the baseReceipt, any other receipt will be a searchReceipt that we are looking for
 * @param searchReceiptType 
 * @returns null or a receipt
 * // explanation using baseReceipt nº4 and searchReceipt nº 17:
  // [4,17,4,4,4,17,4,17,4,17,4]
  // how can we find the correct 17 receipt the corresponds to the 4 receipt?
  // contractIndex must tell which one baseReceiptType(4) we want, if it is 2, it means it wants the third 4
  // loop through receipts and create a counter
  // +1 to counter every time baseReceiptType is found(number 4)
  //  when counter matches contractIndex, we have found the correct baseReceiptIndex(number 4)
  // with the correct baseReceiptIndex, we can read it's sibling receipts and extract it's data because now we are certain they correspond to the correct contract
 * 
 */
export const findNextSiblingReceipt = (
  receipts: IReceipt[] | undefined,
  contractIndex: number,
  baseReceiptType: number,
  searchReceiptType: number,
  callbackArgs: any[] = [],
  callbackCheck: (...callbackArgs: any[]) => boolean = callbackArgs => true,
): any => {
  if (!receipts || receipts.length === 0) {
    return null;
  }

  let baseReceiptIndex = -1;

  let baseReceiptIsFound = false;

  for (let index = 0; index < receipts.length; index++) {
    if (
      receipts[index].type === baseReceiptType &&
      baseReceiptIndex !== contractIndex
    ) {
      baseReceiptIndex += 1;
    }
    if (baseReceiptIndex === contractIndex) {
      if (receipts[index].type === baseReceiptType) {
        if (!baseReceiptIsFound) {
          // first baseReceipt is found, we should not do an early return
          baseReceiptIsFound = true;
        } else {
          // contract is finished, if found new base Receipt must early return
          break;
        }
      }
      if (receipts[index].type === searchReceiptType) {
        callbackArgs.push(receipts[index]);
        if (callbackCheck(...callbackArgs)) {
          // here we have access to the correct receipts
          return receipts[index];
        } else {
          callbackArgs.pop();
        }
      }
    }
  }
  return null;
};
/**
 * 
 * @param receipts receipts array
 * @param contractIndex index of array of contracts(multicontract)
 * @param baseReceiptType baseReceipt is the main receipt of the contract, e.g. in a freeze contract, the freeze receipt is the baseReceipt, any other receipt will be a searchReceipt that we are looking for
 * @param searchReceiptType
 * @returns null or a receipt
 * // same as findNextPreviousSiblingReceipt, but this one is for the cases where baseReceiptType comes after searchReceiptType
  //  in the example below, baseReceipt remains 4, but now we have to go back in index to find the corresponding 17 receipt
  // [17,4,17,4,4,4,17,4,17,4,17]

  // single contract example:
  //[19,0,17,7,12,12]
 */
export const findPreviousSiblingReceipt = (
  receipts: IReceipt[] | undefined,
  contractIndex: number,
  baseReceiptType: number,
  searchReceiptType: number,
): any => {
  if (!receipts) {
    return null;
  }
  let baseReceiptIndex = -1;

  let baseReceiptsFounds = 0;

  for (let index = 0; index < receipts.length; index++) {
    if (
      receipts[index].type === baseReceiptType &&
      baseReceiptIndex !== contractIndex
    ) {
      baseReceiptIndex += 1;
    }
    if (baseReceiptIndex === contractIndex) {
      for (let index2 = index; index2 >= 0; index2--) {
        if (receipts[index2].type === baseReceiptType) {
          if (baseReceiptsFounds > 1) {
            // if previous receipt is a baseReceipt, there is no searchReceipt corresponding to the baseReceipt
            break;
          } else {
            baseReceiptsFounds += 1;
          }
        }
        if (receipts[index2].type === searchReceiptType) {
          // safely access to previous receipts without the risk of getting a baseReceipt
          return receipts[index2];
        }
      }
    }
  }
  return null;
};
