import { KLV } from '@/assets/coins';
import { Receive } from '@/assets/icons';
import { AccountDetails as AccountIcon } from '@/assets/title-icons';
import Copy from '@/components/Copy';
import { ISelectedDays } from '@/components/DateFilter';
import Title from '@/components/Layout/Title';
import Pagination from '@/components/Pagination';
import { PaginationContainer } from '@/components/Pagination/styles';
import QrCodeModal from '@/components/QrCodeModal';
import Tabs, { ITabs } from '@/components/Tabs';
import Assets from '@/components/Tabs/Assets';
import Buckets from '@/components/Tabs/Buckets';
import Transactions from '@/components/Tabs/Transactions';
import api, { IPrice } from '@/services/api';
import {
  IAccount,
  IAccountAsset,
  IBucket,
  IPagination,
  IResponse,
  ITransaction,
  Service,
} from '@/types/index';
import { useDidUpdateEffect } from '@/utils/hooks';
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
} from '@/views/accounts/detail';
import { ReceiveBackground } from '@/views/validator';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';

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
  KLVallowance: IAllowanceResponse;
  KFIallowance: IAllowanceResponse;
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
    result: { allowance: number; stakingRewards: number };
  };
}

interface ITxQuery {
  page?: number;
  address?: string;
  startdate?: string;
  enddate?: string;
  fromAddress?: string;
  toAddress?: string;
}

const Account: React.FC<IAccountPage> = ({
  account,
  transactions: transactionResponse,
  priceKLV,
  precisions,
  assets,
  defaultKlvPrecision,
  KLVallowance,
  KFIallowance,
}) => {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(
    transactionResponse.pagination.totalPages,
  );

  const [dateFilter, setDateFilter] = useState({
    start: '',
    end: '',
  });
  const [fromToFilter, setFromToFilter] = useState(0);

  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState(
    transactionResponse.data.transactions,
  );

  const [buckets, setBuckets] = useState<IBucket[]>([]);
  const [showModal, setShowModal] = useState(false);

  useDidUpdateEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const query = getTxQuery();

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
  }, [page, account.address, dateFilter, fromToFilter]);

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

  const getTxQuery = useCallback((): ITxQuery => {
    const txQuery: ITxQuery = {
      page: page,
      address: account.address,
    };

    if (dateFilter.start) {
      txQuery.startdate = dateFilter.start;
      txQuery.enddate = dateFilter.end;
    }

    if (fromToFilter === 1) {
      txQuery.fromAddress = account.address;
    }

    if (fromToFilter === 2) {
      txQuery.toAddress = account.address;
    }

    return txQuery;
  }, [account.address, dateFilter, fromToFilter, page]);

  const calculateTotalKLV = useCallback(() => {
    // does not include Allowance and Staking
    const available = account.balance;
    const frozen = account.assets?.KLV?.frozenBalance || 0;
    const unfrozen = account.assets?.KLV?.unfrozenBalance || 0;
    return (available + frozen + unfrozen) / 10 ** defaultKlvPrecision;
  }, [account.balance, account.assets, defaultKlvPrecision]);

  const getKLVfreezeBalance = useCallback((): number => {
    return (
      (account.assets?.KLV?.frozenBalance || 0) / 10 ** defaultKlvPrecision
    );
  }, [account.assets, defaultKlvPrecision]);

  const getKLVunfreezeBalance = (): number => {
    return (
      (account.assets?.KLV?.unfrozenBalance || 0) / 10 ** defaultKlvPrecision
    );
  };

  const getKLVAllowance = (): number => {
    return (
      (KLVallowance?.data?.result?.allowance || 0) / 10 ** defaultKlvPrecision
    );
  };

  const getKLVStaking = (): number => {
    return (
      (KLVallowance?.data?.result?.stakingRewards || 0) /
      10 ** defaultKlvPrecision
    );
  };

  const getKFIStaking = (): number => {
    return (
      (KFIallowance?.data?.result?.stakingRewards || 0) /
      10 ** defaultKlvPrecision
    );
  };

  const getTabHeaders = useCallback(() => {
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
  }, [account.assets, buckets, transactionResponse.data.transactions]);

  const [selectedTab, setSelectedTab] = useState<string>(getTabHeaders()[0]);

  const resetDate = () => {
    setPage(1);
    setDateFilter({
      start: '',
      end: '',
    });
  };

  const filterDate = useCallback((selectedDays: ISelectedDays) => {
    setPage(1);
    setDateFilter({
      start: selectedDays.start.getTime().toString(),
      end: selectedDays.end
        ? (selectedDays.end.getTime() + 24 * 60 * 60 * 1000).toString()
        : (selectedDays.start.getTime() + 24 * 60 * 60 * 1000).toString(),
    });
  }, []);

  const filterFromTo = (op: number) => {
    setFromToFilter(op);
  };

  const tabProps: ITabs = {
    headers: getTabHeaders(),
    onClick: header => setSelectedTab(header),
    dateFilterProps: {
      resetDate,
      filterDate,
      empty: transactions.length === 0,
    },
    filterFromTo,
  };

  const SelectedTabComponent: React.FC = () => {
    switch (selectedTab) {
      case 'Assets':
        return <Assets assets={assets} address={account.address} />;
      case 'Transactions':
        return (
          <>
            <Transactions transactions={transactions} loading={loading} />
            <PaginationContainer>
              <Pagination
                scrollUp={false}
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
        <Title title="Account" Icon={AccountIcon} route={'/accounts'} />

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
              <ReceiveBackground>
                <Receive onClick={() => setShowModal(!showModal)} />
                <QrCodeModal
                  show={showModal}
                  setShowModal={() => setShowModal(false)}
                  value={account.address}
                  onClose={() => setShowModal(false)}
                />
              </ReceiveBackground>
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
                  <strong>KLV Staking</strong>
                  <span>{getKLVStaking().toLocaleString()}</span>
                </div>
                <div>
                  <strong>KFI Staking</strong>
                  <span>{getKFIStaking().toLocaleString()}</span>
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
    KLVallowance: {} as IAllowanceResponse,
    KFIallowance: {} as IAllowanceResponse,
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

  const KLVAllowancePromise = new Promise<IAllowanceResponse>(resolve =>
    resolve(
      api.get({
        route: `address/${address}/allowance?assetID=KLV`,
        service: Service.PROXY,
      }),
    ),
  );

  const KFIAllowancePromise = new Promise<IAllowanceResponse>(resolve =>
    resolve(
      api.get({
        route: `address/${address}/allowance?assetID=KFI`,
        service: Service.PROXY,
      }),
    ),
  );

  await Promise.allSettled([KLVAllowancePromise, KFIAllowancePromise]).then(
    responses => {
      responses.forEach((res, index) => {
        if (res.status === 'fulfilled') {
          const { value }: { value: IAllowanceResponse } = res;
          if (index === 0) {
            props.KLVallowance = value;
          } else if (index === 1) {
            props.KFIallowance = value;
          }
        }
      });
    },
  );

  return { props };
};

export default Account;
