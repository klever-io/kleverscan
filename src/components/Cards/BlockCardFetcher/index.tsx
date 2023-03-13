import BlockCard from '@/components/Cards/BlockCardFetcher/BlockCard';
import Carousel from '@/components/Carousel';
import { useHomeData } from '@/contexts/mainPage';
import { IBlock } from '@/types/blocks';
import { Section } from '@/views/home';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import React, { useCallback } from 'react';
import BlockCardSkeleton from './BlockCardSkeleton';

const BlockCardFetcher: React.FC = () => {
  const { blocks } = useHomeData();

  const { t } = useTranslation('blocks');

  const getBlockCards = useCallback(() => {
    return blocks.length && blocks.length > 0
      ? blocks.map((block: IBlock, index) => {
          return (
            <BlockCard blockIndex={index} key={block.hash + index} {...block} />
          );
        })
      : new Array(10)
          .fill(0)
          .map((_, index) => <BlockCardSkeleton key={index} index={index} />);
  }, [blocks]);

  return (
    <Section>
      <Link href={'/blocks'}>
        <h1>{t('Blocks')}</h1>
      </Link>
      <Carousel>{getBlockCards()}</Carousel>
    </Section>
  );
};

export default BlockCardFetcher;
