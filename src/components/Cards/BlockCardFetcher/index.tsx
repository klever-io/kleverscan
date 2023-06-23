import { PlusSquare } from '@/assets/icons';
import BlockCard from '@/components/Cards/BlockCardFetcher/BlockCard';
import { useHomeData } from '@/contexts/mainPage';
import { IBlock } from '@/types/blocks';
import {
  ArrowUpSquareHideMenu,
  ContainerHide,
  SectionCards,
  TransactionContainer,
  ViewMoreContainer,
} from '@/views/home';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import React, { useCallback, useState } from 'react';
import BlockCardSkeleton from './BlockCardSkeleton';

const BlockCardFetcher: React.FC = () => {
  const { blocks } = useHomeData();
  const [hideMenu, setHideMenu] = useState(false);
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
  }, []);
  const getBlocks = () => {
    return blocks.map((block: IBlock, index) => {
      return (
        <BlockCard blockIndex={index} key={block.hash + index} {...block} />
      );
    });
  };

  return (
    <SectionCards>
      <ContainerHide>
        <h1>{t('Recent Blocks')}</h1>
        <div onClick={() => setHideMenu(!hideMenu)}>
          <p>{hideMenu ? 'Show' : 'Hide'}</p>
          <ArrowUpSquareHideMenu hide={hideMenu} />
        </div>
      </ContainerHide>
      <TransactionContainer>
        {!hideMenu && (
          <>
            {getBlocks()}
            <Link href={`/blocks`}>
              <a>
                <ViewMoreContainer>
                  <PlusSquare />
                  <p>View all blocks</p>
                </ViewMoreContainer>
              </a>
            </Link>
          </>
        )}
      </TransactionContainer>
    </SectionCards>
  );
};

export default BlockCardFetcher;
