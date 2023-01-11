import Skeleton from '@/components/Skeleton';
import { BlockCardContainer, BlockCardHash, BlockCardRow } from '@/views/home';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import React from 'react';

const BlockCardSkeleton: React.FC<{ index: number }> = ({ index }) => {
  const { t } = useTranslation('blocks');
  const { t: commonT } = useTranslation('common');

  const lineHeight = 19;

  return (
    <BlockCardContainer blockIndex={index}>
      <Link href={`#`}>
        <a>
          <BlockCardRow>
            <strong>
              <Skeleton height={lineHeight} />
            </strong>
            <p>{t('Miner')}</p>
          </BlockCardRow>
          <BlockCardRow>
            <small>
              <Skeleton height={16} />
            </small>
            <BlockCardHash>
              <Skeleton height={lineHeight} />
            </BlockCardHash>
          </BlockCardRow>
          <BlockCardRow>
            <p>{t('Burned')}</p>
            <span>
              <Skeleton height={lineHeight} />
            </span>
          </BlockCardRow>
          <BlockCardRow>
            <p>{commonT('Titles.Transactions')}</p>
            <span>
              <Skeleton height={lineHeight} />
            </span>
          </BlockCardRow>
          <BlockCardRow>
            <p>{t('Reward')}</p>
            <span>
              <Skeleton height={lineHeight} />
            </span>
          </BlockCardRow>
        </a>
      </Link>
    </BlockCardContainer>
  );
};

export default BlockCardSkeleton;
