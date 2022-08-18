import { IFilterItem } from '@/components/Filter';
import { ContractsName } from '../types';

const coins: IFilterItem[] = [
  { name: 'KLV', value: 'klv' },
  { name: 'KFI', value: 'kfi' },
];

const status: IFilterItem[] = [
  { name: 'Success', value: 'success' },
  { name: 'Pending', value: 'pending' },
  { name: 'Fail', value: 'fail' },
];

const contracts = Object.values(ContractsName).map((contract, index) => ({
  name: contract,
  value: String(index),
}));

export { coins, status, contracts };
