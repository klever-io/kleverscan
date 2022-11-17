import { IChartData } from '@/configs/home';
import { ISO2 } from '@/utils/country';
import { Dispatch, SetStateAction } from 'react';
import { IBlock } from './blocks';
import { Contract, IContract, IParameterOnlyAssetId } from './contracts';

export type Query = {
  [key: string]: any;
};

export enum Service {
  PROXY,
  PRICE,
  NODE,
  GECKO,
  EXPLORER,
}

export interface IDropdownItem {
  label: string;
  value: any;
}

export interface IParamList {
  label: string;
  value: number;
  currentValue?: string;
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
  isNFT: boolean;
  frozenBalance: number;
  balance: number;
  precision?: number;
  buckets?: any[];
  minEpochsToWithdraw?: number | null;
}

export interface IKAssets {
  label: string;
  value: string;
  properties?: IAssetProperties;
  isNFT: boolean;
  isPaused: boolean;
}

export interface ICreateAssetReceipt {
  assetId: string;
}

export interface IFreezeReceipt {
  bucketId: string;
}

export interface IUnfreezeReceipt {
  availableEpoch: number;
}

export interface IBuyReceipt {
  assetId: string;
  type: number;
  from?: string;
  to?: string;
  value?: number;
}

export type IReceipt =
  | ICreateAssetReceipt
  | IFreezeReceipt
  | IUnfreezeReceipt
  | IBuyReceipt;

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
  contractIndex?: number;
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
  collection: INfts[];
}

export interface IHolder {
  holders: IBalance[];
  asset: IAsset;
  holdersTableProps: IInnerTableProps;
}

export interface IBalance {
  address: string;
  balance: number;
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
}

export interface IAssetsHoldersResponse extends IResponse {
  data: {
    accounts: IAccountAsset[];
  };
  pagination: IPagination;
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
  royalties: {
    address: string;
    marketPercentage: number;
    transferFixed: number;
    transferPercentage: [
      {
        amount: number;
        percentage: number;
      },
    ];
  };
  mintedValue: number;
  issueDate: number;
  staking: {
    interestType: string;
    minEpochsToWithdraw: number;
    totalStaked: number;
    apr: [
      {
        timestamp: number;
        epoch: number;
        value: number;
      },
    ];
    fpr: {
      totalAmount: number;
      totalStaked: number;
      TotalClaimed: number;
      epoch: number;
    }[];
    currentFPRAmount: number;
    minEpochsToClaim: number;
    minEpochsToUnstake: number;
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
  hidden: boolean;
  verified: boolean;
  metadata?: string;
  mime?: string;
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
}

export interface IInnerTableProps {
  scrollUp: boolean;
  totalPages: number;
  dataName: string;
  request: (page: number, limit: number) => Promise<any>;
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

export interface IAssetStaking {
  totalStaking: number | null;
  dayBeforeTotalStaking: number | null;
}

export interface IAssetsData {
  klv: IAssetData;
  kfi: IAssetData;
}

export interface IAssetData {
  prices: IAssetPrice;
  staking: IAssetStaking;
  volume: number | null;
  circulatingSupply: number | null;
  estimatedAprYesterday: number;
  estimatedAprBeforeYesterday: number;
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
  beforeYesterdayTransactions: number;
  yesterdayAccounts: number;
  assetsData: IAssetsData;
}
export interface IDataCards {
  totalAccounts: number;
  totalTransactions: number;
  tps: string;
  epochInfo: IEpochInfo;
  coinsData: ICoinInfo[];
  yesterdayTransactions: number;
  beforeYesterdayTransactions: number;
  yesterdayAccounts: number;
  assetsData: IAssetsData;
  block: IBlock;
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

export interface IAssetTransactionResponse extends IResponse {
  data: {
    transactions: ITransactionAssetIds[];
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
export interface IAssetResponse extends IResponse {
  data: {
    assets: IAsset[];
  };
}

export interface IAssetOne extends IResponse {
  data: {
    asset: IAsset;
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

export interface IRowSection {
  element: JSX.Element;
  span: number;
}

export interface IOffset {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
}

export interface ICustomStyles {
  offset?: IOffset;
  place?: 'top' | 'right' | 'bottom' | 'left';
}
