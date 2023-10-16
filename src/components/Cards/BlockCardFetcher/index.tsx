import { PlusSquare } from '@/assets/icons';
import BlockCard from '@/components/Cards/BlockCardFetcher/BlockCard';
import { useHomeData } from '@/contexts/mainPage';
import { IBlock } from '@/types/blocks';
import {
  ArrowUpSquareHideMenu,
  ContainerHide,
  SectionCards,
  TransactionContainer,
  TransactionEmpty,
  ViewMoreContainer,
} from '@/views/home';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import React, { useState } from 'react';

const BlockCardFetcher: React.FC = () => {
  const { blocks } = useHomeData();
  const { t: commonT } = useTranslation('common');
  const { t } = useTranslation('blocks');
  const [hideMenu, setHideMenu] = useState(false);

  const getBlocks = () => {
    if (blocks && blocks.length) {
      return blocks.map((block: IBlock, index) => {
        return (
          <BlockCard blockIndex={index} key={block.hash + index} {...block} />
        );
      });
    }
    return (
      <TransactionEmpty>
        <span>{commonT('EmptyData')}</span>
      </TransactionEmpty>
    );
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
                  <p>
                    {commonT('Cards.ViewAll', { type: 'os' }) +
                      ' ' +
                      commonT('Titles.Blocks')}
                  </p>
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
