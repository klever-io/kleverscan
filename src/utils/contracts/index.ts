import { isBeta } from '@/configs/navbar';
import {
  Contract,
  ContractsIndex,
  ContractsName,
  IContract,
  IContractOption,
} from '@/types/contracts';
import { IKAppTransferReceipt } from '@/types/receipts';
import { format, fromUnixTime } from 'date-fns';
import { NextRouter } from 'next/router';
import {
  IClaimReceipt,
  IReceipt,
  IRowSection,
  ITransaction,
} from '../../types';
import { getBuyAmount, getBuyPrice } from '../buyContractFunctions';
import { filterReceipts, findReceipt, findReceiptWithSender } from '../findKey';
import { getPrecision } from '../precisionFunctions';
import { getAmountFromReceipts } from '../receiptsFunctions';
import {
  AssetTriggerSections,
  BuySections,
  CancelMarketOrderSections,
  ClaimSections,
  ConfigITOSections,
  ConfigMarketplaceSections,
  CreateAssetSections,
  CreateMarketplaceSections,
  CreateValidatorSections,
  DelegateSections,
  DepositSections,
  FreezeSections,
  IITOTriggerSections,
  ProposalSections,
  SellSections,
  SetAccountNameSections,
  SetITOPricesSections,
  SmartContractSections,
  TransferSections,
  UndelegateSections,
  UnfreezeSections,
  UnjailSections,
  UpdateAccountPermissionContractSections,
  ValidatorConfigSections,
  VoteSections,
  WithdrawSections,
} from '../transactionListSections';

export const contractOptions: IContractOption[] = [
  {
    label: 'Transfer',
    value: 'TransferContract',
  },
  {
    label: 'Create Asset',
    value: 'CreateAssetContract',
  },
  {
    label: 'Create Validator',
    value: 'CreateValidatorContract',
  },
  {
    label: 'Edit Validator Settings',
    value: 'ValidatorConfigContract',
  },
  {
    label: 'Freeze',
    value: 'FreezeContract',
  },
  {
    label: 'Unfreeze',
    value: 'UnfreezeContract',
  },
  {
    label: 'Delegate',
    value: 'DelegateContract',
  },
  {
    label: 'Undelegate',
    value: 'UndelegateContract',
  },
  {
    label: 'Withdraw',
    value: 'WithdrawContract',
  },
  {
    label: 'Claim',
    value: 'ClaimContract',
  },
  {
    label: 'Unjail',
    value: 'UnjailContract',
  },
  {
    label: 'Asset Trigger',
    value: 'AssetTriggerContract',
  },
  {
    label: 'Set Account Name',
    value: 'SetAccountNameContract',
  },
  {
    label: 'Proposal',
    value: 'ProposalContract',
  },
  {
    label: 'Vote',
    value: 'VoteContract',
  },
  {
    label: 'Config ITO',
    value: 'ConfigITOContract',
  },
  {
    label: 'Buy',
    value: 'BuyContract',
  },
  {
    label: 'Sell',
    value: 'SellContract',
  },
  {
    label: 'Cancel Market Order',
    value: 'CancelMarketOrderContract',
  },
  {
    label: 'Create Marketplace',
    value: 'CreateMarketplaceContract',
  },
  {
    label: 'Configure Marketplace',
    value: 'ConfigMarketplaceContract',
  },
  {
    label: 'Deposit',
    value: 'DepositContract',
  },
  {
    label: 'ITO Trigger',
    value: 'ITOTriggerContract',
  },
  {
    label: 'Update Account Permission',
    value: 'UpdateAccountPermissionContract',
  },
  {
    label: 'Smart Contract',
    value: 'SmartContract',
  },
].filter(contract => isBeta || contract.value !== 'SmartContract');

export const claimTypes = [
  {
    label: 'Staking Claim (0)',
    value: 0,
  },
  {
    label: 'Allowance Claim (1)',
    value: 1,
  },
  {
    label: 'Market Claim (2)',
    value: 2,
  },
];

export const withdrawTypes = [
  {
    label: 'Staking',
    value: 0,
  },
  {
    label: 'KDA Pool',
    value: 1,
  },
];

