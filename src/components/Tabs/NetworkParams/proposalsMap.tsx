import { IProposalsMap } from '@/types/proposals';
import { KLV_PRECISION } from '@/utils/globalVariables';

export const proposalsMap: IProposalsMap = {
  FeePerDataByte: {
    message: 'Fee per Data Byte',
    precision: KLV_PRECISION,
    unit: 'KLV/Byte',
  },
  KAppFeeCreateValidator: {
    message: 'KApp Fee for Validator Creation',
    precision: KLV_PRECISION,
    unit: 'KLV',
  },
  KAppFeeCreateAsset: {
    message: 'KApp Fee for Asset Creation',
    precision: KLV_PRECISION,
    unit: 'KLV',
  },
  MaxEpochsUnclaimed: {
    message: 'Max Epochs to Clear Unclaimed',
    precision: 0,
    unit: 'Epochs',
  },
  MinSelfDelegatedAmount: {
    message: 'Min Self Delegation Amount',
    precision: KLV_PRECISION,
    unit: 'KLV',
  },
  MinTotalDelegatedAmount: {
    message: 'Min Total Delegation Amount',
    precision: KLV_PRECISION,
    unit: 'KLV',
  },
  BlockRewards: {
    message: 'Block Rewards',
    precision: KLV_PRECISION,
    unit: 'KLV',
  },
  StakingRewards: {
    message: 'Staking Rewards',
    precision: KLV_PRECISION,
    unit: 'KLV',
  },
  KAppFeeTransfer: {
    message: 'KApp Fee for Transfer',
    precision: KLV_PRECISION,
    unit: 'KLV',
  },
  KAppFeeAssetTrigger: {
    message: 'KApp Fee for Asset Trigger',
    precision: KLV_PRECISION,
    unit: 'KLV',
  },
  KAppFeeValidatorConfig: {
    message: 'KApp Fee for Validator Config',
    precision: KLV_PRECISION,
    unit: 'KLV',
  },
  KAppFeeFreeze: {
    message: 'KApp Fee for Freeze',
    precision: KLV_PRECISION,
    unit: 'KLV',
  },
  KAppFeeUnfreeze: {
    message: 'KApp Fee for Unfreeze',
    precision: KLV_PRECISION,
    unit: 'KLV',
  },
  KAppFeeDelegate: {
    message: 'KApp Fee for Delegation',
    precision: KLV_PRECISION,
    unit: 'KLV',
  },
  KAppFeeUndelegate: {
    message: 'KApp Fee for Undelegate',
    precision: KLV_PRECISION,
    unit: 'KLV',
  },
  KAppFeeWithdraw: {
    message: 'KApp Fee for Withdraw',
    precision: KLV_PRECISION,
    unit: 'KLV',
  },
  KAppFeeClaim: {
    message: 'KApp Fee for Claim',
    precision: KLV_PRECISION,
    unit: 'KLV',
  },
  KAppFeeUnjail: {
    message: 'KApp Fee for Unjail',
    precision: KLV_PRECISION,
    unit: 'KLV',
  },
  KAppFeeSetAccountName: {
    message: 'KApp Fee for Account Name',
    precision: KLV_PRECISION,
    unit: 'KLV',
  },
  KAppFeeProposal: {
    message: 'KApp Fee for Proposal',
    precision: KLV_PRECISION,
    unit: 'KLV',
  },
  KAppFeeVote: {
    message: 'KApp Fee for Vote',
    precision: KLV_PRECISION,
    unit: 'KLV',
  },
  KAppFeeConfigITO: {
    message: 'KApp Fee for Config ITO',
    precision: KLV_PRECISION,
    unit: 'KLV',
  },
  KAppFeeSetITOPrices: {
    message: 'KApp Fee for Set ITO Prices',
    precision: KLV_PRECISION,
    unit: 'KLV',
  },
  KAppFeeBuy: {
    message: 'KApp Fee for Buy',
    precision: KLV_PRECISION,
    unit: 'KLV',
  },
  KAppFeeSell: {
    message: 'KApp Fee for Sell',
    precision: KLV_PRECISION,
    unit: 'KLV',
  },
  KAppFeeCancelMarketOrder: {
    message: 'KApp Fee for Cancel Market Order',
    precision: KLV_PRECISION,
    unit: 'KLV',
  },
  KAppFeeCreateMarketplace: {
    message: 'KApp Fee for Marketplace Creation',
    precision: KLV_PRECISION,
    unit: 'KLV',
  },
  KAppFeeConfigMarketplace: {
    message: 'KApp Fee for Config Marketplace',
    precision: KLV_PRECISION,
    unit: 'KLV',
  },
  KAppFeeUpdateAccountPermission: {
    message: 'KApp Fee for Update Account Permission',
    precision: KLV_PRECISION,
    unit: 'KLV',
  },
  MaxNFTMintBatch: {
    message: 'Max NFT Mint per Batch',
    precision: 0,
    unit: 'NFTs',
  },
  MinKFIStakedToEnableProposals: {
    message: 'Min KFI staked to Enable Proposals Kapps',
    precision: KLV_PRECISION,
    unit: 'KFI',
  },
  MinKLVBucketAmount: {
    message: 'Min KLV Bucket Amount',
    precision: KLV_PRECISION,
    unit: 'KLV',
  },
  MaxBucketSize: { message: 'Max bucket size', precision: 0, unit: 'KDA' },
  LeaderValidatorRewardsPercentage: {
    message: 'Leader Validator Rewards Percentage',
    precision: 2,
    unit: '%',
  },
  ProposalMaxEpochsDuration: {
    message: 'Max Epochs for Active Proposal Duration',
    precision: 0,
    unit: 'Epochs',
  },
  KAppFeeDeposit: {
    message: 'KApp Fee for Deposit',
    precision: KLV_PRECISION,
    unit: 'KLV',
  },
  KAppFeeITOTrigger: {
    message: 'KApp Fee for ITO Trigger',
    precision: KLV_PRECISION,
    unit: 'KLV',
  },
  KAppFeeSmartContract: {
    message: 'KApp Fee for Smart Contract Deploy and Invoke',
    precision: KLV_PRECISION,
    unit: 'KLV',
  },
  GasMultiplier: {
    message: 'Gas Multiplier',
    precision: KLV_PRECISION,
    unit: 'X',
  },
  MaxGasPerBlock: {
    message: 'Max Gas Per Block',
    precision: 0,
    unit: 'Gas',
  },
  MaxGasPerTX: {
    message: 'Max Gas Per TX',
    precision: 0,
    unit: 'Gas',
  },
};
