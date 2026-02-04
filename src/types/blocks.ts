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
  validators: string[];
  producerOwnerAddress: string;
  producerLogo: string;
}

export interface IBlockCard {
  blockIndex: number;
  nonce: number;
  timestamp: number;
  hash: string;
  blockRewards: number;
  txCount: number;
  txBurnedFees?: number;
  producerLogo: string;
  producerOwnerAddress: string;
  producerName: string;
}
export interface IBlockCardFetcher {
  blocks: IBlock[];
  getBlocks: (
    setBlocks: React.Dispatch<React.SetStateAction<IBlock[]>>,
  ) => void;
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
}

export interface IBlocksResponse extends IResponse {
  data: {
    blocks: IBlock[];
  };
}

export interface IBlockResponse extends IResponse {
  data: {
    block: IBlock;
  };
  pagination: IPagination;
}

export interface IBlockPage {
  block: IBlock;
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
  values: (string | React.ReactElement)[];
}
