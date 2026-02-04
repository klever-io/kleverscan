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
import { IClaimReceipt, IReceipt, ITransaction } from '../../types';
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
];

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

// Re-export from types (single source of truth)
export {
  contractsIndexMap,
  contractIndices,
  contractsList,
} from '@/types/contracts';

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
  precision = 6,
  data?: string[],
): React.ReactElement[] => {
  const props = {
    par: contract?.[0]?.parameter,
    receipts,
    precision,
    data,
  };

  switch (contractType) {
    case Contract.Transfer:
      return TransferSections(props);
    case Contract.CreateAsset:
      return CreateAssetSections(props);
    case Contract.CreateValidator:
      return CreateValidatorSections(props);
    case Contract.ValidatorConfig:
      return ValidatorConfigSections(props);
    case Contract.Freeze:
      return FreezeSections(props);
    case Contract.Unfreeze:
      return UnfreezeSections(props);
    case Contract.Delegate:
      return DelegateSections(props);
    case Contract.Undelegate:
      return UndelegateSections(props);
    case Contract.Withdraw:
      return WithdrawSections(props);
    case Contract.Claim:
      return ClaimSections(props);
    case Contract.Unjail:
      return UnjailSections(props);
    case Contract.AssetTrigger:
      return AssetTriggerSections(props);
    case Contract.SetAccountName:
      return SetAccountNameSections(props);
    case Contract.Proposal:
      return ProposalSections(props);
    case Contract.Vote:
      return VoteSections(props);
    case Contract.ConfigITO:
      return ConfigITOSections(props);
    case Contract.SetITOPrices:
      return SetITOPricesSections(props);
    case Contract.Buy:
      return BuySections(props);
    case Contract.Sell:
      return SellSections(props);
    case Contract.CancelMarketOrder:
      return CancelMarketOrderSections(props);
    case Contract.CreateMarketplace:
      return CreateMarketplaceSections(props);
    case Contract.ConfigMarketplace:
      return ConfigMarketplaceSections(props);
    case Contract.UpdateAccountPermission:
      return UpdateAccountPermissionContractSections(props);
    case Contract.Deposit:
      return DepositSections(props);
    case Contract.ITOTrigger:
      return IITOTriggerSections(props);
    case Contract.SmartContract:
      return SmartContractSections(props);
    default:
      return [];
  }
};

export const initialsTableHeaders = [
  'Hash',
  'Block',
  'Created',
  'From',
  '',
  'To',
  'Status',
  'Contract',
];

export const transactionTableHeaders = [
  'Transaction Hash',
  'Block/Fees',
  'From/To',
  'Type',
  'Misc',
];

export const smartContractsTableHeaders = [
  'Contract',
  'Total Transactions',
  'Deployer',
  'Deploy Hash / Time',
];

export const smartContractInvokesTransactionsTableHeaders = [
  'Tx Hash',
  'Age',
  'Caller',
  'Status',
  'Fee',
  'Bandwidth Fee',
  'Method',
  'SC Type',
];