export const depositTypes = [
  {
    label: 'FPR Deposit',
    value: 0,
  },
  {
    label: 'KDA Pool',
    value: 1,
  },
];

export const assetTriggerTypes = [
  {
    label: 'Mint (0)',
    value: 0,
  },
  {
    label: 'Burn (1)',
    value: 1,
  },
  {
    label: 'Wipe (2)',
    value: 2,
  },
  {
    label: 'Pause (3)',
    value: 3,
  },
  {
    label: 'Resume (4)',
    value: 4,
  },
  {
    label: 'Change Owner (5)',
    value: 5,
  },
  {
    label: 'Add Role (6)',
    value: 6,
  },
  {
    label: 'Remove Role (7)',
    value: 7,
  },
  {
    label: 'Update Metadata (8)',
    value: 8,
  },
  {
    label: 'Stop NFT Mint (9)',
    value: 9,
  },
  {
    label: 'Update Logo (10)',
    value: 10,
  },
  {
    label: 'Update URIs (11)',
    value: 11,
  },
  {
    label: 'Change Royalties Receiver (12)',
    value: 12,
  },
  {
    label: 'Update Staking (13)',
    value: 13,
  },
  {
    label: 'Update Royalties (14)',
    value: 14,
  },
  {
    label: 'Update KDA Fee Pool (15)',
    value: 15,
  },
  {
    label: 'Stop Royalties Change (16)',
    value: 16,
  },
  {
    label: 'Stop NFT Metadata Change (17)',
    value: 17,
  },
];

export const ITOTriggerTypes = [
  {
    label: 'SET ITO Prices (0)',
    value: 0,
  },
  {
    label: 'Update Status (1)',
    value: 1,
  },
  {
    label: 'Update Receiver Address (2)',
    value: 2,
  },
  {
    label: 'Update Max Amount (3)',
    value: 3,
  },
  {
    label: 'Update Default Limit Per Address (4)',
    value: 4,
  },
  {
    label: 'Update Times (5)',
    value: 5,
  },
  {
    label: 'Update Whitelist Status (6)',
    value: 6,
  },
  {
    label: 'Add to Whitelist (7)',
    value: 7,
  },
  {
    label: 'Remove from Whitelist (8)',
    value: 8,
  },
  {
    label: 'Update Whitelist Times (9)',
    value: 9,
  },
];

/**
 * Receive the contracts number to return the contract name using the Contract Enum
 * @param contracts is required to fill using the Enum
 * @returns return string with the contract name
 */
export const contractTypes = (contracts: IContract[]): string => {
  if (!contracts) {
    return 'Unknown';
  }

  return contracts.length > 1 ? 'Multi contract' : contracts[0].typeString;
};

export const contractsList = [
  'Transfer',
  'CreateAsset',
  'Create Validator',
  'Config Validator',
  'Freeze',
  'Unfreeze',
  'Delegate',
  'Undelegate',
  'Withdraw',
  'Claim',
  'Unjail',
  'Asset Trigger',
  'Set Account Name',
  'Proposal',
  'Vote',
  'Config ITO',
  'Set ITO Prices',
  'Buy',
  'Sell',
  'Cancel Market Order',
  'Create Market',
  'Config Marketplace',
  'Update Account Permission',
  'Deposit',
  'ITO Trigger',
];

