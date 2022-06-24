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

import api, { IPrice} from '@/services/api';
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
  convertedBalance: number;
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
  convertedBalance,
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

  const getFreezeBalance = () => {
    if (Object.values(account.assets).length <= 0) {
      return 0;
    }

    const freezeBalance = Object.values(account.assets).reduce(
      (acc, asset) => acc + asset.frozenBalance,
      0,
    );

    return freezeBalance / 10 ** defaultKlvPrecision;
  };

  const getUnfreezeBalance = () => {
    if (Object.values(account.assets).length <= 0) {
      return 0;
    }

    const unfreezeBalance = Object.values(account.assets).reduce(
      (acc, asset) => acc + asset.unfrozenBalance,
      0,
    );

    return unfreezeBalance / 10 ** defaultKlvPrecision || 0;
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
                  <span>
                    {(
                      account.balance / 10 ** defaultKlvPrecision +
                      getFreezeBalance()
                    ).toLocaleString()}
                  </span>
                  <p>USD {convertedBalance.toLocaleString()}</p>
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
                  <span>{getFreezeBalance().toLocaleString()}</span>
                </div>
                <div>
                  <strong>Unfrozen</strong>
                  <span>{getUnfreezeBalance().toLocaleString()}</span>
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
                  <span>{allowance?.data?.allowance.toLocaleString()}</span>
                </div>
                <div>
                  <strong>Staking</strong>
                  <span>
                    {allowance?.data?.stakingRewards.toLocaleString()}
                  </span>
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
    convertedBalance: 0,
    transactions: {} as ITransactionsResponse,
    precisions: [],
    assets: [],
    defaultKlvPrecision: 6,
    allowance: {} as IAllowanceResponse,
  };

  const accountLength = 62;
  const redirectProps = { redirect: { destination: '/404', permanent: false } };
  const address = String(params?.account);

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

            if (props.account.assets.KLV) {
              props.account.assets.KLV.balance =
                props.account.balance - props.account.assets.KLV.frozenBalance;
            }

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
              props.convertedBalance =
                prices.symbols[0].price *
                (value.data.account.balance / 10 ** precision);
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
    allowance.data.allowance = allowance.data.allowance / 10 ** precision;
    allowance.data.stakingRewards = allowance.data.allowance / 10 ** precision;
    props.allowance = allowance;
  }

  return { props };
};

export default Account;
