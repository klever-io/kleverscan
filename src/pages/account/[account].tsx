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
  IAsset,
  IAssetResponse,
  IAssetsBuckets,
  IInnerTableProps,
  IPagination,
  IResponse,
  ITransaction,
  Service,
} from '@/types/index';
import { KLV_PRECISION, UINT32_MAX } from '@/utils/globalVariables';
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

export const getRequestAssets = (
  address: string,
): ((page: number, limit: number) => Promise<IResponse>) => {
  const requestAssets = async (
    page: number,
    limit: number,
  ): Promise<IResponse> => {
    let assets: IAccountAsset[] = [];
    let ownedAssets: IAsset[] = [];

    const accountCall = new Promise<IAccountResponse>(
      async (resolve, reject) => {
        const res = await api.get({
          route: `address/${address}`,
        });
        if (!res.error || res.error === '') {
          resolve(res);
        }

        reject(res.error);
      },
    );

    const accountAssetsOwner = new Promise<IAssetResponse>(
      async (resolve, reject) => {
        const res = await api.get({
          route: 'assets/kassets',
          query: { owner: `${address}` },
        });
        if (!res.error || res.error === '') {
          resolve(res);
        }

        reject(res.error);
      },
    );

    await Promise.allSettled([accountCall, accountAssetsOwner]).then(
      responses => {
        responses.forEach((res, index) => {
          if (res.status === 'fulfilled') {
            const { value }: any = res;
            if (index === 0) {
              assets = value.data.account.assets;
            }

            if (index === 1) {
              ownedAssets = value.data.assets;
              Object.keys(ownedAssets).forEach(
                ownedAsset => (ownedAssets[ownedAsset]['owner'] = true),
              );
            }
          }
        });
      },
    );
    if (!Object.keys(assets).length) {
      return {
        data: { assets: null },
        error: 'request failed',
        code: 'error',
      };
    } else {
      const assetsArray = Object.keys(assets).map(asset => {
        if (
          ownedAssets.some(
            ownedAsset => ownedAsset.assetId === assets[asset].assetId,
          )
        ) {
          assets[asset]['owner'] = true;
        }
        return assets[asset];
      });

      if (ownedAssets.length) {
        const missingAssets: any[] = ownedAssets
          .filter(
            (ownedAsset: IAsset) =>
              !Object.keys(assets).find(
                assetId => assetId === ownedAsset.assetId,
              ),
          )
          .map((asset: any) => ({
            address: asset.ownerAddress,
            assetId: asset.assetId,
            assetName: asset.name,
            assetType: asset.assetType === 'Fungible' ? 0 : 1,
            precision: asset.precision,
            balance: 0,
            frozenBalance: 0,
            unfrozenBalance: 0,
            owner: true,
          }));

        const allAssetsAccount = [...assetsArray, ...missingAssets];
        return {
          data: { assets: allAssetsAccount },
          error: '',
          code: 'error',
        };
      }
      return {
        data: { assets: assetsArray },
        error: '',
        code: 'error',
      };
    }
  };
  return requestAssets;
};

export const getRequestBuckets = (
  address: string,
): ((page: number, limit: number) => Promise<IResponse | []>) => {
  const requestBuckets = async (
    page: number,
    limit: number,
  ): Promise<IResponse | []> => {
    const accountResponse: IAccountResponse = await api.get({
      route: `address/${address}`,
    });
    if (!accountResponse) return [];
    const bucketsTable: IAssetsBuckets[] = [];
    const assets = accountResponse?.data?.account?.assets || {};
    Object.keys(assets).forEach(asset => {
      const assetHasUnstakedBucket = assets[asset]?.buckets?.find(
        bucket => bucket.unstakedEpoch !== UINT32_MAX,
      );

      const getDetails = async () => {
        const details = await api.get({
          route: `assets/${assets[asset]?.assetId}`,
        });
        if (details.error === '') {
          assets[asset]['minEpochsToWithdraw'] =
            details?.data?.asset?.staking?.minEpochsToWithdraw;
        }
      };

      if (assetHasUnstakedBucket) {
        getDetails();
      }
      if (assets?.[asset]?.buckets?.length) {
        assets?.[asset].buckets?.forEach(bucket => {
          if (
            bucket.unstakedEpoch === UINT32_MAX &&
            assets?.[asset].assetId.length < 64
          ) {
            bucket['availableEpoch'] = asset['minEpochsToWithdraw']
              ? bucket.unstakedEpoch + asset['minEpochsToWithdraw']
              : '--';
          } else {
            bucket['availableEpoch'] = bucket.unstakedEpoch + 2; // Default for KLV and KFI
          }
          const assetBucket = {
            asset: { ...assets[asset] },
            bucket: { ...bucket },
          };
          bucketsTable.push(assetBucket);
        });
      }
    });
    return { data: { buckets: bucketsTable }, code: 'successful', error: '' };
  };
  return requestBuckets;
};

