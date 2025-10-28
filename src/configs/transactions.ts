import { ContractsName } from '../types/contracts';

const coins: string[] = ['KLV', 'KFI'];

const status: string[] = ['Success', 'Fail'];

const contracts = Object.values(ContractsName).map(contract => contract);

const buyType: string[] = ['MarketBuy', 'ITOBuy'];

export { coins, status, contracts, buyType };