export enum contractTableHeaders {
  'Asset Id',
  'Amount',
  'Name',
  'Ticker',
  'Reward Address',
  'Can Delegate',
  'BLS public key',
  'Public Key',
  'Bucket Id',
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

const oldContractLabels = {
  Transfer: ['Asset Id', 'Amount'],
  'Create Asset': ['Name', 'Ticker'],
  'Create Validator': ['Reward Address', 'Can Delegate'],
  'Config Validator': ['BLS public key'],
  Freeze: ['Asset Id', 'Amount'],
  Unfreeze: ['Bucket Id'],
  Delegate: ['Bucket Id'],
  Undelegate: ['Bucket Id'],
  Withdraw: ['Asset Id'],
  Claim: ['Claim Type', 'Asset Id'],
  Unjail: [],
  'Asset Trigger': ['Trigger Type'],
  'Set Account Name': ['Name'],
  Proposal: ['Description'],
  Vote: ['Proposal Id', 'Amount'],
  'Config ITO': ['Asset Id'],
  'Set ITO': ['Asset Id'],
  Buy: ['Buy Type', 'Currency Id'],
  Sell: ['Market Type', 'Currency Id', 'Asset Id'],
  'Cancel Marketplace Order': ['Order Id'],
  'Create Marketplace': ['Name'],
  'Config Marketplace': ['Marketplace Id'],
  'Update Account Permission': ['Permission Name'],
  Deposit: ['Deposit Type', 'Id'],
  'ITO Trigger': ['Type'],
  'Smart Contract': [],
};

const contractLabels = {
  Transfer: ['Amount'],
  'Create Asset': ['Name', 'AssetId', 'Precision'],
  'Create Validator': ['Owner Address', 'Name', 'Can Delegate'],
  'Config Validator': ['BLS public key', 'Name', 'Can Delegate'],
  Freeze: ['Amount', 'Bucket Id'],
  Unfreeze: ['Amount', 'Bucket Id'],
  Delegate: ['Amount', 'Bucket Id', 'to Address'],
  Undelegate: ['Amount', 'Bucket Id'],
  Withdraw: ['Type', 'Amount'],
  Claim: ['Amount', 'Claim Type', 'Asset Id / Order Id'],
  Unjail: [],
  'Asset Trigger': ['Asset Id', 'Trigger Type'],
  'Set Account Name': ['Name'],
  Proposal: ['Proposal Id', 'Duration (in Epochs)', 'Description'],
  Vote: ['Proposal Id', 'Amount', 'Type'],
  'Config ITO': ['Asset Id', 'Status', 'Public Start Time'],
  'Set ITO': ['Asset Id'],
  Buy: ['Buy Type', 'Id', 'Price'],
  Sell: ['Market Type', 'Asset Id', 'Price'],
  'Cancel Marketplace Order': ['Order Id'],
  'Create Marketplace': ['Marketplace Id', 'Name', 'Fee Percentage'],
  'Config Marketplace': ['Marketplace Id', 'Name', 'Fee Percentage'],
  'Update Account Permission': ['Permission Name(s)'],
  Deposit: ['Deposit Type', 'Target Asset', 'Amount'],
  'ITO Trigger': ['Asset Id', 'Type'],
  'Smart Contract': ['Type', 'Contract Address', 'Function'],
};

export const getLabelForTableField = (
  contractType: string | number,
): string[] => {
  const type =
    typeof contractType === 'string'
      ? ContractsName[contractType as keyof typeof ContractsName]
      : ContractsIndex[contractType];

  return contractLabels[type as keyof typeof contractLabels] || [];
};

export const getHeaderForCSV = (
  router: NextRouter,
  header: string[],
): string[] => {
  let newHeaders: string[] = [];
  switch (Number(ContractsIndex[Number(router.query.type)])) {
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
  let assetId: any = parameter?.assetId || parameter?.kda || '';

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
  const to = parameter?.toAddress || '';
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
  const to = parameter?.toAddress || '';
  const contractName = ContractsName[contract[0]?.typeString] || '';
  const created = format(fromUnixTime(timestamp), 'yyyy-MM-dd HH:mm:ss'); // csv date pattern
  const cells = [hash, blockNum, created, sender, to, status, contractName];
  const parsedbandwidthFee = bandwidthFee / 10 ** 6;
  const parsedkAppFee = kAppFee / 10 ** 6;

  switch (contract[0].typeString) {
    case Contract.Transfer:
      try {
        const coin = parameter?.assetId || 'KLV';
        let asyncAmount = await getParsedAmount(parameter, coin);
        cells.push(coin, asyncAmount);
      } catch (e) {
        console.error(Contract.Transfer, e);
        throw new Error(`Error Getting Transfer Contract Cells: ${e}`);
      }
      break;
    case Contract.CreateAsset:
      try {
        let name = parameter?.name || '';
        const ticker = parameter?.ticker || '';
        cells.push(name, ticker);
      } catch (e) {
        console.error(Contract.CreateAsset, e);
        throw new Error(`Error Getting Create Asset Contract Cells: ${e}`);
      }
      break;
    case Contract.CreateValidator:
      try {
        const rewardAddress = parameter?.config.rewardAddress || '';
        const canDelegate = parameter?.config.canDelegate || '';
        cells.push(rewardAddress, canDelegate);
      } catch (e) {
        console.error(Contract.CreateValidator, e);
        throw new Error(`Error Getting Create Validator Contract Cells: ${e}`);
      }
      break;
    case Contract.ValidatorConfig:
      try {
        const blsPublicKey = parameter?.config.blsPublicKey || '';
        cells.push(blsPublicKey);
      } catch (e) {
        console.error(Contract.ValidatorConfig, e);
        throw new Error(`Error Getting Validator Config Contract Cells: ${e}`);
      }
      break;
    case Contract.Freeze:
      try {
        let assetId = parameter?.assetId || 'KLV';
        const asyncAmount = await getParsedAmount(parameter, assetId);
        cells.push(assetId, asyncAmount);
      } catch (e) {
        console.error(Contract.Freeze, e);
        throw new Error(`Error Getting Freeze Contract Cells: ${e}`);
      }
      break;
    case Contract.Unfreeze:
      try {
        let bucketID = parameter?.bucketID || '';
        cells.push(bucketID);
      } catch (e) {
        console.error(Contract.Unfreeze, e);
        throw new Error(`Error Getting Unfreeze Contract Cells: ${e}`);
      }
      break;
    case Contract.Delegate:
      try {
        const bucketID = parameter?.bucketID || '';
        cells.push(bucketID);
      } catch (e) {
        console.error(Contract.Delegate, e);
        throw new Error(`Error Getting Delegate Contract Cells: ${e}`);
      }
      break;
    case Contract.Undelegate:
      try {
        const bucketID = parameter?.bucketID || '';
        cells.push(bucketID);
      } catch (e) {
        console.error(Contract.Undelegate, e);
        throw new Error(`Error Getting Undelegate Contract Cells: ${e}`);
      }
      break;
    case Contract.Withdraw:
      try {
        const filteredReceipts = filterReceipts(receipts, index);
        const assetId = parameter?.assetId || 'KLV';
        const asyncAmount = await getAmountFromReceipts(
          assetId,
          18,
          filteredReceipts,
        );
        cells.push(assetId, asyncAmount);
      } catch (e) {
        console.error(Contract.Withdraw, e);
        throw new Error(`Error Getting Withdraw Contract Cells: ${e}`);
      }
      break;
    case Contract.Claim:
      try {
        const filteredReceipts = filterReceipts(receipts, index);
        const claimType = parameter?.claimType || '';
        const claimReceipt = findReceipt(filteredReceipts, 17) as
          | IClaimReceipt
          | undefined;
        const asyncAmount = await getAmountFromReceipts(
          claimReceipt?.assetId || '',
          17,
          filteredReceipts,
        );
        cells.push(claimType, claimReceipt?.assetId, asyncAmount);
      } catch (e) {
        console.error(Contract.Claim, e);
        throw new Error(`Error Getting Claim Contract Cells: ${e}`);
      }
      break;
    case Contract.Unjail:
      try {
        cells.push(parsedkAppFee, parsedbandwidthFee);
      } catch (e) {
        console.error(Contract.Unjail, e);
        throw new Error(`Error Getting Unjail Contract Cells: ${e}`);
      }
      break;
    case Contract.AssetTrigger:
      try {
        let triggerType = parameter?.triggerType || '';
        cells.push(triggerType);
      } catch (e) {
        console.error(Contract.AssetTrigger, e);
        throw new Error(`Error Getting Asset Trigger Contract Cells: ${e}`);
      }
      break;
    case Contract.SetAccountName:
      try {
        const name = parameter?.name || '';
        cells.push(name);
      } catch (e) {
        console.error(Contract.SetAccountName, e);
        throw new Error(`Error Getting Set Account Name Contract Cells: ${e}`);
      }
      break;
    case Contract.Proposal:
      try {
        const description = parameter?.description || '';
        cells.push(description);
      } catch (e) {
        console.error(Contract.SetAccountName, e);
        throw new Error(`Error Getting Proposal Contract Cells: ${e}`);
      }
      break;
    case Contract.Vote:
      try {
        const proposalId = parameter?.proposalId || '';
        let amount = parameter?.amount / 10 ** 6 || '';
        cells.push(proposalId, amount);
      } catch (e) {
        console.error(Contract.Vote, e);
        throw new Error(`Error Getting Vote Contract Cells: ${e}`);
      }
      break;
    case Contract.ConfigITO:
      try {
        const assetId = parameter?.assetId || 'KLV';
        cells.push(assetId);
      } catch (e) {
        console.error(Contract.ConfigITO, e);
        throw new Error(`Error Getting Config ITO Contract Cells: ${e}`);
      }
      break;
    case Contract.SetITOPrices:
      try {
        const assetId = parameter?.assetId || 'KLV';
        cells.push(assetId);
      } catch (e) {
        console.error(Contract.SetITOPrices, e);
        throw new Error(`Error Getting Set ITO Prices Contract Cells: ${e}`);
      }
      break;
    case Contract.Buy:
      try {
        const buyType = parameter?.buyType || '';
        let currencyID = parameter?.currencyID || '';
        const filteredReceipts = filterReceipts(receipts, index);
        const senderKAppTransferReceipt = findReceiptWithSender(
          filteredReceipts,
          14,
          sender,
        ) as IKAppTransferReceipt | undefined;
        let currencyIDPrecision: any = 6;
        let amountPrecision: any = 0;
        if (
          parameter?.currencyID !== 'KLV' &&
          parameter?.currencyID !== 'KFI'
        ) {
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
      } catch (e) {
        console.error(Contract.Buy, e);
        throw new Error(`Error Getting Buy Contract Cells: ${e}`);
      }
      break;
    case Contract.Sell:
      try {
        const marketType = parameter?.marketType || '';
        const currencyID = parameter?.currencyID;
        const assetId = parameter?.assetId || 'KLV';
        const precision = (await getPrecision(
          parameter?.currencyID || 'KLV',
        )) as number;
        const price = (parameter?.price || 0) / 10 ** precision;
        const amount = 1;
        cells.push(marketType, currencyID, assetId, price, amount);
      } catch (e) {
        console.error(Contract.Sell, e);
        throw new Error(`Error Getting Sell Contract Cells: ${e}`);
      }
      break;
    case Contract.CancelMarketOrder:
      try {
        const orderID = parameter?.orderID || '';
        cells.push(orderID);
      } catch (e) {
        console.error(Contract.CancelMarketOrder, e);
        throw new Error(
          `Error Getting Cancel Market Order Contract Cells: ${e}`,
        );
      }
      break;
    case Contract.CreateMarketplace:
      try {
        const name = parameter?.name || '';
        cells.push(name);
      } catch (e) {
        console.error(Contract.CreateMarketplace, e);
        throw new Error(
          `Error Getting Create Marketplace Contract Cells: ${e}`,
        );
      }
      break;
    case Contract.ConfigMarketplace:
      try {
        cells.push(parsedkAppFee, parsedbandwidthFee);
      } catch (e) {
        console.error(Contract.ConfigMarketplace, e);
        throw new Error(
          `Error Getting Config Marketplace Contract Cells: ${e}`,
        );
      }
      break;
    case Contract.UpdateAccountPermission:
      try {
        const permission = parameter?.permissions?.permissionName;
        cells.push(permission);
      } catch (e) {
        console.error(Contract.UpdateAccountPermission, e);
        throw new Error(
          `Error Getting Update Account Permission Contract Cells: ${e}`,
        );
      }
      break;
    case Contract.Deposit:
      try {
        const depositType = parameter?.depositTypeString || '';
        const id = parameter?.id || '';
        cells.push(depositType, id);
      } catch (e) {
        console.error(Contract.Deposit, e);
        throw new Error(`Error Getting Deposit Contract Cells: ${e}`);
      }
      break;
    case Contract.ITOTrigger:
      try {
        const triggerType = parameter?.triggerType || '';
        const assetID = parameter?.assetId || '';
        cells.push(triggerType, assetID);
      } catch (e) {
        console.error(Contract.ITOTrigger, e);
        throw new Error(`Error Getting ITO Trigger Contract Cells: ${e}`);
      }

      break;
    default:
      try {
        cells.push(parsedkAppFee, parsedbandwidthFee);
      } catch (e) {
        console.error('Default', e);
        throw new Error(`Error Getting Default Contract Cells: ${e}`);
      }
  }

  cells.push(isMulticontract, nonce);
  return cells;
};
