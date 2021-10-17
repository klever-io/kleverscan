import { BottomRow, TopRow } from '../views/home';

export interface IChartData {
  value: number;
}

interface IStats {
  Side: React.FC;
  name: string;
  value: number | string;
  haveCoin: boolean;
}

const infoChartData: IChartData[] = [
  { value: 3000 },
  { value: 4000 },
  { value: 2000 },
  { value: 2780 },
  { value: 1890 },
  { value: 2390 },
  { value: 1390 },
  { value: 3490 },
];

const transactionHistory: IChartData[] = [
  { value: 1000 },
  { value: 1235 },
  { value: 1699 },
  { value: 2400 },
  { value: 2800 },
  { value: 3321 },
  { value: 3700 },
  { value: 4124 },
];

const accountGrowth: IChartData[] = [
  // { value: 0 },
  { value: 1000 },
  { value: 1235 },
  { value: 1599 },
  { value: 2200 },
  { value: 2500 },
  { value: 3021 },
  { value: 3500 },
  { value: 3999 },
];

export const statsData: IStats[] = [
  {
    Side: TopRow,
    name: 'KLV Price',
    value: (0.0).toFixed(4),
    haveCoin: true,
  },
  {
    Side: TopRow,
    name: 'Market Cap',
    value: 0,
    haveCoin: true,
  },
  {
    Side: BottomRow,
    name: 'Transactions Last Day',
    value: 0,
    haveCoin: false,
  },
  {
    Side: BottomRow,
    name: 'Total Accounts',
    value: 0,
    haveCoin: false,
  },
];

const defaultEquivalentCoin = 'USD';

export {
  transactionHistory,
  accountGrowth,
  infoChartData,
  defaultEquivalentCoin,
};
