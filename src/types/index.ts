import { IChartData } from '@/configs/home';
import { ISO2 } from '@/utils/country';
import { Dispatch, PropsWithChildren, SetStateAction } from 'react';
import { IBlock, IBlockResponse } from './blocks';
import {
  Contract,
  IContract,
  IPackInfo,
  IParameterOnlyAssetId,
  IWhitelistInfo,
} from './contracts';
import { INodeOverview, IProposal } from './proposals';

export type Query = {
  [key: string]: any;
};

export enum Service {
  PROXY,
  NODE,
  GECKO,
  EXPLORER,
  MULTISIGN,
  CDN,
}

export interface IDropdownItem {
  label: string;
  value: any;
}

export interface IParamList {
  label: string;
  value: number;
  currentValue?: string;
  parameterLabel: string;
}

interface IAssetProperties {
  canAddRoles: boolean;
  canFreeze: boolean;
  canWipe: boolean;
  canPause: boolean;
  canMint: boolean;
  canBurn: boolean;
  canChangeOwner: boolean;
}

export interface ICollectionList {
  label: string;
  value: string;
  assetId: string;
  isNFT: boolean;
  isFungible: boolean;
  frozenBalance?: number;
  balance?: number;
  precision?: number;
  buckets?: any[];
  minEpochsToWithdraw?: number | null;
  ownerAddress?: string;
  properties?: IAssetProperties;
  attributes?: {
    isPaused: boolean;
    isNFTMintStopped: boolean;
  };
  royalties: IRoyalties | undefined;
}

export interface ICreateAssetReceipt {
  assetId: string;
  type: number;
  cID: number;
}

export interface IFreezeReceipt {
  type: number;
  cID: number;
  bucketId: string;
}

export interface IUnfreezeReceipt {
  assetId: string;
  availableEpoch: number;
  bucketId: string;
  cID: number;
  from: string;
  type: 4;
  typeString: string;
  value: string;
}

export interface IDelegateReceipt {
  amountDelegated: string;
  bucketId: string;
  cID: number;
  delegate: string;
  from: string;
  type: 7;
  typeString: 'Delegate';
}

export interface IBuyReceipt {
  amount: number;
  bidder: string;
  cID: number;
  currencyId: string;
  executed: boolean;
  marketplaceId: string;
  orderId: string;
  type: 16;
  typeString: 'Buy';
  assetId: string;
  from?: string;
  to?: string;
  value?: number;
}

export interface ISellReceipt {
  cID: number;
  marketplaceId: string;
  orderId: string;
  type: 15;
  typeString: 'Sell';
}

export interface IWithdrawReceipt {
  amount: string;
  assetId: string;
  cID: number;
  from: string;
  type: 18;
  typeString: 'Withdraw';
}

export interface IClaimReceipt {
  cID: number;
  amount: number;
  assetId: string;
  assetIdReceived: string;
  claimType: number;
  claimTypeString: string;
  marketplaceId: string;
  orderId: string;
  type: 17;
  typeString: 'Claim';
}

export interface IProposalReceipt {
  cID: number;
  proposalId: string;
  type: number;
  typeString: string;
}

export interface ICreateMarketplaceReceipt {
  cID: number;
  marketplaceId: string;
  type: 10;
  typeString: 'CreateMarketplace';
}

export type IReceipt =
  | ICreateAssetReceipt
  | IFreezeReceipt
  | IUnfreezeReceipt
  | IDelegateReceipt
  | IClaimReceipt
  | IBuyReceipt
  | ISellReceipt
  | IWithdrawReceipt
  | IClaimReceipt
  | IProposalReceipt
  | ICreateMarketplaceReceipt;

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
  precision?: number;
  kdaFee?: IKdaFee;
  logs?: any;
}

export interface ITransactionAssetIds {
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
  contract: IContractAssetIds[];
  receipts: IReceipt[];
  precision?: number;
}

export interface IContractAssetIds {
  sender: string;
  type: number;
  typeString: Contract;
  parameter: IParameterOnlyAssetId;
  precision?: number;
  asset?: IAsset;
  receipts?: IReceipt[];
  contractIndex: number;
}

interface ItotalLeaderSuccessRate {
  numSuccess: number;
  numFailure: number;
}

interface ItotalValidatorSuccessRate {
  numSuccess: number;
  numFailure: number;
}

export interface IUri {
  key: string;
  value: string;
}

