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

import {
  IAccount,
  IResponse,
  ITransaction,
  IPagination,
  IBucket,
  IAsset,
  IAccountAsset,
} from '@/types/index';

import { ArrowLeft } from '@/assets/icons';
import { KLV } from '@/assets/coins';
import { AccountDetails as AccountIcon } from '@/assets/title-icons';

import { PaginationContainer } from '@/components/Pagination/styles';
import Pagination from '@/components/Pagination';
import Copy from '@/components/Copy';

import api, { IPrice } from '@/services/api';
import { Service } from '@/types/index';
import { ISelectedDays } from '@/components/DateFilter';
import Buckets from '@/components/Tabs/Buckets';
import { useDidUpdateEffect } from '@/utils/hooks';

interface IAssetInfo {
  assetId: string;
  precision: number;
}

interface IAccountPage {
  account: IAccount;
  transactions: ITransactionsResponse;
  priceKLV: number;
  precisions: IAssetInfo[];
  assets: IAccountAsset[];
  defaultKlvPrecision: number;
  allowance: IAllowanceResponse;
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

interface IAllowanceResponse extends IResponse {
  data: {
    allowance: number;
    stakingRewards: number;
  };
}

const Account: React.FC<IAccountPage> = ({
  account,
  transactions: transactionResponse,
  priceKLV,
  precisions,
  assets,
  defaultKlvPrecision,
  allowance,
}) => {
  const router = useRouter();

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(
    transactionResponse.pagination.totalPages,
  );

  const [dateFilter, setDateFilter] = useState({
    start: '',
    end: '',
  });
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState(
    transactionResponse.data.transactions,
  );

  const [buckets, setBuckets] = useState<IBucket[]>([]);

  useDidUpdateEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const query = dateFilter.start
        ? {
            page: page,
            address: account.address,
            startdate: dateFilter.start ? dateFilter.start : undefined,
            enddate: dateFilter.end ? dateFilter.end : undefined,
          }
        : {
            page: page,
            address: account.address,
          };

      const response: ITransactionsResponse = await api.get({
        route: `transaction/list`,
        query,
      });
      if (!response.error) {
        setTransactions(response.data.transactions);
        setTotalPages(response.pagination.totalPages);
      }

      setLoading(false);
    };

