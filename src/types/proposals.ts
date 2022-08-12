import { IPagination, IResponse } from '@/types/index';

export interface IProposal {
  proposalId: number;
  proposer: string;
  txHash: string;
  proposalStatus: string;
  parameters: IRawParam;
  description: string;
  epochStart: number;
  epochEnd: number;
  votes: IVotes;
  timestamp: number;
  voters: IVote[];
  totalStaked?: number;
  timestampStart?: number;
  timestampEnd?: number;
  parsedParameters?: IFullInfoParam[];
}

export interface IProposalsResponse extends IResponse {
  data: {
    proposals: IProposal[];
  };
  pagination: IPagination;
}

export interface IParsedProposal extends IProposal {
  parsedParameters: IFullInfoParam[];
  votingPowers?: IVotingPowers;
}

export interface IVotingPowers {
  [address: number]: number;
}

export interface IVote {
  address: string;
  type: 0 | 1;
  amount: number;
  timestamp: number;
}

export interface IVotes {
  [name: string]: number;
}

export interface IProposalsPage {
  networkParams: INetworkParams;
  proposals: IParsedProposal[];
  totalProposalsPage: number;
}

export interface INetworkParams {
  [index: number]: INetworkParam;
}

export interface INetworkParam {
  number: number;
  parameter: string;
  currentValue: number;
}

export interface IProposals {
  [index: number]: IProposal;
}

export interface IProposalsProps {
  proposals: IParsedProposal[];
  loading: boolean;
}

export interface IRawParam {
  [name: string]: string;
}

export interface IFullInfoParam {
  paramIndex: string;
  paramLabel: string;
  paramValue: number;
  paramText: string;
}

export enum NetworkParamsIndexer {
  FeePerDataByte = 0,
  KAppFeeCreateValidator = 1,
  KAppFeeCreateAsset = 2,
  MaxEpochsUnclaimed = 3,
  MinSelfDelegatedAmount = 4,
  MinTotalDelegatedAmount = 5,
  BlockRewards = 6,
  StakingRewards = 7,
  KAppFeeTransfer = 8,
  KAppFeeAssetTrigger = 9,
  KAppFeeValidatorConfig = 10,
  KAppFeeFreeze = 11,
  KAppFeeUnfreeze = 12,
  KAppFeeDelegate = 13,
  KAppFeeUndelegate = 14,
  KAppFeeWithdraw = 15,
  KAppFeeClaim = 16,
  KAppFeeUnjail = 17,
  KAppFeeSetAccountName = 18,
  KAppFeeProposal = 19,
  KAppFeeVote = 20,
  KAppFeeConfigITO = 21,
  KAppFeeSetITOPrices = 22,
  KAppFeeBuy = 23,
  KAppFeeSell = 24,
  KAppFeeCancelMarketOrder = 25,
  KAppFeeCreateMarketplace = 26,
  KAppFeeConfigMarketplace = 27,
  KAppFeeUpdateAccountPermission = 28,
  MaxNFTMintBatch = 29,
  MinKFIStakedToEnableProposals = 30,
  MinKLVBucketAmount = 31,
  MaxBucketSize = 32,
  LeaderValidatorRewardsPercentage = 33,
  ProposalMaxEpochsDuration = 34,
}

export interface IProposalsMessages {
  FeePerDataByte: string;
  KAppFeeCreateValidator: string;
  KAppFeeCreateAsset: string;
  MaxEpochsUnclaimed: string;
  MinSelfDelegatedAmount: string;
  MinTotalDelegatedAmount: string;
  BlockRewards: string;
  StakingRewards: string;
  KAppFeeTransfer: string;
  KAppFeeAssetTrigger: string;
  KAppFeeValidatorConfig: string;
  KAppFeeFreeze: string;
  KAppFeeUnfreeze: string;
  KAppFeeDelegate: string;
  KAppFeeUndelegate: string;
  KAppFeeWithdraw: string;
  KAppFeeClaim: string;
  KAppFeeUnjail: string;
  KAppFeeSetAccountName: string;
  KAppFeeProposal: string;
  KAppFeeVote: string;
  KAppFeeConfigITO: string;
  KAppFeeSetITOPrices: string;
  KAppFeeBuy: string;
  KAppFeeSell: string;
  KAppFeeCancelMarketOrder: string;
  KAppFeeCreateMarketplace: string;
  KAppFeeConfigMarketplace: string;
  KAppFeeUpdateAccountPermission: string;
  MaxNFTMintBatch: string;
  MinKFIStakedToEnableProposals: string;
  MinKLVBucketAmount: string;
  MaxBucketSize: string;
  LeaderValidatorRewardsPercentage: string;
  ProposalMaxEpochsDuration: string;
}
