import BlockCardFetcher from '@/components/Cards/BlockCardFetcher';
import HomeDataCards from '@/components/Cards/CardDataFetcher/HomeDataCards';
import CoinCard from '@/components/Cards/CoinDataFetcher/CoinCard';
import HomeTransactions from '@/components/HomeTransactions';
import { ChartDailyTransactions } from '@/components/HomeTransactions/ChartDailyTransactions';
import { HomeInput } from '@/components/InputGlobal/HomeInput';
import QuickAccess from '@/components/QuickAccess';
import Wizard from '@/components/Wizard';
// import WizCreateNFT from '@/components/WIzard/createNFT';
import { useExtension } from '@/contexts/extension';
import { HomeDataProvider } from '@/contexts/mainPage';
import { useMobile } from '@/contexts/mobile';
import {
  CardContainer,
  Container,
  DataCardsContainer,
  DataContainer,
} from '@/views/home';
import React, { useEffect, useState } from 'react';

const Home: React.FC = () => {
  const [wizard, setWizard] = useState(null);
  const { extensionInstalled, connectExtension } = useExtension();

  useEffect(() => {
    document.body.style.overflow = !!wizard ? 'hidden' : 'visible';
  }, [wizard]);

  useEffect(() => {
    if (extensionInstalled) {
      connectExtension();
    }
  }, [extensionInstalled]);

  const wizProps = {
    isOpen: wizard,
    contract: 0,
    closeModal: setWizard,
  };

  const { isMobile } = useMobile();
  return (
    <HomeDataProvider>
      <Container>
        {!!wizard && <Wizard {...wizProps} />}
        <HomeInput />
        <QuickAccess setWizard={setWizard} />
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

export default Home;
