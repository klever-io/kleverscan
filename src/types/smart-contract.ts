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
