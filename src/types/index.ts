import { ISO2 } from '@/utils/country';
import { IChartData } from '@/configs/home';
import { Dispatch, SetStateAction } from 'react';

export enum Contract {
  Transfer = 'Transfer',
  CreateAsset = 'Create Asset',
  CreateValidator = 'Create Validator',
  ValidatorConfig = 'Config Validator',
  Freeze = 'Freeze',
  Unfreeze = 'Unfreeze',
  Delegate = 'Delegate',
  Undelegate = 'Undelegate',
  Withdraw = 'Withdraw',
}

export interface ITransferContract {
  amount: number;
  ownerAddress: string;
  toAddress: string;
  assetAddress?: string;
}

export interface ICreateAssetContract {
  circulatingSupply: number;
  initialSupply: number;
  maxSupply: number;
  name: string;
  ticker: string;
  ownerAddress: string;
  precision: number;
  royalties: number;
}

export interface ICreateValidatorContract {
  ownerAddress: string;
  config: {
    canDelegate: boolean;
    commission: number;
    maxDelegationAmount: number;
    rewardAddress: string;
  };
}

export interface IValidatorConfigContract {
  ownerAddress: string;
  config: {
    canDelegate: boolean;
    commission: number;
    maxDelegationAmount: number;
    rewardAddress: string;
  };
}

export interface IFreezeContract {
  amount: number;
  ownerAddress: string;
}

export interface IUnfreezeContract {
  bucketID: string;
  ownerAddress: string;
}

export interface IDelegateContract {
  bucketID: string;
  ownerAddress: string;
}

export interface IUndelegateContract {
  bucketID: string;
  ownerAddress: string;
}

export interface IWithdrawContract {
  ownerAddress: string;
  toAddress: string;
}

type IParameter =
  | ITransferContract
  | ICreateAssetContract
  | ICreateValidatorContract
  | IValidatorConfigContract
  | IFreezeContract
  | IUnfreezeContract;

export interface ICreateAssetReceipt {
  assetId: string;
}

export interface IFreezeReceipt {
  bucketId: string;
}

export interface IUnfreezeReceipt {
  availableWithdrawEpoch: number;
}

export type IReceipt = ICreateAssetReceipt | IFreezeReceipt | IUnfreezeReceipt;

export interface ITransaction {
  hash: string;
  blockNum: number;
  sender: string;
  data?: string;
  nonce: number;
  timestamp: number;
  chainID: string;
  signature: string;
  searchOrder: number;
  kAppFee: number;
  bandwidthFee: number;
  status: string;
  resultCode: string;
  contract: IContract[];
  receipt: IReceipt[];
  precision: number;
}

export interface IBlock {
  hash: string;
  nonce: number;
  parentHash: string;
  timestamp: number;
  slot: number;
  epoch: number;
  isEpochStart: boolean;
  size: number;
  sizeTxs: number;
  transactions: ITransaction[];
  txRootHash: string;
  trieRoot: string;
  validatorsTrieRoot: string;
  stakingTrieRoot: string;
  assetTrieRoot: string;
  producerSignature: string;
  signature: string;
  prevRandSeed: string;
  randSeed: string;
  txCount: number;
  txFees?: number;
  kAppFees?: number;
  burnedFees?: number;
  blockRewards: number;
  txHashes: any[];
  softwareVersion: string;
  chainID: string;
}

export interface IBlockCard {
  blockIndex: number;
  precision: number;
}
export interface IBlockCardList {
  blocks: IBlock[];
  precision: number;
}

export interface IAccount {
  address: string;
  nonce: number;
  balance: number;
  blsPublicKey: string;
  assets?: {
    [key: string]: any;
  };
  buckets?: [
    {
      [key: string]: IBucket;
    },
  ];
}

export interface IAsset {
  type: string;
  assetId: string;
  name: string;
  ticker: string;
  ownerAddress: string;
  uris: any;
  precision: number;
  initialSupply: number;
  circulatingSupply: number;
  maxSupply: number;
  royalties: number;
}
export interface IContract {
  type: Contract;
  parameter: IParameter;
  precision?: number;
  asset?: IAsset;
}

export interface IBucket {
  stakeValue: number;
  staked: boolean;
  stakedEpoch: number;
  unstakedEpoch: number;
  delegation: string;
}

export interface IChainStatistics {
  liveTPS: number;
  averageTPS: number;
  peakTPS: number;
  currentBlockNonce: number;
  totalProcessedTxCount: number;
  averageBlockTxCount: number;
  lastBlockTxCount: number;
}

interface IError {
  message: string;
}

export interface IPagination {
  next: number;
  previous: number;
  perPage: number;
  totalPages: number;
  totalRecords: number;
}

export interface IResponse {
  data: any;
  code: string;
  error: IError;
}

export interface ICountryNode {
  country: ISO2;
  nodes: [number, number][];
}

export interface ICountryFeature {
  type: string;
  id: string;
  properties: { name: string };
  geometry: { type: string; coordinates: number[][][] };
}

export interface ICountriesGeoData {
  features: ICountryFeature[];
}
export interface ICoinInfo {
  name: string;
  shortname: string;
  price: number;
  variation: number;
  marketCap: {
    price: number;
    variation: number;
  };
  volume: {
    price: number;
    variation: number;
  };
  prices: IChartData[];
}

export interface IDailyTransaction {
  doc_count: number;
  key: number;
}
export interface IHome {
  transactions: ITransaction[];
  transactionsList: IDailyTransaction[];
  blocks: IBlock[];
  totalAccounts: number;
  totalTransactions: number;
  tps: string;
  coinsData: ICoinInfo[];
  yeasterdayTransactions: number;
}
export interface IDataCards {
  totalAccounts: number;
  totalTransactions: number;
  tps: string;
  coinsData: ICoinInfo[];
  yeasterdayTransactions: number;
}

export interface IHomeTransactions {
  setTotalTransactions: Dispatch<SetStateAction<number>>;
  transactions: ITransaction[];
  transactionsList: IDailyTransaction[];
  precision: number;
}
export interface ITransactionResponse extends IResponse {
  data: {
    transactions: ITransaction[];
  };
  pagination: IPagination;
}

export interface ITransactionListResponse extends IResponse {
  data: {
    number_by_day: IDailyTransaction[];
  };
  pagination: IPagination;
}

export interface IAccountResponse extends IResponse {
  pagination: IPagination;
}

export interface IBlockResponse extends IResponse {
  data: {
    blocks: IBlock[];
  };
}

export interface IStatisticsResponse extends IResponse {
  data: {
    statistics: {
      chainStatistics: IChainStatistics;
    };
  };
}

export interface IGeckoResponse extends IResponse {
  market_data: {
    current_price: {
      usd: number;
    };
    price_change_percentage_24h: number;
    market_cap: {
      usd: number;
    };
    market_cap_change_percentage_24h: number;
    total_volume: {
      usd: number;
    };
  };
}

export interface IYesterdayResponse extends IResponse {
  data: {
    number_by_day: {
      doc_count: number;
      key: number;
    }[];
  };
}

export interface IGeckoChartResponse extends IResponse {
  prices: number[][];
}

export interface ICard {
  Icon: any;
  title: string;
  value: number;
  variation: string;
}
