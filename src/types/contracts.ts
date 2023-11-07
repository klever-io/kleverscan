// for updating contracts, you need to check 4 main files:
// this file(src/types/contracts.ts)
// src/pages/transaction/[hash].tsx
// src/components/TransactionContractComponents/index.tsx
// src/utils/contracts.ts

import { IAsset, IReceipt } from '.';

export enum Contract {
  Transfer = 'TransferContractType',
  CreateAsset = 'CreateAssetContractType',
  CreateValidator = 'CreateValidatorContractType',
  ValidatorConfig = 'ValidatorConfigContractType',
  Freeze = 'FreezeContractType',
  Unfreeze = 'UnfreezeContractType',
  Delegate = 'DelegateContractType',
  Undelegate = 'UndelegateContractType',
  Withdraw = 'WithdrawContractType',
  Claim = 'ClaimContractType',
  Unjail = 'UnjailContractType',
  AssetTrigger = 'AssetTriggerContractType',
  SetAccountName = 'SetAccountNameContractType',
  Proposal = 'ProposalContractType',
  Vote = 'VoteContractType',
  ConfigITO = 'ConfigITOContractType',
  SetITOPrices = 'SetITOPricesContractType',
  Buy = 'BuyContractType',
  Sell = 'SellContractType',
  CancelMarketOrder = 'CancelMarketOrderContractType',
  CreateMarketplace = 'CreateMarketplaceContractType',
  ConfigMarketplace = 'ConfigMarketplaceContractType',
  UpdateAccountPermission = 'UpdateAccountPermissionContractType',
  Deposit = 'DepositContractType',
  ITOTrigger = 'ITOTriggerContractType',
}

//used in Filter Contracts
export enum ContractsName {
  TransferContractType = 'Transfer',
  CreateAssetContractType = 'Create Asset',
  CreateValidatorContractType = 'Create Validator',
  ValidatorConfigContractType = 'Config Validator',
  FreezeContractType = 'Freeze',
  UnfreezeContractType = 'Unfreeze',
  DelegateContractType = 'Delegate',
  UndelegateContractType = 'Undelegate',
  WithdrawContractType = 'Withdraw',
  ClaimContractType = 'Claim',
  UnjailContractType = 'Unjail',
  AssetTriggerContractType = 'Asset Trigger',
  SetAccountNameContractType = 'Set Account Name',
  ProposalContractType = 'Proposal',
  VoteContractType = 'Vote',
  ConfigITOContractType = 'Config ITO',
  SetITOPricesContractType = 'Set ITO',
  BuyContractType = 'Buy',
  SellContractType = 'Sell',
  CancelMarketOrderContractType = 'Cancel Marketplace Order',
  CreateMarketplaceContractType = 'Create Marketplace',
  ConfigMarketplaceContractType = 'Config Marketplace',
  UpdateAccountPermissionContractType = 'Update Account Permission',
  DepositContractType = 'Deposit',
  ITOTriggerContractType = 'ITO Trigger',
}

export enum ContractsIndex {
  'Transfer',
  'Create Asset',
  'Create Validator',
  'Config Validator',
  'Freeze',
  'Unfreeze',
  'Delegate',
  'Undelegate',
  'Withdraw',
  'Claim',
  'Unjail',
  'Asset Trigger',
  'Set Account Name',
  'Proposal',
  'Vote',
  'Config ITO',
  'Set ITO',
  'Buy',
  'Sell',
  'Cancel Marketplace Order',
  'Create Marketplace',
  'Config Marketplace',
  'Update Account Permission',
  'Deposit',
  'ITO Trigger',
}

export interface ReducedContract {
  [0]?: number;
  [1]?: number;
  [2]?: number;
  [3]?: number;
  [4]?: number;
  [5]?: number;
  [6]?: number;
  [7]?: number;
  [8]?: number;
  [9]?: number;
  [10]?: number;
  [11]?: number;
  [12]?: number;
  [13]?: number;
  [14]?: number;
  [15]?: number;
  [16]?: number;
  [17]?: number;
  [18]?: number;
  [19]?: number;
  [20]?: number;
  [21]?: number;
  [22]?: number;
  [23]?: number;
  [24]?: number;
}

export interface IContractOption {
  value: string;
  label: string;
}

export interface ITransferContract {
  amount: number;
  toAddress: string;
  assetId?: string;
  precision?: number;
  kdaRoyalties?: number;
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
  itoPercentage: number;
  itoFixed: number;
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
  attributes: IAttributesInfo;
  staking: IStakingInfo;
  roles: IRolesInfo[];
  assetId?: string;
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
  isRoyaltiesChangeStopped: boolean;
}

