import { Transactions } from '@/assets/cards';
import { RedFailed, WhiteTick } from '@/assets/icons';
import Copy from '@/components/Copy';
import { DefaultCards } from '@/components/Home/CardDataFetcher/HomeDataCards';
import Title from '@/components/Layout/Title';
import {
  ContractSourceTab,
  ContractVerifyTab,
} from '@/components/SmartContracts/ContractVerification';
import {
  ContractReadTab,
  ContractWriteTab,
} from '@/components/SmartContracts/ContractInteraction';
import SmartContractsTransactions from '@/components/SmartContracts/SmartContractsTransactions';
import { useExtension } from '@/contexts/extension';
import { useMobile } from '@/contexts/mobile';
import api from '@/services/api';
import {
  fetchContractInfo,
  fetchLatestJob,
} from '@/services/requests/contractValidator';
import { smartContractBeforeYesterdayTransactionsCall } from '@/services/requests/smartContracts';
import {
  Badge,
  BadgeContainer,
  CardContainer,
  CardContent,
  CardHeader,
  CardHeaderItem,
  CardTabContainer,
  CenteredRow,
  Container,
  Header,
  Row,
} from '@/styles/common';
import { SmartContractDetailsData } from '@/types/smart-contract';
import { isKVMAvailable } from '@/utils/kvm';
import { getNetwork } from '@/utils/networkFunctions';
import { parseAddress } from '@/utils/parseValues';
import { timestampToDate } from '@/utils/timeFunctions';
import {
  DataCard,
  DataCardContent,
  DataCardsContent,
  DataCardValue,
} from '@/views/home';
import { useQuery } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import nextI18nextConfig from '../../../next-i18next.config';

const SmartContractInvoke: React.FC = () => {
  const router = useRouter();
  const { isMobile } = useMobile();
  const { walletAddress } = useExtension();
  const contractAddress = router.query.address as string;

  const [invokesTotalRecords, setInvokesTotalRecords] = useState<number>(0);
  const [scData, setScData] = useState<SmartContractDetailsData>();
  const [beforeYesterdayTransactions, setBeforeYesterdayTransactions] =
    useState<number>(0);
  const dataCardsRef = useRef<HTMLDivElement>(null);

  const isOwner =
    !!walletAddress && !!scData?.deployer && walletAddress === scData.deployer;

  const { data: contractInfo, refetch: refetchContractInfo } = useQuery({
    queryKey: ['contractInfo', contractAddress],
    queryFn: () => fetchContractInfo(contractAddress),
    enabled: !!contractAddress,
  });

  const { data: latestJob, refetch: refetchJob } = useQuery({
    queryKey: ['latestJob', contractAddress],
    queryFn: () => fetchLatestJob(contractAddress),
    enabled: !!contractAddress && isOwner,
    refetchInterval: query => {
      const status = query.state.data?.status;
      if (status === 'pending' || status === 'running') return 3000;
      return false;
    },
  });

  const hasVerifiedVersions = (contractInfo?.contractVersions?.length ?? 0) > 0;

  const tabHeaders = useMemo(() => {
    const tabs = [{ label: 'Transactions', value: 'transactions' }];
    if (hasVerifiedVersions) {
      tabs.push({ label: 'Contract Source', value: 'contract-source' });
      tabs.push({ label: 'Read Contract', value: 'read-contract' });
      tabs.push({ label: 'Write Contract', value: 'write-contract' });
    }
    if (isOwner) {
      tabs.push({ label: 'Verify Contract', value: 'verify' });
    }
    return tabs;
  }, [hasVerifiedVersions, isOwner]);

  const [selectedTab, setSelectedTab] = useState(tabHeaders[0].label);

  useEffect(() => {
    if (!tabHeaders.some(tab => tab.label === selectedTab)) {
      setSelectedTab(tabHeaders[0].label);
    }
  }, [tabHeaders, selectedTab]);

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

  const SelectedComponent = () => {
    switch (selectedTab) {
      case 'Transactions':
        return <SmartContractsTransactions contractAddress={contractAddress} />;
      case 'Contract Source':
        return contractInfo ? (
          <ContractSourceTab
            contractAddress={contractAddress}
            contractInfo={contractInfo}
          />
        ) : null;
      case 'Read Contract':
        return contractInfo ? (
          <ContractReadTab
            contractAddress={contractAddress}
            contractInfo={contractInfo}
          />
        ) : null;
      case 'Write Contract':
        return contractInfo ? (
          <ContractWriteTab
            contractAddress={contractAddress}
            contractInfo={contractInfo}
          />
        ) : null;
      case 'Verify Contract':
        return (
          <ContractVerifyTab
            contractAddress={contractAddress}
            latestJob={latestJob ?? null}
            hasVerifiedVersions={hasVerifiedVersions}
            onSubmitted={() => {
              refetchJob();
              refetchContractInfo();
            }}
          />
        );
      default:
        return <div />;
    }
  };

  const formatKey = (str: string) => {
    return str
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/(^\w|\s\w)/g, m => m.toUpperCase());
  };

  useEffect(() => {
    if (contractAddress) {
      requestBeforeYesterdayTransactions();
      requestSmartContractData();
      requestInvokesTotalRecords();
      setSelectedTab(tabHeaders[0].label);
    }
  }, [contractAddress]);

  return (
    <Container>
      <Header>
        <Title
          title={
            scData?.name ? scData?.name : parseAddress(contractAddress, 25)
          }
          route={`/smart-contracts`}
        />
      </Header>
      <CardContainer>
        <CardContent>
          <Row>
            <span>
              <strong>Owner</strong>
            </span>
            <span>
              <CenteredRow>
                <Link href={`/account/${scData?.deployer}`}>
                  {parseAddress(scData?.deployer || '', isMobile ? 35 : NaN)}
                </Link>
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
                <Link href={`/account/${contractAddress}`}>
                  {parseAddress(contractAddress, isMobile ? 35 : NaN)}
                </Link>
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
        <SelectedComponent />
      </CardTabContainer>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => {
  const network = getNetwork();
  if (!isKVMAvailable(network)) {
    return {
      notFound: true,
    };
  }
  const props = await serverSideTranslations(
    locale,
    ['common'],
    nextI18nextConfig,
    ['en'],
  );
  return { props };
};

export default SmartContractInvoke;
