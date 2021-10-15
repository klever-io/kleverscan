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

interface IContract {
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
  timeStamp: number;
  fee: number;
  bandwidthFeeLimit: number;
  chainID: string;
  signature: string;
  searchOrder: number;
  kappFee: number;
  bandwidthFee: number;
  consumedFee: number;
  contract: IContract[];
  receipt: IReceipt[];
}

export interface IHyperblock {
  nonce: number;
  parentHash: string;
  timeStamp: number;
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
  producerID: number;
  ProducerPublicKey: string;
  producerSignature: string;
  prevRandSeed: string;
  randSeed: string;
  txCount: number;
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
