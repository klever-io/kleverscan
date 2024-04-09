import BlockCardFetcher from '@/components/Cards/BlockCardFetcher';
import HomeDataCards from '@/components/Cards/CardDataFetcher/HomeDataCards';
import CoinCard from '@/components/Cards/CoinDataFetcher/CoinCard';
import HomeTransactions from '@/components/HomeTransactions';
import { ChartDailyTransactions } from '@/components/HomeTransactions/ChartDailyTransactions';
import { HomeInput } from '@/components/InputGlobal/HomeInput';
import { HomeDataProvider } from '@/contexts/mainPage';
import {
  CardContainer,
  Container,
  DataCardsContainer,
  DataContainer,
} from '@/views/home';
import React from 'react';
import ProposalValidatorSection from './ProposalsAndValidatorsSection';

const Home: React.FC = () => {
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
        <ProposalValidatorSection />
      </Container>
    </HomeDataProvider>
  );
};

export default Home;
