import { IPagination, IResponse, ITransaction } from '.';

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
  kappsTrieRoot: string;
  producerSignature: string;
  signature: string;
  prevRandSeed: string;
  randSeed: string;
  txCount: number;
  txFees?: number;
  kAppFees?: number;
  txBurnedFees?: number;
  blockRewards: number;
  txHashes: any[];
  softwareVersion: string;
  chainID: string;
  producerName: string;
  producerOwnerAddress: string;
}

export interface IBlockCard {
  blockIndex: number;
  precision: number;
}
export interface IBlockCardList {
  blocks: IBlock[];
  precision: number;
}

export interface IBlockStats {
  totalBlocks: number;
  totalBurned: number;
  totalBlockRewards: number;
}
export interface IBlockData {
  yesterday: IBlockStats;
  total: IBlockStats;
}
export interface IBlocks {
  blocks: IBlock[];
  statistics: IBlockData;
  pagination: IPagination;
}

export interface IBlockResponse extends IResponse {
  data: {
    blocks: IBlock[];
  };
  pagination: IPagination;
}

export interface IStatisticsResponse extends IResponse {
  data: {
    block_stats_by_day: IBlockStats;
    block_stats_total: IBlockStats;
  };
}

export interface ICard {
  title: string;
  headers: string[];
  values: string[];
}
