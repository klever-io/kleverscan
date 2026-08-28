import { Blocks as Icon } from '@/assets/title-icons';
import AutoUpdate from '@/components/BlocksList/AutoUpdate';
import { RIGHT_ALIGNED_COLUMNS } from '@/components/BlocksList/columns';
import { blockRowSections } from '@/components/BlocksList/rows';
import { BlocksTableWrapper } from '@/components/BlocksList/styles';
import BlocksSummary from '@/components/BlocksList/Summary';
import { useBlockHeaders } from '@/components/BlocksList/useBlockHeaders';
import Title from '@/components/Layout/Title';
import Table, { ITable } from '@/components/Table';
import { blockListCall } from '@/services/requests/block';
import { Container, Header } from '@/styles/common';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, { PropsWithChildren, useMemo, useRef, useState } from 'react';
import nextI18nextConfig from '../../../next-i18next.config';

/** How often the list refetches while auto update is on. */
const AUTO_UPDATE_INTERVAL = 4 * 1000;

/**
 * The table renders `Filters` as a component, so it needs one identity for the
 * life of the page: built inline it would be a new type every render, remount
 * on each one, and cut the toggle's 0.4s transition short.
 */
const makeFilters = (onChange: (interval: number) => void): React.FC =>
  function BlocksFilters() {
    return <AutoUpdate interval={AUTO_UPDATE_INTERVAL} onChange={onChange} />;
  };

const Blocks: React.FC<PropsWithChildren> = () => {
  const router = useRouter();
  const header = useBlockHeaders();
  const [blocksInterval, setBlocksInterval] = useState(0);

  // The setter through a ref, so the memo below never has to be rebuilt.
  const onIntervalChange = useRef(setBlocksInterval);
  const Filters = useMemo(
    () => makeFilters(interval => onIntervalChange.current(interval)),
    [],
  );

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
    Filters,
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