export interface IUris {
  uris?: IUri[];
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
  uris: IUri[];
}
export interface IPermissions {
  id: number;
  type: number;
  permissionName: string;
  Threshold: number;
  operations: string;
  signers: [
    {
      address: string;
      weight: number;
    },
  ];
}
export interface IAccount {
  name?: string;
  address: string;
  nonce: number;
  balance: number;
  frozenBalance: number;
  blsPublicKey?: string;
  allowance?: number;
  assets: {
    [key: string]: IAccountAsset;
  };
  buckets?: [
    {
      [key: string]: IBucket;
    },
  ];
  collection?: INfts[];
  timestamp: number;
  permissions?: IPermissions[];
}

export interface IAssetsBuckets {
  asset?: IAccountAsset;
  bucket?: IBucket;
}

export interface IHolders {
  asset: IAsset;
  holdersTableProps: IInnerTableProps;
  setHolderQuery: React.Dispatch<React.SetStateAction<string>>;
  holderQuery: string;
}
export interface IHolder extends IAccountAsset {
  totalBalance: number;
}

export interface IBalance {
  address: string;
  balance: number;
  frozenBalance: number;
  totalBalance: number;
  index: number;
  rank: number;
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
  owner?: boolean;
  staking?: {
    interestType: string;
    minEpochsToWithdraw?: number;
    minEpochsToUnstake?: number;
    minEpochsToClaim?: number;
  };
}

export interface IProprietaryAsset {
  assetId: string;
  assetType: string;
  precision: number;
  circulatingSupply: number;
  staking: {
    interestType: string;
    totalStaked: number;
  };
}

export interface IRewardsAssets {
  allowance: number;
  allStakingRewards?: [
    {
      assetId: string;
      precision: number;
      rewards: number;
    },
  ];
  assetId: string;
}
export interface IAssetsHoldersResponse extends IResponse {
  data: {
    accounts: IAccountAsset[];
  };
  pagination: IPagination;
}

export interface ISplitRoyalties {
  address: string;
  percentITOFixed: number;
  percentITOPercentage: number;
  percentTransferPercentage: number;
}

export interface IRoyalties {
  address?: string;
  marketPercentage?: number;
  marketFixed?: number;
  transferFixed?: number;
  transferPercentage?: [
    {
      amount: number;
      percentage: number;
    },
  ];
  itoPercentage?: number;
  itoFixed?: number;
  splitRoyalties?: ISplitRoyalties[];
}

export interface IRole {
  address: string;
  hasRoleMint: boolean;
  hasRoleSetITOPrices: boolean;
}

export interface IAPR {
  timestamp: number;
  epoch: number;
  value: number;
}

export interface IKDAFPR {
  kda: string;
  totalAmount: number;
  totalClaimed: number;
  precision?: number;
}

export interface IFPR {
  totalAmount: number;
  totalStaked: number;
  TotalClaimed: number;
  epoch: number;
  precision?: number;
  kda: IKDAFPR[];
}

export interface IStaking {
  interestType: string;
  minEpochsToWithdraw: number;
  totalStaked: number;
  apr:
    | {
        timestamp: number;
        epoch: number;
        value: number;
      }[]
    | [];

  fpr: {
    totalAmount: number;
    totalStaked: number;
    TotalClaimed: number;
    epoch: number;
    kda: IKDAFPR[];
  }[];
  currentFPRAmount: number;
  minEpochsToClaim: number;
  minEpochsToUnstake: number;
}

export interface IAsset {
  assetType: string;
  assetId: string;
  name: string;
  ticker: string;
  ownerAddress: string;
  logo: string;
  uris:
    | {
        [key: string]: string;
      }
    | IUri[];
  precision: number;
  initialSupply: number;
  circulatingSupply: number;
  maxSupply: number;
  royalties: IRoyalties;
  mintedValue: number;
  issueDate: number;
  staking: IStaking;
  roles?: IRole[];
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
  hidden: boolean;
  verified: boolean;
  metadata?: string;
  mime?: string;
  stakingHolders: number;
}

export interface IITO {
  assetId: string;
  isActive: boolean;
  maxAmount: number;
  mintedAmount?: number;
  receiverAddress: string;
  packData: IPackInfo[];
  isWhitelistActive: boolean;
  whitelistInfo: IWhitelistInfo[];
  whitelistStartTime: number;
  whitelistEndTime: number;
  startTime?: number;
  endTime?: number;
}

export interface IParsedITO extends IITO {
  name: string;
  logo: string;
  verified: boolean;
  ticker: string;
  assetType: string;
  precision: number;
  assetLogo: string;
  royalties: {
    fixed: number;
    percentage: number;
  };
}

export interface IAssetPool {
  ownerAddress: string;
  kda: string;
  active: boolean;
  klvBalance: number;
  kdaBalance: number;
  convertedFees: number;
  adminAddress: string;
  fRatioKLV: number;
  fRatioKDA: number;
  hidden: boolean;
  verified: boolean;
  ratio: number;
}

