interface IParameter {
  amount: number;
  ownerAddress: string;
  toAddress: string;
}

interface IContract {
  type: number;
  parameter: IParameter;
}

export interface ITransaction {
  blockNum: number;
  sender: string;
  expiration: number;
  timeStamp: number;
  fee: number;
  bandwidthFeeLimit: number;
  chainID: string;
  signature: string;
  searchOrder: number;
  contract: IContract[];
}

export interface IBlock {
  nonce: number;
  parentHash: string;
  timeStamp: number;
  transactions: Array<any>;
  sizeTxs: number;
}

interface IError {
  message: string;
}

export interface IResponse {
  data: any;
  code: string;
  error: IError;
}
