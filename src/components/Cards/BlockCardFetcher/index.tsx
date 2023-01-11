import BlockCard from '@/components/Cards/BlockCardFetcher/BlockCard';
import Carousel from '@/components/Carousel';
import { IBlock, IBlockCardFetcher } from '@/types/blocks';
import { Section } from '@/views/home';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import React, { useCallback, useEffect } from 'react';
import BlockCardSkeleton from './BlockCardSkeleton';

const BlockCardFetcher: React.FC<IBlockCardFetcher> = ({
  blocks: defaultBlocks,
  getBlocks,
}) => {
  const [blocks, setBlocks] = React.useState<IBlock[]>(defaultBlocks);

  const { t } = useTranslation('blocks');

  const blockWatcherInterval = 4000;

  useEffect(() => {
    const blockWatcher = setInterval(async () => {
      try {
        getBlocks(setBlocks);
      } catch (error) {
        console.error(error);
      }
    }, blockWatcherInterval);

    return () => clearInterval(blockWatcher);
  }, []);

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