export const paramContractMap = {
  TransferContract: 'KAppFeeTransfer',
  CreateAssetContract: 'KAppFeeCreateAsset',
  CreateValidatorContract: 'KAppFeeCreateValidator',
  AssetTriggerContract: 'KAppFeeAssetTrigger',
  ValidatorConfigContract: 'KAppFeeValidatorConfig',
  FreezeContract: 'KAppFeeFreeze',
  UnfreezeContract: 'KAppFeeUnfreeze',
  DelegateContract: 'KAppFeeDelegate',
  UndelegateContract: 'KAppFeeUndelegate',
  WithdrawContract: 'KAppFeeWithdraw',
  ClaimContract: 'KAppFeeClaim',
  UnjailContract: 'KAppFeeUnjail',
  SetAccountNameContract: 'KAppFeeSetAccountName',
  ProposalContract: 'KAppFeeProposal',
  VoteContract: 'KAppFeeVote',
  ConfigITOContract: 'KAppFeeConfigITO',
  SetITOPricesContract: 'KAppFeeSetITOPrices',
  BuyContract: 'KAppFeeBuy',
  SellContract: 'KAppFeeSell',
  CancelMarketOrderContract: 'KAppFeeCancelMarketOrder',
  CreateMarketplaceContract: 'KAppFeeCreateMarketplace',
  ConfigMarketplaceContract: 'KAppFeeConfigMarketplace',
  UpdateAccountPermissionContract: 'KAppFeeUpdateAccountPermission',
  ITOTriggerContract: 'KAppFeeITOTrigger',
  DepositContract: 'KAppFeeDeposit',
  SmartContract: 'KAppFeeSmartContract',
};

/**
 * Receive the contracts number to return the contract name using the Contract Enum
 * @param contracts is required to filter the contracts header based on each contract
 * @param contractType is required to know which contract section with contract header should render
 * @returns return a array of sections
 */
export const filteredSections = (
  contract: IContract[],
  contractType: string,
  receipts: IReceipt[],
  precision = 0,
): IRowSection[] => {
  switch (contractType) {
    case Contract.Transfer:
      return TransferSections(contract[0].parameter, precision);
    case Contract.CreateAsset:
      return CreateAssetSections(contract[0].parameter);
    case Contract.CreateValidator:
      return CreateValidatorSections(contract[0].parameter);
    case Contract.ValidatorConfig:
      return ValidatorConfigSections(contract[0].parameter);
    case Contract.Freeze:
      return FreezeSections(contract[0].parameter, precision);
    case Contract.Unfreeze:
      return UnfreezeSections(contract[0].parameter);
    case Contract.Delegate:
      return DelegateSections(contract[0].parameter);
    case Contract.Undelegate:
      return UndelegateSections(contract[0].parameter);
    case Contract.Withdraw:
      return WithdrawSections(contract[0].parameter);
    case Contract.Claim:
      return ClaimSections(contract[0].parameter, receipts);
    case Contract.Unjail:
      return UnjailSections(contract[0].parameter);
    case Contract.AssetTrigger:
      return AssetTriggerSections(contract[0].parameter);
    case Contract.SetAccountName:
      return SetAccountNameSections(contract[0].parameter);
    case Contract.Proposal:
      return ProposalSections(contract[0].parameter);
    case Contract.Vote:
      return VoteSections(contract[0].parameter);
    case Contract.ConfigITO:
      return ConfigITOSections(contract[0].parameter);
    case Contract.SetITOPrices:
      return SetITOPricesSections(contract[0].parameter);
    case Contract.Buy:
      return BuySections(contract[0].parameter);
    case Contract.Sell:
      return SellSections(contract[0].parameter);
    case Contract.CancelMarketOrder:
      return CancelMarketOrderSections(contract[0].parameter);
    case Contract.CreateMarketplace:
      return CreateMarketplaceSections(contract[0].parameter);
    case Contract.ConfigMarketplace:
      return ConfigMarketplaceSections(contract[0].parameter);
    case Contract.UpdateAccountPermission:
      return UpdateAccountPermissionContractSections(contract[0].parameter);
    case Contract.Deposit:
      return DepositSections(contract[0].parameter);
    case Contract.ITOTrigger:
      return IITOTriggerSections(contract[0].parameter);
    case Contract.SmartContract:
      return SmartContractSections(contract[0].parameter);
    default:
      return [];
  }
};

export const initialsTableHeaders = [
  'Transaction Hash',
  'Block/Fees',
  'From/To',
  'Type/Amount',
  'Misc',
];

export enum contractTableHeaders {
  'Coin',
  'Amount',
  'Name',
  'Ticker',
  'Reward Address',
  'Can Delegate',
  'BLS public key',
  'Public Key',
  'Bucket Id',
  'Asset Id',
  'Claim Type',
  'Trigger Type',
  'Description',
  'Proposal Id',
  'Buy Type',
  'Order Id',
  'Marketplace Id',
  'Permission Name',
  'Deposit Type',
  'Id',
  'Currency Id',
  'Market Type',
  'Price',
  'Type',
}

