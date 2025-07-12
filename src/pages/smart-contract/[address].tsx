import {
  Container,
  Header,
  CardContent,
  Row,
  CardContainer,
  CardHeader,
  CardHeaderItem,
  CardTabContainer,
  CenteredRow,
  Badge,
} from '@/styles/common';
import Title from '@/components/Layout/Title';
import React, { useEffect, useRef, useState } from 'react';
import { Transactions } from '@/assets/cards';
import { useRouter } from 'next/router';
import {
  ArrowData,
  DataCard,
  DataCardContent,
  DataCardLatest,
  DataCardValue,
} from '@/views/home';
import { DefaultCards } from '@/components/Home/CardDataFetcher/HomeDataCards';
import { useSmartContractData } from '@/contexts/smartContractPage';
import api from '@/services/api';
import { SmartContractData } from '@/types/smart-contract';
import { parseAddress } from '@/utils/parseValues';
import Copy from '@/components/Copy';
import SmartContractsTransactions from '@/components/SmartContracts/SmartContractsTransactions';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18nextConfig from '../../../next-i18next.config';
import { WhiteTick, RedFailed } from '@/assets/icons';

const SmartContractInvoke: React.FC = () => {
  const router = useRouter();
  const tabHeaders = [{ label: 'Transactions', value: 'transactions' }];
  const [selectedTab, setSelectedTab] = useState(tabHeaders[0].label);
  const [scData, setScData] = useState<SmartContractData>();
  const dataCardsRef = useRef<HTMLDivElement>(null);
  const contractAddress = router.query.address as string;

  const { beforeYesterdayTransactions, smartContractsTotalTransactions } =
    useSmartContractData();

  const requestSmartContractData = async () => {
    try {
      const res = await api.get({
        route: `sc/${contractAddress}`,
      });

      if (!res.error || res.error === '') {
        const data = {
          ...res,
          data: { sc: res.data.sc },
        };
        setScData(data.data.sc);
      }
    } catch (error) {
      console.error('Error fetching smart contract data:', error);
    }
  };

  const dataCards = [
    {
      Icon: Transactions,
      title: 'Total Transactions',
      value: smartContractsTotalTransactions,
      variation: `+ ${(beforeYesterdayTransactions ?? 0).toLocaleString()}`,
    },
  ];

  useEffect(() => {
    requestSmartContractData();
    setSelectedTab(tabHeaders[0].label);
  }, []);

  const SelectedComponent = () => {
    switch (selectedTab) {
      case 'Transactions':
        return <SmartContractsTransactions contractAddress={contractAddress} />;
      default:
        return <div />;
    }
  };

  const formatKey = (str: string) => {
    return str.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase());
  };

  return (
    <Container>
      <Header>
        <Title title={parseAddress(contractAddress, 25)} />
      </Header>
      <CardContainer>
        <CardContent>
          <Row>
            <span>
              <strong>Owner</strong>
            </span>
            <strong>
              <CenteredRow>
                {scData?.deployer}
                <Copy data={scData?.deployer} info="Owner" />
              </CenteredRow>
            </strong>
          </Row>
          <Row>
            <span>
              <strong>Address</strong>
            </span>
            <strong>
              <CenteredRow>
                {contractAddress}
                <Copy data={contractAddress} info="contractAddress" />
              </CenteredRow>
            </strong>
          </Row>
          <Row>
            <span>
              <strong>Properties</strong>
            </span>
            <strong>
              <CenteredRow>
                {Object.entries(scData?.properties || {}).map(
                  ([key, value]) => (
                    <Badge key={key} active={value}>
                      {value ? <WhiteTick /> : <RedFailed />} {formatKey(key)}
                    </Badge>
                  ),
                )}
              </CenteredRow>
            </strong>
          </Row>
        </CardContent>
      </CardContainer>
      <CardContainer>
        <div style={{ width: '100%' }} ref={dataCardsRef}>
          {dataCards.map(({ title, value, variation }, index) => (
            <DataCard key={String(index)}>
              <DefaultCards index={index} />
              <DataCardContent>
                <span>{title}</span>
                <DataCardValue>
                  <p>{value?.toLocaleString() || 0}</p>
                </DataCardValue>
                {variation && !variation.includes('%') && (
                  <DataCardLatest positive={variation.includes('+')}>
                    <ArrowData $positive={variation.includes('+')} />
                    <p>{variation}/24h</p>
                  </DataCardLatest>
                )}
              </DataCardContent>
            </DataCard>
          ))}
        </div>
      </CardContainer>
      <CardTabContainer>
        <CardHeader>
          {tabHeaders.map((header, index) => (
            <CardHeaderItem
              key={String(index)}
              selected={selectedTab === header.label}
              onClick={() => setSelectedTab(header.label)}
            >
              <span>{header.label}</span>
            </CardHeaderItem>
          ))}
        </CardHeader>
        <CardContent>
          <SelectedComponent />
        </CardContent>
      </CardTabContainer>
    </Container>
  );
};

// export const getServerSideProps: GetServerSideProps = async ({
//   locale = 'en',
// }) => {
//   if (process.env.NODE_ENV !== 'development') {
//     return {
//       notFound: true,
//     };
//   }
//   const props = await serverSideTranslations(
//     locale,
//     ['common'],
//     nextI18nextConfig,
//     ['en'],
//   );
//   return { props };
// };

export default SmartContractInvoke;