    fetchData();
  }, [page, account.address, dateFilter]);

  useEffect(() => {
    const { assets } = account;
    if (Object.keys(assets).length === 0) {
      return;
    }

    let assetBuckets: IBucket[] = [];

    for (const key in assets) {
      if (assets[key].buckets) {
        assetBuckets = [...assetBuckets, ...(assets[key].buckets || [])];
      }
    }

    setBuckets(assetBuckets);
  }, [account]);

  const calculateTotalKLV = () => {
    // does not include Allowance and Staking
    const available = account.balance;
    const frozen = account.assets?.KLV?.frozenBalance || 0;
    const unfrozen = account.assets?.KLV?.unfrozenBalance || 0;
    return (available + frozen + unfrozen) / 10 ** defaultKlvPrecision;
  };

  const getKLVfreezeBalance = (): number => {
    return (
      (account.assets?.KLV?.frozenBalance || 0) / 10 ** defaultKlvPrecision
    );
  };

  const getKLVunfreezeBalance = (): number => {
    return (
      (account.assets?.KLV?.unfrozenBalance || 0) / 10 ** defaultKlvPrecision
    );
  };

  const getKLVAllowance = (): number => {
    return (allowance?.data?.allowance || 0) / 10 ** defaultKlvPrecision;
  };

  const getKLVStaking = (): number => {
    return (allowance?.data?.stakingRewards || 0) / 10 ** defaultKlvPrecision;
  };

  const getTabHeaders = () => {
    const headers: string[] = [];

    if (account.assets && Object.values(account.assets).length > 0) {
      headers.push('Assets');
    }

    if (transactionResponse.data.transactions.length > 0) {
      headers.push('Transactions');
    }

    if (buckets.length > 0) {
      headers.push('Buckets');
    }

    return headers;
  };

  const [selectedTab, setSelectedTab] = useState<string>(getTabHeaders()[0]);

  const resetDate = () => {
    setPage(0);
    setDateFilter({
      start: '',
      end: '',
    });
  };
  const filterDate = (selectedDays: ISelectedDays) => {
    setPage(0);
    setDateFilter({
      start: selectedDays.start.getTime().toString(),
      end: selectedDays.end
        ? (selectedDays.end.getTime() + 24 * 60 * 60 * 1000).toString()
        : (selectedDays.start.getTime() + 24 * 60 * 60 * 1000).toString(),
    });
  };

  const tabProps: ITabs = {
    headers: getTabHeaders(),
    onClick: header => setSelectedTab(header),
    dateFilterProps: {
      resetDate,
      filterDate,
      empty: transactions.length === 0,
    },
  };

  const SelectedTabComponent: React.FC = () => {
    switch (selectedTab) {
      case 'Assets':
        return <Assets assets={assets} />;
      case 'Transactions':
        return (
          <>
            <Transactions transactions={transactions} loading={loading} />
            <PaginationContainer>
              <Pagination
                count={totalPages}
                page={page}
                onPaginate={page => {
                  setPage(page);
                }}
              />
            </PaginationContainer>
          </>
        );
      case 'Buckets':
        return <Buckets buckets={buckets} assets={assets} />;
      default:
        return <div />;
    }
  };

  return (
    <Container>
      <Header>
        <Title>
          <div onClick={() => router.push('/accounts')}>
            <ArrowLeft />
          </div>
          <h1>Account</h1>
          <AccountIcon />
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
                  <span>{calculateTotalKLV().toLocaleString()}</span>
                  <p>USD {(calculateTotalKLV() * priceKLV).toLocaleString()}</p>
                </div>
              </AmountContainer>
              <FrozenContainer>
                <div>
                  <strong>Available</strong>
                  <span>
                    {(
                      account.balance /
                      10 ** defaultKlvPrecision
                    ).toLocaleString()}
                  </span>
                </div>
                <div>
                  <strong>Frozen</strong>
                  <span>{getKLVfreezeBalance().toLocaleString()}</span>
                </div>
                <div>
                  <strong>Unfrozen</strong>
                  <span>{getKLVunfreezeBalance().toLocaleString()}</span>
                </div>
              </FrozenContainer>
            </BalanceContainer>
          </RowContent>
        </Row>
        <Row>
          <span>
            <strong>Rewards</strong>
            <strong>Available</strong>
          </span>
          <RowContent>
            <BalanceContainer>
              <FrozenContainer>
                <div>
                  <strong>Allowance</strong>
                  <span>{getKLVAllowance().toLocaleString()}</span>
                </div>
                <div>
                  <strong>Staking</strong>
                  <span>{getKLVStaking().toLocaleString()}</span>
                </div>
              </FrozenContainer>
            </BalanceContainer>
          </RowContent>
        </Row>
        <Row>
          <span>
            <strong>Nonce</strong>
          </span>
          <RowContent>
            <small>{account.nonce}</small>
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
    priceKLV: 0,
    transactions: {} as ITransactionsResponse,
    precisions: [],
    assets: [],
    defaultKlvPrecision: 6,
    allowance: {} as IAllowanceResponse,
  };

  const accountLength = 62;
  const redirectProps = { redirect: { destination: '/404', permanent: false } };
  const address = String(params?.account);

  const emptyAccount = {
    account: {
      address: address,
      nonce: 0,
      balance: 0,
      frozenBalance: 0,
      allowance: 0,
      permissions: [],
      timestamp: new Date().getTime(),
      assets: {},
    },
  };

  if (!address || address.length !== accountLength) {
    return redirectProps;
  }

  const accountCall = new Promise<IAccountResponse>(async (resolve, reject) => {
    const res = await api.get({
      route: `address/${address}`,
    });

    if (!res.error || res.error === '') {
      resolve(res);
    }
    if (res.error === 'cannot find account in database') {
      res.data = emptyAccount;
      resolve(res);
    }

    reject(res.error);
  });

  const transactionsCall = new Promise<ITransactionsResponse>(
    async (resolve, reject) => {
      const res = await api.get({
        route: `address/${address}/transactions`,
      });

      if (!res.error || res.error === '') {
        resolve(res);
      }

      reject(res.error);
    },
  );

  const pricesCall = new Promise<IPriceResponse>(async (resolve, reject) => {
    const res = await api.post({
      route: 'prices',
      service: Service.PRICE,
      body: { names: ['KLV/USD'] },
    });

    if (!res.error || res.error === '') {
      resolve(res);
    }

    reject(res.error);
  });

  await Promise.allSettled([pricesCall, transactionsCall, accountCall]).then(
    responses => {
      responses.forEach((res, index) => {
        if (res.status === 'fulfilled') {
          const { value }: any = res;

          if (index === 1) {
            props.transactions = value;
          } else if (index === 2) {
            props.account = value.data.account;

            const filterPrecisions = Object.entries(
              value.data.account.assets,
            ).map(
              ([assetId, asset]: [string, any]): IAssetInfo => ({
                assetId,
                precision: asset.precision,
              }),
            );
            const precision = 6;

            props.precisions = filterPrecisions;
            props.assets = Object.values(value.data.account.assets);

            if (responses[0].status !== 'rejected') {
              const prices = responses[0].value;
              props.priceKLV = prices.symbols[0].price;
            }
          }
        } else if (index == 2) {
          return redirectProps;
        }
      });
    },
  );

  const precision = 6;
  props.defaultKlvPrecision = precision; // Default KLV precision

  const allowance: IAllowanceResponse = await api.get({
    route: `address/${address}/allowance?asset=KLV`,
    service: Service.NODE,
  });

  if (!allowance.error) {
    allowance.data.allowance = allowance.data.allowance;
    allowance.data.stakingRewards = allowance.data.allowance;
    props.allowance = allowance;
  }
  return { props };
};

export default Account;
