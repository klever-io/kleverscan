import { ContractsName } from '../types/contracts';

export const isBeta =
  process.env.DEFAULT_NODE_HOST?.includes('devnet') ||
  process.env.DEFAULT_NODE_HOST?.includes('testnet') ||
  process.env.DEFAULT_IS_BETA;

const coins: string[] = ['KLV', 'KFI'];

const status: string[] = ['Success', 'Fail'];

const contracts = Object.values(ContractsName)
  .map(contract => contract)
  .filter(contract => isBeta || contract !== 'Smart Contract');

const buyType: string[] = ['MarketBuy', 'ITOBuy'];

export { coins, status, contracts, buyType };
