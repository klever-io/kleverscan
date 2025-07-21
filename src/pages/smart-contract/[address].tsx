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
  BadgeContainer,
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
  DataCardsContent,
  DataCardValue,
} from '@/views/home';
import { DefaultCards } from '@/components/Home/CardDataFetcher/HomeDataCards';
import api from '@/services/api';
import { smartContractBeforeYesterdayTransactionsCall } from '@/services/requests/smartContracts';
import { SmartContractDetailsData } from '@/types/smart-contract';
import { parseAddress } from '@/utils/parseValues';
import Copy from '@/components/Copy';
import SmartContractsTransactions from '@/components/SmartContracts/SmartContractsTransactions';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18nextConfig from '../../../next-i18next.config';
import { WhiteTick, RedFailed } from '@/assets/icons';
import { useMobile } from '@/contexts/mobile';
import { timestampToDate } from '@/utils/timeFunctions';

const SmartContractInvoke: React.FC = () => {
  const router = useRouter();
  const { isMobile } = useMobile();
  const contractAddress = router.query.address as string;
  const tabHeaders = [{ label: 'Transactions', value: 'transactions' }];
  const [selectedTab, setSelectedTab] = useState(tabHeaders[0].label);
  const [invokesTotalRecords, setInvokesTotalRecords] = useState<number>(0);
  const [scData, setScData] = useState<SmartContractDetailsData>();
  const [beforeYesterdayTransactions, setBeforeYesterdayTransactions] =
    useState<number>(0);
  const dataCardsRef = useRef<HTMLDivElement>(null);

  const requestBeforeYesterdayTransactions = async () => {
    try {
      const res =
        await smartContractBeforeYesterdayTransactionsCall(contractAddress);

      if (res) {
        setBeforeYesterdayTransactions(res.beforeYesterdayTxs);
      }
    } catch (error) {
      console.error('Error fetching before yesterday transactions:', error);
    }
  };

  const requestInvokesTotalRecords = async () => {
    try {
      const res = await api.get({
        route: `sc/invokes/${contractAddress}`,
      });

      if (!res.error || res.error === '') {
        setInvokesTotalRecords(res.pagination.totalRecords);
      }
    } catch (error) {
      console.error('Error fetching invokes list:', error);
      return [];
    }
  };

  const requestSmartContractData = async () => {
    try {
      const res = await api.get({
        route: `sc/${contractAddress}`,
      });

      if (!res.error || res.error === '') {
        const data = {
          ...res,
          data: { sc: res.data.sc },
          pagination: res.pagination,
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
      value: invokesTotalRecords,
      variation: `+ ${(beforeYesterdayTransactions ?? 0).toLocaleString()}`,
    },
  ];

  useEffect(() => {
    if (!contractAddress) return;
    requestBeforeYesterdayTransactions();
    requestSmartContractData();
    requestInvokesTotalRecords();
    setSelectedTab(tabHeaders[0].label);
  }, [contractAddress]);

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
            <span>
              <CenteredRow>
                {parseAddress(scData?.deployer || '', isMobile ? 35 : NaN)}
                <Copy data={scData?.deployer} info="Owner" />
              </CenteredRow>
            </span>
          </Row>
          <Row>
            <span>
              <strong>Address</strong>
            </span>
            <span>
              <CenteredRow>
                {parseAddress(contractAddress, isMobile ? 35 : NaN)}
                <Copy data={contractAddress} info="Contract Address" />
              </CenteredRow>
            </span>
          </Row>
          <Row>
            <span>
              <strong>Properties</strong>
            </span>
            <span>
              <CenteredRow>
                <BadgeContainer>
                  {Object.entries(scData?.properties || {}).map(
                    ([key, value]) => (
                      <Badge key={key} active={value}>
                        {value ? <WhiteTick /> : <RedFailed />} {formatKey(key)}
                      </Badge>
                    ),
                  )}
                </BadgeContainer>
              </CenteredRow>
            </span>
          </Row>
        </CardContent>
      </CardContainer>
      <CardContainer>
        <DataCardsContent ref={dataCardsRef}>
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
          <DataCard>
            <DataCardContent>
              <span>Created At</span>
              <DataCardValue>
                <p>
                  {scData?.createdAt ? timestampToDate(scData.createdAt) : '--'}
                </p>
              </DataCardValue>
            </DataCardContent>
          </DataCard>
        </DataCardsContent>
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
//     ['en'],
//   );
//   return { props };
// };

export default SmartContractInvoke;
