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
  CardBackground,
  NextImageWrapper,
  TransactionContainerContent,
  TransactionRow,
} from '@/views/home';
import { fromUnixTime } from 'date-fns';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const BlockCard: React.FC<IBlockCard> = ({
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
            ></Image>
          </NextImageWrapper>
        </Anchor>
      );
    }
    return (
      <Anchor href={`/validator/${producerOwnerAddress}`}>
        <LetterLogo>{producerName?.split[0] || 'K'}</LetterLogo>
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
      {!isMobile && <CardBackground src="/homeCards/blocks.svg" />}
      <TransactionContainerContent isBlocks={true}>
        <BlockCardRow>
          <Link href={`/block/${nonce}`}>
            <a>
              <strong>#{nonce}</strong>
            </a>
          </Link>
          <small>
            {getAge(fromUnixTime(timestamp), commonT)}{' '}
            {commonT('Date.Elapsed Time')}
          </small>
        </BlockCardRow>
        <BlockCardRow>
          <div>
            <p>{t('Miner')}:</p>
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
