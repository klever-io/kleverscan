import { LetterLogo } from '@/components/Logo/styles';
import { useMobile } from '@/contexts/mobile';
import { IBlockCard } from '@/types/blocks';
import { formatAmount } from '@/utils/formatFunctions/';
import { validateImgUrl } from '@/utils/imageValidate';
import { getAge } from '@/utils/timeFunctions';
import {
  Anchor,
  BlockCardHash,
  BlockCardRow,
  NextImageWrapper,
  TransactionContainerContent,
  TransactionRow,
} from '@/views/home';
import { fromUnixTime } from 'date-fns';
import { useTranslation } from 'next-i18next';
import Image from 'next/legacy/image';
import Link from 'next/link';
import React, { PropsWithChildren, useEffect, useState } from 'react';

const BlockCard: React.FC<PropsWithChildren<IBlockCard>> = ({
  nonce,
  timestamp,
  hash,
  blockRewards,
  blockIndex,
  txCount,
  txBurnedFees,
  producerOwnerAddress,
  producerLogo,
  producerName,
}) => {
  const { t } = useTranslation('blocks');
  const { t: commonT } = useTranslation('common');
  const { isMobile } = useMobile();

  const precision = 6; // default KLV precision
  const maxRequestAwaitTime = 3000;
  const [img, setImg] = useState(false);
  const [error, setError] = useState(false);

  const handleImageError = () => {
    setError(true);
  };

  const renderLogo = () => {
    if (img && !error) {
      return (
        <Anchor href={`/validator/${producerOwnerAddress}`}>
          <NextImageWrapper>
            <Image
              src={producerLogo}
              alt="Logo of the block producer"
              onError={handleImageError}
              width={30}
              height={30}
              style={{ borderRadius: '50%', border: '2px solid black' }}
              loader={({ src, width }) => `${src}?w=${width}`}
            ></Image>
          </NextImageWrapper>
        </Anchor>
      );
    }
    return (
      <Anchor href={`/validator/${producerOwnerAddress}`}>
        <LetterLogo>{producerName?.split('')[0] || 'K'}</LetterLogo>
      </Anchor>
    );
  };

  useEffect(() => {
    (async () => {
      if (producerLogo) {
        const isImg = await validateImgUrl(producerLogo, maxRequestAwaitTime);
        if (isImg) {
          setImg(true);
        }
      }
    })();
  }, [producerLogo]);

  return (
    <TransactionRow>
      {!isMobile && (
        <Image
          src="/homeCards/blocks.svg"
          alt="generic block icon"
          width={48}
          height={48}
          loader={({ src, width }) => `${src}?w=${width}`}
        />
      )}
      <TransactionContainerContent isBlocks={true}>
        <BlockCardRow>
          <Link href={`/block/${nonce}`}>
            <strong>#{nonce}</strong>
          </Link>
          <small>
            {getAge(fromUnixTime(timestamp), commonT)}{' '}
            {commonT('Date.Elapsed Time')}
          </small>
        </BlockCardRow>
        <BlockCardRow>
          <div>
            <p>{t('blocks:Miner')}:</p>
            <BlockCardHash>
              <strong>
                <a href={`/account/${producerOwnerAddress}`}>
                  {producerName || producerOwnerAddress}
                </a>
              </strong>
            </BlockCardHash>
          </div>
          {renderLogo()}
        </BlockCardRow>
        {!isMobile && (
          <BlockCardRow>
            <div>
              <p>{commonT('Titles.Transactions')}:</p>
              <span>{txCount}</span>
            </div>

            <div>
              <p>{t('blocks:Burned')}:</p>
              <span>
                {formatAmount((txBurnedFees || 0) / 10 ** precision)} KLV
              </span>
            </div>
            <div>
              <p>{t('blocks:Reward')}:</p>
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
                <p>{t('blocks:Burned')}:</p>
                <span>
                  {formatAmount((txBurnedFees || 0) / 10 ** precision)} KLV
                </span>
              </div>
              <div>
                <p>{t('blocks:Reward')}:</p>
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
