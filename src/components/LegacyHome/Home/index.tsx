import BlockCardFetcher from '@/components/LegacyHome/Cards/BlockCardFetcher';
import HomeDataCards from '@/components/LegacyHome/Cards/CardDataFetcher/HomeDataCards';
import CoinCard from '@/components/LegacyHome/Cards/CoinDataFetcher/CoinCard';
import HomeTransactions from '@/components/LegacyHome/HomeTransactions';
import { HomeDataProvider } from '@/contexts/mainPage';
import {
  Container,
  DataCardsContainer,
  DataContainer,
} from '@/views/legacyHome';
import React from 'react';

const LegacyHome: React.FC = () => {
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

export default LegacyHome;
