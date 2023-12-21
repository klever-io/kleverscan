import { Blocks as Icon } from '@/assets/title-icons';
import ToggleButton from '@/components/Button/Toggle';
import Title from '@/components/Layout/Title';
import Skeleton from '@/components/Skeleton';
import Table, { ITable } from '@/components/Table';
import {
  blockCall,
  totalStatisticsCall,
  yesterdayStatisticsCall,
} from '@/services/apiCalls';
import { Card, CardContainer, Container, Header } from '@/styles/common';
import { IBlock, IBlocks, ICard } from '@/types/blocks';
import { IRowSection } from '@/types/index';
import {
  formatAmount,
  formatDate,
  toLocaleFixed,
} from '@/utils/formatFunctions';
import {
  getStorageUpdateConfig,
  storageUpdateBlocks,
} from '@/utils/localStorage/localStorageData';
import { parseAddress } from '@/utils/parseValues';
import { getAge } from '@/utils/timeFunctions';
import { TableContainer, TableHeader, UpdateContainer } from '@/views/blocks';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';
import { useQuery } from 'react-query';

interface IBlocksStatsToday {
  totalBlocks: number;
  totalBurned: number;
  totalBlockRewards: number;
}

interface IBlocksStatsYesterday {
  date: number;
  totalBlocks: number;
  totalMinted: number;
  totalBurned: number;
  totalBlockRewards: number;
  totalStakingRewards: number;
  totalTxFees: number;
  totalKappsFees: number;
  totalTxRewards: number;
}

const Blocks: React.FC<IBlocks> = () => {
  const precision = 6; // default KLV precision
  const blocksWatcherInterval = 4 * 1000; // 4 secs
  const [blocksInterval, setBlocksInterval] = useState(0);
  const { data: blocksStatsToday } = useQuery(
    'statisticsCall',
    totalStatisticsCall,
  );
  const { data: blocksStatsYesterday, refetch } = useQuery(
    'yesterdayStatisticsCall',
    yesterdayStatisticsCall,
  );

  const updateBlocks = useCallback(async () => {
    const newState = storageUpdateBlocks(!!blocksInterval);
    if (newState) {
      setBlocksInterval(blocksWatcherInterval);
    } else {
      setBlocksInterval(0);
    }
  }, [blocksInterval]);

  useEffect(() => {
    if (blocksInterval) {
      const intervalId = setInterval(() => {
        refetch();
      }, blocksWatcherInterval);
      return () => clearInterval(intervalId);
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
      headers: ['Blocks 24h', 'Cumulative Number'],
      values: [
        blocksStatsYesterday?.totalBlocks ? (
          toLocaleFixed(blocksStatsYesterday?.totalBlocks, 0)
        ) : (
          <Skeleton />
        ),
        blocksStatsToday?.totalBlocks ? (
          toLocaleFixed(blocksStatsToday?.totalBlocks, 0)
        ) : (
          <Skeleton />
        ),
      ],
    },
    {
      title: 'Block Reward',
      headers: ['Rewards 24h', 'Cumulative Revenue'],
      values: [
        blocksStatsYesterday ? (
          `${formatAmount(
            (blocksStatsYesterday?.totalBlockRewards || 0) / 10 ** precision,
          )} KLV`
        ) : (
          <Skeleton />
        ),
        blocksStatsToday ? (
          `${formatAmount(
            (blocksStatsToday?.totalBlockRewards || 0) / 10 ** precision,
          )} KLV`
        ) : (
          <Skeleton />
        ),
      ],
    },
    {
      title: 'Stats on Burned KLV',
      headers: ['Burned 24h', 'Burned in Total'],
      values: [
        blocksStatsYesterday ? (
          `${formatAmount(
            (blocksStatsYesterday?.totalBurned || 0) / 10 ** precision,
          )} KLV`
        ) : (
          <Skeleton />
        ),
        blocksStatsToday ? (
          `${formatAmount(
            (blocksStatsToday?.totalBurned || 0) / 10 ** precision,
          )} KLV`
        ) : (
          <Skeleton />
        ),
      ],
    },
  ];

  const CardContent: React.FC<ICard> = ({ title, headers, values }) => {
    const [uptime] = useState(new Date().getTime());
    const [age, setAge] = useState(getAge(new Date()));

    useEffect(() => {
      const interval = setInterval(() => {
        const newAge = getAge(new Date(uptime));

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

  const rowSections = (block: IBlock): IRowSection[] => {
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
      {
        element: (
          <Link href={`/block/${nonce}`} key={nonce}>
            {String(nonce)}
          </Link>
        ),
        span: 1,
      },
      {
        element: (
          <React.Fragment key={size}>
            {size.toLocaleString()} Bytes
          </React.Fragment>
        ),
        span: 1,
      },
      {
        element: (
          <Link
            href={`/validator/${producerOwnerAddress}`}
            key={producerOwnerAddress}
          >
            {parseAddress(producerName, 20)}
          </Link>
        ),
        span: 1,
      },
      {
        element: <span key={timestamp}>{formatDate(timestamp)}</span>,
        span: 1,
      },
      {
        element: <React.Fragment key={txCount}>{txCount}</React.Fragment>,
        span: 1,
      },
      {
        element: (
          <span key={txBurnedFees}>{`${formatAmount(
            (txBurnedFees || 0) / 10 ** precision,
          )} KLV`}</span>
        ),
        span: 1,
      },
      {
        element: (
          <span key={kAppFees}>
            {formatAmount((kAppFees || 0) / 10 ** precision)} KLV
          </span>
        ),
        span: 1,
      },
      {
        element: (
          <span key={txFees}>
            {formatAmount(((txFees || 0) * 0.5) / 10 ** precision)} KLV
          </span>
        ),
        span: 1,
      },
      {
        element: (
          <span key={blockRewards}>
            {formatAmount((blockRewards || 0) / 10 ** precision)} KLV
          </span>
        ),
        span: 1,
      },
    ];

    return sections;
  };

  const tableProps: ITable = {
    type: 'blocks',
    header,
    rowSections,
    scrollUp: true,
    dataName: 'blocks',
    request: (page: number, limit: number) => blockCall(page, limit),
    interval: blocksInterval,
    intervalController: setBlocksInterval,
  };

  return (
    <Container>
      <Header>
        <Title title="Blocks" Icon={Icon} />
      </Header>

      <CardContainer>
        {cards.map((card, index) => (
          <CardContent key={index} {...card} />
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

        <Table {...tableProps} />
      </TableContainer>
    </Container>
  );
};

export default Blocks;
