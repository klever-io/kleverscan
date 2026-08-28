import { PropsWithChildren } from 'react';
import { Blocks as Icon } from '@/assets/title-icons';
import BlocksSummary from '@/components/BlocksList/Summary';
import ToggleButton from '@/components/Button/Toggle';
import Title from '@/components/Layout/Title';
import Table, { ITable } from '@/components/Table';
import { blockListCall } from '@/services/requests/block';
import { Container, DoubleRow, Header } from '@/styles/common';
import { IBlock } from '@/types/blocks';
import { IRowSection } from '@/types/index';
import { formatAmount, formatDate } from '@/utils/formatFunctions';
import { KLV_PRECISION } from '@/utils/globalVariables';
import {
  getStorageUpdateConfig,
  storageUpdateBlocks,
} from '@/utils/localStorage/localStorageData';
import { parseAddress } from '@/utils/parseValues';
import { TableContainer, TableHeader, UpdateContainer } from '@/views/blocks';
import ExplorerLink from '@/components/ExplorerLink';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import nextI18nextConfig from '../../../next-i18next.config';

const blocksHeader = [
  'Block/ Epoch',
  'Size/Transactions',
  'Produced by/ Created At',
  'kApp Fees/Burned Fees',
  'Fee Rewards/Block Rewards',
];

const blocksRowSections = (block: IBlock): IRowSection[] => {
  const {
    nonce,
    size,
    epoch,
    producerName,
    producerOwnerAddress,
    timestamp,
    txCount,
    txFees,
    kAppFees,
    txBurnedFees,
    blockRewards,
  } = block;

  const sections: IRowSection[] = [
    {
      element: props => (
        <DoubleRow {...props} key={nonce + epoch}>
          <ExplorerLink type="block" value={String(nonce)} compact />
          <span>{epoch}</span>
        </DoubleRow>
      ),
      span: 1,
    },
    {
      element: props => (
        <DoubleRow {...props} key={txCount + size}>
          <span>{size} Bytes</span>
          <span>
            {txCount} TX{txCount > 1 ? 's' : ''}
          </span>
        </DoubleRow>
      ),
      span: 1,
    },
    {
      element: props => (
        <DoubleRow {...props} key={producerOwnerAddress + timestamp}>
          <ExplorerLink
            type="validator"
            value={producerOwnerAddress}
            label={parseAddress(producerName, 16)}
            compact
          />
          <span key={timestamp}>{formatDate(timestamp)}</span>
        </DoubleRow>
      ),
      span: 1,
    },
    {
      element: props => (
        <DoubleRow {...props} key={String(kAppFees) + String(txBurnedFees)}>
          <span>{formatAmount((kAppFees || 0) / 10 ** KLV_PRECISION)} KLV</span>
          <span>{`${formatAmount(
            (txBurnedFees || 0) / 10 ** KLV_PRECISION,
          )} KLV`}</span>
        </DoubleRow>
      ),
      span: 1,
    },
    {
      element: props => (
        <DoubleRow {...props} key={String(txFees) + String(blockRewards)}>
          <span>
            {formatAmount(((txFees || 0) * 0.5) / 10 ** KLV_PRECISION)} KLV
          </span>
          <span>
            {formatAmount((blockRewards || 0) / 10 ** KLV_PRECISION)} KLV
          </span>
        </DoubleRow>
      ),
      span: 1,
    },
  ];

  return sections;
};

const Blocks: React.FC<PropsWithChildren> = () => {
  const router = useRouter();
  const blocksWatcherInterval = 4 * 1000; // 4 secs
  const [blocksInterval, setBlocksInterval] = useState(0);

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

  const tableProps: ITable = {
    type: 'blocks',
    header: blocksHeader,
    rowSections: blocksRowSections,
    dataName: 'blocks',
    request: (page: number, limit: number) =>
      blockListCall(page, limit, router.query),
    interval: blocksInterval,
    intervalController: setBlocksInterval,
  };

  return (
    <Container>
      <Header>
        <Title title="Blocks" Icon={Icon} />
      </Header>

      <BlocksSummary />

      <TableContainer autoUpdate={!!blocksInterval}>
        <TableHeader>
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

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => {
  const props = await serverSideTranslations(
    locale,
    ['common', 'blocks', 'table'],
    nextI18nextConfig,
    ['en'],
  );

  return { props };
};

export default Blocks;
