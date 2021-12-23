import React, { useState, useEffect } from 'react';

import { Section } from '@/views/home';

import api from '@/services/api';

import { IBlock, IBlockResponse, IBlockCardList } from '../../types';

import Carousel from '@/components/Carousel';
import BlockCard from '@/components/BlockCard';

const BlockCardList: React.FC<IBlockCardList> = ({ blocks, precision }) => {
  const [listedBlocks, setListedBlocks] = useState<IBlock[]>(blocks);
  const blockWatcherTimeout = 4000;

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
      <h1>Blocks</h1>
      <Carousel>{getBLockCards()}</Carousel>
    </Section>
  );
};

export default BlockCardList;
