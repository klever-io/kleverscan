import React from 'react';
import { Accounts as Icon } from '@/assets/title-icons';
import { PropsWithChildren } from 'react';
import { Container, FlexSpan, Header, Mono } from '@/styles/common';
import Title from '@/components/Layout/Title';
import { parseAddress } from '@/utils/parseValues';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18nextConfig from '../../../next-i18next.config';
import { useTranslation } from 'react-i18next';
import { HomeInput } from '@/components/InputGlobal/HomeInput';
import AssetLogo from '@/components/Logo/AssetLogo';
import Input from '@/components/Input';
import Copy from '@/components/Copy';
// import Table, { ITable } from '@/components/Table';
import { smartContractsTableHeaders } from '@/utils/contracts';
import { useRouter } from 'next/router';
import {
  CardContainer,
  CardContractInfo,
  CardContractName,
  CardHeader,
  CardsContainerWrapper,
  CardsTitleWrapper,
  CellTableContractName,
  CellTableContractNameWrapper,
  InputContractContainer,
  SearchInputContainer,
  SmartContractDataCard,
  SmartContractDataCardHeader,
  SmartContractDataCardHeaderItem,
  SmartContractDataCardInfo,
  SmartContractDataCardInfoColumn,
  SmartContractDataWrapper,
  TitleSection,
} from './style';
import {
  Cell,
  HeaderItem,
  Row,
  Table,
} from '@/components/Home/MostTransacted/styles';
import HomeDataCards from '@/components/Home/CardDataFetcher/HomeDataCards';
import { HomeDataProvider } from '@/contexts/mainPage';
import { ChartDailyTransactions } from '@/components/Home/HomeTransactions/ChartDailyTransactions';
import { DataCardsContainer } from '@/views/home';
import { useMobile } from '@/contexts/mobile';
import { Search } from '@/assets/icons';

const ContractApps = [
  {
    constract: '000000',
    name: 'Contract Name',
    address: 'klv1fr724pjdjp3l8unuvgda0k6vt06d875hj7t5ggrxymzcg3jcveysejzljc',
  },
  {
    constract: '000000',
    name: 'Contract Name',
    address: 'klv1fr724pjdjp3l8unuvgda0k6vt06d875hj7t5ggrxymzcg3jcveysejzljc',
  },
  {
    constract: '000000',
    name: 'Contract Name',
    address: 'klv1fr724pjdjp3l8unuvgda0k6vt06d875hj7t5ggrxymzcg3jcveysejzljc',
  },
  {
    constract: '000000',
    name: 'Contract Name',
    address: 'klv1fr724pjdjp3l8unuvgda0k6vt06d875hj7t5ggrxymzcg3jcveysejzljc',
  },
  {
    constract: '000000',
    name: 'Contract Name',
    address: 'klv1fr724pjdjp3l8unuvgda0k6vt06d875hj7t5ggrxymzcg3jcveysejzljc',
  },
  {
    constract: '000000',
    name: 'Contract Name',
    address: 'klv1fr724pjdjp3l8unuvgda0k6vt06d875hj7t5ggrxymzcg3jcveysejzljc',
  },
  {
    constract: '000000',
    name: 'Contract Name',
    address: 'klv1fr724pjdjp3l8unuvgda0k6vt06d875hj7t5ggrxymzcg3jcveysejzljc',
  },
  {
    constract: '000000',
    name: 'Contract Name',
    address: 'klv1fr724pjdjp3l8unuvgda0k6vt06d875hj7t5ggrxymzcg3jcveysejzljc',
  },
  {
    constract: '000000',
    name: 'Contract Name',
    address: 'klv1fr724pjdjp3l8unuvgda0k6vt06d875hj7t5ggrxymzcg3jcveysejzljc',
  },
  {
    constract: '000000',
    name: 'Contract Name',
    address: 'klv1fr724pjdjp3l8unuvgda0k6vt06d875hj7t5ggrxymzcg3jcveysejzljc',
  },
];