/**
 * Receive the header of the table and the NextJS Router
 * @param router is required to filter using the router.query when it exists
 * @param header is required to do the filter when has filter on router.query
 * @returns return a array of string with the headers based on each contract
 */
export const getHeaderForTable = (
  router: NextRouter,
  header: string[],
): string[] => {
  let newHeaders: string[] = [];
  switch (ContractsIndex[ContractsIndex[Number(router.query.type)]]) {
    case ContractsIndex.Transfer:
      newHeaders = [contractTableHeaders[0], contractTableHeaders[1]];
      break;
    case ContractsIndex['Create Asset']:
      newHeaders = [contractTableHeaders[2], contractTableHeaders[3]];
      break;
    case ContractsIndex['Create Validator']:
      newHeaders = [contractTableHeaders[4], contractTableHeaders[5]];
      break;
    case ContractsIndex['Config Validator']:
      newHeaders = [contractTableHeaders[6]];
      break;
    case ContractsIndex['Validator Config']:
      newHeaders = [contractTableHeaders[7]];
      break;
    case ContractsIndex.Freeze:
      newHeaders = [contractTableHeaders[9], contractTableHeaders[1]];
      break;
    case ContractsIndex.Unfreeze:
      newHeaders = [contractTableHeaders[8]];
      break;
    case ContractsIndex.Delegate:
      newHeaders = [contractTableHeaders[8]];
      break;
    case ContractsIndex.Undelegate:
      newHeaders = [contractTableHeaders[8]];
      break;
    case ContractsIndex.Withdraw:
      newHeaders = [contractTableHeaders[9]];
      break;
    case ContractsIndex.Claim:
      newHeaders = [contractTableHeaders[10], contractTableHeaders[9]];
      break;
    case ContractsIndex.Unjail:
      break;
    case ContractsIndex['Asset Trigger']:
      newHeaders = [contractTableHeaders[11]];
      break;
    case ContractsIndex['Set Account Name']:
      newHeaders = [contractTableHeaders[2]];
      break;
    case ContractsIndex.Proposal:
      newHeaders = [contractTableHeaders[12]];
      break;
    case ContractsIndex.Vote:
      newHeaders = [contractTableHeaders[13], contractTableHeaders[1]];
      break;
    case ContractsIndex['Config ITO']:
      newHeaders = [contractTableHeaders[9]];
      break;
    case ContractsIndex['Set ITO']:
      newHeaders = [contractTableHeaders[9]];
      break;
    case ContractsIndex.Buy:
      newHeaders = [contractTableHeaders[14], contractTableHeaders[20]];
      break;
    case ContractsIndex.Sell:
      newHeaders = [
        contractTableHeaders[21],
        contractTableHeaders[20],
        contractTableHeaders[9],
      ];
      break;
    case ContractsIndex['Cancel Marketplace Order']:
      newHeaders = [contractTableHeaders[15]];
      break;
    case ContractsIndex['Create Marketplace']:
      newHeaders = [contractTableHeaders[2]];
      break;
    case ContractsIndex['Config Marketplace']:
      newHeaders = [contractTableHeaders[16]];
      break;
    case ContractsIndex['Update Account Permission']:
      newHeaders = [contractTableHeaders[17]];
      break;
    case ContractsIndex['Deposit']:
      newHeaders = [contractTableHeaders[18], contractTableHeaders[19]];
      break;
    case ContractsIndex['ITO Trigger']:
      newHeaders = [contractTableHeaders[17], contractTableHeaders[9]];
    case ContractsIndex['Smart Contract']:
      newHeaders = [contractTableHeaders[23]];
      break;
  }
  if (router.query.type) {
    return header.splice(0, header.length - 2).concat(newHeaders);
  }

  return header;
};

