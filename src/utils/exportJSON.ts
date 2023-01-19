import { IReceipt, ITransaction } from '@/types';
import {
  Contract,
  ContractsRecipesTypes,
  IContract,
  ITransferContract,
} from '@/types/contracts';
import { ITransferReceipt } from '@/types/receipts';
import { formatDate, getPrecision } from '.';

export const exportToJson = async (
  filename: string,
  rows: ITransaction[] | null,
): Promise<void> => {
  const parsedRows = await parseJSONprecisions(rows);
  const formatedData = new TextEncoder().encode(
    JSON.stringify(parsedRows, undefined, 2),
  );
  const data = new Blob([formatedData], {
    type: 'application/json;charset=utf-8',
  });

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', URL.createObjectURL(data));
  linkElement.setAttribute('download', filename);
  linkElement.click();
};

export const parseJSONprecisions = async (
  rows: ITransaction[] | null,
): Promise<ITransaction[] | null> => {
  if (!rows || rows.length < 1) {
    return null;
  }
  const rowsCopy = JSON.parse(JSON.stringify(rows));
  for (let i = 0; i < rowsCopy.length; i++) {
    Object.entries(rowsCopy[i]).forEach(async ([key, value]) => {
      rowsCopy[i][key] = await txParserSwitch(key, value as any); // fix type
    });
  }
  return rowsCopy;
};

export const txParserSwitch = async (
  key: string,
  value: number | IContract[] | IReceipt[],
): Promise<string | number | IContract[] | IReceipt[]> => {
  switch (key) {
    case 'bandwidthFee':
      return (value as number) / 10 ** 6, 6;
    case 'kAppFee':
      return (value as number) / 10 ** 6, 6;
    case 'timestamp':
      return formatDate(value as number);
    case 'contract':
      return parseContractPrecisions(value as IContract[]);
    case 'receipts':
      return parseReceiptsPrecisions(value as IReceipt[]);
    default:
      return value;
  }
};

export const parseContractPrecisions = async (
  contracts: IContract[],
): Promise<IContract[]> => {
  contracts.map(async contract => contractParserSwitch(contract));
  return contracts;
};

export const contractParserSwitch = async (
  contract: IContract,
): Promise<IContract> => {
  let assetId = '';
  let parameter;
  let precision = 6;
  switch (contract?.typeString) {
    case Contract['Transfer']:
    case Contract['Freeze']:
      parameter = contract.parameter as ITransferContract;
      assetId = parameter?.assetId?.split('/')[0] || 'KLV';
      precision = await getPrecision(assetId);
      (parameter.amount = parameter.amount / 10 ** precision), precision;
      break;
    default:
      throw new Error('Contract type not found.');
  }
  return contract;
};

export const parseReceiptsPrecisions = async (
  receipts: IReceipt[],
): Promise<IReceipt[]> => {
  receipts.map(async receipt => receiptParserSwitch(receipt));
  return receipts;
};

export const receiptParserSwitch = async (
  receipt: IReceipt,
): Promise<IReceipt> => {
  let assetId = '';
  let specificReceipt;
  let precision = 6;
  switch (receipt?.type) {
    case ContractsRecipesTypes['Transfer']:
      specificReceipt = receipt as ITransferReceipt;
      assetId = specificReceipt.assetId;
      precision = await getPrecision(assetId);
      (specificReceipt.value = specificReceipt.value / 10 ** precision),
        precision;
      break;
    default:
      break;
  }
  return receipt;
};
