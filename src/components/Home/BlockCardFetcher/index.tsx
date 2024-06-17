import { PropsWithChildren } from 'react';
import { PurpleArrowRight } from '@/assets/icons';
import AssetLogo from '@/components/Logo/AssetLogo';
import Table, { ITable } from '@/components/Table';
import { useHomeData } from '@/contexts/mainPage';
import { useMobile } from '@/contexts/mobile';
import { defaultPagination } from '@/services/apiCalls';
import { CenteredRow, DoubleRow, Mono } from '@/styles/common';
import { IBlock } from '@/types/blocks';
import { IPaginatedResponse, IRowSection } from '@/types/index';
import { formatAmount } from '@/utils/formatFunctions';
import { KLV_PRECISION } from '@/utils/globalVariables';
import { parseAddress } from '@/utils/parseValues';
import {
  ArrowHide,
  ContainerHide,
  SectionCards,
  TransactionContainer,
} from '@/views/home';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import React, { useState } from 'react';
import { ValidatorName } from './style';

export const blocksHeader = [
  '',
  'Block',
  'Size/TXs',
  'Fees(Kapp/Burned)',
  'Rewards(Fee/Block)',
];
export const blocksTabletHeader = [
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

  const producerNameIsAddress = producerName === producerOwnerAddress;

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
            <a>
              {producerName && !producerNameIsAddress ? (
                producerName
              ) : (
                <Mono>{parseAddress(producerOwnerAddress, 24)}</Mono>
              )}
            </a>
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

export const blocksTabletRowSections = (block: IBlock): IRowSection[] => {
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
        <CenteredRow>
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
          <Link
            href={`/validator/${producerOwnerAddress}`}
            key={producerOwnerAddress}
          >
            <ValidatorName>{parseAddress(producerName, 24)}</ValidatorName>
          </Link>
        </CenteredRow>
      ),
      span: 2,
    },
    {
      element: props => (
        <DoubleRow {...props} key={nonce + epoch}>
          <Link href={`/block/${nonce}`}>{String(nonce)}</Link>
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

const BlockCardFetcher: React.FC<PropsWithChildren> = () => {
  const { blocks } = useHomeData();
  const { t: commonT } = useTranslation('common');
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
    header: isTablet ? blocksTabletHeader : blocksHeader,
    rowSections: isTablet ? blocksTabletRowSections : blocksRowSections,
    dataName: 'blocks',
    request: (page: number, limit: number) => homeBlocksCall(page, limit),
    showLimit: false,
    showPagination: false,
    smaller: true,
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
          <a>
            View All
            <PurpleArrowRight />
          </a>
        </Link>
        {isTablet ? (
          <div onClick={() => setHideMenu(!hideMenu)}>
            <ArrowHide $hide={hideMenu} />
          </div>
        ) : null}
      </ContainerHide>

      <TransactionContainer>
        {!hideMenu && <Table key={JSON.stringify(blocks)} {...tableProps} />}
      </TransactionContainer>
    </SectionCards>
  );
};

export default BlockCardFetcher;
