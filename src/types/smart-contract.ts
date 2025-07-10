export interface HotContracts {
  name: string;
  address: string;
  ownerAddress: string;
  count: number;
}

export interface SmartContractsList {
  name: string;
  deployTxHash: string;
  deployer: string;
  timestamp: number;
  upgrades: string[];
  totalTransactions: number;
  contractAddress: string;
}

export interface InvokesList {
  hash: string;
  blockNumber: number;
  sender: string;
  nonce: number;
  timestamp: number;
  kAppFee: number;
  bandwidthFee: number;
  status: string;
  resultCode: string;
  version: number;
  chainID: string;
  signature: string[] | [];
  searchOrder: number;
}
