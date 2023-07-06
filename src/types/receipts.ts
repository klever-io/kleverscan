export interface ITransferReceipt {
  assetId: string;
  cID: number;
  from: string;
  to: string;
  type: 0;
  typeString: string;
  value: number;
}

export interface IKAppTransferReceipt {
  assetId: string;
  cID: number;
  from: string;
  marketplaceId: string;
  orderId: string;
  to: string;
  type: 14;
  value: number;
}

export interface IMarketBuyReceipt {
  marketplaceId: string;
  orderId: string;
  type: 16;
}

export interface ISignedByReceipt {
  signer: string;
  type: 19;
  weight: string;
}

export type BuyReceiptData = IKAppTransferReceipt | ITransferReceipt | null;
