import BlockCardFetcher from '@/components/Cards/BlockCardFetcher';
import HomeDataCards from '@/components/Cards/CardDataFetcher/HomeDataCards';
import CoinCard from '@/components/Cards/CoinDataFetcher/CoinCard';
import HomeTransactions from '@/components/HomeTransactions';
import { ChartDailyTransactions } from '@/components/HomeTransactions/ChartDailyTransactions';
import { HomeInput } from '@/components/InputGlobal/HomeInput';
import QuickAccess from '@/components/QuickAccess';
import { HomeDataProvider } from '@/contexts/mainPage';
import { useMobile } from '@/contexts/mobile';
import { IHomeProps } from '@/types';
import {
  CardContainer,
  Container,
  DataCardsContainer,
  DataContainer,
} from '@/views/home';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';
import nextI18NextConfig from '../../next-i18next.config';

const Home: React.FC<IHomeProps> = () => {
  const { isMobile } = useMobile();
  return (
    <HomeDataProvider>
      <Container>
        <HomeInput />
        <QuickAccess />
        <DataContainer>
          <DataCardsContainer>
            <HomeDataCards />
            {!isMobile && <ChartDailyTransactions />}
            <CoinCard />
            {isMobile && <ChartDailyTransactions />}
          </DataCardsContainer>
        </DataContainer>
        <CardContainer>
          <HomeTransactions />
          <BlockCardFetcher />
        </CardContainer>
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
