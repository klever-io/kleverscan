import { IAsset, IPaginatedResponse, IPagination } from '.';

export interface IMarketplacePage {
  marketplace: IMarketplace;
  pagination: IPagination;
}

export interface IMarketplaceAsset {
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
  buckets: [];
  marketplaceId: string;
  orderId: string;
  stakingType: number;
  sell: {
    orderId: string;
    marketType: string;
    marketplaceId: string;
    collectionId: string;
    assetId: string;
    currencyId: string;
    price: number;
    reservePrice: number;
    currentBidder: string;
    currentBid: number;
    currentBuyOrderTxHash: string;
    endTime: number;
    status: string;
    buyOrders: null;
    orderTxHash: string;
    ownerAddress: string;
  };
}

export interface IMarketplaceAssets {
  [key: string]: IMarketplaceAsset;
}

export interface IMarketplace {
  id: string;
  name: string;
  ownerAddress: string;
  referralAddress: string;
  referralPercentage: number;
  assets: null | IMarketplaceAssets;
}

export interface IMarketplaceResponse extends IPaginatedResponse {
  data: {
    assets: IMarketplace;
  };
  pagination: IPagination;
}

export interface IMarketplacesResponse extends IPaginatedResponse {
  data: {
    marketplaces: IMarketplace[];
  };
  pagination: IPagination;
}

export interface IBuyCardResponse {
  marketplaceResponse: IMarketplaceResponse;
  assets: IAsset[];
}