export const getHeaderForCSV = (
  router: NextRouter,
  header: string[],
): string[] => {
  let newHeaders: string[] = [];
  switch (ContractsIndex[ContractsIndex[Number(router.query.type)]]) {
    case ContractsIndex.Transfer:
      newHeaders = [contractTableHeaders[0], contractTableHeaders[1]];
      break;
    case ContractsIndex['Create Asset']:
      newHeaders = [contractTableHeaders[2], contractTableHeaders[3]];
      break;
    case ContractsIndex['Create Validator']:
      newHeaders = [contractTableHeaders[4], contractTableHeaders[5]];
      break;
    case ContractsIndex['Config Validator']:
      newHeaders = [contractTableHeaders[6]];
      break;
    case ContractsIndex['Validator Config']:
      newHeaders = [contractTableHeaders[7]];
      break;
    case ContractsIndex.Freeze:
      newHeaders = [contractTableHeaders[9], contractTableHeaders[1]];
      break;
    case ContractsIndex.Unfreeze:
      newHeaders = [contractTableHeaders[8]];
      break;
    case ContractsIndex.Delegate:
      newHeaders = [contractTableHeaders[8]];
      break;
    case ContractsIndex.Undelegate:
      newHeaders = [contractTableHeaders[8]];
      break;
    case ContractsIndex.Withdraw:
      newHeaders = [contractTableHeaders[9], contractTableHeaders[1]];
      break;
    case ContractsIndex.Claim:
      newHeaders = [
        contractTableHeaders[10],
        contractTableHeaders[9],
        contractTableHeaders[1],
      ];
      break;
    case ContractsIndex.Unjail:
      break;
    case ContractsIndex['Asset Trigger']:
      newHeaders = [contractTableHeaders[11]];
      break;
    case ContractsIndex['Set Account Name']:
      newHeaders = [contractTableHeaders[2]];
      break;
    case ContractsIndex.Proposal:
      newHeaders = [contractTableHeaders[12]];
      break;
    case ContractsIndex.Vote:
      newHeaders = [contractTableHeaders[13], contractTableHeaders[1]];
      break;
    case ContractsIndex['Config ITO']:
      newHeaders = [contractTableHeaders[9]];
      break;
    case ContractsIndex['Set ITO']:
      newHeaders = [contractTableHeaders[9]];
      break;
    case ContractsIndex.Buy:
      newHeaders = [
        contractTableHeaders[14],
        contractTableHeaders[20],
        contractTableHeaders[22],
        contractTableHeaders[1],
      ];
      break;
    case ContractsIndex.Sell:
      newHeaders = [
        contractTableHeaders[21],
        contractTableHeaders[20],
        contractTableHeaders[9],
        contractTableHeaders[22],
        contractTableHeaders[1],
      ];
      break;
    case ContractsIndex['Cancel Marketplace Order']:
      newHeaders = [contractTableHeaders[15]];
      break;
    case ContractsIndex['Create Marketplace']:
      newHeaders = [contractTableHeaders[2]];
      break;
    case ContractsIndex['Config Marketplace']:
      newHeaders = [contractTableHeaders[16]];
      break;
    case ContractsIndex['Update Account Permission']:
      newHeaders = [contractTableHeaders[17]];
      break;
    case ContractsIndex['Deposit']:
      newHeaders = [contractTableHeaders[18], contractTableHeaders[19]];
      break;
    case ContractsIndex['ITO Trigger']:
      newHeaders = [contractTableHeaders[11], contractTableHeaders[9]];
      break;
  }
  if (router?.query?.type) {
    return header
      .splice(0, header.length - 2)
      .concat(
        newHeaders,
        'Multicontract',
        `Account's Transaction Number (Nonce)`,
      );
  }
  return header.concat('Multicontract', `Account's Transaction Number (Nonce)`);
};

const getParsedAmount = async (parameter: any, assetId: string) => {
  const amount = parameter?.amount ?? '';
  try {
    const precision = (await getPrecision(assetId)) as number;
    return amount / 10 ** precision;
  } catch (error) {
    return amount;
  }
};

