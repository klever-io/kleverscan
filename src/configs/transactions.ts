import { IFilterItem } from '@/components/Filter';
import { Contract } from '../types';

const coins: IFilterItem[] = [
  { name: 'KLV', value: 'klv' },
  { name: 'KFI', value: 'kfi' },
];

const status: IFilterItem[] = [
  { name: 'Success', value: 'success' },
  { name: 'Pending', value: 'pending' },
  { name: 'Fail', value: 'fail' },
];

const contracts = Object.values(Contract).map((contract, index) => ({
  name: contract,
  value: String(index),
}));

export { coins, status, contracts };
