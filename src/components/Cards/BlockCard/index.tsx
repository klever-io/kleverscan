import { IBlock, IBlockCard } from '@/types/blocks';
import { BlockCardContainer, BlockCardHash, BlockCardRow } from '@/views/home';
import { fromUnixTime } from 'date-fns';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import React from 'react';
import { formatAmount, getAge } from '../../../utils';

const BlockCard: React.FC<IBlock & IBlockCard> = ({
  nonce,
  timestamp,
  hash,
  blockRewards,
  blockIndex,
  txCount,
  txBurnedFees,
  precision,
}) => {
  const { t } = useTranslation('blocks');
  const { t: commonT } = useTranslation('common');

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
              {getAge(fromUnixTime(timestamp / 1000), commonT)}{' '}
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
