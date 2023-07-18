import { IBlockCard } from '@/types/blocks';
import { formatAmount } from '@/utils/formatFunctions/';
import { getAge } from '@/utils/timeFunctions';
import {
  BlockCardContainer,
  BlockCardHash,
  BlockCardRow,
} from '@/views/legacyHome';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import React from 'react';

const BlockCard: React.FC<IBlockCard> = ({
  nonce,
  timestamp,
  hash,
  blockRewards,
  blockIndex,
  txCount,
  txBurnedFees,
}) => {
  const { t } = useTranslation('blocks');
  const { t: commonT } = useTranslation('common');

  const precision = 6; // default KLV precision

  return (
    <BlockCardContainer blockIndex={blockIndex}>
      <Link href={`/block/${nonce}`}>
        <a>
          <BlockCardRow>
            <strong>#{nonce}</strong>
            <p>{t('Miner')}</p>
          </BlockCardRow>
          <BlockCardRow>
            <small>
              {getAge(new Date(timestamp), commonT)}{' '}
              {commonT('Date.Elapsed Time')}
            </small>
            <BlockCardHash>{hash}</BlockCardHash>
          </BlockCardRow>
          <BlockCardRow>
            <p>{t('Burned')}</p>
            <span>
              {formatAmount((txBurnedFees || 0) / 10 ** precision)} KLV
            </span>
          </BlockCardRow>
          <BlockCardRow>
            <p>{commonT('Titles.Transactions')}</p>
            <span>{txCount}</span>
          </BlockCardRow>
          <BlockCardRow>
            <p>{t('Reward')}</p>
            <span>
              {formatAmount((blockRewards || 0) / 10 ** precision)} KLV
            </span>
          </BlockCardRow>
        </a>
      </Link>
    </BlockCardContainer>
  );
};

export default BlockCard;
