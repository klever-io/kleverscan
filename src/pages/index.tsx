import BlockCardFetcher from '@/components/Cards/BlockCardFetcher';
import HomeDataCards from '@/components/Cards/CardDataFetcher/HomeDataCards';
import CoinCard from '@/components/Cards/CoinDataFetcher/CoinCard';
import CreateTxShortcut from '@/components/CreateTxShortCut';
import HomeTransactions from '@/components/HomeTransactions';
import { useExtension } from '@/contexts/extension';
import { HomeDataProvider } from '@/contexts/mainPage';
import { IHomeProps } from '@/types';
import { Container, DataCardsContainer, DataContainer } from '@/views/home';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { useEffect, useState } from 'react';
import nextI18NextConfig from '../../next-i18next.config';

const Home: React.FC<IHomeProps> = () => {
  const [walletAddres, setWalletAddress] = useState<string | null>(null);

  const { extensionInstalled } = useExtension();

  useEffect(() => {
    const getWalletAddress = sessionStorage.getItem('walletAddress');
    if (getWalletAddress) {
      setWalletAddress(getWalletAddress);
    }
  }, []);
  return (
    <HomeDataProvider>
      <Container>
        <CreateTxShortcut />
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
