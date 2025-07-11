import React from 'react';
import { Accounts as Icon } from '@/assets/title-icons';
import { PropsWithChildren } from 'react';
import {
  Container,
  Header,
  SponsoredContainer,
  SponsoredTitleSection,
} from '@/styles/common';
import Title from '@/components/Layout/Title';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18nextConfig from '../../../next-i18next.config';
import { useTranslation } from 'next-i18next';
import { SmartContractDataProvider } from '@/contexts/smartContractPage';
import { ChartDailyTransactions } from '@/components/Home/HomeTransactions/ChartDailyTransactions';
import { DataCardsContainer } from '@/views/home';
import MostUsedApplications from '@/components/SmartContracts/MostUsedApplications';
import BrowseAllDeployedContracts from '@/components/SmartContracts/BrowseAllDeployedContracts';
import SmartContractTopCard from '@/components/SmartContracts/SmartContractTopCard';

const SmartContracts: React.FC<PropsWithChildren> = () => {
  const { t } = useTranslation(['common', 'smartContracts']);

  return (
    <SmartContractDataProvider>
      <Container>
        <Header>
          <Title title={t('common:Titles.Smart Contracts')} Icon={Icon} />
        </Header>
        <SponsoredContainer>
          {/* <span>Sponsored:</span>
          <SponsoredTitleSection>
            <span>Next crypto project to explode on KleverChain</span>
          </SponsoredTitleSection> */}
        </SponsoredContainer>
        <div>
          <DataCardsContainer>
            <SmartContractTopCard />
            <ChartDailyTransactions smartContract />
          </DataCardsContainer>
        </div>

        <MostUsedApplications />

        <BrowseAllDeployedContracts />
      </Container>
    </SmartContractDataProvider>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => {
  if (process.env.NODE_ENV !== 'development') {
    return {
      notFound: true,
    };
  }
  const props = await serverSideTranslations(
    locale,
    ['common', 'smartContracts'],
    nextI18nextConfig,
    ['en'],
  );
  return { props };
};

export default SmartContracts;