export const getDefaultCells = async (
  tableRowData: ITransaction,
  isMulticontract: boolean,
): Promise<any[]> => {
  const {
    hash,
    blockNum,
    timestamp,
    sender,
    nonce,
    status,
    receipts,
    contract,
    bandwidthFee,
    kAppFee,
  } = tableRowData;

  const amountContract = [];
  const parameter = contract[0]?.parameter as any;
  let assetId: any = parameter.assetId || '';

  switch (contract[0].typeString) {
    case Contract.Transfer:
      try {
        const coin = parameter?.assetId || 'KLV';
        const asyncAmount = await getParsedAmount(parameter, coin);
        amountContract.push(asyncAmount);
        break;
      } catch (e) {
        console.error(Contract.Transfer, e);
        throw new Error();
      }
    case Contract.Freeze:
      try {
        const assetId = parameter?.assetId || 'KLV';
        const asyncAmount = await getParsedAmount(parameter, assetId);
        amountContract.push(asyncAmount);
        break;
      } catch (e) {
        console.error(Contract.Freeze, e);
        throw new Error();
      }
    case Contract.Withdraw:
      try {
        const filteredReceipts = filterReceipts(receipts, contract[0].type);
        assetId = parameter?.assetId || 'KLV';
        const asyncAmount = await getAmountFromReceipts(
          assetId,
          18,
          filteredReceipts,
        );
        amountContract.push(asyncAmount);
        break;
      } catch (e) {
        console.error(Contract.Withdraw, e);
        throw new Error();
      }
    case Contract.Claim:
      try {
        const filteredReceipts = filterReceipts(receipts, contract[0].type);
        const claimReceipt = findReceipt(filteredReceipts, 17) as
          | IClaimReceipt
          | undefined;
        const asyncAmount = await getAmountFromReceipts(
          claimReceipt?.assetId || '',
          17,
          filteredReceipts,
        );
        amountContract.push(asyncAmount);
        break;
      } catch (e) {
        console.error(Contract.Claim, e);
        throw new Error();
      }
    case Contract.Vote:
      try {
        const amount = parameter?.amount / 10 ** 6 || 0;
        amountContract.push(amount);
        break;
      } catch (e) {
        console.error(Contract.Vote, e);
        throw new Error();
      }
    case Contract.Buy:
      try {
        const currencyID = parameter?.currencyID || 'KLV';
        const filteredReceipts = filterReceipts(receipts, contract[0].type);
        const senderKAppTransferReceipt = findReceiptWithSender(
          filteredReceipts,
          14,
          sender,
        ) as IKAppTransferReceipt | undefined;
        let currencyIDPrecision: any = 6;
        let amountPrecision: any = 0;
        if (currencyID !== 'KLV' && currencyID !== 'KFI') {
          currencyIDPrecision = await getPrecision(currencyID || 'KLV');
        }
        if (parameter?.buyType === 'MarketBuy') {
          if (status !== 'fail') {
            amountPrecision = await getPrecision(
              senderKAppTransferReceipt?.assetId ?? 'KLV',
            );
          } else {
            amountPrecision = 0;
          }
        } else if (parameter?.buyType === 'ITOBuy') {
          amountPrecision = (await getPrecision(parameter?.id)) || 0;
        }
        let buyPrice = getBuyPrice(parameter, senderKAppTransferReceipt);
        let buyAmount = getBuyAmount(parameter, senderKAppTransferReceipt);

        if (buyPrice) {
          buyPrice = buyPrice / 10 ** currencyIDPrecision;
        }
        if (buyAmount) {
          buyAmount = buyAmount / 10 ** amountPrecision;
        }
        amountContract.push(buyAmount);
        break;
      } catch (e) {
        console.error(Contract.Buy, e);
        throw new Error();
      }
    case Contract.Sell:
      try {
        const currencyID = parameter?.currencyID || 'KLV';
        assetId = parameter?.assetId || 'KLV';
        const precision = (await getPrecision(currencyID || 'KLV')) as number;
        const price = (parameter?.price || 0) / 10 ** precision;
        amountContract.push(price);
        break;
      } catch (e) {
        console.error(Contract.Sell, e);
        throw new Error();
      }
    default:
  }
  const to = parameter.toAddress || '';
  const contractName = ContractsName[contract[0]?.typeString] || '';
  const created = format(fromUnixTime(timestamp), 'yyyy-MM-dd HH:mm:ss'); // csv date pattern
  const parsedbandwidthFee = bandwidthFee / 10 ** 6;
  const parsedkAppFee = kAppFee / 10 ** 6;
  const cells = [
    hash,
    blockNum,
    created,
    sender,
    to,
    status,
    contractName,
    amountContract,
    assetId,
    parsedkAppFee,
    parsedbandwidthFee,
    isMulticontract,
    nonce,
  ];
  return cells;
};

