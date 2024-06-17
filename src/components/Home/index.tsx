import { PropsWithChildren } from 'react';
import BlockCardFetcher from '@/components/Home/BlockCardFetcher';
import HomeDataCards from '@/components/Home/CardDataFetcher/HomeDataCards';
import CoinCard from '@/components/Home/CoinDataFetcher/CoinCard';
import HomeTransactions from '@/components/Home/HomeTransactions';
import { ChartDailyTransactions } from '@/components/Home/HomeTransactions/ChartDailyTransactions';
import { HomeInput } from '@/components/InputGlobal/HomeInput';
import { HomeDataProvider } from '@/contexts/mainPage';
import {
  CardContainer,
  Container,
  DataCardsContainer,
  DataContainer,
} from '@/views/home';
import React from 'react';
import { HomeITOSection } from './HomeITOSection';
import ProposalValidatorSection from './ProposalsAndValidatorsSection';
import MostTransacted from './MostTransacted';

const Home: React.FC<PropsWithChildren> = () => {
  return (
    <HomeDataProvider>
      <Container>
        <DataContainer>
          <HomeInput />
          <DataCardsContainer>
            <HomeDataCards />
            <ChartDailyTransactions />
          </DataCardsContainer>
          <CoinCard />
        </DataContainer>
        <CardContainer>
          <HomeTransactions />
          <BlockCardFetcher />
        </CardContainer>
        <MostTransacted />
        <ProposalValidatorSection />
        <HomeITOSection />
      </Container>
    </HomeDataProvider>
  );
};

export default Home;
