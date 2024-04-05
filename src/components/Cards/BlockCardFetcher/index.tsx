import BlockCard from '@/components/Cards/BlockCardFetcher/BlockCard';
import AssetLogo from '@/components/Logo/AssetLogo';
import Table, { ITable } from '@/components/TableV2';
import { useHomeData } from '@/contexts/mainPage';
import { blockCall } from '@/services/apiCalls';
import { DoubleRow } from '@/styles/common';
import { IBlock } from '@/types/blocks';
import { IRowSection } from '@/types/index';
import { formatAmount } from '@/utils/formatFunctions';
import { KLV_PRECISION } from '@/utils/globalVariables';
import { parseAddress } from '@/utils/parseValues';
import {
  ArrowUpSquareHideMenu,
  ContainerHide,
  SectionCards,
  TransactionContainer,
  TransactionEmpty,
} from '@/views/home';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

export const blocksHeader = ['', 'Block', 'Transactions', 'Burned', 'Rewards'];

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

  const sections = [
    {
      element: (
        <Link href={`/validator/${producerOwnerAddress}`} key={producerLogo}>
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
      element: (
        <DoubleRow key={nonce + epoch}>
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
      element: (
        <DoubleRow key={txCount + size}>
          <span>
            {txCount} TX{txCount > 1 ? 's' : ''}
          </span>
        </DoubleRow>
      ),
      span: 1,
    },
    {
      element: (
        <DoubleRow key={String(kAppFees) + String(txBurnedFees)}>
          <span>{formatAmount((kAppFees || 0) / 10 ** KLV_PRECISION)} KLV</span>
          <span>{`${formatAmount(
            (txBurnedFees || 0) / 10 ** KLV_PRECISION,
          )} KLV`}</span>
        </DoubleRow>
      ),
      span: 1,
    },
    {
      element: (
        <DoubleRow key={String(txFees) + String(blockRewards)}>
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

  const getBlocks = () => {
    if (blocks && blocks.length) {
      return blocks.map((block: IBlock, index) => {
        return (
          <BlockCard
            blockIndex={index}
            key={JSON.stringify(block)}
            {...block}
          />
        );
      });
    }
    return (
      <TransactionEmpty>
        <span>{commonT('EmptyData')}</span>
      </TransactionEmpty>
    );
  };

  const router = useRouter();

  const tableProps: ITable = {
    type: 'blocks',
    header: blocksHeader,
    rowSections: blocksRowSections,
    dataName: 'blocks',
    request: (page: number, limit: number) => blockCall(page, limit),
    showLimit: false,
    showPagination: false,
    smaller: true,
  };

  return (
    <SectionCards>
      <ContainerHide>
        <h1>{t('Recent Blocks')}</h1>
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
