import BlockCard from '@/components/Cards/BlockCard';
import Carousel from '@/components/Carousel';
import api from '@/services/api';
import { IBlock, IBlockCardList } from '@/types/blocks';
import { Section } from '@/views/home';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { IBlockResponse } from '../../types';

const BlockCardList: React.FC<IBlockCardList> = ({ blocks, precision }) => {
  const [listedBlocks, setListedBlocks] = useState<IBlock[]>(blocks);
  const blockWatcherTimeout = 4000;
  const router = useRouter();

  const { t } = useTranslation('blocks');

  useEffect(() => {
    const blockWatcher = setInterval(async () => {
      try {
        const blocks: IBlockResponse = await api.get({
          route: 'block/list',
        });

        if (!blocks.error) {
          if (listedBlocks[0].nonce !== blocks.data?.blocks[0].nonce) {
            setListedBlocks(blocks.data?.blocks);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }, blockWatcherTimeout);

    return () => clearInterval(blockWatcher);
  }, []);

  const getBLockCards = useCallback(() => {
    return listedBlocks.map((block: IBlock, index) => {
      return (
        <BlockCard
          precision={precision}
          blockIndex={index}
          key={block.hash + index}
          {...block}
        />
      );
    });
  }, [listedBlocks, precision]);

  return (
    <Section>
      <Link href={'/blocks'}>
        <h1>{t('Blocks')}</h1>
      </Link>
      <Carousel>{getBLockCards()}</Carousel>
    </Section>
  );
};

export default BlockCardList;
