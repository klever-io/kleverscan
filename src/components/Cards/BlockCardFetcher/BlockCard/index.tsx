import { useMobile } from '@/contexts/mobile';
import { IBlockCard } from '@/types/blocks';
import { formatAmount } from '@/utils/formatFunctions/';
import { getAge } from '@/utils/timeFunctions';
import {
  BlockCardHash,
  BlockCardLogo,
  BlockCardRow,
  CardBackground,
  TransactionContainerContent,
  TransactionRow,
} from '@/views/home';
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
  producerLogo,
}) => {
  const { t } = useTranslation('blocks');
  const { t: commonT } = useTranslation('common');
  const { isMobile } = useMobile();

  const precision = 6; // default KLV precision

  return (
    <TransactionRow>
      {!isMobile && <CardBackground src="/homeCards/blocks.svg" />}
      <TransactionContainerContent>
        <BlockCardRow>
          <Link href={`/block/${nonce}`}>
            <a>
              <strong>#{nonce}</strong>
            </a>
          </Link>
          <small>
            {getAge(fromUnixTime(timestamp / 1000), commonT)}{' '}
            {commonT('Date.Elapsed Time')}
          </small>
        </BlockCardRow>
        <BlockCardRow>
          <div>
            <p>{t('Miner')}:</p>
            <BlockCardHash>
              <strong>{hash}</strong>
            </BlockCardHash>
          </div>
          <BlockCardLogo
            src={producerLogo ? producerLogo : '/homeCards/blocks.svg'}
          />
        </BlockCardRow>
        {!isMobile && (
          <BlockCardRow>
            <div>
              <p>{commonT('Titles.Transactions')}:</p>
              <span>{txCount}</span>
            </div>

            <div>
              <p>{t('Burned')}:</p>
              <span>
                {formatAmount((txBurnedFees || 0) / 10 ** precision)} KLV
              </span>
            </div>
            <div>
              <p>{t('Reward')}:</p>
              <span>
                {formatAmount((blockRewards || 0) / 10 ** precision)} KLV
              </span>
            </div>
          </BlockCardRow>
        )}
        {isMobile && (
          <>
            <BlockCardRow>
              <div>
                <p>{commonT('Titles.Transactions')}:</p>
                <span>{txCount}</span>
              </div>
            </BlockCardRow>
            <BlockCardRow>
              <div>
                <p>{t('Burned')}:</p>
                <span>
                  {formatAmount((txBurnedFees || 0) / 10 ** precision)} KLV
                </span>
              </div>
              <div>
                <p>{t('Reward')}:</p>
                <span>
                  {formatAmount((blockRewards || 0) / 10 ** precision)} KLV
                </span>
              </div>
            </BlockCardRow>
          </>
        )}
      </TransactionContainerContent>
    </TransactionRow>
  );
};

export default BlockCard;
