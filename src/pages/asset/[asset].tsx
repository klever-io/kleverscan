import React, { useState } from 'react';
import { useDidUpdateEffect } from '@/utils/hooks';

import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';

import {
  AssetTitle,
  CardContainer,
  CardContent,
  CardHeader,
  CardHeaderItem,
  Container,
  Header,
  Input,
  Row,
  Title,
  LetterLogo,
  Logo,
} from '@/views/assets/detail';

import api from '@/services/api';
import {
  IAsset,
  IPagination,
  IResponse,
  ITransaction,
  IAccountAsset,
} from '@/types/index';

import {
  parseHardCodedInfo,
  toLocaleFixed,
  breakText,
  timestampToDate
} from '@/utils/index';

import { ArrowLeft } from '@/assets/icons';
import Tabs, { ITabs } from '@/components/Tabs';
import Transactions from '@/components/Tabs/Transactions';
import Holders from '@/components/Tabs/Holders';
import { PaginationContainer } from '@/components/Pagination/styles';
import Pagination from '@/components/Pagination';
import { ISelectedDays } from '@/components/DateFilter';

interface IAssetPage {
  asset: IAsset;
  transactions: ITransaction[];
  totalTransactions: number;
  totalTransactionsPage: number;
  totalHoldersPage: number;
  holders: IAccountAsset[];
  totalRecords: number;
}

interface IAssetResponse extends IResponse {
  data: {
    asset: IAsset;
  };
}

interface IHoldersResponse extends IResponse {
  data: {
    accounts: IAccountAsset[];
  };
  pagination: IPagination;
}

interface ITransactionResponse extends IResponse {
  data: {
    transactions: ITransaction[];
  };
  pagination: IPagination;
}

