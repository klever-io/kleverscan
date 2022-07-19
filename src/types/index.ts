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
  Claim = 'Claim',
  Unjail = 'Unjail',
  AssetTrigger = 'AssetTrigger',
  SetAccountName = 'SetAccountName',
  Proposal = 'Proposal',
  Vote = 'Vote',
  ConfigICO = 'ConfigICO',
  SetICOPrices = 'SetICOPrices',
  Buy = 'Buy',
  Sell = 'Sell',
  CancelMarketOrder = 'CancelMarketOrder',
  CreateMarketplace = 'CreateMarketplace',
  ConfigMarketplace = 'ConfigMarketplace',
}

export enum Service {
  PROXY,
  PRICE,
  NODE,
  GECKO,
  EXPLORER,
}

export interface IContractOption {
  value: string;
  label: string;
}

export interface ITransferContract {
  amount: number;
  toAddress: string;
  assetId?: string;
}

export enum EnumAssetType {
  Fungible = 0,
  NonFungible = 1,
}

export interface IRoyaltyInfo {
  amount: number;
  percentage: number;
}

export interface IRoyaltiesInfo {
  address: string;
  transferPercentage: IRoyaltyInfo[];
  transferFixed: number;
  marketPercentage: number;
  marketFixed: number;
}

export interface ICreateAssetContract {
  type: EnumAssetType;
  name: string;
  ticker: string;
  ownerAddress: string;
  logo: string;
  uris: any;
  precision: number;
  initialSupply: number;
  circulatingSupply: number;
  maxSupply: number;
  royalties: IRoyaltiesInfo;
  properties: IPropertiesInfo;
  atributes: IAttributesInfo;
  staking: IStakingInfo;
  roles: IRolesInfo[];
}

export interface IPropertiesInfo {
  canFreeze: boolean;
  canWipe: boolean;
  canPause: boolean;
  canMint: boolean;
  canBurn: boolean;
  canChangeOwner: boolean;
  canAddRoles: boolean;
}

export interface IAttributesInfo {
  isPaused: boolean;
  isNFTMintStopped: boolean;
}

export interface IStakingInfo {
  type: number;
  apr: number;
  minEpochsToClaim: number;
  minEpochsToUnstake: number;
  minEpochsToWithdraw: number;
}
export interface IRolesInfo {
  address: string;
  hasRoleMint: boolean;
  hasRoleSetICOPrices: boolean;
}

export interface ICreateValidatorContract {
  ownerAddress: string;
  config: IValidatorConfig;
}

export interface IValidatorConfigContract {
  config: IValidatorConfig;
}

export interface IValidatorConfig {
  blsPublicKey: string;
  rewardAddress: string;
  canDelegate: boolean;
  commission: number;
  maxDelegationAmount: number;
  logo: string;
  uris: any;
  name: string;
}

export interface IFreezeContract {
  amount: number;
  assetId: string;
}

export interface IUnfreezeContract {
  bucketID: string;
  assetId: string;
}

export interface IDelegateContract {
  bucketID: string;
  toAddress: string;
}

export interface IUndelegateContract {
  bucketID: string;
}

export interface IWithdrawContract {
  assetId: string;
}
export enum EnumClaimType {
  StakingClaim = 0,
  AllowanceClaim = 1,
  MarketClaim = 2,
}
export interface IClaimContract {
  claimType: EnumClaimType;
  id: string;
}
export interface IUnjailContract {}

export enum EnumTriggerType {
  Mint = 0,
  Burn = 1,
  Wipe = 2,
  Pause = 3,
  Resume = 4,
  ChangeOwner = 5,
  AddRole = 6,
  RemoveRole = 7,
  UpdateMetadata = 8,
  StopNFTMint = 9,
  UpdateLogo = 10,
  UpdateURIs = 11,
  ChangeRoyaltiesReceiver = 12,
}

export interface IAssetTriggerContract {
  triggerType: EnumTriggerType;
  toAddress: string;
  amount: number;
  mime: string;
  logo: string;
  uri: any;
  role: IRolesInfo;
}

export interface ISetAccountNameContract {
  name: string;
}

export interface IProposalContract {
  parameter: number;
  value: string;
  description: string;
  epochsDuration: number;
}

export interface IVoteContract {
  proposalId: number;
  amount: number;
}

