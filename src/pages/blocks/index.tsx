import { Blocks as Icon } from '@/assets/title-icons';
import AutoUpdate from '@/components/BlocksList/AutoUpdate';
import BlocksFilters from '@/components/BlocksList/Filters';
import { RIGHT_ALIGNED_COLUMNS } from '@/components/BlocksList/columns';
import BlocksMobileCard from '@/components/BlocksList/MobileCard';
import { blockRowSections } from '@/components/BlocksList/rows';
import { BlocksTableWrapper } from '@/components/BlocksList/styles';
import BlocksSummary from '@/components/BlocksList/Summary';
import { useBlockHeaders } from '@/components/BlocksList/useBlockHeaders';
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
import { useRouter } from 'next/router';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import nextI18nextConfig from '../../../next-i18next.config';

/** How often the list refetches while auto update is on. */
const AUTO_UPDATE_INTERVAL = 4 * 1000;

const Blocks: React.FC<PropsWithChildren> = () => {
  const router = useRouter();
  const header = useBlockHeaders();
  const [blocksInterval, setBlocksInterval] = useState(0);
  const page = normalizePageParam(router.query?.page, 1);

  // The switch renders `blocksInterval`, which the shared Table zeroes on a
  // page change away from 1 (rolling blocks mean nothing on page 7). Stored
  // intent survives that pause, so landing back on page 1 resumes; in between
  // the switch shows the pause honestly rather than holding its own copy of
  // the state, which is how the first version kept saying "on" while nothing
  // refreshed any more.
  useEffect(() => {
    if (page === 1 && getStorageUpdateConfig()) {
      setBlocksInterval(AUTO_UPDATE_INTERVAL);
    }
  }, [page]);

  const toggleAutoUpdate = (): void => {
    const next = storageUpdateBlocks(blocksInterval > 0);
    // Intent is stored regardless; the loop itself only runs on page 1, the
    // same policy every other path enforces. Without the page check a click
    // on page 5 started the four-second refetch there, drifting the rows
    // under the reader one block at a time.
    setBlocksInterval(next && page === 1 ? AUTO_UPDATE_INTERVAL : 0);
  };

  const tableProps: ITable = {
    type: 'blocks',
    header,
    rowSections: blockRowSections,
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
      <AutoUpdate active={blocksInterval > 0} onToggle={toggleAutoUpdate} />
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