export interface IStakingInfo {
  type: number;
  apr: number;
  minEpochsToClaim: number;
  minEpochsToUnstake: number;
  minEpochsToWithdraw: number;
}

export interface IKDAPool {
  kda: string; // only appears on transaction return, don't use it when creating tx
  active: boolean;
  adminAddress: string;
  fRatioKLV: number;
  fRatioKDA: number;
}

export interface IRolesInfo {
  address: string;
  hasRoleMint: boolean;
  hasRoleSetITOPrices: boolean;
}

export interface ICreateValidatorContract {
  ownerAddress: string;
  config: IValidatorConfig;
  assetId?: string;
  precision?: number;
}

export interface IValidatorConfigContract {
  config: IValidatorConfig;
  assetId?: string;
  precision?: number;
}

export interface IValidatorConfig {
  blsPublicKey: string;
  rewardAddress: string;
  canDelegate: boolean;
  commission: number;
  maxDelegationAmount: number;
  logo: string;
  uris: IValidatorConfigURI[];
  name: string;
}

export interface IValidatorConfigURI {
  key: string;
  value: string;
}

export interface IURIs {
  key: string;
  value: string;
}

export interface IFreezeContract {
  amount: number;
  assetId: string;
  precision?: number;
}

export interface IUnfreezeContract {
  bucketID: string;
  assetId: string;
  precision?: number;
}

export interface IDelegateContract {
  bucketID: string;
  toAddress: string;
  assetId?: string;
  precision?: number;
}

export interface IUndelegateContract {
  bucketID: string;
  assetId?: string;
  precision?: number;
}

export interface IWithdrawContract {
  assetId: string;
  precision?: number;
  withdrawTypeString?: string;
  withdrawType?: number;
  amount?: number;
  currencyID?: string;
}
export enum EnumClaimType {
  StakingClaim = 0,
  AllowanceClaim = 1,
  MarketClaim = 2,
}
export interface IClaimContract {
  claimType: EnumClaimType;
  id: string;
  assetId?: string;
  precision?: number;
}
export interface IUnjailContract {
  assetId?: string;
  precision?: number;
}

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
  UpdateStaking = 13,
  UpdateRoyalties = 14,
  UpdateKDAFeePool = 15,
  StopRoyaltiesChange = 16,
}

export enum EnumTriggerTypeName {
  Mint = 'Mint',
  Burn = 'Burn',
  Wipe = 'Wipe',
  Pause = 'Pause',
  Resume = 'Resume',
  ChangeOwner = 'ChangeOwner',
  AddRole = 'AddRole',
  RemoveRole = 'RemoveRole',
  UpdateMetadata = 'UpdateMetadata',
  StopNFTMint = 'StopNFTMint',
  UpdateLogo = 'UpdateLogo',
  UpdateURIs = 'UpdateURIs',
  ChangeRoyaltiesReceiver = 'ChangeRoyaltiesReceiver',
  UpdateStaking = 'UpdateStaking',
  UpdateRoyalties = 'UpdateRoyalties',
  UpdateKDAFeePool = 'UpdateKDAFeePool',
  StopRoyaltiesChange = 'StopRoyaltiesChange',
}

export interface IAssetTriggerContract {
  triggerType: EnumTriggerTypeName;
  assetId?: string;
  toAddress: string;
  amount: number;
  mime: string;
  logo: string;
  uris: IURIs[];
  role: IRolesInfo;
  royalties: IRoyaltiesInfo;
  staking?: IStakingInfo;
  kdaPool: IKDAPool;
  precision?: number;
}

export enum ITOTriggerType {
  SetITOPrices = 'SetITOPrices',
  UpdateStatus = 'UpdateStatus',
  UpdateReceiverAddress = 'UpdateReceiverAddress',
  UpdateMaxAmount = 'UpdateMaxAmount',
  UpdateDefaultLimitPerAddress = 'UpdateDefaultLimitPerAddress',
  UpdateTimes = 'UpdateTimes',
  UpdateWhitelistStatus = 'UpdateWhitelistStatus',
  AddToWhitelist = 'AddToWhitelist',
  RemoveFromWhitelist = 'RemoveFromWhitelist',
  UpdateWhitelistTimes = 'UpdateWhitelistTimes',
}

export interface ISetAccountNameContract {
  name: string;
  assetId?: string;
  precision?: number;
}

export interface IProposalParameter {
  [key: string]: string;
}

export interface IProposalContract {
  parameters: IProposalParameter;
  value: string;
  description: string;
  epochsDuration: number;
  assetId?: string;
  precision?: number;
}

