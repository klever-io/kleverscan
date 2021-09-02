export interface IChartData {
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

const defaultEquivalentCoin = 'USD';

export { infoChartData, defaultEquivalentCoin };
