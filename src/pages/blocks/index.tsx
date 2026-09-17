import { Blocks as Icon } from '@/assets/title-icons';
import AutoUpdate from '@/components/BlocksList/AutoUpdate';
import BlocksFilters from '@/components/BlocksList/Filters';
import {
  RIGHT_ALIGNED_COLUMNS,
  BLOCK_COLUMNS,
} from '@/components/BlocksList/columns';
import BlocksMobileCard from '@/components/BlocksList/MobileCard';
import { blockRowSections } from '@/components/BlocksList/rows';
import { BlocksTableWrapper } from '@/components/BlocksList/styles';
import BlocksSummary from '@/components/BlocksList/Summary';
import { useColumnHeaders } from '@/components/DataList/useColumnHeaders';
import Title from '@/components/Layout/Title';
import Table, { ITable } from '@/components/Table';
import { blockListCall } from '@/services/requests/block';
import { Container, Header } from '@/styles/common';
import {
  getStorageUpdateConfig,
  storageUpdateBlocks,
} from '@/utils/localStorage/localStorageData';
import { normalizePageParam } from '@/utils/table';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import nextI18nextConfig from '../../../next-i18next.config';

/** How often the list refetches while auto update is on. */
const AUTO_UPDATE_INTERVAL = 4 * 1000;

const Blocks: React.FC<PropsWithChildren> = () => {
  const router = useRouter();
  const header = useColumnHeaders(BLOCK_COLUMNS);
  const { t } = useTranslation(['blocks']);
  // Translated here and handed down: the row builder is no component, so
  // t() is out of its reach, and the mobile card already translates this key.
  const epochLabel = t('blocks:Table.Epoch', { defaultValue: 'Epoch' });
  // Two pieces of state on purpose: the switch and storage carry the user's
  // INTENT, the interval is derived from it. Conflating them made the toggle
  // unable to turn the setting off from a paused page: with the interval at
  // zero there, a click stored "on" again.
  const [autoUpdateIntent, setAutoUpdateIntent] = useState(false);
  const [blocksInterval, setBlocksInterval] = useState(0);
  const page = normalizePageParam(router.query?.page, 1);

  useEffect(() => {
    setAutoUpdateIntent(getStorageUpdateConfig());
  }, []);

  // The loop itself only runs on page 1: rolling blocks mean nothing on page
  // 7, and the shared Table zeroes its interval on a page change for the same
  // reason. Deriving it here re-arms it on returning to page 1.
  useEffect(() => {
    setBlocksInterval(
      autoUpdateIntent && page === 1 ? AUTO_UPDATE_INTERVAL : 0,
    );
  }, [autoUpdateIntent, page]);

  const toggleAutoUpdate = (): void => {
    setAutoUpdateIntent(storageUpdateBlocks(autoUpdateIntent));
  };

  const tableProps: ITable = {
    type: 'blocks',
    header,
    rowSections: (block: Parameters<typeof blockRowSections>[0]) =>
      blockRowSections(block, epochLabel),
    dataName: 'blocks',
    request: (page: number, limit: number) =>
      blockListCall(page, limit, router.query),
    interval: blocksInterval,
    intervalController: setBlocksInterval,
    singleLineSkeleton: true,
    rightAlignedSkeletonColumns: RIGHT_ALIGNED_COLUMNS,
    MobileCard: BlocksMobileCard,
    Filters: BlocksFilters,
    TableControl: (
      <AutoUpdate active={autoUpdateIntent} onToggle={toggleAutoUpdate} />
    ),
  };

  return (
    <Container>
      <Header>
        <Title title="Blocks" Icon={Icon} />
      </Header>

      <BlocksSummary />

      <BlocksTableWrapper>
        <Table {...tableProps} />
      </BlocksTableWrapper>
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
