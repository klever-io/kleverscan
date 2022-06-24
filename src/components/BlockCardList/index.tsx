import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/router';

import { Section } from '@/views/home';

import api from '@/services/api';

import { IBlock, IBlockResponse, IBlockCardList } from '../../types';

import Carousel from '@/components/Carousel';
import BlockCard from '@/components/Cards/BlockCard';
import Link from 'next/link';

const BlockCardList: React.FC<IBlockCardList> = ({ blocks, precision }) => {
  const [listedBlocks, setListedBlocks] = useState<IBlock[]>(blocks);
  const blockWatcherTimeout = 4000;
  const router = useRouter();

  useEffect(() => {
    const blockWatcher = setInterval(async () => {
      try {
        const blocks: IBlockResponse = await api.get({
          route: 'block/list',
        });

        if (!blocks.error) {
          setListedBlocks(blocks.data?.blocks);
        }
      } catch (error) {
        console.error(error);
      }
    }, blockWatcherTimeout);

    return () => clearInterval(blockWatcher);
  }, []);

  const getBLockCards = () => {
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
  };

  return (
    <Section>
      <Link href={'/blocks'}>
        <h1>Blocks</h1>
      </Link>
      <Carousel>{getBLockCards()}</Carousel>
    </Section>
  );
};

export default BlockCardList;
