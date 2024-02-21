import { ContractsName } from '../types/contracts';
import { isBeta } from './navbar';

const coins: string[] = ['KLV', 'KFI'];

const status: string[] = ['Success', 'Pending', 'Fail'];

const contracts = Object.values(ContractsName)
  .map(contract => contract)
  .filter(contract => isBeta || contract !== 'Smart Contract');

const buyType: string[] = ['MarketBuy', 'ITOBuy'];

export { coins, status, contracts, buyType };
