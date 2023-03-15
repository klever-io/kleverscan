import BlockCardFetcher from '@/components/Cards/BlockCardFetcher';
import HomeDataCards from '@/components/Cards/CardDataFetcher/HomeDataCards';
import CoinCard from '@/components/Cards/CoinDataFetcher/CoinCard';
import HomeTransactions from '@/components/HomeTransactions';
import { HomeDataProvider } from '@/contexts/mainPage';
import { IHomeProps } from '@/types';
import { Container, DataCardsContainer, DataContainer } from '@/views/home';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';
import nextI18NextConfig from '../../next-i18next.config';

const Home: React.FC<IHomeProps> = () => {
  return (
    <HomeDataProvider>
      <Container>
        <DataContainer>
          <DataCardsContainer>
            <HomeDataCards />
            <CoinCard />
          </DataCardsContainer>
        </DataContainer>

        <BlockCardFetcher />
        <HomeTransactions />
      </Container>
    </HomeDataProvider>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  const props = await serverSideTranslations(
    locale,
    ['common', 'blocks', 'transactions'],
    nextI18NextConfig,
  );

  return { props };
};

export default Home;
