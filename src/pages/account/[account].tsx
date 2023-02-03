import { KLV } from '@/assets/coins';
import { AccountDetails as AccountIcon } from '@/assets/title-icons';
import ModalContract from '@/components/Contract/ModalContract';
import Copy from '@/components/Copy';
import DateFilter, {
  IDateFilter,
  ISelectedDays,
} from '@/components/DateFilter';
import Filter, { IFilter } from '@/components/Filter';
import Title from '@/components/Layout/Title';
import QrCodeModal from '@/components/QrCodeModal';
import Skeleton from '@/components/Skeleton';
import Tabs, { ITabs } from '@/components/Tabs';
import Assets from '@/components/Tabs/Assets';
import Buckets from '@/components/Tabs/Buckets';
import Transactions from '@/components/Tabs/Transactions';
import TransactionsFilters from '@/components/TransactionsFilters';
import {
  ContainerFilter,
  FilterDiv,
  RightFiltersContent,
  TxsFiltersWrapper,
} from '@/components/TransactionsFilters/styles';
import { useExtension } from '@/contexts/extension';
import api, { IPrice } from '@/services/api';
import {
  IAccount,
  IAccountAsset,
  IInnerTableProps,
  IPagination,
  IResponse,
  ITransaction,
  Service,
} from '@/types/index';
import {
  filterDate,
  getPrecision,
  getSelectedTab,
  resetDate,
} from '@/utils/index';
import {
  AmountContainer,
  BalanceContainer,
  ButtonModal,
  CenteredRow,
  Container,
  ContainerTabInteractions,
  FrozenContainer,
  Header,
  IconContainer,
  Input,
  OverviewContainer,
  Row,
  RowContent,
  StakingRewards,
} from '@/views/accounts/detail';
import { FilterByDate } from '@/views/transactions';
import { ReceiveBackground } from '@/views/validator';
import { GetStaticPaths, GetStaticProps } from 'next';
import { NextParsedUrlQuery } from 'next/dist/server/request-meta';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
export interface IStakingRewards {
  label: string;
  value: number;
}

interface IAccountPage {
  address: string;
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
  sender?: '' | 'receiver' | 'sender';
}

