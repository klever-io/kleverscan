import React, { useEffect, useState } from 'react';

import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { format, fromUnixTime } from 'date-fns';

import {
  Card,
  CardContainer,
  Container,
  Header,
  Input,
  TableContainer,
  Title,
} from '@/views/blocks';

import Table, { ITable } from '@/components/Table';
import { Row } from '@/components/Table/styles';

import { IBlock, IPagination, IResponse } from '@/types/index';
import api from '@/services/api';
import { formatAmount, getAge, toLocaleFixed } from '@/utils/index';

import { ArrowLeft } from '@/assets/icons';
import { Blocks as Icon } from '@/assets/title-icons';
import { PaginationContainer } from '@/components/Pagination/styles';
import Pagination from '@/components/Pagination';

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

interface ICard {
  title: string;
  headers: string[];
  values: string[];
}

const Blocks: React.FC<IBlocks> = ({
  blocks: defaultBlocks,
  statistics,
  pagination,
}) => {
  const router = useRouter();
  const precision = 6; // default KLV precision

  const [page, setPage] = useState(0);
  const [blocks, setBlocks] = useState(defaultBlocks);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const response: IBlockResponse = await api.get({
        route: `block/list?page=${page}`,
      });
      if (!response.error) {
        setBlocks(response.data.blocks);
      }

      setLoading(false);
    };

    fetchData();
  }, [page]);

  const cards: ICard[] = [
    {
      title: 'Number of Blocks',
      headers: ['Blocks Yesterday', 'Cumulative Number'],
      values: [
        toLocaleFixed(statistics.yesterday.total_blocks, 0),
        toLocaleFixed(statistics.total.total_blocks, 0),
      ],
    },
    {
      title: 'Block Reward',
      headers: ['Reward Yesterday', 'Cumulative Revenue'],
      values: [
        `${formatAmount(
          statistics.yesterday.total_block_rewards / 10 ** precision,
        )} KLV`,
        `${formatAmount(
          statistics.total.total_block_rewards / 10 ** precision,
        )} KLV`,
      ],
    },
    {
      title: 'Stats on Burned KLV',
      headers: ['Burned Yesterday', 'Burned in Total'],
      values: [
        `${formatAmount(
          statistics.yesterday.total_burned / 10 ** precision,
        )} KLV`,
        `${formatAmount(statistics.total.total_burned / 10 ** precision)} KLV`,
      ],
    },
  ];

  const CardContent: React.FC<ICard> = ({ title, headers, values }) => {
    const [uptime] = useState(new Date().getTime());
    const [age, setAge] = useState(
      getAge(fromUnixTime(new Date().getTime() / 1000)),
    );

    useEffect(() => {
      const interval = setInterval(() => {
        const newAge = getAge(fromUnixTime(uptime / 1000));

        setAge(newAge);
      }, 1 * 1000); // 1 sec

      return () => {
        clearInterval(interval);
      };
    }, []);

    return (
      <Card>
        <div>
          <span>
            <strong>{title}</strong>
          </span>
          <p>{age} ago</p>
        </div>
        <div>
          <span>
            <small>{headers[0]}</small>
          </span>
          <span>
            <small>{headers[1]}</small>
          </span>
        </div>
        <div>
          <span>{values[0]}</span>
          <span>{values[1]}</span>
        </div>
      </Card>
    );
  };

  const header = [
    'Block',
    'Block size',
    'Produced by',
    'Created',
    'Tx Count',
    'Burned Fees',
    'kApp Fees',
    'Fee Rewards',
    'Block Rewards',
  ];

  const TableBody: React.FC<IBlock> = ({
    nonce,
    size,
    timestamp,
    txCount,
    txFees,
    kAppFees,
    burnedFees,
    blockRewards,
  }) => {
    return (
      <Row type="blocks">
        <span>
          <Link href={`/block/${nonce}`}>{String(nonce)}</Link>
        </span>
        <span>{size.toLocaleString()} Bytes</span>
        <span>Klever.io</span>
        <span>
          <small>
            {format(fromUnixTime(timestamp / 1000), 'MM/dd/yyyy HH:mm')}
          </small>
        </span>
        <span>{txCount}</span>
        <span>
          <small>{`${formatAmount(
            (burnedFees || 0) / 10 ** precision,
          )} KLV`}</small>
        </span>
        <span>
          <small>{formatAmount((kAppFees || 0) / 10 ** precision)} KLV</small>
        </span>
        <span>
          <small>{formatAmount((txFees || 0) / 10 ** precision)} KLV</small>
        </span>
        <span>
          <strong>{formatAmount(blockRewards / 10 ** precision)} KLV</strong>
        </span>
      </Row>
    );
  };

  const tableProps: ITable = {
    type: 'blocks',
    header,
    data: blocks as any[],
    body: TableBody,
    loading,
  };

  return (
    <Container>
      <Header>
        <Title>
          <div onClick={router.back}>
            <ArrowLeft />
          </div>
          <h1>Blocks</h1>
          <Icon />
        </Title>

        <Input />
      </Header>

      <CardContainer>
        {cards.map((card, index) => (
          <CardContent key={String(index)} {...card} />
        ))}
      </CardContainer>

      <TableContainer>
        <h3>List of blocks</h3>
        <Table {...tableProps} />
      </TableContainer>

      <PaginationContainer>
        <Pagination
          count={pagination.totalPages}
          page={page}
          onPaginate={page => {
            setPage(page);
          }}
        />
      </PaginationContainer>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps<IBlocks> = async () => {
  const props: IBlocks = {
    blocks: [],
    statistics: {
      yesterday: { total_blocks: 0, total_burned: 0, total_block_rewards: 0 },
      total: { total_blocks: 0, total_burned: 0, total_block_rewards: 0 },
    },
    pagination: {} as IPagination,
  };

  const blockCall = new Promise<IBlockResponse>(resolve =>
    resolve(
      api.get({
        route: 'block/list',
      }),
    ),
  );

  const yesterdayStatisticsCall = new Promise<IStatisticsResponse>(resolve =>
    resolve(
      api.get({
        route: 'block/statistics/1',
      }),
    ),
  );
  const totalStatisticsCall = new Promise<IStatisticsResponse>(resolve =>
    resolve(
      api.get({
        route: 'block/statistics/0',
      }),
    ),
  );

  const [block, yesterdayStatistics, totalStatistics] = await Promise.all([
    blockCall,
    yesterdayStatisticsCall,
    totalStatisticsCall,
  ]);

  if (!block.error) {
    props.blocks = block.data.blocks;
    props.pagination = block.pagination;
  }

  if (!yesterdayStatistics.error && !totalStatistics.error) {
    props.statistics = {
      yesterday: yesterdayStatistics.data.block_stats,
      total: totalStatistics.data.block_stats,
    };
  }

  return { props };
};

export default Blocks;
