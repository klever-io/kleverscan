import { IBlockCard } from '@/types/blocks';
import { formatAmount } from '@/utils/formatFunctions/';
import { getAge } from '@/utils/timeFunctions';
import { BlockCardHash, BlockCardRow, TransactionRow } from '@/views/home';
import { fromUnixTime } from 'date-fns';
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
    <TransactionRow>
      <Link href={`/block/${nonce}`}>
        <a>
          <BlockCardRow>
            <strong>#{nonce}</strong>
          </BlockCardRow>
        </a>
      </Link>
      <BlockCardRow>
        <small>
          {getAge(fromUnixTime(timestamp / 1000), commonT)}{' '}
          {commonT('Date.Elapsed Time')}
        </small>
      </BlockCardRow>
      <BlockCardRow>
        <p>{t('Miner')}:</p>
        <BlockCardHash> {hash}</BlockCardHash>
      </BlockCardRow>
      <BlockCardRow>
        <p>{t('Burned')}:</p>
        <span>{formatAmount((txBurnedFees || 0) / 10 ** precision)} KLV</span>
      </BlockCardRow>
      <BlockCardRow>
        <p>{commonT('Titles.Transactions')}:</p>
        <span>{txCount}</span>
      </BlockCardRow>
      <BlockCardRow>
        <p>{t('Reward')}:</p>
        <span>{formatAmount((blockRewards || 0) / 10 ** precision)} KLV</span>
      </BlockCardRow>
    </TransactionRow>
  );
};

export default BlockCard;
