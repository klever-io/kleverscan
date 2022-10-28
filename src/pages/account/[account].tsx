import { KLV } from '@/assets/coins';
import { Receive } from '@/assets/icons';
import { AccountDetails as AccountIcon } from '@/assets/title-icons';
import Copy from '@/components/Copy';
import { ISelectedDays } from '@/components/DateFilter';
import Title from '@/components/Layout/Title';
import QrCodeModal from '@/components/QrCodeModal';
import Tabs, { ITabs } from '@/components/Tabs';
import Assets from '@/components/Tabs/Assets';
import Buckets from '@/components/Tabs/Buckets';
import Transactions from '@/components/Tabs/Transactions';
import TransactionsFilters from '@/components/TransactionsFilters';
import { TxsFiltersWrapper } from '@/components/TransactionsFilters/styles';
import api, { IPrice } from '@/services/api';
import {
  IAccount,
  IAccountAsset,
  IAsset,
  IAssetResponse,
  IPagination,
  IResponse,
  ITransaction,
  Service,
} from '@/types/index';
import { filterDate, getSelectedTab, resetDate } from '@/utils/index';
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
import { NextParsedUrlQuery } from 'next/dist/server/request-meta';
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
  accountAssets: IAccountAsset[];
  assets: IAsset[];
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

interface IQueryParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  tab?: string;
  fromAddress?: string;
  toAddress?: string;
}

