import { Blocks as Icon } from '@/assets/title-icons';
import ToggleButton from '@/components/Button/Toggle';
import Title from '@/components/Layout/Title';
import Table, { ITable } from '@/components/Table';
import api from '@/services/api';
import {
  blockCall,
  totalStatisticsCall,
  yesterdayStatisticsCall,
} from '@/services/apiCalls';
import { IBlock, IBlockResponse, IBlocks, ICard } from '@/types/blocks';
import { IPagination } from '@/types/index';
import {
  formatAmount,
  getAge,
  parseAddress,
  toLocaleFixed,
} from '@/utils/index';
import {
  getStorageUpdateConfig,
  storageUpdateBlocks,
} from '@/utils/localStorage/localStorageData';
import {
  Card,
  CardContainer,
  Container,
  EffectsContainer,
  Header,
  Input,
  TableContainer,
  TableHeader,
  UpdateContainer,
} from '@/views/blocks';
import { format, fromUnixTime } from 'date-fns';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';

const Blocks: React.FC<IBlocks> = ({
  blocks: defaultBlocks,
  statistics: defaultStatistics,
  pagination,
}) => {
  const precision = 6; // default KLV precision
  const blocksWatcherInterval = 4 * 1000; // 4 secs

  const [blocks, setBlocks] = useState(defaultBlocks);
  const [statistics, setStatistics] = useState(defaultStatistics);
  const [blocksInterval, setBlocksInterval] = useState(blocksWatcherInterval);

  const requestBlocks = async (page: number) => {
    let response = { data: { blocks } };
    const blockCall = new Promise<IBlockResponse>(async (resolve, reject) => {
      const res = await api.get({
        route: `block/list?page=${page}`,
      });

      if (!res.error || res.error === '') {
        resolve(res);
      }
      reject(res.error);
    });

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
              response = value;
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
    return response;
  };

  const updateBlocks = useCallback(async () => {
    const newState = storageUpdateBlocks(!!blocksInterval);
    if (newState) {
      setBlocksInterval(blocksWatcherInterval);
    } else {
      setBlocksInterval(0);
    }
  }, [blocksInterval]);

  useEffect(() => {
    const updateBlocksConfig = getStorageUpdateConfig();
    if (updateBlocksConfig) {
      setBlocksInterval(blocksWatcherInterval);
    } else {
      setBlocksInterval(0);
    }
  }, []);

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
          statistics?.yesterday?.totalBlockRewards / 10 ** precision,
        )} KLV`,
        `${formatAmount(
          statistics?.total?.totalBlockRewards / 10 ** precision,
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

  const rowSections = (block: IBlock): JSX.Element[] => {
    const {
      nonce,
      size,
      producerName,
      producerOwnerAddress,
      timestamp,
      txCount,
      txFees,
      kAppFees,
      txBurnedFees,
      blockRewards,
    } = block;

    const sections = [
      <Link href={`/block/${nonce}`} key={nonce}>
        {String(nonce)}
      </Link>,
      <React.Fragment key={size}>{size.toLocaleString()} Bytes</React.Fragment>,
      <Link
        href={`/validator/${producerOwnerAddress}`}
        key={producerOwnerAddress}
      >
        {parseAddress(producerName, 12)}
      </Link>,
      <small key={timestamp}>
        {format(fromUnixTime(timestamp / 1000), 'MM/dd/yyyy HH:mm')}
      </small>,
      <React.Fragment key={txCount}>{txCount}</React.Fragment>,
      <small key={txBurnedFees}>{`${formatAmount(
        (txBurnedFees || 0) / 10 ** precision,
      )} KLV`}</small>,
      <small key={kAppFees}>
        {formatAmount((kAppFees || 0) / 10 ** precision)} KLV
      </small>,
      <small key={txFees}>
        {formatAmount((txFees || 0) / 10 ** precision)} KLV
      </small>,
      <strong key={blockRewards}>
        {formatAmount((blockRewards || 0) / 10 ** precision)} KLV
      </strong>,
    ];

    return sections;
  };

  const tableProps: ITable = {
    type: 'blocks',
    header,
    data: blocks as any[],
    rowSections,
    scrollUp: true,
    totalPages: pagination.totalPages,
    dataName: 'blocks',
    request: (page: number) => requestBlocks(page),
    interval: blocksInterval,
    intervalController: setBlocksInterval,
  };

  return (
    <Container>
      <Header>
        <Title title="Blocks" Icon={Icon} />

        <Input />
      </Header>

      <CardContainer>
        {cards.map((card, index) => (
          <CardContent key={String(index)} {...card} />
        ))}
      </CardContainer>

      <TableContainer autoUpdate={!!blocksInterval}>
        <TableHeader>
          <h3>List of blocks</h3>
          <UpdateContainer onClick={() => updateBlocks()}>
            <span>Auto update</span>
            <ToggleButton active={!!blocksInterval} />
          </UpdateContainer>
        </TableHeader>
        <EffectsContainer autoUpdate={!!blocksInterval}>
          <Table {...tableProps} />
        </EffectsContainer>
      </TableContainer>
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
