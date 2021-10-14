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

export { infoChartData, defaultEquivalentCoin };
