import { PropsWithChildren } from 'react';
import { PurpleArrowRight } from '@/assets/icons';
import AssetLogo from '@/components/Logo/AssetLogo';
import Table, { ITable } from '@/components/Table';
import { homeDefaultInterval, useHomeData } from '@/contexts/mainPage';
import { useMobile } from '@/contexts/mobile';
import { defaultPagination } from '@/services/apiCalls';
import { CenteredRow, DoubleRow } from '@/styles/common';
import { IBlock } from '@/types/blocks';
import { IPaginatedResponse, IRowSection } from '@/types/index';
import { parseAddress } from '@/utils/parseValues';
import {
  ArrowHide,
  ContainerHide,
  SectionCards,
  TransactionContainer,
} from '@/views/home';
import ExplorerLink from '@/components/ExplorerLink';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import React, { useState } from 'react';
import { blockFeesCell, blockRewardsCell, blockSizeTxsCell } from './cells';
import SkeletonTable from '@/components/SkeletonTable';

export const blocksHeader = [
  '',
  'Block',
  'Size/TXs',
  'Fees(Kapp/Burned)',
  'Rewards(Fee/Block)',
];

export const blocksRowSections = (block: IBlock): IRowSection[] => {
  const { nonce, epoch, producerName, producerOwnerAddress, producerLogo } =
    block;

  const producerNameIsAddress = producerName === producerOwnerAddress;

  const sections: IRowSection[] = [
    {
      element: props => (
        <Link href={`/validator/${producerOwnerAddress}`}>
          <AssetLogo
            logo={producerLogo}
            ticker={producerName}
            name={producerName}
            size={36}
          />
        </Link>
      ),
      span: 1,
      width: 50,
    },
    {
      element: props => (
        <DoubleRow {...props} key={nonce + epoch}>
          <ExplorerLink type="block" value={String(nonce)} compact />
          <ExplorerLink
            type="validator"
            value={producerOwnerAddress}
            label={
              producerName && !producerNameIsAddress
                ? producerName
                : parseAddress(producerOwnerAddress, 24)
            }
            compact
          />
        </DoubleRow>
      ),
      span: 1,
    },
    blockSizeTxsCell(block),
    blockFeesCell(block),
    blockRewardsCell(block),
  ];

  return sections;
};

export const blocksTabletRowSections = (block: IBlock): IRowSection[] => {
  const { nonce, epoch, producerName, producerOwnerAddress, producerLogo } =
    block;

  const sections: IRowSection[] = [
    {
      element: props => (
        <CenteredRow>
          <Link href={`/validator/${producerOwnerAddress}`}>
            <AssetLogo
              logo={producerLogo}
              ticker={producerName}
              name={producerName}
              size={36}
            />
          </Link>
          <ExplorerLink
            type="validator"
            value={producerOwnerAddress}
            label={parseAddress(producerName, 24)}
            compact
          />
        </CenteredRow>
      ),
      span: 2,
    },
    {
      element: props => (
        <DoubleRow {...props} key={nonce + epoch}>
          <ExplorerLink type="block" value={String(nonce)} compact />
        </DoubleRow>
      ),
      span: 1,
    },
    blockSizeTxsCell(block),
    blockFeesCell(block),
    blockRewardsCell(block),
  ];

  return sections;
};

const BlockCardFetcher: React.FC<PropsWithChildren> = () => {
  const { blocks, loadingBlocks } = useHomeData();
  const { t } = useTranslation('blocks');
  const [hideMenu, setHideMenu] = useState(false);
  const { isTablet } = useMobile();

  const homeBlocksCall: (
    page: number,
    limit: number,
  ) => Promise<IPaginatedResponse> = async (page = 1, limit = 10) => {
    const quantity = isTablet ? 5 : 10;

    return {
      data: {
        blocks: (blocks || []).slice(0, quantity),
      },
      error: '',
      code: '',
      pagination: defaultPagination,
    };
  };

  const tableProps: ITable = {
    type: 'blocks',
    header: blocksHeader,
    rowSections: isTablet ? blocksTabletRowSections : blocksRowSections,
    dataName: 'blocks',
    request: (page: number, limit: number) => homeBlocksCall(page, limit),
    showLimit: false,
    showPagination: false,
    smaller: true,
    interval: homeDefaultInterval,
  };

  return (
    <SectionCards>
      <ContainerHide>
        <h1>{t('Recent Blocks')}</h1>

        <Link
          href={{
            pathname: '/blocks',
          }}
        >
          View All
          <PurpleArrowRight />
        </Link>
        {isTablet ? (
          <div onClick={() => setHideMenu(!hideMenu)}>
            <ArrowHide $hide={hideMenu} />
          </div>
        ) : null}
      </ContainerHide>
      {!loadingBlocks ? (
        <TransactionContainer>
          {!hideMenu && <Table {...tableProps} />}
        </TransactionContainer>
      ) : (
        <TransactionContainer>
          <table>
            <tbody>
              <SkeletonTable items={10} columns={4} />
            </tbody>
          </table>
        </TransactionContainer>
      )}
    </SectionCards>
  );
};

export default BlockCardFetcher;