const Account: React.FC<IAccountPage> = ({
  account,
  transactions: transactionResponse,
  priceKLV,
  precisions,
  assets,
  accountAssets,
  defaultKlvPrecision,
  KLVallowance,
  KFIallowance,
}) => {
  const router = useRouter();

  const initialQueryState = {
    ...router.query,
    fromAddress: account.address,
    toAddress: account.address,
  };

  const getTabHeaders = useCallback(() => {
    const headers: string[] = [];

    if (account.assets && Object.values(account.assets).length > 0) {
      headers.push('Assets');
    }

    if (transactionResponse.data?.transactions.length > 0) {
      headers.push('Transactions');
    }

    if (Object.keys(assets).length === 0) {
      return headers;
    }

    for (const key in accountAssets) {
      if (accountAssets[key].buckets) {
        headers.push('Buckets');
        break;
      }
    }

    return headers;
  }, [account.assets, transactionResponse.data?.transactions]);

  const [showModal, setShowModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string>(
    getTabHeaders()[getSelectedTab(router.query?.tab)],
  );

  const setQueryAndRouter = (newQuery: NextParsedUrlQuery) => {
    router.push({ pathname: router.pathname, query: newQuery }, undefined, {
      shallow: true,
    });
  };

  useEffect(() => {
    setQueryAndRouter(initialQueryState);
  }, []);

  const requestTransactions = async (page: number, limit: number) => {
    const localQuery: IQueryParams = { ...router.query, page, limit };
    delete localQuery.tab;

    if (localQuery.fromAddress || localQuery.toAddress) {
      return api.get({
        route: `transaction/list`,
        query: localQuery,
      });
    } else {
      return api.get({
        route: `address/${account.address}/transactions`,
        query: localQuery,
      });
    }
  };

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

  const resetQueryDate = () => {
    setQueryAndRouter(resetDate(router.query));
  };

  const filterQueryDate = (selectedDays: ISelectedDays) => {
    const getFilteredDays = filterDate(selectedDays);
    setQueryAndRouter({ ...router.query, ...getFilteredDays });
  };

  const filterFromTo = (op: number) => {
    const updatedQuery = { ...router.query };
    if (op === 0) {
      setQueryAndRouter({
        ...updatedQuery,
        fromAddress: account.address,
        toAddress: account.address,
      });
    } else if (op === 1) {
      delete updatedQuery.toAddress;
      setQueryAndRouter({ ...updatedQuery, fromAddress: account.address });
    } else if (op === 2) {
      delete updatedQuery.fromAddress;
      setQueryAndRouter({ ...updatedQuery, toAddress: account.address });
    }
  };

  const transactionTableProps = {
    scrollUp: false,
    totalPages: transactionResponse?.pagination?.totalPages || 0,
    dataName: 'transactions',
    request: (page: number, limit: number) => requestTransactions(page, limit),
    query: router.query,
  };

  const tabProps: ITabs = {
    headers: getTabHeaders(),
    onClick: header => {
      setSelectedTab(header);
      setQueryAndRouter({ ...router.query, tab: header });
    },
    dateFilterProps: {
      resetDate: resetQueryDate,
      filterDate: filterQueryDate,
      empty: transactionResponse?.data?.transactions?.length === 0,
    },
    filterFromTo,
    showTxInTxOutFilter: true,
  };

  const transactionsFiltersProps = {
    query: router.query,
    setQuery: setQueryAndRouter,
    assets,
  };

  const SelectedTabComponent: React.FC = () => {
    switch (selectedTab) {
      case 'Assets':
        return <Assets assets={accountAssets} address={account.address} />;
      case 'Transactions':
        return (
          <Transactions
            transactions={transactionResponse.data.transactions}
            transactionsTableProps={transactionTableProps}
          />
        );
      case 'Buckets':
        return <Buckets assets={accountAssets} />;
      default:
        return <div />;
    }
  };

  const availableBalance = account.balance / 10 ** defaultKlvPrecision;
  const totalKLV = calculateTotalKLV();
  const pricedKLV = calculateTotalKLV() * priceKLV;

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
                  <span>
                    {isNaN(Number(totalKLV)) ? 0 : totalKLV.toLocaleString()}
                  </span>
                  {!isNaN(Number(pricedKLV)) && (
                    <p>USD {pricedKLV.toLocaleString()}</p>
                  )}
                </div>
              </AmountContainer>
              <FrozenContainer>
                <div>
                  <strong>Available</strong>
                  <span>
                    {isNaN(Number(availableBalance))
                      ? 0
                      : availableBalance.toLocaleString()}
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
              {transactionResponse?.pagination?.totalRecords.toLocaleString()}
            </small>
          </RowContent>
        </Row>
      </OverviewContainer>
      <Tabs {...tabProps}>
        {selectedTab === 'Transactions' && (
          <TxsFiltersWrapper>
            <TransactionsFilters
              {...transactionsFiltersProps}
            ></TransactionsFilters>
          </TxsFiltersWrapper>
        )}
        <SelectedTabComponent />
      </Tabs>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps<IAccountPage> = async ({
  params,
}) => {
  const redirectProps = { redirect: { destination: '/404', permanent: false } };

  const props: IAccountPage = {
    account: {} as IAccount,
    priceKLV: 0,
    transactions: {} as ITransactionsResponse,
    precisions: [],
    accountAssets: [],
    assets: [],
    defaultKlvPrecision: 6,
    KLVallowance: {} as IAllowanceResponse,
    KFIallowance: {} as IAllowanceResponse,
  };

  const accountLength = 62;
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

  const assetsCall = new Promise<IAssetResponse>(async (resolve, reject) => {
    const res: IAssetResponse = await api.get({
      route: 'assets/kassets',
    });
    if (!res.error || res.error === '') {
      resolve(res);
    }

    reject(res.error);
  });

  await Promise.allSettled([
    pricesCall,
    transactionsCall,
    accountCall,
    assetsCall,
  ]).then(responses => {
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
          props.accountAssets = Object.values(value.data.account.assets);

          if (responses[0].status !== 'rejected') {
            const prices = responses[0].value;
            props.priceKLV = prices.symbols[0].price;
          }
        } else if (index === 3) {
          props.assets = value?.data?.assets || [];
        }
      } else if (index == 2) {
        return redirectProps;
      }
    });
  });

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

  if (Object.keys(props.account).length === 0) {
    props.account.address = address;
  }

  return { props };
};

export default Account;