export enum EnumICOStatus {
  DefaultICO = 0,
  ActiveICO = 1,
  PausedICO = 2,
}

export interface IConfigICOContract {
  assetId: string;
  receiverAddress: string;
  status: EnumICOStatus;
  maxAmount: number;
  packInfo: any;
}

export interface ISetICOPricesContract {
  assetId: string;
  packInfo: any;
}

export enum EnumBuyType {
  ICOBuy = 0,
  MarketBuy = 1,
}

export interface IBuyContract {
  buyType: EnumBuyType;
  id: string;
  currencyId: string;
  amount: number;
}

export enum EnumMarketType {
  BuyItNowMarket = 0,
  AuctionMarket = 1,
}

export interface ISellContract {
  marketType: EnumMarketType;
  marketplaceID: string;
  assetId: string;
  currencyID: string;
  price: number;
  reservePrice: number;
  endTime: number;
}

export interface ICancelMarketOrderContract {
  orderId: string;
}

export interface ICreateMarketplaceContract {
  name: string;
  referralAddress: string;
  referralPercentage: number;
}

export interface IConfigMarketplaceContract {
  marketplaceId: string;
  name: string;
  referralAddress: string;
  referralPercentage: number;
}

type IParameter =
  | ITransferContract
  | ICreateAssetContract
  | ICreateValidatorContract
  | IValidatorConfigContract
  | IFreezeContract
  | IUnfreezeContract
  | IDelegateContract
  | IUndelegateContract
  | IWithdrawContract
  | IClaimContract
  | IUnjailContract
  | IAssetTriggerContract
  | ISetAccountNameContract
  | IProposalContract
  | IVoteContract
  | IConfigICOContract
  | ISetICOPricesContract
  | IBuyContract
  | ISellContract
  | ICancelMarketOrderContract
  | ICreateMarketplaceContract
  | IConfigMarketplaceContract;

export interface ICreateAssetReceipt {
  assetId: string;
}

export interface IFreezeReceipt {
  bucketId: string;
}

export interface IUnfreezeReceipt {
  availableEpoch: number;
}

export type IReceipt = ICreateAssetReceipt | IFreezeReceipt | IUnfreezeReceipt;

export interface ITransaction {
  hash: string;
  blockNum: number;
  sender: string;
  data?: string[];
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
  receipts: IReceipt[];
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
}

interface ItotalLeaderSuccessRate {
  numSuccess: number;
  numFailure: number;
}

interface ItotalValidatorSuccessRate {
  numSuccess: number;
  numFailure: number;
}

export interface IPeer {
  blsPublicKey: string;
  ownerAddress: string;
  rewardAddress: string;
  canDelegate: boolean;
  commission: number;
  maxDelegation: number;
  rating: number;
  list: string;
  totalStake: number;
  selfStake: number;
  logo: string;
  name: string;
  totalLeaderSuccessRate: ItotalLeaderSuccessRate;
  totalValidatorSuccessRate: ItotalValidatorSuccessRate;
  uris: {
    [index: string]: any;
  };
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
  frozenBalance: number;
  blsPublicKey: string;
  assets: {
    [key: string]: IAccountAsset;
  };
  buckets?: [
    {
      [key: string]: IBucket;
    },
  ];
}

export interface IAccountAsset {
  address: string;
  assetId: string;
  assetType: number;
  balance: number;
  precision: number;
  frozenBalance: number;
  unfrozenBalance: number;
  lastClaim: {
    timestamp: number;
    epoch: number;
  };
  buckets?: IBucket[];
  staking?: {
    minEpochsToWithdraw: number;
  };
}

export interface IAsset {
  assetType: string;
  assetId: string;
  name: string;
  ticker: string;
  ownerAddress: string;
  logo: string;
  uris: any;
  precision: number;
  initialSupply: number;
  circulatingSupply: number;
  maxSupply: number;
  royalties: number;
  mintedValue: number;
  issueDate: number;
  staking: {
    minEpochsToWithdraw: number;
    totalStaked: number;
  };
  burnedValue: number;
  properties: {
    canFreeze: boolean;
    canWipe: boolean;
    canPause: boolean;
    canMint: boolean;
    canBurn: boolean;
    canChangeOwner: boolean;
    canAddRoles: boolean;
  };
  attributes: {
    isPaused: boolean;
    isNFTMintStopped: boolean;
  };
}

