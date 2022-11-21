import { ContractsName } from '../types/contracts';

const coins: string[] = ['KLV', 'KFI'];

const status: string[] = ['Success', 'Pending', 'Fail'];

const contracts = Object.values(ContractsName).map(contract => contract);

export { coins, status, contracts };
