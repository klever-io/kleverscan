import { IPagination, IResponse } from '@/types/index';
import { NextRouter } from 'next/router';

export interface IParsedVote {
  status: string;
  validator: string;
  votingPower: string;
  voteDate: string;
  voter: string;
}

export interface IParsedVoter {
  voter: string;
  votingPower: string;
  voteDate: string;
  status: string;
}

export interface IParsedVoterResponse {
  data: { voters: IParsedVoter[] };
  pagination: IPagination;
  error: string;
  code: string;
}

export interface IProposalVoters {
  proposalVotersProps: {
    scrollUp: boolean;
    request: (page: number, limit: number) => Promise<any>;
    dataName: string;
  };
}

export interface IProposal {
  proposalId: number;
  proposer: string;
  txHash: string;
  proposalStatus: string;
  parameters: IProposalParams;
  description: string;
  epochStart: number;
  epochEnd: number;
  votes: IVotes;
  timestamp: number;
  voters: IVote[];
  totalStaked?: number;
  timestampStart?: number;
  timestampEnd?: number;
  fullInfoNewParams?: IParsedProposalParam[];
  currentNetworkParams?: INetworkParams;
  overview: INodeOverview;
  votersPage: IVotersPage;
}

export interface IVotersPage {
  self: number;
  next: number;
  previous: number;
  perPage: number;
  totalPages: number;
  totalRecords: number;
}

export interface INodeOverview {
  baseTxSize: number;
  chainID: string;
  currentSlot: number;
  epochNumber: number;
  nonce: number;
  nonceAtEpochStart: number;
  slotAtEpochStart: number;
  slotCurrentTimestamp: number;
  slotDuration: number;
  slotsPerEpoch: number;
  startTime: number;
}

export interface IProposalsResponse extends IResponse {
  data: {
    proposals: IProposal[];
  };
  pagination: IPagination;
}

export interface IProposalResponse extends IResponse {
  data: {
    proposal: IProposal;
  };
  pagination: IPagination;
  error: string;
}

export interface IParsedProposal extends IProposal {
  parsedParameters: IParsedProposalParam[];
  votingPowers?: IVotingPowers;
  currentNetworkParams: INetworkParams;
  pagination: IPagination;
  totalVoted: number;
  totalStaked: number;
  parsedVoters: IParsedVoter[];
}
export interface IAPINetworkParams {
  parameters: {
    [key: string]: { type: string; value: string };
  };
}

export interface IVotingPowers {
  [address: string]: number;
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
}

export interface IParsedNetworkParams {
  [key: string]: IParsedNetworkParam;
}

export interface IParsedNetworkParam {
  number: number;
  parameter: string;
  currentValue: string;
  parameterLabel: string;
}

export interface INetworkParams {
  [key: string]: INetworkParam;
}

export interface INetworkParam {
  type: string;
  value: string;
}

export interface IProposals {
  [index: number]: IProposal;
}

export interface IProposalsProps {
  request: (page: number, limit: number, router: NextRouter) => Promise<any>;
}

export interface IProposalParams {
  [name: string]: string;
}

export interface IParsedParams {
  currentNetworkParams: IParsedNetworkParams;
  parsedProposalParams: IParsedProposalParam[];
}

export interface IParsedProposalParam {
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
  KAppFeeITOTrigger = 35,
  KAppFeeDeposit = 36,
  KAppFeeSmartContract = 37,
}

export interface IProposalMapItem {
  message: string;
  precision: number;
  unit: string;
}

export interface IProposalsMap {
  FeePerDataByte: IProposalMapItem;
  KAppFeeCreateValidator: IProposalMapItem;
  KAppFeeCreateAsset: IProposalMapItem;
  MaxEpochsUnclaimed: IProposalMapItem;
  MinSelfDelegatedAmount: IProposalMapItem;
  MinTotalDelegatedAmount: IProposalMapItem;
  BlockRewards: IProposalMapItem;
  StakingRewards: IProposalMapItem;
  KAppFeeTransfer: IProposalMapItem;
  KAppFeeAssetTrigger: IProposalMapItem;
  KAppFeeValidatorConfig: IProposalMapItem;
  KAppFeeFreeze: IProposalMapItem;
  KAppFeeUnfreeze: IProposalMapItem;
  KAppFeeDelegate: IProposalMapItem;
  KAppFeeUndelegate: IProposalMapItem;
  KAppFeeWithdraw: IProposalMapItem;
  KAppFeeClaim: IProposalMapItem;
  KAppFeeUnjail: IProposalMapItem;
  KAppFeeSetAccountName: IProposalMapItem;
  KAppFeeProposal: IProposalMapItem;
  KAppFeeVote: IProposalMapItem;
  KAppFeeConfigITO: IProposalMapItem;
  KAppFeeSetITOPrices: IProposalMapItem;
  KAppFeeBuy: IProposalMapItem;
  KAppFeeSell: IProposalMapItem;
  KAppFeeCancelMarketOrder: IProposalMapItem;
  KAppFeeCreateMarketplace: IProposalMapItem;
  KAppFeeConfigMarketplace: IProposalMapItem;
  KAppFeeUpdateAccountPermission: IProposalMapItem;
  MaxNFTMintBatch: IProposalMapItem;
  MinKFIStakedToEnableProposals: IProposalMapItem;
  MinKLVBucketAmount: IProposalMapItem;
  MaxBucketSize: IProposalMapItem;
  LeaderValidatorRewardsPercentage: IProposalMapItem;
  ProposalMaxEpochsDuration: IProposalMapItem;
  KAppFeeDeposit: IProposalMapItem;
  KAppFeeITOTrigger: IProposalMapItem;
  KAppFeeSmartContract: IProposalMapItem;
}

export interface MostTransferredToken {
  doc_count: number;
  key: string;
  logo: string;
  name: string;
  address: string;
  ownerAddress: string;
  count: number;
}
