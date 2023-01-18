import BlockCardFetcher from '@/components/Cards/BlockCardFetcher';
import CardDataFetcher from '@/components/Cards/CardDataFetcher';
import CoinDataFetcher from '@/components/Cards/CoinDataFetcher';
import HomeTransactions from '@/components/HomeTransactions';
import api from '@/services/api';
import { IHomeProps, Service } from '@/types';
import { IBlock } from '@/types/blocks';
import {
  Container,
  DataCardsContainer,
  DataContainer,
  Input,
} from '@/views/home';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { useCallback, useEffect } from 'react';
import nextI18NextConfig from '../../next-i18next.config';

const Home: React.FC<IHomeProps> = ({ kfiPrices }) => {
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
          <CoinDataFetcher kfiPrices={kfiPrices} />
        </DataCardsContainer>
      </DataContainer>

      <BlockCardFetcher blocks={blocks} getBlocks={getBlocks} />
      <HomeTransactions />
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => {
  const props = await serverSideTranslations(
    locale,
    ['common', 'blocks', 'transactions'],
    nextI18NextConfig,
  );

  const res = await api.post({
    route: `coinstats`,
    service: Service.PRICE,
    body: {
      ID: 'kfi',
      Name: 'kfi',
      Currency: 'USD',
    },
  });

  if (!res.error || res.error === '') {
    props['kfiPrices'] = res;
  }

  return { props };
};

export default Home;
