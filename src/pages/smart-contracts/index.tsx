import React from 'react';
import { Accounts as Icon } from '@/assets/title-icons';
import { PropsWithChildren } from 'react';
import { Container, Header } from '@/styles/common';
import Title from '@/components/Layout/Title';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18nextConfig from '../../../next-i18next.config';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import {
  InputContractContainer,
  SearchInputContainer,
  TitleSection,
} from './style';

import { SmartContractDataProvider } from '@/contexts/smartContractPage';
import { ChartDailyTransactions } from '@/components/Home/HomeTransactions/ChartDailyTransactions';
import { DataCardsContainer } from '@/views/home';
import MostUsedApplications from '@/components/SmartContracts/MostUsedApplications';
import BrowseAllDeployedContracts from '@/components/SmartContracts/BrowseAllDeployedContracts';
import SmartContractTopCard from '@/components/SmartContracts/SmartContractTopCard';

const SmartContracts: React.FC<PropsWithChildren> = () => {
  const { t } = useTranslation('smartContracts');

  return (
    <SmartContractDataProvider>
      <Container>
        <Header>
          <Title title={`${'SmartContracts'}`} Icon={Icon} />
        </Header>
        <SearchInputContainer>
          <span>Sponsored:</span>
          <TitleSection>
            <span>Next crypto project to explode on KleverChain</span>
          </TitleSection>
        </SearchInputContainer>
        <div>
          <DataCardsContainer>
            <SmartContractTopCard />
            <ChartDailyTransactions />
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
  const props = await serverSideTranslations(
    locale,
    ['smartContracts'],
    nextI18nextConfig,
    ['en'],
  );

  return { props };
};

export default SmartContracts;