export interface IParsedAsset extends IAsset {
  nonce: string;
  nonceOwner: string;
}

export interface IAssetAmount {
  asset: string;
  amount: number;
}

export interface IBucket {
  address?: string;
  id: string;
  stakeAt: number;
  stakedEpoch: number;
  unstakedEpoch: number;
  balance: number;
  delegation: string;
  availableEpoch: number | string;
}

// TODO: establish a pattern for filter types
export interface ITxQuery {
  page?: number;
  address?: string;
  startdate?: string;
  start?: string;
  enddate?: string;
  end?: string;
  fromAddress?: string;
  toAddress?: string;
  account?: string;
  tab?: string;
}

export interface IInnerTableProps {
  dataName: string;
  request: (page: number, limit: number) => Promise<any>;
  scrollUp?: boolean;
  query?: ITxQuery;
  page?: number;
}

export interface IValidatorResponse extends IResponse {
  data: {
    validators: IDelegationsResponse[];
    networkTotalStake: number;
  };
  pagination: IPagination;
}

export interface IValidatorsResponse extends IResponse {
  data: {
    networkTotalStake: number;
    validators: IValidator[];
  };
}

export interface IDelegationsResponse {
  totalStake: number;
  ownerAddress: string;
  buckets?: number;
  name?: string;
  totalLeaderSuccessRate: ItotalValidatorSuccessRate;
  totalValidatorSuccessRate: ItotalValidatorSuccessRate;
  rating: number;
  selfStake: number;
  list: string;
  canDelegate: boolean;
  maxDelegation: number;
  commission: number;
}
export interface IValidator {
  ownerAddress: string;
  name?: string;
  parsedAddress: string;
  rank: number;
  staked: number;
  cumulativeStaked: number;
  rating: number;
  selfStake: number;
  status: string;
  totalProduced: number;
  totalMissed: number;
  canDelegate: boolean;
  commission: number;
  maxDelegation: number;
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
  self: number;
  next: number;
  previous: number;
  perPage: number;
  totalPages: number;
  totalRecords: number;
}

export interface IResponse {
  data: any;
  code: string;
  error: IError | string;
}

