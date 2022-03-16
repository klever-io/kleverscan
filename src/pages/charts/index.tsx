import React, { useState } from 'react';
import { useRouter } from 'next/router';

import {
  TransactionContainer,
  TransactionChart,
  TransactionChartContent,
} from '@/views/home';

import Chart, { ChartType } from '@/components/Chart';

import { IBlock, IPagination, IResponse } from '../../types';

import { Container, Header, Title, Input, Section } from '@/views/charts';
import { ArrowLeft } from '@/assets/icons';
import { Proposals as Icon } from '@/assets/title-icons';

interface ICard {
  title: string;
  headers: string[];
  values: string[];
}
export interface IChartData {
  date?: number;
  value: number;
}
interface Graph {
  data: IChartData[];
}

const Charts: React.FC<IBlocks> = ({
  blocks: defaultBlocks,
  statistics,
  pagination,
}) => {
  const router = useRouter();
  const precision = 6; // default KLV precision

  const [page, setPage] = useState(0);
  const [blocks, setBlocks] = useState(defaultBlocks);
  const [loading, setLoading] = useState(false);

  const graph1 = [
    { date: 2, value: 8 },
    { date: 4, value: 12 },
    { date: 6, value: 18 },
    { date: 8, value: 12 },
  ];

  const graph2 = [
    { date: 1, value: 7 },
    { date: 3, value: 13 },
    { date: 5, value: 17 },
    { date: 7, value: 21 },
  ];

  return (
    <Container>
      <Header>
        <Title>
          <div onClick={router.back}>
            <ArrowLeft />
          </div>
          <h1>Graphs</h1>
          <Icon />
        </Title>
        <Input />
      </Header>

      <Section>
        <TransactionContainer>
          <TransactionChart>
            <span>Graph 1</span>
            <p>Total staked</p>
            <TransactionChartContent>
              <Chart type={ChartType.Linear} data={graph1} />
            </TransactionChartContent>
          </TransactionChart>

          <TransactionChart>
            <span>Graph 2</span>
            <p>KLV Burned</p>
            <TransactionChartContent>
              <Chart type={ChartType.Linear} data={graph2} />
            </TransactionChartContent>
          </TransactionChart>
        </TransactionContainer>
      </Section>
    </Container>
  );
};

interface IBlockStats {
  total_blocks: number;
  total_burned: number;
  total_block_rewards: number;
}
interface IBlockData {
  yesterday: IBlockStats;
  total: IBlockStats;
}
interface IBlocks {
  blocks: IBlock[];
  statistics: IBlockData;
  pagination: IPagination;
}

interface IBlockResponse extends IResponse {
  data: {
    blocks: IBlock[];
  };
  pagination: IPagination;
}

interface IStatisticsResponse extends IResponse {
  data: {
    block_stats: IBlockStats;
  };
}

export default Charts;