export const getContractCells = async (
  tableRowData: ITransaction,
  isMulticontract: boolean,
  index: number,
): Promise<any[]> => {
  const {
    hash,
    blockNum,
    timestamp,
    sender,
    nonce,
    status,
    receipts,
    contract,
    bandwidthFee,
    kAppFee,
  } = tableRowData;

  // all data extracted:
  // const assetId = contract[0].parameter.assetId || 'KLV';
  // const coin = contract[0].parameter.assetId || 'KLV';
  // const amount = contract[0].parameter.amount || 0;
  // const name = contract[0].parameter.name || '';
  // const ticker = contract[0].parameter.ticker || '';
  // const rewardAddress = contract[0].parameter.config.rewardAddress || '';
  // const canDelegate = contract[0].parameter.config.canDelegate || '';
  // const blsPublicKey = contract[0].parameter.config.blsPublicKey || '';
  // const bucketID = contract[0].parameter.bucketID || '';
  // const claimType = contract[0].parameter.claimType || '';
  // const triggerType = contract[0].parameter.triggerType || '';
  // const description = contract[0].parameter.description || '';
  // const proposalId = contract[0].parameter.proposalId || '';
  // const buyType = contract[0].parameter.buyType || '';
  // const orderID = contract[0].parameter.orderID || '';

  const parameter = contract[0]?.parameter as any;
  const to = parameter.toAddress || '';
  const contractName = ContractsName[contract[0]?.typeString] || '';
  const created = format(fromUnixTime(timestamp), 'yyyy-MM-dd HH:mm:ss'); // csv date pattern
  const cells = [hash, blockNum, created, sender, to, status, contractName];
  const parsedbandwidthFee = bandwidthFee / 10 ** 6;
  const parsedkAppFee = kAppFee / 10 ** 6;

  switch (contract[0].typeString) {
    case Contract.Transfer:
      const coin = parameter?.assetId || 'KLV';
      let asyncAmount = await getParsedAmount(parameter, coin);
      cells.push(coin, asyncAmount);
      break;
    case Contract.CreateAsset:
      let name = parameter?.name || '';
      const ticker = parameter?.ticker || '';
      cells.push(name, ticker);
      break;
    case Contract.CreateValidator:
      const rewardAddress = parameter?.config.rewardAddress || '';
      const canDelegate = parameter?.config.canDelegate || '';
      cells.push(rewardAddress, canDelegate);
      break;
    case Contract.ValidatorConfig:
      const blsPublicKey = parameter?.config.blsPublicKey || '';
      cells.push(blsPublicKey);
      break;
    case Contract.Freeze:
      let assetId = parameter?.assetId || 'KLV';
      asyncAmount = await getParsedAmount(parameter, assetId);
      cells.push(assetId, asyncAmount);
      break;
    case Contract.Unfreeze:
      let bucketID = parameter?.bucketID || '';
      cells.push(bucketID);
      break;
    case Contract.Delegate:
      bucketID = parameter?.bucketID || '';
      cells.push(bucketID);
      break;
    case Contract.Undelegate:
      bucketID = parameter?.bucketID || '';
      cells.push(bucketID);
      break;
    case Contract.Withdraw:
      let filteredReceipts = filterReceipts(receipts, index);
      assetId = parameter?.assetId || 'KLV';
      asyncAmount = await getAmountFromReceipts(assetId, 18, filteredReceipts);
      cells.push(assetId, asyncAmount);
      break;
    case Contract.Claim:
      filteredReceipts = filterReceipts(receipts, index);
      const claimType = parameter?.claimType || '';
      const claimReceipt = findReceipt(filteredReceipts, 17) as
        | IClaimReceipt
        | undefined;
      asyncAmount = await getAmountFromReceipts(
        claimReceipt?.assetId || '',
        17,
        filteredReceipts,
      );
      cells.push(claimType, claimReceipt?.assetId, asyncAmount);
      break;
    case Contract.Unjail:
      cells.push(parsedkAppFee, parsedbandwidthFee);
      break;
    case Contract.AssetTrigger:
      let triggerType = parameter?.triggerType || '';
      cells.push(triggerType);
      break;
    case Contract.SetAccountName:
      name = parameter?.name || '';
      cells.push(name);
      break;
    case Contract.Proposal:
      const description = parameter?.description || '';
      cells.push(description);
      break;
    case Contract.Vote:
      const proposalId = parameter?.proposalId || '';
      let amount = parameter?.amount / 10 ** 6 || '';
      cells.push(proposalId, amount);
      break;
    case Contract.ConfigITO:
      assetId = parameter?.assetId || 'KLV';
      cells.push(assetId);
      break;
    case Contract.SetITOPrices:
      assetId = parameter?.assetId || 'KLV';
      cells.push(assetId);
      break;
    case Contract.Buy:
      const buyType = parameter?.buyType || '';
      let currencyID = parameter?.currencyID || '';
      filteredReceipts = filterReceipts(receipts, index);
      const senderKAppTransferReceipt = findReceiptWithSender(
        filteredReceipts,
        14,
        sender,
      ) as IKAppTransferReceipt | undefined;
      let currencyIDPrecision: any = 6;
      let amountPrecision: any = 0;
      if (parameter?.currencyID !== 'KLV' && parameter?.currencyID !== 'KFI') {
        currencyIDPrecision = await getPrecision(
          parameter?.currencyID || 'KLV',
        );
      }
      if (parameter?.buyType === 'MarketBuy') {
        if (status !== 'fail') {
          amountPrecision = await getPrecision(
            senderKAppTransferReceipt?.assetId ?? '',
          );
        } else {
          amountPrecision = 0;
        }
      } else if (parameter?.buyType === 'ITOBuy') {
        amountPrecision = (await getPrecision(parameter?.id)) || '';
      }
      let buyPrice = getBuyPrice(parameter, senderKAppTransferReceipt);
      let buyAmount = getBuyAmount(parameter, senderKAppTransferReceipt);

      if (buyPrice) {
        buyPrice = buyPrice / 10 ** currencyIDPrecision;
      }
      if (buyAmount) {
        buyAmount = buyAmount / 10 ** amountPrecision;
      }
      cells.push(buyType, currencyID, buyPrice, buyAmount);
      break;
    case Contract.Sell:
      const marketType = parameter?.marketType || '';
      currencyID = parameter?.currencyID;
      assetId = parameter?.assetId || 'KLV';
      const precision = (await getPrecision(
        parameter?.currencyID || 'KLV',
      )) as number;
      const price = (parameter?.price || 0) / 10 ** precision;
      amount = 1;
      cells.push(marketType, currencyID, assetId, price, amount);
      break;
    case Contract.CancelMarketOrder:
      const orderID = parameter?.orderID || '';
      cells.push(orderID);
      break;
    case Contract.CreateMarketplace:
      name = parameter?.name || '';
      cells.push(name);
      break;
    case Contract.ConfigMarketplace:
      cells.push(parsedkAppFee, parsedbandwidthFee);
      break;
    case Contract.UpdateAccountPermission:
      const permission = parameter?.permissions?.permissionName;
      cells.push(permission);
      break;
    case Contract.Deposit:
      const depositType = parameter?.depositTypeString || '';
      const id = parameter?.id || '';
      cells.push(depositType, id);
      break;
    case Contract.ITOTrigger:
      triggerType = parameter?.triggerType || '';
      const assetID = parameter?.assetId || '';
      cells.push(triggerType, assetID);
      break;
    default:
      cells.push(parsedkAppFee, parsedbandwidthFee);
  }

  cells.push(isMulticontract, nonce);
  return cells;
};
