import BlockCardFetcher from '@/components/Cards/BlockCardFetcher';
import CardDataFetcher from '@/components/Cards/CardDataFetcher';
import CoinDataFetcher from '@/components/Cards/CoinDataFetcher';
import HomeTransactions from '@/components/HomeTransactions';
import api from '@/services/api';
import { IBlock } from '@/types/blocks';
import HomeStaticProps from '@/utils/ServerSideProps/Home';
import {
  Container,
  DataCardsContainer,
  DataContainer,
  Input,
} from '@/views/home';
import { GetStaticProps } from 'next';
import React, { useCallback, useEffect } from 'react';
import { IHome } from '../types';

const Home: React.FC<IHome> = () => {
  const precision = 6; // default KLV precision

  const [blocks, setBlocks] = React.useState<IBlock[]>([]);

  const getBlocks = useCallback(
    async (setBlocksScoped: React.Dispatch<React.SetStateAction<IBlock[]>>) => {
      const res = await api.getCached({
        route: 'block/list',
        refreshTime: 4,
      });

      if (!res.error || res.error === '') {
        setBlocksScoped(res.data?.blocks);
      }
    },
    [],
  );

  useEffect(() => {
    getBlocks(setBlocks);
  }, []);

  return (
    <Container>
      <DataContainer>
        <Input />

        <DataCardsContainer>
          <CardDataFetcher block={blocks?.[0]} />
          <CoinDataFetcher />
        </DataCardsContainer>
      </DataContainer>

      <BlockCardFetcher blocks={blocks} getBlocks={getBlocks} />
      <HomeTransactions />
    </Container>
  );
};

export const getStaticProps: GetStaticProps = HomeStaticProps;

export default Home;