const Asset: React.FC<IAssetPage> = ({
  asset,
  transactions: defaultTransactions,
  totalTransactions,
  holders: defaultHolders,
  totalHoldersPage,
  totalTransactionsPage: defaultTotalTransactionsPage,
  totalRecords,
}) => {
  const {
    name,
    uris,
    assetId,
    assetType,
    issueDate,
    ownerAddress,
    precision,
    maxSupply,
    initialSupply,
    circulatingSupply,
  } = asset;

  const router = useRouter();
  const cardHeaders = ['Overview', 'More'];
  const tableHeaders = ['Transactions', 'Holders'];

  const [selectedCard, setSelectedCard] = useState(cardHeaders[0]);
  const [selectedTab, setSelectedTab] = useState(tableHeaders[0]);

  const [transactionsPage, setTransactionsPage] = useState(0);
  const [totalTransactionsPage, setTotalTransactionsPage] = useState(
    defaultTotalTransactionsPage,
  );
  const [transactions, setTransactions] = useState(defaultTransactions);
  const [dateFilter, setDateFilter] = useState({
    start: '',
    end: '',
  });
  const [holdersPage, setHoldersPage] = useState(0);
  const [holders, setHolders] = useState(defaultHolders);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [loadingHolders, setLoadingHolders] = useState(false);

  useDidUpdateEffect(() => {
    setLoadingTransactions(true);
    const fetchData = async () => {
      setLoadingTransactions(true);

      const query = dateFilter.start
        ? {
            page: transactionsPage,
            asset: asset.assetId,
            startdate: dateFilter.start ? dateFilter.start : undefined,
            enddate: dateFilter.end ? dateFilter.end : undefined,
          }
        : {
            page: transactionsPage,
            asset: asset.assetId,
          };

      const response: ITransactionResponse = await api.get({
        route: `transaction/list`,
        query,
      });
      if (!response.error) {
        setTransactions(response.data.transactions);
        setTotalTransactionsPage(response.pagination.totalPages);
        setLoadingTransactions(false);
      }
    };

    fetchData();
  }, [transactionsPage, dateFilter]);

  useDidUpdateEffect(() => {
    setLoadingHolders(true);
    const fetchData = async () => {
      const response: IHoldersResponse = await api.get({
        route: `assets/holders/${asset.assetId}?page=${holdersPage}`,
      });
      if (!response.error) {
        setHolders(response.data.accounts);
        setLoadingHolders(false);
      }
    };

    fetchData();
  }, [holdersPage]);

  const renderLogo = () => {
    const regex = /[\/.](gif|jpg|jpeg|tiff|png)$/i;
    if (regex.test(asset.logo)) {
      return <Logo alt={`${name}-logo`} src={asset.logo} />;
    }
    return <LetterLogo>{asset.ticker.split('')[0]}</LetterLogo>;
  };

  const getWhitepaper = () => {
    if (!uris || !uris.Whitepaper) {
      return <>--</>;
    }

    return <a href="#">{breakText(uris.Whitepaper, 25)}</a>;
  }

  const getWebsite = () => {
    if (!uris || !uris.Website) {
      return <>--</>;
    }

    return <a href="#">{uris.Website}</a>;
  }

  const getIssueDate = () => {
    if (issueDate) {
      return timestampToDate(issueDate);
    }

    return '--';
  }

  const Overview: React.FC = () => {
    return (
      <>
        <Row>
          <span>
            <strong>Owner</strong>
          </span>
          <span>
            <Link href={`/account/${ownerAddress}`}>{ownerAddress}</Link>
          </span>
        </Row>
        <Row>
          <span>
            <strong>Max Supply</strong>
          </span>
          <span>
            <small>
              {toLocaleFixed(maxSupply / 10 ** precision, precision)}
            </small>
          </span>
        </Row>
        <Row>
          <span>
            <strong>Initial Supply</strong>
          </span>
          <span>
            <small>
              {toLocaleFixed(initialSupply / 10 ** precision, precision)}
            </small>
          </span>
        </Row>
        <Row>
          <span>
            <strong>Circulating Supply</strong>
          </span>
          <span>
            <small>
              {toLocaleFixed(circulatingSupply / 10 ** precision, precision)}
            </small>
          </span>
        </Row>
        <Row>
          <span>
            <strong>Holders</strong>
          </span>
          <span>{totalRecords}</span>
        </Row>
        <Row>
          <span>
            <strong>Transactions</strong>
          </span>
          <span>{totalTransactions}</span>
        </Row>
        <Row>
          <span>
            <strong>Market Cap</strong>
          </span>
          <span>--</span>
        </Row>
      </>
    );
  };

  const More: React.FC = () => {
    return (
      <>
        <Row>
          <span>
            <strong>White Papper</strong>
          </span>
          <span>{getWhitepaper()}</span>
        </Row>
        <Row>
          <span>
            <strong>Official Website</strong>
          </span>
          <span>{getWebsite()}</span>
        </Row>
        <Row>
          <span>
            <strong>Issuing Time</strong>
          </span>
          <span>{getIssueDate()}</span>
        </Row>
        <Row>
          <span>
            <strong>Issuer</strong>
          </span>
          <span>{ownerAddress ? ownerAddress : '--'}</span>
        </Row>
        <Row>
          <span>
            <strong>Precision</strong>
          </span>
          <span>{precision}</span>
        </Row>
      </>
    );
  };

  const SelectedComponent: React.FC = () => {
    switch (selectedCard) {
      case 'Overview':
        return <Overview />;
      case 'More':
        return <More />;
      default:
        return <div />;
    }
  };

  const SelectedTabComponent: React.FC = () => {
    switch (selectedTab) {
      case 'Transactions':
        return (
          <>
            <Transactions
              transactions={transactions}
              precision={precision}
              loading={loadingTransactions}
            />
            <PaginationContainer>
              <Pagination
                count={totalTransactionsPage}
                page={transactionsPage}
                onPaginate={page => {
                  setTransactionsPage(page);
                }}
              />
            </PaginationContainer>
          </>
        );
      case 'Holders':
        return (
          <>
            <Holders asset={asset} holders={holders} loading={loadingHolders} />
            <PaginationContainer>
              <Pagination
                count={totalHoldersPage}
                page={holdersPage}
                onPaginate={page => {
                  setHoldersPage(page);
                }}
              />
            </PaginationContainer>
          </>
        );
      default:
        return <div />;
    }
  };
  const resetDate = () => {
    setTransactionsPage(0);
    setDateFilter({
      start: '',
      end: '',
    });
  };

  const filterDate = (selectedDays: ISelectedDays) => {
    setTransactionsPage(0);
    setDateFilter({
      start: selectedDays.start.getTime().toString(),
      end: selectedDays.end
        ? (selectedDays.end.getTime() + 24 * 60 * 60 * 1000).toString()
        : (selectedDays.start.getTime() + 24 * 60 * 60 * 1000).toString(),
    });
  };

  const tabProps: ITabs = {
    headers: tableHeaders,
    onClick: header => setSelectedTab(header),
    dateFilterProps: {
      resetDate,
      filterDate,
      empty: transactions.length === 0,
    },
  };

  return (
    <Container>
      <Header>
        <Title>
          <div onClick={router.back}>
            <ArrowLeft />
          </div>
          {renderLogo()}

          <AssetTitle>
            <h1>
              {name} ({assetId})
            </h1>
            <div>{assetType}</div>
          </AssetTitle>
        </Title>

        <Input />
      </Header>

      <CardContainer>
        <CardHeader>
          {cardHeaders.map((header, index) => (
            <CardHeaderItem
              key={String(index)}
              selected={selectedCard === header}
              onClick={() => setSelectedCard(header)}
            >
              <span>{header}</span>
            </CardHeaderItem>
          ))}
        </CardHeader>

        <CardContent>
          <SelectedComponent />
        </CardContent>
      </CardContainer>

      <Tabs {...tabProps}>
        <SelectedTabComponent />
      </Tabs>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps<IAssetPage> = async ({
  params,
}) => {
  const props: IAssetPage = {
    asset: {} as IAsset,
    transactions: [],
    totalTransactions: 0,
    totalHoldersPage: 0,
    totalTransactionsPage: 0,
    holders: [],
    totalRecords: 0,
  };

  const redirectProps = { redirect: { destination: '/404', permanent: false } };

  const assetId = params?.asset;

  const asset: IAssetResponse = await api.get({ route: `assets/${assetId}` });
  if (asset.error) {
    return redirectProps;
  } else {
    props.asset = parseHardCodedInfo([asset.data.asset])[0];
  }

  const transactions: ITransactionResponse = await api.get({
    route: `transaction/list?asset=${assetId}`,
  });
  if (!transactions.error) {
    props.transactions = transactions.data.transactions;
    props.totalTransactions = transactions.pagination.totalRecords;
    props.totalTransactionsPage = transactions.pagination.totalPages;
  }

  const holders: IHoldersResponse = await api.get({
    route: `assets/holders/${assetId}`,
  });
  if (!holders.error) {
    props.holders = holders.data.accounts;
    props.totalHoldersPage = holders.pagination.totalPages;
    props.totalRecords = holders.pagination.totalRecords;
  }

  return { props };
};

export default Asset;
