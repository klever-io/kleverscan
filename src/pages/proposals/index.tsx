import { PropsWithChildren } from 'react';
import { Proposals as Icon } from '@/assets/title-icons';
import Title from '@/components/Layout/Title';
import Tabs, { ITabs } from '@/components/Tabs';
import NetworkParams from '@/components/Tabs/NetworkParams';
import ProposalsTab from '@/components/Tabs/Proposals';
import { requestProposals } from '@/services/requests/proposals';
import { Card, Container, Header } from '@/styles/common';
import { setQueryAndRouter } from '@/utils';
import { CardContainer } from '@/views/proposals';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import nextI18nextConfig from '../../../next-i18next.config';

const Proposals: React.FC<PropsWithChildren> = () => {
  const { t } = useTranslation(['common', 'proposals']);
  const router = useRouter();
  const tableHeaders = [
    `${t('common:Titles.Proposals')}`,
    `${t('proposals:NetworkParameters')}`,
  ];
  const [selectedTab, setSelectedTab] = useState(tableHeaders[0]);

  useEffect(() => {
    if (!router.isReady) return;
    setQueryAndRouter({ ...router.query }, router);
    setSelectedTab((router.query.tab as string) || tableHeaders[0]);
  }, [router.isReady]);

  const CardContent: React.FC<PropsWithChildren> = () => {
    return (
      <Card>
        <div>
          <span>{t('proposals:ProposalsInfo')}</span>
        </div>
      </Card>
    );
  };

  const SelectedTabComponent: React.FC<PropsWithChildren> = () => {
    switch (selectedTab) {
      case `${t('proposals:NetworkParameters')}`:
        return <NetworkParams />;
      case `${t('common:Titles.Proposals')}`:
        return (
          <>
            <ProposalsTab request={requestProposals} />
          </>
        );
      default:
        return <div />;
    }
  };

  const tabProps: ITabs = {
    headers: tableHeaders,
    onClick: header => {
      setSelectedTab(header),
        setQueryAndRouter({ ...router.query, tab: header }, router);
    },
  };

  return (
    <Container>
      <Header>
        <Title title={t('common:Titles.Proposals')} Icon={Icon} />
      </Header>
      <CardContainer>
        <CardContent />
      </CardContainer>
      <Tabs {...tabProps}>
        <SelectedTabComponent />
      </Tabs>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => {
  const props = await serverSideTranslations(
    locale,
    ['common', 'proposals'],
    nextI18nextConfig,
    ['en'],
  );

  return { props };
};

export default Proposals;