export interface IPaginatedResponse extends IResponse {
  pagination?: IPagination;
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

export interface IParsedDailyTransaction {
  value: number;
  date: string;
}

export interface IAssetStaking {
  totalStaking: number | null | undefined;
  dayBeforeTotalStaking: number | null | undefined;
}

export interface IAssetsData {
  klv: IAssetData;
  kfi: IAssetData;
}

export interface IAssetData {
  prices?: IAssetPrice | undefined;
  staking?: IAssetStaking | undefined;
  volume?: number | null;
  circulatingSupply?: number | null;
  estimatedAprYesterday?: number | undefined;
  estimatedAprBeforeYesterday?: number | undefined;
}

export interface IAssetPrice {
  todaysPrice: number | null;
  yesterdayPrice: number | null;
  variation: number | null;
}

export interface IAssetsPrice {
  klvPrice: IAssetPrice;
  kfiPrice: IAssetPrice;
}

export interface IPrice {
  TotalVolume: number;
  TotalCurrencyVolume: number;
  Currency: string;
  CurrencyPrice: number;
  AveragePrice: number;
  AverageCurrencyPrice: number;
  Exchanges: [
    {
      ExchangeName: string;
      Symbol: string;
      Price: number;
      Volume: number;
      HighPrice: number;
      LowPrice: number;
      PriceVariation: number;
    },
  ];
}

export interface IHome {
  transactionsList: IDailyTransaction[];
  defaultEpochInfo: IEpochInfo;
  blocks: IBlock[];
  defaultTotalAccounts: number;
  tps: string;
  coinsData: ICoinInfo[];
  yesterdayTransactions: number;
  beforeYesterdayTransactions: number;
  yesterdayAccounts: number;
  assetsData: IAssetsData;
}

export interface IDataMetrics {
  currentSlot: number;
  epochFinishSlot: number;
  epochLoadPercent: number;
  remainingTime: string;
}
export interface IDataCards {
  metrics: IDataMetrics;
  totalAccounts: number;
  newAccounts: number;
  totalTransactions: number;
  newTransactions: number;
  beforeYesterdayTransactions: number;
  actualTPS: string;
  blocks: IBlock[];
  counterEpoch: number;
}

export interface ICoinCards {
  coins: ICoinInfo[];
  assetsData: IAssetsData;
}
export interface ITransactionsResponse extends IResponse {
  data: {
    transactions: ITransaction[];
  };
  pagination: IPagination;
}

export interface ITransactionResponse extends IResponse {
  data: {
    transaction: ITransaction;
  };
}

export interface ITransactionPage {
  transaction: ITransaction;
  block: IBlock;
}

export interface IAssetTransactionResponse extends IResponse {
  data: {
    transactions: ITransactionAssetIds[];
  };
  pagination: IPagination;
}

export interface IAssetPoolResponse extends IResponse {
  data: {
    pool: IAssetPool;
  };
}

export interface IAssetPoolsResponse extends IResponse {
  data: {
    pools: IAssetPool[];
  };
}

export interface ITransactionListResponse extends IResponse {
  data: {
    number_by_day: IDailyTransaction[];
  };
  pagination: IPagination;
}

export interface INodeAccountResponse extends IResponse {
  data: {
    account: {
      Address: string;
      Allowance: number;
      Balance: number;
      Nonce?: number;
      RootHash: string;
    };
  };
}

export interface IAccountResponse extends IResponse {
  pagination: IPagination;
  data: { account: IAccount };
}

export interface ICollection {
  address: string;
  assetId: string;
  collection: string;
  nftNonce: number;
  assetName: string;
  assetType: number;
  balance: number;
  precision: number;
  frozenBalance: number;
  unfrozenBalance: number;
  lastClaim: {
    timestamp: number;
    epoch: number;
  };
  buckets: IBucket[];
  stakingType: number;
}

export interface ICollectionIdListResponse extends IResponse {
  data: {
    collection: ICollection[];
  };
}

export interface IAssetsResponse extends IPaginatedResponse {
  data: {
    assets: IAsset[];
  };
}

export interface IAssetResponse extends IResponse {
  data: Record<'asset', IAsset> | null;
}

export interface IAssetPage {
  asset: IAsset;
  transactions: ITransaction[];
  totalTransactions: number;
  totalTransactionsPage: number;
  totalHoldersPage: number;
  holders: IBalance[];
  totalRecords: number;
  page: number;
}

export interface IHoldersResponse extends IResponse {
  data: {
    accounts: IAccountAsset[];
  };
  pagination: IPagination;
}

export interface IITOResponse extends IResponse {
  data: {
    ito: IITO;
  };
  pagination: IPagination;
}

export interface IITOsResponse extends IResponse {
  data: {
    itos: IITO[];
  };
  pagination: IPagination;
}

export interface IStatisticsResponse extends IResponse {
  data: {
    statistics: {
      chainStatistics: IChainStatistics;
    };
  };
}

export interface IAggregate {
  blocks: IBlock[];
  transactions: ITransaction[];
  statistics: IChainStatistics;
  overview: INodeOverview;
  proposalStatistics: {
    activeProposals: IProposal[];
    lastProposal: IProposal;
  };
  validatorStatistics: {
    active: number;
    total: number;
    eligible: number;
  };
}

export interface IAggregateResponse extends IResponse {
  data: IAggregate;
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
  percentage?: number;
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

export interface IMetrics {
  slotAtEpochStart: number;
  slotsPerEpoch: number;
  currentSlot: number;
  slotDuration: number;
}

export interface ITotalFrozen {
  data: {
    totalFrozen: number;
  };
}

export interface IFormData {
  [key: string]: any;
}

export interface INfts {
  address: string;
  assetName: string;
  collection: string;
  assetId: string;
  nftNonce: number;
  mime?: string;
  metadata?: string;
}

export interface IFilterDater {
  startdate: string;
  enddate: string;
}

export interface TableRowElementProps {
  $smaller?: boolean;
}
export interface IRowSection {
  element: React.FC<PropsWithChildren<TableRowElementProps>>;
  span: number;
  width?: number;
  maxWidth?: number;
}

export type Place = 'top' | 'right' | 'bottom' | 'left';

export interface ICustomStyles {
  offset?: number;
  place?: Place;
  delayShow?: number;
}

export interface IPrecisionResponse {
  precisions: { [assetId: string]: number };
}

export interface IHomeTransactions {
  setTotalTransactions: Dispatch<SetStateAction<number>>;
  transactions: ITransaction[];
  transactionsList: IDailyTransaction[];
  precision: number;
}

export interface IKdaFee {
  kda: string;
  amount: number;
}

export type SearchRequest =
  | ITransactionResponse
  | IAssetResponse
  | IAccountResponse
  | IBlockResponse;

export interface NotFound {
  notFound: true;
}

export interface Nodes {
  locations: Node[];
}

export interface Node {
  coordinates: [number, number];
}
