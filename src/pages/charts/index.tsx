import React from 'react';
import { useRouter } from 'next/router';

import {
  TransactionContainer,
  TransactionChart,
  TransactionChartContent,
} from '@/views/home';

import Chart, { ChartType } from '@/components/Chart';

import { IResponse } from '../../types';

import { Container, Header, Title, Input, Section } from '@/views/charts';
import { ArrowLeft } from '@/assets/icons';
import { Assets as Icon } from '@/assets/title-icons';
import { GetServerSideProps } from 'next';
import api from '@/services/api';
import { format } from 'date-fns';

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
}

interface IBlockStats {
  date: string;
  burned: number;
  minted: number;
  value: number;
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
        <Title>
          <div onClick={router.back}>
            <ArrowLeft />
          </div>
          <h1>Charts</h1>
          <Icon />
        </Title>
        <Input />
      </Header>

      <Section>
        <TransactionContainer>
          <TransactionChart>
            <span>Total KLV Burned vs Minted</span>
            <TransactionChartContent>
              <Chart
                type={ChartType.DoubleLinear}
                data={statistics}
                value="burned"
                value2="minted"
              />
              x
            </TransactionChartContent>
          </TransactionChart>

          <TransactionChart>
            <span>Block Rewards</span>
            <TransactionChartContent>
              <Chart type={ChartType.Linear} data={statistics} />
            </TransactionChartContent>
          </TransactionChart>
        </TransactionContainer>
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
          value: stats.totalBlockRewards / 1000000,
        };
      });
  }

  return { props };
};

export default Charts;
