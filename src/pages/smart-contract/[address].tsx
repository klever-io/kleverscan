import {
  Container,
  Header,
  CardContent,
  Row,
  CardContainer,
  CardHeader,
  CardHeaderItem,
  CardTabContainer,
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
import {
  SmartContractDataProvider,
  useSmartContractData,
} from '@/contexts/smartContractPage';
import Table, { ITable } from '@/components/Table';
import { smartContractInvokesTransactionsTableHeaders } from '@/utils/contracts';
import api from '@/services/api';
import { InvokesList } from '@/types/smart-contract';
import { IRowSection } from '@/types';
import { parseAddress } from '@/utils/parseValues';
import { formatDate } from '@/utils/formatFunctions';
import { getAge } from '@/utils/timeFunctions';
import { useTranslation } from 'next-i18next';
import { fromUnixTime } from 'date-fns';

const invokesListRowSections = (invokes: InvokesList): IRowSection[] => {
  const { t: commonT } = useTranslation('common');
  const {
    hash,
    blockNumber,
    sender,
    nonce,
    timestamp,
    kAppFee,
    bandwidthFee,
    status,
    resultCode,
    version,
    chainID,
    signature,
  } = invokes;

  return [
    {
      // tx hash
      element: props => (
        <Row>
          <span>{parseAddress(hash, 12)}</span>
        </Row>
      ),
      span: 1,
    },
    {
      // age
      element: props => (
        <Row>
          <span>{getAge(fromUnixTime(timestamp), commonT)}</span>
        </Row>
      ),
      span: 1,
    },
    {
      // from
      element: props => (
        <Row>
          <span>{parseAddress(sender, 12)}</span>
        </Row>
      ),
      span: 1,
    },
  ];
};

const SmartContractInvoke: React.FC = () => {
  const router = useRouter();
  const tabHeaders = [
    { label: 'Transactions', value: 'transactions' },
    { label: 'Logs', value: 'logs' },
  ];
  const [selectedTab, setSelectedTab] = useState(tabHeaders[0].label);
  const dataCardsRef = useRef<HTMLDivElement>(null);

  const { beforeYesterdayTransactions, smartContractsTotalTransactions } =
    useSmartContractData();

  const requestInvokesList = async (page: number, limit: number) => {
    try {
      const res = await api.get({
        route: `sc/invokes/${router.query.address}`,
      });

      if (!res.error || res.error === '') {
        const data = {
          ...res,
          data: { invokes: res.data.invokes },
        };
        return data;
      }
    } catch (error) {
      console.error('Error fetching invokes list:', error);
      return [];
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
    setSelectedTab(tabHeaders[0].label);
  }, []);

  const tableProps: ITable = {
    type: 'smartContractsInvokes',
    header: smartContractInvokesTransactionsTableHeaders,
    rowSections: invokesListRowSections,
    request: (page, limit) => requestInvokesList(page, limit),
    dataName: 'invokes',
    showLimit: false,
  };

  const SelectedComponent = () => {
    switch (selectedTab) {
      case 'Transactions':
        return <Table {...tableProps} />;
      case 'Logs':
        return <h1 style={{ color: 'white' }}>FAço nada</h1>;
      default:
        return <div />;
    }
  };

  return (
    <Container>
      <Header>
        <Title title={parseAddress(router.query.address, 25)} />
      </Header>
      <CardContainer>
        <CardContent>
          <Row>
            <span>
              <strong>Owner</strong>
            </span>
            <strong>
              klv1fr724pjdjp3l8unuvgda0k6vt06d875hj7t5ggrxymzcg3jcveysejzljc
            </strong>
          </Row>
          <Row>
            <span>
              <strong>Address</strong>
            </span>
            <strong>
              klv1fr724pjdjp3l8unuvgda0k6vt06d875hj7t5ggrxymzcg3jcveysejzljc
            </strong>
          </Row>
          <Row>
            <span>
              <strong>Properties</strong>
            </span>
            <strong></strong>
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

export default SmartContractInvoke;
