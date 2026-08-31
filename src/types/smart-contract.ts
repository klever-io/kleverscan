import { IPagination, IResponse } from '.';
export interface HotContracts {
  name: string;
  address: string;
  ownerAddress: string;
  count: number;
}

/**
 * One redeploy of a contract under the same address. Verified against mainnet
 * `sc/list`: objects, not the transaction hashes three declarations here used
 * to claim. 82 of 100 contracts on one page carry at least one.
 */
export interface ISmartContractUpgrade {
  upgradeTxHash: string;
  upgrader: string;
  timestamp: number;
}

export interface SmartContractsList {
  /** Absent for most contracts: `sc/list` resolves names best-effort. */
  name?: string;
  deployTxHash: string;
  deployer: string;
  timestamp: number;
  upgrades: ISmartContractUpgrade[];
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
  method: string;
  contract?: [
    {
      parameter: {
        type: string;
      };
    },
  ];
}

export interface SmartContractDetailsData {
  name?: string;
  deployer: string;
  deployTxHash: string;
  timestamp: number;
  upgrades?: ISmartContractUpgrade[];
  properties?: {
    payable?: boolean;
    payableBySC?: boolean;
    upgradeable?: boolean;
    readable?: boolean;
  };
  createdAt: number;
}

export interface SmartContractTransactionData {
  blockNum?: number;
  sender?: string;
  nonce?: number;
  timestamp?: number;
  kAppFee?: number;
  bandwidthFee?: number;
  status?: string;
  contract?: Array<{
    parameter?: {
      address?: string;
      type?: string;
    };
  }>;
  price?: number;
  data?: string[];
}

export type ValidationJobStatus =
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed';

export interface ValidationJob {
  id: number;
  contractAddress: string;
  kscVersion: string;
  rustVersion: string;
  // Binaryen/wasm-opt version used for the optimize step. Optional: empty means
  // the validator compares the unoptimized build first, then the default wasm-opt.
  wasmOptVersion?: string;
  status: ValidationJobStatus;
  result: string;
  error: string;
  createdAt: string;
  updatedAt: string;
  // Paid match-check fields. checkOnly marks an ephemeral, payment-gated check;
  // matched is its verdict (null until the check completes).
  checkOnly?: boolean;
  matched?: boolean | null;
  walletAddress?: string;
  fileName?: string;
}

export interface AuditReport {
  id: number;
  txHash: string;
  link: string;
  label: string;
  submittedAt: string;
  updatedAt: string;
}

export interface ContractVersion {
  id: number;
  version: number;
  abi: string;
  byteCodeHash: string;
  transactionHash: string;
  storagePath: string;
  sourceHidden?: boolean;
  contractInfoId: number;
  auditReports?: AuditReport[];
  createdAt: string;
  updatedAt: string;
}

export interface ContractInfo {
  id: number;
  contractAddress: string;
  contractVersions: ContractVersion[];
  createdAt: string;
  updatedAt: string;
  sourceUpToDate?: boolean;
}

export interface ISmartContractResponse extends IResponse {
  pagination: IPagination;
  data: {
    sc: {
      contractAddress: string;
      properties: {
        payable?: boolean;
        payableBySC?: boolean;
        upgradeable?: boolean;
        readable?: boolean;
      };
      upgrades: ISmartContractUpgrade[];
      timestamp: number;
    };
  };
}
