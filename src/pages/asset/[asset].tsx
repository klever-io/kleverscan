import React, { useEffect, useState } from 'react';

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
} from '@/views/assets/detail';

import api from '@/services/api';
import {
  IAsset,
  IPagination,
  IResponse,
  ITransaction,
  IAccountAsset,
} from '@/types/index';
import { toLocaleFixed } from '@/utils/index';

import { ArrowLeft } from '@/assets/icons';
import Tabs, { ITabs } from '@/components/Tabs';
import Transactions from '@/components/Tabs/Transactions';
import Holders from '@/components/Tabs/Holders';
import { PaginationContainer } from '@/components/Pagination/styles';
import Pagination from '@/components/Pagination';

interface IAssetPage {
  asset: IAsset;
  transactions: ITransaction[];
  totalTransactions: number;
  totalTransactionsPage: number;
  totalHoldersPage: number;
  holders: IAccountAsset[];
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
  totalTransactionsPage,
}) => {
  const {
    name,
    assetId,
    assetType,
    ownerAddress,
    precision,
    maxSupply,
    initialSupply,
  } = asset;

  const router = useRouter();
  const cardHeaders = ['Overview', 'More'];
  const tableHeaders = ['Transactions', 'Holders'];

  const [selectedCard, setSelectedCard] = useState(cardHeaders[0]);
  const [selectedTab, setSelectedTab] = useState(tableHeaders[0]);

  const [transactionsPage, setTransactionsPage] = useState(0);
  const [transactions, setTransactions] = useState(defaultTransactions);
  const [holdersPage, setHoldersPage] = useState(0);
  const [holders, setHolders] = useState(defaultHolders);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [loadingHolders, setLoadingHolders] = useState(false);

  useEffect(() => {
    setLoadingTransactions(true);
    const fetchData = async () => {
      const response: ITransactionResponse = await api.get({
        route: `transaction/list?asset=${asset.assetId}&page=${transactionsPage}`,
      });
      if (!response.error) {
        setTransactions(response.data.transactions);
        setLoadingTransactions(false);
      }
    };

    fetchData();
  }, [transactionsPage]);

  useEffect(() => {
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
            <strong>Total Supply</strong>
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
            <strong>Holders</strong>
          </span>
          <span>{holders.length}</span>
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
          <span>
            <a href="#">--</a>
          </span>
        </Row>
        <Row>
          <span>
            <strong>Official Website</strong>
          </span>
          <span>
            <a href="#">--</a>
          </span>
        </Row>
        <Row>
          <span>
            <strong>Issuing Time</strong>
          </span>
          <span>--</span>
        </Row>
        <Row>
          <span>
            <strong>Issuer</strong>
          </span>
          <span>--</span>
        </Row>
        <Row>
          <span>
            <strong>Precision</strong>
          </span>
          <span>
            <p>{precision}</p>
          </span>
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

  const tabProps: ITabs = {
    headers: tableHeaders,
    onClick: header => setSelectedTab(header),
  };

  return (
    <Container>
      <Header>
        <Title>
          <div onClick={router.back}>
            <ArrowLeft />
          </div>

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
  };

  const redirectProps = { redirect: { destination: '/404', permanent: false } };

  const assetId = params?.asset;

  const asset: IAssetResponse = await api.get({ route: `assets/${assetId}` });
  if (asset.error) {
    return redirectProps;
  } else {
    props.asset = asset.data.asset;
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
  }

  return { props };
};

export default Asset;
