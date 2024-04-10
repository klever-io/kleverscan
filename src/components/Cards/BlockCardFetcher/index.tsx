import { PurpleArrowRight } from '@/assets/icons';
import AssetLogo from '@/components/Logo/AssetLogo';
import Table, { ITable } from '@/components/TableV2';
import { useHomeData } from '@/contexts/mainPage';
import { defaultPagination } from '@/services/apiCalls';
import { DoubleRow } from '@/styles/common';
import { IBlock } from '@/types/blocks';
import { IPaginatedResponse, IRowSection } from '@/types/index';
import { formatAmount } from '@/utils/formatFunctions';
import { KLV_PRECISION } from '@/utils/globalVariables';
import { parseAddress } from '@/utils/parseValues';
import {
  ArrowUpSquareHideMenu,
  ContainerHide,
  SectionCards,
  TransactionContainer,
} from '@/views/home';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import React, { useState } from 'react';

export const blocksHeader = [
  '',
  'Block',
  'Size/TXs',
  'Fees(Kapp/Burned)',
  'Rewards(Fee/Block)',
];

export const blocksRowSections = (block: IBlock): IRowSection[] => {
  const {
    nonce,
    size,
    epoch,
    producerName,
    producerOwnerAddress,
    producerLogo,
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
        <Link href={`/validator/${producerOwnerAddress}`}>
          <a>
            <AssetLogo
              logo={producerLogo}
              ticker={producerName}
              name={producerName}
              size={36}
            />
          </a>
        </Link>
      ),
      span: 1,
      width: 50,
    },
    {
      element: props => (
        <DoubleRow {...props} key={nonce + epoch}>
          <Link href={`/block/${nonce}`}>{String(nonce)}</Link>
          <Link
            href={`/validator/${producerOwnerAddress}`}
            key={producerOwnerAddress}
          >
            <a>{parseAddress(producerName, 16)}</a>
          </Link>
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

const BlockCardFetcher: React.FC = () => {
  const { blocks } = useHomeData();
  const { t: commonT } = useTranslation('common');
  const { t } = useTranslation('blocks');
  const [hideMenu, setHideMenu] = useState(false);

  const homeBlocksCall: (
    page: number,
    limit: number,
  ) => Promise<IPaginatedResponse> = async (page = 1, limit = 10) => {
    return {
      data: { blocks },
      error: '',
      code: '',
      pagination: defaultPagination,
    };
  };

  const tableProps: ITable = {
    type: 'blocks',
    header: blocksHeader,
    rowSections: blocksRowSections,
    dataName: 'blocks',
    request: (page: number, limit: number) => homeBlocksCall(page, limit),
    showLimit: false,
    showPagination: false,
    smaller: true,
    interval: 4000,
  };

  return (
    <SectionCards>
      <ContainerHide>
        <h1>{t('Recent Blocks')}</h1>

        <Link
          href={{
            pathname: '/transactions',
          }}
        >
          <a>
            View All
            <PurpleArrowRight />
          </a>
        </Link>
        <div onClick={() => setHideMenu(!hideMenu)}>
          <p>{hideMenu ? 'Show' : 'Hide'}</p>
          <ArrowUpSquareHideMenu $hide={hideMenu} />
        </div>
      </ContainerHide>

      <TransactionContainer>
        {!hideMenu && <Table {...tableProps} />}
      </TransactionContainer>
    </SectionCards>
  );
};

export default BlockCardFetcher;