export interface IVoteContract {
  proposalId: number;
  amount: number;
  assetId?: string;
  precision?: number;
  type: 'Yes' | 'No';
}

export enum EnumITOStatus {
  DefaultITO = 0,
  ActiveITO = 1,
  PausedITO = 2,
}

export interface IPackItem {
  amount: number;
  price: number;
}
export interface IPackInfo {
  key: string;
  packs: IPackItem[];
}

// deprecated(ISetITOPricesContract)
export interface ISetITOPricesContract {
  assetId: string;
  packInfo: any;
  precision?: number;
}

export interface IConfigITOContract {
  assetId: string;
  receiverAddress: string;
  status: EnumITOStatus;
  maxAmount: number;
  packInfo: IPackInfo[];
  precision?: number;
}

export enum EnumBuyType {
  ITOBuy = 0,
  MarketBuy = 1,
}

export interface IBuyContract {
  type: 17;
  typeString: 'BuyContractType';
  parameter: IBuyContractPayload;
}

export interface IBuyITOsTotalPrices {
  [key: string]: {
    price: number;
    precision: number;
  };
}

export interface IBuyContractPayload {
  buyType: 'MarketBuy' | 'ITOBuy';
  id: string;
  currencyID: string;
  amount: number;
  assetId?: string;
  precision?: number;
}

export interface IITOBuyParameter {
  buyType: 'ITOBuy';
}

export interface IMarketBuyParameter {}

export type IBuyContractParameter = IITOBuyParameter | IMarketBuyParameter;

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
  precision?: number;
}

export interface ICancelMarketOrderContract {
  orderID: string;
  assetId?: string;
  precision?: number;
}

export interface ICreateMarketplaceContract {
  name: string;
  referralAddress: string;
  referralPercentage: number;
  assetId?: string;
  precision?: number;
}

export interface IConfigMarketplaceContract {
  marketplaceID: string;
  name: string;
  referralAddress: string;
  referralPercentage: number;
  assetId?: string;
  precision?: number;
}

export interface IAccKey {
  address: string;
  weight: number;
}

export interface IAccPermission {
  id: number;
  type: number;
  permissionName: string;
  Threshold: number;
  operations: string;
  signers: IAccKey[];
}

export interface IUpdateAccountPermissionContract {
  permissions: IAccPermission[];
}

export interface IDepositContract {
  depositTypeString: string;
  depositType: number;
  id: string;
  amount: number;
  currencyID: string;
}

export interface IWhitelistInfo {
  address: string;
  limit: number;
}

export interface IITOTriggerContract {
  triggerType: ITOTriggerType;
  assetId: string;
  receiverAddress: string;
  status: string;
  maxAmount: number;
  packInfo: IPackInfo[];
  defaultLimitPerAddress: number;
  whitelistStatus: string;
  whitelistInfo: IWhitelistInfo[];
  whitelistStartTime: number;
  whitelistEndTime: number;
  startTime: number;
  endTime: number;
}

export type IParameter =
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
  | IConfigITOContract
  | IBuyContract
  | ISellContract
  | ICancelMarketOrderContract
  | ICreateMarketplaceContract
  | IConfigMarketplaceContract
  | IUpdateAccountPermissionContract
  | IDepositContract
  | IITOTriggerContract;

export type IParameterOnlyAssetId =
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
  | IConfigITOContract
  | ISellContract
  | ICancelMarketOrderContract
  | ICreateMarketplaceContract
  | IConfigMarketplaceContract;

export interface IContract {
  sender: string;
  type: number;
  typeString: Contract;
  parameter: IParameter;
  precision?: number;
  asset?: IAsset;
  receipts?: IReceipt[];
}

export interface IIndexedContract extends IContract {
  contractIndex: number;
  renderMetadata: () => JSX.Element | null;
  filteredReceipts: IReceipt[];
}

export interface IContractBuyProps extends IContract {
  sender: string;
  contractIndex: number;
  filteredReceipts: IReceipt[];
  contracts: IBuyContract[];
  renderMetadata: () => JSX.Element | null;
}

export enum ContractsRecipesTypes {
  Transfer,
  CreateKDA,
  UpdateKDA,
  Freeze,
  Unfreeze,
  Proposal,
  ProposalVote,
  Delegate,
  ConfigITO,
  SetITOPrices,
  CreateMarketplace,
  ConfigMarketplace,
  UpdateValidator,
  UpdateAccountPermission,
  KAppTransfer,
  Sell,
  Buy,
  Claim,
  Withdraw,
  SignedBy,
  UpdateMetadata,
  Deposit,
  UpdateKDAPool,
  UpdateITO,
}
