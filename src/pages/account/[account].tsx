import React, { useEffect, useState } from 'react';

import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

import {
  AmountContainer,
  BalanceContainer,
  CenteredRow,
  Container,
  FrozenContainer,
  Header,
  IconContainer,
  Input,
  OverviewContainer,
  Row,
  RowContent,
  Title,
} from '@/views/accounts/detail';

import Tabs, { ITabs } from '@/components/Tabs';
import Assets from '@/components/Tabs/Assets';
import Transactions from '@/components/Tabs/Transactions';
import Buckets from '@/components/Tabs/Buckets';

import { IAccount, IResponse, ITransaction, IPagination } from '@/types/index';

import { ArrowLeft } from '@/assets/icons';
import { KLV } from '@/assets/coins';
import { PaginationContainer } from '@/components/Pagination/styles';
import Pagination from '@/components/Pagination';
import Copy from '@/components/Copy';

import api, { IPrice, Service } from '@/services/api';

interface IAccountPage {
  account: IAccount;
  transactions: ITransactionsResponse;
  convertedBalance: number;
}

interface IAccountResponse extends IResponse {
  data: {
    account: IAccount;
  };
}

interface ITransactionsResponse extends IResponse {
  data: {
    transactions: ITransaction[];
  };
  pagination: IPagination;
}

interface IPriceResponse extends IResponse {
  symbols: IPrice[];
}

const Account: React.FC<IAccountPage> = ({
  account,
  transactions: transactionResponse,
  convertedBalance,
}) => {
  const router = useRouter();
  const precision = 6;

  const [page, setPage] = useState(0);
  const [, setLoading] = useState(false);
  const [transactions, setTransactions] = useState(
    transactionResponse.data.transactions,
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const response: ITransactionsResponse = await api.get({
        route: `transaction/list?page=${page}`,
      });
      if (!response.error) {
        setTransactions(response.data.transactions);
      }

      setLoading(false);
    };

    fetchData();
  }, [page]);

  const getFreezeBalance = () => {
    if (Object.values(account.buckets).length <= 0) {
      return 0;
    }

    const freezeBalance = Object.values(account.buckets).reduce(
      (acc, bucket) => acc + bucket.stakeValue,
      0,
    );

    return freezeBalance / 10 ** precision;
  };

  const getTotalBalance = () => {
    return (account.balance + getFreezeBalance()) / 10 ** precision;
  };

  const getTabHeaders = () => {
    const headers: string[] = [];

    if (account.assets && Object.values(account.assets).length > 0) {
      headers.push('Assets');
    }

    if (transactionResponse.data.transactions.length > 0) {
      headers.push('Transactions');
    }

    if (account.buckets && Object.values(account.buckets).length > 0) {
      headers.push('Buckets');
    }

    return headers;
  };

  const [selectedTab, setSelectedTab] = useState<string>(getTabHeaders()[0]);

  const tabProps: ITabs = {
    headers: getTabHeaders(),
    onClick: header => setSelectedTab(header),
  };

  const SelectedTabComponent: React.FC = () => {
    switch (selectedTab) {
      case 'Assets':
        return <Assets {...account.assets} />;
      case 'Transactions':
        return (
          <>
            <Transactions {...transactions} />
            <PaginationContainer>
              <Pagination
                count={transactionResponse.pagination.totalPages}
                page={page}
                onPaginate={page => {
                  setPage(page);
                }}
              />
            </PaginationContainer>
          </>
        );
      case 'Buckets':
        return <Buckets {...account.buckets} />;
      default:
        return <div />;
    }
  };

  return (
    <Container>
      <Header>
        <Title>
          <div onClick={router.back}>
            <ArrowLeft />
          </div>
          <h1>Account</h1>
        </Title>

        <Input />
      </Header>

      <OverviewContainer>
        <Row>
          <span>
            <strong>Address</strong>
          </span>
          <RowContent>
            <CenteredRow>
              <span>{account.address}</span>
              <Copy info="Address" data={account.address} />
            </CenteredRow>
          </RowContent>
        </Row>
        <Row>
          <span>
            <strong>Balance</strong>
          </span>
          <RowContent>
            <BalanceContainer>
              <AmountContainer>
                <IconContainer>
                  <KLV />
                  <span>KLV</span>
                </IconContainer>
                <div>
                  <span>{getTotalBalance().toLocaleString()}</span>
                  <p>USD {convertedBalance.toLocaleString()}</p>
                </div>
              </AmountContainer>
              <FrozenContainer>
                <div>
                  <strong>Available</strong>
                  <span>
                    {(account.balance / 10 ** precision).toLocaleString()}
                  </span>
                </div>
                <div>
                  <strong>Frozen</strong>
                  <span>{getFreezeBalance().toLocaleString()}</span>
                </div>
              </FrozenContainer>
            </BalanceContainer>
          </RowContent>
        </Row>
        <Row>
          <span>
            <strong>Transactions</strong>
          </span>
          <RowContent>
            <small>
              {transactionResponse.pagination.totalRecords.toLocaleString()}
            </small>
          </RowContent>
        </Row>
      </OverviewContainer>

      <Tabs {...tabProps}>
        <SelectedTabComponent />
      </Tabs>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps<IAccountPage> = async ({
  params,
}) => {
  const props: IAccountPage = {
    account: {} as IAccount,
    convertedBalance: 0,
    transactions: {} as ITransactionsResponse,
  };

  const precision = 6; // KLV default precision;
  const accountLength = 62;
  const redirectProps = { redirect: { destination: '/404', permanent: false } };

  const address = String(params?.account);

  if (!address || address.length !== accountLength) {
    return redirectProps;
  }

  const account: IAccountResponse = await api.get({
    route: `address/${address}`,
  });
  if (account.error) {
    return redirectProps;
  }
  props.account = account.data.account;

  const transactions: ITransactionsResponse = await api.get({
    route: `address/${address}/transactions`,
  });
  if (account.error) {
    return redirectProps;
  }
  props.transactions = transactions;

  const prices: IPriceResponse = await api.post({
    route: 'prices',
    service: Service.PRICE,
    body: { names: ['KLV/USD'] },
  });
  if (!prices.error) {
    props.convertedBalance =
      prices.symbols[0].price *
      (account.data.account.balance / 10 ** precision);
  }

  return { props };
};

export default Account;