const Account: React.FC<IAccountPage> = () => {
  const [account, setAccount] = useState<IAccount | null>(null);
  const [priceKLV, setPriceKLV] = useState<number>(0);
  const [KLVAllowance, setKLVAllowance] = useState<IAllowanceResponse>(
    {} as IAllowanceResponse,
  );
  const [KFIAllowance, setKFIAllowance] = useState<IAllowanceResponse>(
    {} as IAllowanceResponse,
  );

  const [openModalTransactions, setOpenModalTransactions] =
    useState<boolean>(false);
  const [titleModal, setTitleModal] = useState<string>('');
  const [stakingRewards, setStakingRewards] = useState<number>(0);
  const [selectedTab, setSelectedTab] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const [contractValue, setContractValue] = useState<string>('');
  const [collectionSelected, setCollectionSelected] = useState<IAccountAsset>();
  const [valueContract, setValueContract] = useState<any>();

  const { walletAddress } = useExtension();
  const router = useRouter();

  const initialQueryState = {
    ...router.query,
  };
  const headers = ['Assets', 'Transactions', 'Buckets'];

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
    if (!router.isReady) return;
    const fetchData = async () => {
      const address = router.query.account as string;

      setLoading(true);
      const emptyAccount: IAccount = {
        address: address,
        nonce: 0,
        balance: 0,
        frozenBalance: 0,
        allowance: 0,
        permissions: [],
        timestamp: new Date().getTime(),
        assets: {},
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
            setAccount(emptyAccount);
            resolve(res);
          }
          if (
            res.error.includes('could not create address from provided param')
          ) {
            return router.push('/404');
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

      await Promise.allSettled([
        accountCall,
        pricesCall,
        KLVAllowancePromise,
        KFIAllowancePromise,
      ]).then(responses => {
        responses.forEach((res, index) => {
          if (res.status === 'fulfilled') {
            const { value }: any = res;
            switch (index) {
              case 0:
                setAccount(value.data.account);
                break;
              case 1:
                setPriceKLV(value.symbols[0].price);
                break;
              case 2:
                setKLVAllowance(value);
                break;
              case 3:
                setKFIAllowance(value);
                break;
              default:
                break;
            }
          }
        });
      });
      setLoading(false);
    };

    fetchData();
  }, [router.query.account, router.isReady]);

  const requestTransactions = async (page: number, limit: number) => {
    const localQuery: IQueryParams = { ...router.query, page, limit };
    delete localQuery.tab;
    const transactionsResponse = await api.get({
      route: `address/${router.query.account}/transactions`,
      query: localQuery,
    });

    const assets: string[] = [];

    transactionsResponse?.data?.transactions.forEach(
      (transaction: ITransaction) => {
        if (transaction.contract && transaction.contract.length) {
          transaction.contract.forEach(contract => {
            if (contract.parameter === undefined) return;

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
            if (contract.parameter === undefined) return;

            if ('assetId' in contract.parameter && contract.parameter.assetId) {
              transaction.precision =
                assetPrecisions[contract.parameter.assetId];
            }
            if (
              'currencyID' in contract.parameter &&
              contract.parameter.currencyID
            ) {
              transaction.precision =
                assetPrecisions[contract.parameter.currencyID];
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
    const available = account?.balance || 0;
    const frozen = account?.assets?.KLV?.frozenBalance || 0;
    const unfrozen = account?.assets?.KLV?.unfrozenBalance || 0;
    return (available + frozen + unfrozen) / 10 ** KLV_PRECISION;
  }, [account?.balance, account?.assets, KLV_PRECISION]);

  const getKLVfreezeBalance = useCallback((): number => {
    return (account?.assets?.KLV?.frozenBalance || 0) / 10 ** KLV_PRECISION;
  }, [account?.assets, KLV_PRECISION]);

  const getKLVunfreezeBalance = (): number => {
    return (account?.assets?.KLV?.unfrozenBalance || 0) / 10 ** KLV_PRECISION;
  };

  const getKLVAllowance = (): number => {
    return (KLVAllowance?.data?.result?.allowance || 0) / 10 ** KLV_PRECISION;
  };

  const getKLVStaking = (): number => {
    return (
      (KLVAllowance?.data?.result?.stakingRewards || 0) / 10 ** KLV_PRECISION
    );
  };

  const getKFIStaking = (): number => {
    return (
      (KFIAllowance?.data?.result?.stakingRewards || 0) / 10 ** KLV_PRECISION
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

  const assetsTableProps: IInnerTableProps = {
    scrollUp: false,
    dataName: 'assets',
    request: (page: number, limit: number) =>
      getRequestAssets(router.query.account as string)(page, limit),
    query: router.query,
  };

  const transactionTableProps: IInnerTableProps = {
    scrollUp: false,
    dataName: 'transactions',
    request: (page: number, limit: number) => requestTransactions(page, limit),
    query: router.query,
  };

  const bucketsTableProps: IInnerTableProps = {
    scrollUp: false,
    dataName: 'buckets',
    request: (page: number, limit: number) =>
      getRequestBuckets(router.query.account as string)(page, limit),
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
              assetsTableProps={assetsTableProps}
              address={router.query.account as string}
              showInteractionsButtons={showInteractionsButtons}
            />
          </>
        );
      case 'Transactions':
        return <Transactions transactionsTableProps={transactionTableProps} />;
      case 'Buckets':
        return (
          <>
            <ContainerTabInteractions>
              {showInteractionsButtons('Freeze', 'FreezeContract', false)}
            </ContainerTabInteractions>
            <Buckets
              bucketsTableProps={bucketsTableProps}
              showInteractionsButtons={showInteractionsButtons}
            />
          </>
        );
      default:
        return <div />;
    }
  };

  const availableBalance = (account?.balance || 0) / 10 ** KLV_PRECISION;
  const totalKLV = calculateTotalKLV();
  const pricedKLV = calculateTotalKLV() * priceKLV;
  const showInteractionsButtons = (
    title: string,
    valueContract: string,
    value?: any,
    isAssetTrigger?: boolean,
  ) => {
    let titleFormatted = '';
    valueContract.split(/(?=[A-Z])/).forEach(t => (titleFormatted += t + ` `));
    const onClick = () => {
      switch (valueContract) {
        case 'ClaimContract':
          setStakingRewards(value || 0);
          break;
        case 'AssetTriggerContract':
          setCollectionSelected(value);
          break;
        default:
          return;
      }
    };

    if (walletAddress === initialQueryState.account) {
      return (
        <ButtonModal
          isLocked={valueContract === '--' && true}
          isAssetTrigger={isAssetTrigger}
          onClick={() => {
            setContractValue(valueContract);
            setOpenModalTransactions(valueContract === '--' ? false : true);
            setTitleModal(titleFormatted);
            setValueContract(value);
            onClick();
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
    contractType: contractValue,
    setContractType: setContractValue,
    setOpenModal: setOpenModalTransactions,
    openModal: openModalTransactions,
    title: titleModal,
    assetTriggerSelected: collectionSelected,
    setAssetTriggerSelected: setCollectionSelected,
    stakingRewards: stakingRewards,
    setStakingRewards: setStakingRewards,
    valueContract: valueContract,
    setValueContract: setValueContract,
  };
  return (
    <Container>
      <ModalContract {...modalOptions} />
      <Header>
        <Title
          title={account?.name ? account?.name : 'Account'}
          Icon={AccountIcon}
          route={'/accounts'}
          isAccountOwner={!!account?.name}
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
              <span>{router.query.account as string}</span>
              <Copy info="Address" data={router.query.account as string} />
              <ReceiveBackground>
                <QrCodeModal
                  value={router.query.account as string}
                  isOverflow={false}
                />
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
                    'Transfer',
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
            <small>
              {!loading ? account?.nonce : <Skeleton height={19} />}
            </small>
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

export default Account;
