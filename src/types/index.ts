import { LatLngExpression } from 'leaflet';

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

export interface IContract {
  type: Contract;
  parameter: IParameter;
}

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
  expiration: number;
  timestamp: number;
  fee: number;
  bandwidthFeeLimit: number;
  chainID: string;
  signature: string;
  searchOrder: number;
  kAppFee: number;
  bandwidthFee: number;
  status: string;
  contract: IContract[];
  receipt: IReceipt[];
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
  blockRewards: number;
  txHashes: any[];
  softwareVersion: string;
  chainID: string;
}

export interface IAccount {
  address: string;
  balance: number;
  blsPublicKey: string;
  assets: {
    [key: string]: any;
  };
  buckets: {
    [key: string]: IBucket;
  };
}

export interface IAsset {
  type: string;
  address: string;
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

export interface INodeData {
  name: string;
  count?: number;
  location: LatLngExpression;
  nodes?: INodeData[];
}
