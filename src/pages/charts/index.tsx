import { Assets as Icon } from '@/assets/title-icons';
import Chart, { ChartType } from '@/components/Chart';
import Title from '@/components/Layout/Title';
import api from '@/services/api';
import { Container, Header, Input, Section } from '@/views/charts';
import {
  ChartsContainer,
  TransactionChart,
  TransactionChartContent,
} from '@/views/home';
import { format } from 'date-fns';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { IResponse } from '../../types';

export interface IChartData {
  date?: number;
  value: number;
}

interface IBlockStatsResponse {
  date: number;
  totalBlocks: number;
  totalBurned: number;
  totalMinted: number;
  totalBlockRewards: number;
  totalTxRewards: number;
  totalStakingRewards: number;
  totalKappsFees: number;
}

interface IBlockStats {
  date: string;
  burned: number;
  minted: number;
  blocks: number;
  transactions: number;
  KLV: number;
  KFI: number;
}
interface ICharts {
  statistics: IBlockStats[];
}

interface IStatisticsResponse extends IResponse {
  data: {
    block_stats_by_day: IBlockStatsResponse[];
  };
}

const Charts: React.FC<ICharts> = ({ statistics }) => {
  const router = useRouter();

  return (
    <Container>
      <Header>
        <Title title="Charts" Icon={Icon} />

        <Input />
      </Header>

      <Section>
        <ChartsContainer>
          <TransactionChart>
            <span>Total KLV Burned vs Minted</span>
            <TransactionChartContent>
              <Chart
                type={ChartType.DoubleLinear}
                data={statistics}
                value="burned"
                value2="minted"
              />
            </TransactionChartContent>
          </TransactionChart>

          <TransactionChart>
            <span>Blocks Rewards vs Transactions Rewards</span>
            <TransactionChartContent>
              <Chart
                type={ChartType.DoubleLinear}
                data={statistics}
                value="blocks"
                value2="transactions"
              />
            </TransactionChartContent>
          </TransactionChart>

          <TransactionChart>
            <span>KLV Rewards Pool vs KFI Rewards Pool</span>
            <TransactionChartContent>
              <Chart
                type={ChartType.DoubleLinear}
                data={statistics}
                value="KFI"
                value2="KLV"
              />
            </TransactionChartContent>
          </TransactionChart>
        </ChartsContainer>
      </Section>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps<ICharts> = async () => {
  const props: ICharts = {
    statistics: [] as IBlockStats[],
  };

  const statistics: IStatisticsResponse = await api.get({
    route: 'block/statistics-by-day/15',
  });
  if (!statistics.error) {
    props.statistics = statistics.data.block_stats_by_day
      .reverse()
      .map(stats => {
        return {
          date: format(stats.date, 'dd MMM'),
          burned: stats.totalBurned / 1000000,
          minted: stats.totalMinted / 1000000,
          blocks: stats.totalBlockRewards / 1000000,
          transactions: stats.totalTxRewards / 1000000,
          KFI: stats.totalKappsFees / 1000000,
          KLV: stats.totalStakingRewards / 1000000,
        };
      });
  }
  return { props };
};

export default Charts;
