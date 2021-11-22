import { sub } from 'date-fns';

export interface IChartData {
  date?: number;
  value: number;
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

const coinMockedData: IChartData[] = [
  { value: 10 },
  { value: 9 },
  { value: 12 },
  { value: 10 },
  { value: 12 },
  { value: 15 },
  { value: 16 },
  { value: 20 },
  { value: 18 },
  { value: 20 },
  { value: 21 },
  { value: 21 },
  { value: 25 },
  { value: 21 },
  { value: 28 },
  { value: 30 },
  { value: 32 },
  { value: 29 },
  { value: 30 },
  { value: 32 },
  { value: 35 },
  { value: 34 },
  { value: 37 },
  { value: 38 },
  { value: 43 },
];

const transactionMockedData: IChartData[] = [
  {
    date: sub(new Date(), { days: 15 }).getTime(),
    value: 6,
  },
  {
    date: sub(new Date(), { days: 14 }).getTime(),
    value: 10,
  },
  {
    date: sub(new Date(), { days: 13 }).getTime(),
    value: 3,
  },
  {
    date: sub(new Date(), { days: 12 }).getTime(),
    value: 2,
  },
  {
    date: sub(new Date(), { days: 11 }).getTime(),
    value: 4,
  },
  {
    date: sub(new Date(), { days: 10 }).getTime(),
    value: 3,
  },
  {
    date: sub(new Date(), { days: 9 }).getTime(),
    value: 5,
  },
  {
    date: sub(new Date(), { days: 8 }).getTime(),
    value: 6,
  },
  {
    date: sub(new Date(), { days: 7 }).getTime(),
    value: 7,
  },
  {
    date: sub(new Date(), { days: 6 }).getTime(),
    value: 9,
  },
  {
    date: sub(new Date(), { days: 5 }).getTime(),
    value: 8,
  },
  {
    date: sub(new Date(), { days: 4 }).getTime(),
    value: 7.5,
  },
  {
    date: sub(new Date(), { days: 3 }).getTime(),
    value: 6.1,
  },
  {
    date: sub(new Date(), { days: 2 }).getTime(),
    value: 4.9,
  },
  {
    date: sub(new Date(), { days: 1 }).getTime(),
    value: 3.13,
  },
  { date: new Date().getTime(), value: 5 },
];

const defaultEquivalentCoin = 'USD';

export {
  transactionHistory,
  accountGrowth,
  infoChartData,
  defaultEquivalentCoin,
  coinMockedData,
  transactionMockedData,
};