export interface IContract {
  sender: string;
  type: Contract;
  parameter: IParameter;
  precision?: number;
  asset?: IAsset;
  receipts?: IReceipt[];
}

export interface IBucket {
  address?: string;
  id: string;
  stakeAt: number;
  stakedEpoch: number;
  unstakedEpoch: number;
  balance: number;
  delegation: string;
}

export interface IDelegationsResponse {
  totalStake: number;
  ownerAddress: string;
  buckets: number;
  name?: string;
  totalLeaderSuccessRate: ItotalValidatorSuccessRate;
  totalValidatorSuccessRate: ItotalValidatorSuccessRate;
  rating: number;
  selfStake: number;
  list: string;
  totalProduced: number;
  totalMissed: number;
  canDelegate: boolean;
  maxDelegation: number;
}
export interface IValidator {
  rank: number;
  name: string;
  staked: number;
  cumulativeStaked: number;
  address: string;
  rating: number;
  selfStake: number;
  status: string;
  totalProduced: number;
  totalMissed: number;
  canDelegate: boolean;
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

interface INodePeer {
  coordenates: [number, number][];
  data: any;
}

export interface ICountryNode {
  country: ISO2;
  nodes: INodePeer[];
}

export interface IGeolocation {
  country: ISO2;
  ll: [number, number];
}

export interface IPeerData {
  isblacklisted: boolean;
  pid: string;
  pk: string;
  peertype: string;
  geolocation: IGeolocation[];
  addresses: string[];
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
  epochInfo: IEpochInfo;
  blocks: IBlock[];
  totalAccounts: number;
  totalTransactions: number;
  tps: string;
  coinsData: ICoinInfo[];
  yesterdayTransactions: number;
  yesterdayAccounts: number;
}
export interface IDataCards {
  totalAccounts: number;
  totalTransactions: number;
  tps: string;
  epochInfo: IEpochInfo;
  coinsData: ICoinInfo[];
  yesterdayTransactions: number;
  yesterdayAccounts: number;
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

export interface IEpochCard {
  Icon: any;
  title: string;
  value: number | string;
  progress?: any;
}

export interface INodeCard {
  title: string;
  headers: string[];
  values: string[];
  chartType: 'chart' | 'map';
  chartOptions?: any;
  chartData: IChartData[] | string[];
}

export interface IProposalDetails {
  proposer: string;
  proposerContent: string;
  created: number;
  hash: string;
}

export interface IProposal {
  proposalId: number;
  proposalStatus: string;
  parameter: string;
  value: string;
  description: string;
  epochStart: number;
  epochEnd: number;
  votes: number;
  voters: IVote[];
  txHash: string;
  proposer: string;
  createdDate: string;
  endedDate: string;
  totalStaked?: number;
  timestampStart?: number;
  timestampEnd?: number;
  parameters?: IFullInfoParam[];
}

export interface IVote {
  address: string;
  amount: number;
}

export interface IProposalsResponse extends IResponse {
  data: {
    proposals: IProposal[];
  };
  pagination: IPagination;
}
export interface ITotalFrozen {
  data: {
    totalFrozen: number;
  };
}

export interface IDelegate {
  address: string;
  buckets: IBucket[];
}

export interface IEpochInfo {
  currentSlot: number;
  epochFinishSlot: number;
  epochLoadPercent: number;
  remainingTime: string;
}

export interface IParsedMetrics {
  klv_slot_at_epoch_start: number;
  klv_slots_per_epoch: number;
  klv_current_slot: number;
  klv_slot_duration: number;
}

export interface IRawParam {
  [name: string]: number | undefined;
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

interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  span?: number;
  type?: string;

  array?: boolean;
  length?: number;
  options?: {
    label: string;
    value: any;
  }[];
  toggleOptions?: [string, string];
  bool?: boolean;
  required?: boolean;
  innerSection?: ISection;
  selectPlaceholder?: string;
  tooltip?: string;
}

export interface IFormField {
  label: string;
  props?: IInputProps;
}

export interface ISection {
  title?: string;
  inner?: boolean;
  innerPath?: string;
  fields: IFormField[];
}