const Account: React.FC<IAccountPage> = ({ address }) => {
  const [openModalTransactions, setOpenModalTransactions] =
    useState<boolean>(false);
  const [transactionValue, setTransactionValue] = useState<string>('');
  const [accountName, setAccountName] = useState<string>('');
  const [titleModal, setTitleModal] = useState<string>('');
  const [assetTriggerSelected, setAssetTriggerSelected] =
    useState<IAccountAsset>();
  const [stakingRewards, setStakingRewards] = useState<number>(0);
  const [account, setAccount] = useState<IAccount>({
    address: address,
    nonce: 0,
    balance: 0,
    frozenBalance: 0,
    allowance: 0,
    permissions: [],
    timestamp: new Date().getTime(),
    assets: {},
  });
  const [priceKLV, setPriceKLV] = useState<number>(0);
  const [KLVAllowance, setKLVAllowance] = useState<IAllowanceResponse>(
    {} as IAllowanceResponse,
  );
  const [KFIAllowance, setKFIAllowance] = useState<IAllowanceResponse>(
    {} as IAllowanceResponse,
  );
  const [accountAssets, setAccountAssets] = useState<IAccountAsset[]>([]);
  const [accountAssetOwner, setAccountAssetOwner] = useState();
  const [loading, setLoading] = useState<boolean>(true);
  const { walletAddress } = useExtension();
  const router = useRouter();

  const initialQueryState = {
    ...router.query,
  };

  const defaultKlvPrecision = 6;
  const headers = ['Assets', 'Transactions', 'Buckets'];
  const [selectedTab, setSelectedTab] = useState<string>();

  const setQueryAndRouter = (newQuery: NextParsedUrlQuery) => {
    router.push({ pathname: router.pathname, query: newQuery }, undefined, {
      shallow: true,
    });
  };

  useEffect(() => {
    if (!router.isReady) return;
    setSelectedTab(headers[getSelectedTab(router.query?.tab)]);
    setQueryAndRouter(initialQueryState);
  }, [router.isReady]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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

      const accountLength = 62;

      if (!address || address.length !== accountLength) {
        return router.push('/404');
      }

      const accountCall = new Promise<IAccountResponse>(
        async (resolve, reject) => {
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
        },
      );

      const pricesCall = new Promise<IPriceResponse>(
        async (resolve, reject) => {
          const res = await api.post({
            route: 'prices',
            service: Service.PRICE,
            body: { names: ['KLV/USD'] },
            useApiProxy: true,
          });

          if (!res.error || res.error === '') {
            resolve(res);
          }

          reject(res.error);
        },
      );

      const accountAssetOwner = new Promise<any>(async (resolve, reject) => {
        const res = await api.get({
          route: 'assets/kassets',
          query: { owner: `${address}` },
        });
        if (!res.error || res.error === '') {
          resolve(res);
        }

        reject(res.error);
      });
      await Promise.allSettled([
        pricesCall,
        accountCall,
        accountAssetOwner,
      ]).then(responses => {
        responses.forEach((res, index) => {
          if (res.status === 'fulfilled') {
            const { value }: any = res;

            if (index === 1) {
              setAccount(value.data.account);

              setAccountAssets(Object.values(value.data.account.assets));

              if (responses[0].status !== 'rejected') {
                const prices = responses[0].value;
                setPriceKLV(prices.symbols[0].price);
              }
            }
            if (index === 2) {
              setAccountAssetOwner(value.data.assets);
            }
          }
        });
      });

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
                setKLVAllowance(value);
              } else if (index === 1) {
                setKFIAllowance(value);
              }
            }
          });
        },
      );
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (account.name) setAccountName(account.name);
  }, [accountName]);

  const requestTransactions = async (page: number, limit: number) => {
    const localQuery: IQueryParams = { ...router.query, page, limit };
    delete localQuery.tab;
    const transactionsResponse = await api.get({
      route: `address/${account.address}/transactions`,
      query: localQuery,
    });

    const assets: string[] = [];

    transactionsResponse?.data?.transactions.forEach(
      (transaction: ITransaction) => {
        if (transaction.contract && transaction.contract.length) {
          transaction.contract.forEach(contract => {
            if ('assetId' in contract.parameter && contract.parameter.assetId) {
              assets.push(contract.parameter.assetId);
            }
            if (
              'currencyID' in contract.parameter &&
              contract.parameter.currencyID
            ) {
              assets.push(contract.parameter.currencyID);
            }
          });
        }
      },
    );

    const assetPrecisions = await getPrecision(assets);

    const parsedTransactions = transactionsResponse.data.transactions.map(
      (transaction: ITransaction) => {
        if (transaction.contract && transaction.contract.length) {
          transaction.contract.forEach(contract => {
            if (contract.parameter && (contract.parameter as any).assetId) {
              transaction.precision =
                assetPrecisions[(contract.parameter as any).assetId];
            }
            if (contract.parameter && (contract.parameter as any).currencyID) {
              transaction.precision =
                assetPrecisions[(contract.parameter as any).currencyID];
            }
          });
        }
        return transaction;
      },
    );

    return {
      ...transactionsResponse,
      data: {
        transactions: parsedTransactions,
      },
    };
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
      (KLVAllowance?.data?.result?.allowance || 0) / 10 ** defaultKlvPrecision
    );
  };

  const getKLVStaking = (): number => {
    return (
      (KLVAllowance?.data?.result?.stakingRewards || 0) /
      10 ** defaultKlvPrecision
    );
  };

  const getKFIStaking = (): number => {
    return (
      (KFIAllowance?.data?.result?.stakingRewards || 0) /
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
      delete updatedQuery.role;
      setQueryAndRouter({
        ...updatedQuery,
      });
    } else if (op === 1) {
      setQueryAndRouter({ ...updatedQuery, role: 'sender' });
    } else if (op === 2) {
      setQueryAndRouter({ ...updatedQuery, role: 'receiver' });
    }
  };

  const transactionTableProps: IInnerTableProps = {
    scrollUp: false,
    dataName: 'transactions',
    request: (page: number, limit: number) => requestTransactions(page, limit),
    query: router.query,
  };

  const tabProps: ITabs = {
    headers,
    onClick: header => {
      setSelectedTab(header);
      setQueryAndRouter({ ...router.query, tab: header });
    },
    dateFilterProps: {
      resetDate: resetQueryDate,
      filterDate: filterQueryDate,
    },
    showDataFilter: false,
  };
  const dateFilterProps: IDateFilter = {
    resetDate: resetQueryDate,
    filterDate: filterQueryDate,
  };
  const transactionsFiltersProps = {
    query: router.query,
    setQuery: setQueryAndRouter,
  };

  const SelectedTabComponent: React.FC = () => {
    switch (selectedTab) {
      case 'Assets':
        return (
          <>
            <ContainerTabInteractions>
              {showInteractionsButtons(
                'Create Asset',
                'CreateAssetContract',
                false,
              )}
            </ContainerTabInteractions>
            <Assets
              assets={accountAssets}
              accountAssetOwner={accountAssetOwner}
              address={account.address}
              showInteractionsButtons={showInteractionsButtons}
            />
          </>
        );
      case 'Transactions':
        return <Transactions transactionsTableProps={transactionTableProps} />;
      case 'Buckets':
        return <Buckets assets={accountAssets} />;
      default:
        return <div />;
    }
  };

  const availableBalance = account.balance / 10 ** defaultKlvPrecision;
  const totalKLV = calculateTotalKLV();
  const pricedKLV = calculateTotalKLV() * priceKLV;
  const showInteractionsButtons = (
    title: string,
    value: string,
    isAssetTrigger?: boolean,
    asset?: IAccountAsset,
    stakingRewards?: number,
  ) => {
    let titleFormatted = '';
    value.split(/(?=[A-Z])/).forEach((t, index) => (titleFormatted += t + ` `));
    if (walletAddress === initialQueryState.account) {
      return (
        <ButtonModal
          isAssetTrigger={isAssetTrigger}
          onClick={() => {
            setAssetTriggerSelected(asset);
            setTransactionValue(value);
            setOpenModalTransactions(true);
            setTitleModal(titleFormatted);
            setStakingRewards(stakingRewards || 0);
          }}
        >
          {title}
        </ButtonModal>
      );
    }
    return <></>;
  };

  const getFilterName = () => {
    if (router.query?.role === 'sender') {
      return 'Transactions Out';
    } else if (router.query?.role === 'receiver') {
      return 'Transactions In';
    } else if (router.query?.role === '' || router.query?.role === undefined) {
      return 'All Transactions';
    }
    return 'All Transactions';
  };
  const filterName = useCallback(getFilterName, [router.query]);
  const handleClickFilterName = (filter: string) => {
    switch (filter) {
      case 'All Transactions':
        filterFromTo && filterFromTo(0);
        break;
      case 'Transactions Out':
        filterFromTo && filterFromTo(1);
        break;
      case 'Transactions In':
        filterFromTo && filterFromTo(2);
        break;

      default:
        filterFromTo && filterFromTo(0);
    }
  };
  const filters: IFilter[] = [
    {
      firstItem: 'All Transactions',
      data: ['Transactions Out', 'Transactions In'],
      onClick: e => {
        handleClickFilterName(e);
      },
      current: filterName(),
      overFlow: 'visible',
      inputType: 'button',
    },
  ];
  const modalOptions = {
    contractType: transactionValue,
    setContractType: setTransactionValue,
    setOpenModal: setOpenModalTransactions,
    openModal: openModalTransactions,
    title: titleModal,
    assetTriggerSelected: assetTriggerSelected,
    setAssetTriggerSelected: setAssetTriggerSelected,
    stakingRewards: stakingRewards,
    setStakingRewards: setStakingRewards,
  };
  return (
    <Container>
      <ModalContract {...modalOptions} />
      <Header>
        <Title
          title={accountName ? accountName : 'Account'}
          Icon={AccountIcon}
          route={'/accounts'}
          isAccountOwner={!!accountName}
        />
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
                <QrCodeModal value={account.address} isOverflow={false} />
              </ReceiveBackground>
              {showInteractionsButtons(
                'Set Account Name',
                'SetAccountNameContract',
              )}
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
                  <div>
                    <span>
                      {!loading ? (
                        totalKLV.toLocaleString()
                      ) : (
                        <Skeleton height={19} />
                      )}
                    </span>
                    <p>
                      {!loading ? (
                        <>USD {pricedKLV.toLocaleString()}</>
                      ) : (
                        <Skeleton height={16} />
                      )}
                    </p>
                  </div>
                  {showInteractionsButtons(
                    'Create Transfer',
                    'TransferContract',
                    false,
                  )}
                </div>
              </AmountContainer>
              <FrozenContainer>
                <div>
                  <strong>Available</strong>
                  <span>
                    {!loading ? (
                      availableBalance.toLocaleString()
                    ) : (
                      <Skeleton height={19} />
                    )}
                  </span>
                </div>
                <div>
                  <strong>Frozen</strong>
                  <span>
                    {!loading ? (
                      getKLVfreezeBalance().toLocaleString()
                    ) : (
                      <Skeleton height={19} />
                    )}
                  </span>
                </div>
                <div>
                  <strong>Unfrozen</strong>
                  <span>
                    {!loading ? (
                      getKLVunfreezeBalance().toLocaleString()
                    ) : (
                      <Skeleton height={19} />
                    )}
                  </span>
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
                <StakingRewards>
                  <strong>Allowance</strong>
                  {!loading ? (
                    <>
                      <span>{getKLVAllowance().toLocaleString()}</span>
                      {showInteractionsButtons(
                        'Allowance Claim',
                        'ClaimContract',
                        false,
                        undefined,
                        1,
                      )}
                    </>
                  ) : (
                    <Skeleton height={19} />
                  )}
                </StakingRewards>
                <StakingRewards>
                  <strong>KLV Staking</strong>
                  {!loading ? (
                    <>
                      <span>{getKLVStaking().toLocaleString()}</span>
                      {showInteractionsButtons(
                        'Staking Claim',
                        'ClaimContract',
                        false,
                        undefined,
                        0,
                      )}
                    </>
                  ) : (
                    <Skeleton height={19} />
                  )}
                </StakingRewards>
                <StakingRewards>
                  <strong>KFI Staking</strong>
                  {!loading ? (
                    <>
                      <span>{getKFIStaking().toLocaleString()}</span>
                      {showInteractionsButtons(
                        'Market Claim',
                        'ClaimContract',
                        false,
                        undefined,
                        2,
                      )}
                    </>
                  ) : (
                    <Skeleton height={19} />
                  )}
                </StakingRewards>
              </FrozenContainer>
            </BalanceContainer>
          </RowContent>
        </Row>
        <Row>
          <span>
            <strong>Nonce</strong>
          </span>
          <RowContent>
            <small>{!loading ? account.nonce : <Skeleton height={19} />}</small>
          </RowContent>
        </Row>
      </OverviewContainer>
      <Tabs {...tabProps}>
        {selectedTab === 'Transactions' && (
          <TxsFiltersWrapper>
            <ContainerFilter>
              <TransactionsFilters
                {...transactionsFiltersProps}
              ></TransactionsFilters>
              <RightFiltersContent>
                <FilterDiv>
                  <span>Transaction In/Out</span>
                  {filters.map((filter, index) => (
                    <Filter key={index} {...filter} />
                  ))}
                </FilterDiv>
                <FilterByDate>
                  <DateFilter {...dateFilterProps} />
                </FilterByDate>
              </RightFiltersContent>
            </ContainerFilter>
          </TxsFiltersWrapper>
        )}
        <SelectedTabComponent />
      </Tabs>
    </Container>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const address = params?.account;
  const redirectProps = { redirect: { destination: '/404', permanent: false } };

  const accountLength = 62;

  if (!address || address.length !== accountLength) {
    return redirectProps;
  }

  return {
    props: {
      address,
    },
  };
};

export default Account;
