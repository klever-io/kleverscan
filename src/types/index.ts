interface IParameter {
  amount: number;
  ownerAddress: string;
  toAddress: string;
}

interface IContract {
  type: number;
  parameter: IParameter;
}

export enum Contract {
  Transfer,
  Contract,
}

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
  contract: IContract[];
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
  assets: any;
  buckets: any;
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