const smartContractsData = [
  {
    contractName: 'Contract Name',
    contractAddress:
      'klv1fr724pjdjp3l8unuvgda0k6vt06d875hj7t5ggrxymzcg3jcveysejzljc',
    rewards: '0000000',
    balance: '0000000',
    logo: '/assets/klv-logo.png?w=1920',
    ticker: 'KLV',
    totalTransactions: 1,
    firstDeployed: 15000,
    lastDeployed: 15,
  },
  {
    contractName: 'Contract Name',
    contractAddress:
      'klv1fr724pjdjp3l8unuvgda0k6vt06d875hj7t5ggrxymzcg3jcveysejzljc',
    rewards: '0000000',
    balance: '0000000',
    logo: '/assets/klv-logo.png?w=1920',
    ticker: 'KLV',
    totalTransactions: 1,
    firstDeployed: 15,
    lastDeployed: 15,
  },
  {
    contractName: 'Contract Name',
    contractAddress:
      'klv1fr724pjdjp3l8unuvgda0k6vt06d875hj7t5ggrxymzcg3jcveysejzljc',
    rewards: '0000000',
    balance: '0000000',
    logo: '/assets/klv-logo.png?w=1920',
    ticker: 'KLV',
    totalTransactions: 1,
    firstDeployed: 15,
    lastDeployed: 15,
  },
  {
    contractName: 'Contract Name',
    contractAddress:
      'klv1fr724pjdjp3l8unuvgda0k6vt06d875hj7t5ggrxymzcg3jcveysejzljc',
    rewards: '0000000',
    balance: '0000000',
    logo: '/assets/klv-logo.png?w=1920',
    ticker: 'KLV',
    totalTransactions: 1,
    firstDeployed: 15,
    lastDeployed: 15,
  },
  {
    contractName: 'Contract Name',
    contractAddress:
      'klv1fr724pjdjp3l8unuvgda0k6vt06d875hj7t5ggrxymzcg3jcveysejzljc',
    rewards: '0000000',
    balance: '0000000',
    logo: '/assets/klv-logo.png?w=1920',
    ticker: 'KLV',
    totalTransactions: 1,
    firstDeployed: 15,
    lastDeployed: 15,
  },
  {
    contractName: 'Contract Name',
    contractAddress:
      'klv1fr724pjdjp3l8unuvgda0k6vt06d875hj7t5ggrxymzcg3jcveysejzljc',
    rewards: '0000000',
    balance: '0000000',
    logo: '/assets/klv-logo.png?w=1920',
    ticker: 'KLV',
    totalTransactions: 1,
    firstDeployed: 15,
    lastDeployed: 15,
  },
  {
    contractName: 'Contract Name',
    contractAddress:
      'klv1fr724pjdjp3l8unuvgda0k6vt06d875hj7t5ggrxymzcg3jcveysejzljc',
    rewards: '0000000',
    balance: '0000000',
    logo: '/assets/klv-logo.png?w=1920',
    ticker: 'KLV',
    totalTransactions: 1,
    firstDeployed: 15,
    lastDeployed: 15,
  },
  {
    contractName: 'Contract Name',
    contractAddress:
      'klv1fr724pjdjp3l8unuvgda0k6vt06d875hj7t5ggrxymzcg3jcveysejzljc',
    rewards: '0000000',
    balance: '0000000',
    logo: '/assets/klv-logo.png?w=1920',
    ticker: 'KLV',
    totalTransactions: 1,
    firstDeployed: 15,
    lastDeployed: 15,
  },
  {
    contractName: 'Contract Name',
    contractAddress:
      'klv1fr724pjdjp3l8unuvgda0k6vt06d875hj7t5ggrxymzcg3jcveysejzljc',
    rewards: '0000000',
    balance: '0000000',
    logo: '/assets/klv-logo.png?w=1920',
    ticker: 'KLV',
    totalTransactions: 1,
    firstDeployed: 15,
    lastDeployed: 15,
  },
  {
    contractName: 'Contract Name',
    contractAddress:
      'klv1fr724pjdjp3l8unuvgda0k6vt06d875hj7t5ggrxymzcg3jcveysejzljc',
    rewards: '0000000',
    balance: '0000000',
    logo: '/assets/klv-logo.png?w=1920',
    ticker: 'KLV',
    totalTransactions: 1,
    firstDeployed: 15,
    lastDeployed: 15,
  },
  {
    contractName: 'Contract Name',
    contractAddress:
      'klv1fr724pjdjp3l8unuvgda0k6vt06d875hj7t5ggrxymzcg3jcveysejzljc',
    rewards: '0',
    balance: '0000000',
    logo: '/assets/klv-logo.png?w=1920',
    ticker: 'KLV',
    totalTransactions: 1,
    firstDeployed: 15,
    lastDeployed: 15,
  },
];

