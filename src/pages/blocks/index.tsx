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
  EffectsContainer,
  ToggleButtonContainer,
  ToggleButton,
  TableHeader,
  UpdateContainer,
} from '@/views/blocks';

import Table, { ITable } from '@/components/Table';
import { Row } from '@/components/Table/styles';

import { IBlock, IPagination, IResponse } from '@/types/index';
import api from '@/services/api';
import {
  formatAmount,
  getAge,
  parseAddress,
  toLocaleFixed,
} from '@/utils/index';

import { ArrowLeft } from '@/assets/icons';
import { Blocks as Icon } from '@/assets/title-icons';
import { PaginationContainer } from '@/components/Pagination/styles';
import Pagination from '@/components/Pagination';
import { useDidUpdateEffect } from '@/utils/hooks';
import {
  storageUpdateBlocks,
  getStorageUpdateConfig,
} from '@/utils/localStorage/localStorageData';

interface IBlockStats {
  totalBlocks: number;
  totalBurned: number;
  totalBlockRewards: number;
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
    block_stats_by_day: IBlockStats;
    block_stats_total: IBlockStats;
  };
}

interface ICard {
  title: string;
  headers: string[];
  values: string[];
}

const Blocks: React.FC<IBlocks> = ({
  blocks: defaultBlocks,
  statistics: defaultStatistics,
  pagination,
}) => {
  const router = useRouter();
  const precision = 6; // default KLV precision
  const blocksWatcherInterval = 4 * 1000; // 4 secs

  const [page, setPage] = useState(0);
  const [blocks, setBlocks] = useState(defaultBlocks);
  const [statistics, setStatistics] = useState(defaultStatistics);
  const [loading, setLoading] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(false);

  const updateBlocks = async () => {
    const newState = storageUpdateBlocks(autoUpdate);
    setAutoUpdate(newState);
    const response: IBlockResponse = await api.get({
      route: `block/list?page=${page}`,
    });
    if (!response.error) {
      setBlocks(response.data.blocks);
    }
  };

  useEffect(() => {
    const updateBlocksConfig = getStorageUpdateConfig();
    setAutoUpdate(updateBlocksConfig);
  }, []);

  useDidUpdateEffect(() => {
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

  useEffect(() => {
    if (autoUpdate) {
      const updateInterval = setInterval(async () => {
        const blockCall = new Promise<IBlockResponse>(
          async (resolve, reject) => {
            const res = await api.get({
              route: `block/list?page=${page}`,
            });

            if (!res.error || res.error === '') {
              resolve(res);
            }
            reject(res.error);
          },
        );

        const yesterdayStatisticsCall = new Promise<IStatisticsResponse>(
          async (resolve, reject) => {
            const res = await api.get({
              route: 'block/statistics-by-day/1',
            });

            if (!res.error || res.error === '') {
              resolve(res);
            }

            reject(res.error);
          },
        );

        const totalStatisticsCall = new Promise<IStatisticsResponse>(
          async (resolve, reject) => {
            const res = await api.get({
              route: 'block/statistics-total/0',
            });

            if (!res.error || res.error === '') {
              resolve(res);
            }

            reject(res.error);
          },
        );

        await Promise.allSettled([
          blockCall,
          yesterdayStatisticsCall,
          totalStatisticsCall,
        ]).then(responses => {
          responses.map((res, index) => {
            if (res.status !== 'rejected') {
              const { value }: any = res;
              switch (index) {
                case 0:
                  setBlocks(value.data.blocks);
                  break;

                case 1:
                  setStatistics({
                    yesterday: value.data.block_stats_by_day[0],
                    total: {
                      totalBlocks: 0,
                      totalBurned: 0,
                      totalBlockRewards: 0,
                    },
                  });
                  break;

                case 2:
                  setStatistics({
                    ...statistics,
                    total: value.data.block_stats_total,
                  });

                default:
                  break;
              }
            }
          });
        });
      }, blocksWatcherInterval);
      return () => clearInterval(updateInterval);
    }
  }, [autoUpdate, page]);

  const cards: ICard[] = [
    {
      title: 'Number of Blocks',
      headers: ['Blocks Yesterday', 'Cumulative Number'],
      values: [
        toLocaleFixed(statistics?.yesterday?.totalBlocks, 0),
        toLocaleFixed(statistics?.total?.totalBlocks, 0),
      ],
    },
    {
      title: 'Block Reward',
      headers: ['Reward Yesterday', 'Cumulative Revenue'],
      values: [
        `${formatAmount(
          (statistics?.yesterday?.totalBlockRewards) / 10 ** precision,
        )} KLV`,
        `${formatAmount(
          (statistics?.total?.totalBlockRewards) / 10 ** precision,
        )} KLV`,
      ],
    },
    {
      title: 'Stats on Burned KLV',
      headers: ['Burned Yesterday', 'Burned in Total'],
      values: [
        `${formatAmount(
          statistics?.yesterday?.totalBurned / 10 ** precision,
        )} KLV`,
        `${formatAmount(statistics?.total?.totalBurned / 10 ** precision)} KLV`,
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
    producerName,
    timestamp,
    txCount,
    txFees,
    kAppFees,
    txBurnedFees,
    blockRewards,
  }) => {
    return (
      <Row type="blocks">
        <span>
          <Link href={`/block/${nonce}`}>{String(nonce)}</Link>
        </span>
        <span>{size.toLocaleString()} Bytes</span>
        <Link href={`/validator/${producerName}`}>{parseAddress(producerName, 14)}</Link>
        <span>
          <small>
            {format(fromUnixTime(timestamp / 1000), 'MM/dd/yyyy HH:mm')}
          </small>
        </span>
        <span>{txCount}</span>
        <span>
          <small>{`${formatAmount(
            (txBurnedFees || 0) / 10 ** precision,
          )} KLV`}</small>
        </span>
        <span>
          <small>{formatAmount((kAppFees || 0) / 10 ** precision)} KLV</small>
        </span>
        <span>
          <small>{formatAmount((txFees || 0) / 10 ** precision)} KLV</small>
        </span>
        <span>
          <strong>
            {formatAmount((blockRewards || 0) / 10 ** precision)} KLV
          </strong>
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
          <div onClick={() => router.push('/')}>
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

      <TableContainer autoUpdate={autoUpdate}>
        <TableHeader>
          <h3>List of blocks</h3>
          <UpdateContainer onClick={() => updateBlocks()}>
            <span>Auto update</span>
            <ToggleButtonContainer autoUpdate={autoUpdate}>
              <ToggleButton autoUpdate={autoUpdate} />
            </ToggleButtonContainer>
          </UpdateContainer>
        </TableHeader>
        <EffectsContainer autoUpdate={autoUpdate}>
          <Table {...tableProps} />
        </EffectsContainer>
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
      yesterday: { totalBlocks: 0, totalBurned: 0, totalBlockRewards: 0 },
      total: { totalBlocks: 0, totalBurned: 0, totalBlockRewards: 0 },
    },
    pagination: {} as IPagination,
  };

  const blockCall = new Promise<IBlockResponse>(async (resolve, reject) => {
    const res = await api.get({
      route: 'block/list',
    });

    if (!res.error || res.error === '') {
      resolve(res);
    }

    reject(res.error);
  });

  const yesterdayStatisticsCall = new Promise<IStatisticsResponse>(
    async (resolve, reject) => {
      const res = await api.get({
        route: 'block/statistics-by-day/1',
      });

      if (!res.error || res.error === '') {
        resolve(res);
      }

      reject(res.error);
    },
  );

  const totalStatisticsCall = new Promise<IStatisticsResponse>(
    async (resolve, reject) => {
      const res = await api.get({
        route: 'block/statistics-total/0',
      });

      if (!res.error || res.error === '') {
        resolve(res);
      }

      reject(res.error);
    },
  );

  await Promise.allSettled([
    blockCall,
    yesterdayStatisticsCall,
    totalStatisticsCall,
  ]).then(responses => {
    responses.map((res, index) => {
      if (res.status !== 'rejected') {
        const { value }: any = res;
        switch (index) {
          case 0:
            props.blocks = value?.data?.blocks;
            props.pagination = value?.pagination;
            break;

          case 1:
            props.statistics = {
              yesterday: value?.data?.block_stats_by_day[0] || null,
              total: {
                totalBlocks: 0,
                totalBurned: 0,
                totalBlockRewards: 0,
              },
            };
            break;

          case 2:
            props.statistics['total'] = value?.data?.block_stats_total;

          default:
            break;
        }
      }
    });
  });

  return { props };
};

export default Blocks;