const SmartContracts: React.FC<PropsWithChildren> = () => {
  const { t } = useTranslation('smartContracts');
  const router = useRouter();
  const { isMobile, isTablet } = useMobile();

  // const tableProps: ITable = {
  //     type: 'smartContracts',
  //     header: smartContractsTableHeaders,
  //     rowSections: () => {},
  //     dataName: 'smartContracts',
  //     request: (page, limit) => requestSmartContractsDefault(page, limit, router),
  //     Filters: SmartContractsFilters,
  // }

  return (
    <HomeDataProvider>
      <Container>
        <Header>
          <Title title={`${'SmartContracts'}`} Icon={Icon} />
        </Header>
        <SearchInputContainer>
          <InputContractContainer>
            <input type="text" placeholder="Search for contract" />
            <Search />
          </InputContractContainer>
          <span>Sponsored:</span>
          <TitleSection>
            <span>Next crypto project to explode on KleverChain</span>
          </TitleSection>
        </SearchInputContainer>
        <div>
          <DataCardsContainer>
            <HomeDataCards />
            <ChartDailyTransactions />
          </DataCardsContainer>
        </div>

        <CardsTitleWrapper>
          <h3>Most Used Applications</h3>
          <span>Daily</span>
        </CardsTitleWrapper>

        <CardsContainerWrapper>
          {ContractApps.map((app, index) => (
            <CardContainer key={index}>
              <CardHeader>
                <h4>#{index + 1}</h4>
                <CardContractInfo>
                  <span>Transactions</span>
                  <span>{app?.constract}</span>
                </CardContractInfo>
              </CardHeader>
              <CardContractName>
                <AssetLogo
                  logo={'/assets/klv-logo.png?w=1920'}
                  ticker={'KLV'}
                  name={'KLV'}
                />
                <span>{app.name}</span>
                <small>{parseAddress(app.address, 25)}</small>
              </CardContractName>
            </CardContainer>
          ))}
        </CardsContainerWrapper>

        <CardsTitleWrapper>
          <h3>Browse all deployed contracts</h3>
        </CardsTitleWrapper>

        <InputContractContainer>
          <input type="text" placeholder="Search for contract" />
          <Search />
          {/* <Input
                        type="text"
                        placeholder='Search for contract'
                        value=""
                        onChange={() => { }}
                        handleConfirmClick={() => { }}
                    /> */}
        </InputContractContainer>

        {/* <Table {...tableProps} /> */}

        <div style={{ marginTop: '20px' }}>
          {!isMobile && !isTablet ? (
            <Table>
              <thead>
                <Row>
                  <HeaderItem key={0}>#</HeaderItem>
                  {smartContractsTableHeaders.map((item, index) => (
                    <HeaderItem key={index}>{item}</HeaderItem>
                  ))}
                </Row>
              </thead>
              <tbody>
                {smartContractsData.map((item, index) => (
                  <Row key={index}>
                    <Cell>{index}</Cell>
                    <CellTableContractNameWrapper>
                      <AssetLogo
                        logo={item?.logo}
                        ticker={item?.ticker}
                        name={item?.contractName}
                      />
                      <CellTableContractName>
                        {item?.contractName}
                        <small>{parseAddress(item?.contractAddress, 25)}</small>
                      </CellTableContractName>
                    </CellTableContractNameWrapper>
                    <Cell>
                      {item?.rewards}
                      {item?.ticker}
                    </Cell>
                    <Cell>
                      {item?.balance}
                      {item?.ticker}
                    </Cell>
                    <Cell>
                      {item?.totalTransactions}
                      {item?.ticker}
                    </Cell>
                    <Cell>
                      {item?.firstDeployed}
                      {item?.ticker}
                    </Cell>
                    <Cell>
                      {item?.lastDeployed}
                      {item?.ticker}
                    </Cell>
                  </Row>
                ))}
              </tbody>
            </Table>
          ) : (
            <SmartContractDataWrapper>
              {smartContractsData?.map((item, index) => (
                <SmartContractDataCard key={index}>
                  <SmartContractDataCardHeader>
                    <SmartContractDataCardHeaderItem>
                      <AssetLogo
                        logo={item?.logo}
                        ticker={item?.ticker}
                        name={item?.contractName}
                      />
                      <span>{item?.contractName}</span>
                    </SmartContractDataCardHeaderItem>
                    <span>02/12/2024 15:27</span>
                  </SmartContractDataCardHeader>
                  <SmartContractDataCardHeader>
                    <small>{parseAddress(item?.contractAddress, 25)}</small>
                    <Copy data={item?.contractAddress} info="contractAddress" />
                  </SmartContractDataCardHeader>
                  <SmartContractDataCardInfo>
                    <SmartContractDataCardInfoColumn>
                      <span>Balance</span>
                      <span>
                        {item?.balance} {item?.ticker}
                      </span>
                    </SmartContractDataCardInfoColumn>
                    <SmartContractDataCardInfoColumn>
                      <span>Total Transactions</span>
                      <span>
                        {item?.totalTransactions} {item?.ticker}
                      </span>
                    </SmartContractDataCardInfoColumn>
                  </SmartContractDataCardInfo>
                  <SmartContractDataCardInfo>
                    <SmartContractDataCardInfoColumn>
                      <span>First Deployed</span>
                      <span>
                        {item?.firstDeployed} {item?.ticker}
                      </span>
                    </SmartContractDataCardInfoColumn>
                    <SmartContractDataCardInfoColumn>
                      <span>Last Deployed</span>
                      <span>
                        {item?.lastDeployed} {item?.ticker}
                      </span>
                    </SmartContractDataCardInfoColumn>
                  </SmartContractDataCardInfo>
                </SmartContractDataCard>
              ))}
            </SmartContractDataWrapper>
          )}
        </div>
      </Container>
    </HomeDataProvider>
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
