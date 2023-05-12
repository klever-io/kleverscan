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
import ProprietaryAssets from '@/components/Tabs/ProprietaryAssets';
import Transactions from '@/components/Tabs/Transactions';
import TransactionsFilters from '@/components/TransactionsFilters';
import {
  ContainerFilter,
  FilterDiv,
  RightFiltersContent,
  TxsFiltersWrapper,
} from '@/components/TransactionsFilters/styles';
import { useExtension } from '@/contexts/extension';
import { useMobile } from '@/contexts/mobile';
import { IPrice } from '@/services/api';
import {
  accountAssetsOwnerCall,
  accountCall,
  assetsRequest,
  bucketsRequest,
  KFIAllowancePromise,
  KLVAllowancePromise,
  ownedAssetsRequest,
  pricesCall,
  transactionsRequest,
} from '@/services/requests/account/account';
import {
  IAccount,
  IAccountAsset,
  IInnerTableProps,
  IPagination,
  IResponse,
  ITransaction,
} from '@/types/index';
import { setQueryAndRouter } from '@/utils';
import { filterDate } from '@/utils/formatFunctions';
import { KLV_PRECISION } from '@/utils/globalVariables';
import { parseAddress } from '@/utils/parseValues';
import { resetDate } from '@/utils/resetDate';
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
  OverviewContainer,
  Row,
  RowContent,
  StakingRewards,
} from '@/views/accounts/detail';
import { FilterByDate } from '@/views/transactions';
import { ReceiveBackground } from '@/views/validator';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useQuery } from 'react-query';

export interface IStakingRewards {
  label: string;
  value: number;
  inputValue?: string;
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

export interface IAllowanceResponse extends IResponse {
  data: {
    result: { allowance: number; stakingRewards: number };
  };
}

const Account: React.FC<IAccountPage> = () => {
  const headers = ['Assets', 'Transactions', 'Buckets'];
  const [openModalTransactions, setOpenModalTransactions] =
    useState<boolean>(false);
  const [titleModal, setTitleModal] = useState<string>('');
  const [stakingRewards, setStakingRewards] = useState<number>(0);
  const [contractValue, setContractValue] = useState<string>('');
  const [collectionSelected, setCollectionSelected] = useState<IAccountAsset>();
  const [valueContract, setValueContract] = useState<any>();
  const { walletAddress, extensionInstalled, connectExtension } =
    useExtension();
  const { isTablet } = useMobile();
  const { data: priceCall, isLoading: isLoadingPriceCall } = useQuery(
    ['pricesCall'],
    pricesCall,
  );
  const router = useRouter();

  const { data: account, isLoading: isLoadingAccount } = useQuery({
    queryKey: [`account`, router.query.account],
    queryFn: () => accountCall(router),
    enabled: !!router?.isReady,
  });

  const { data: KLVAllowance, isLoading: isLoadingKLVAllowance } = useQuery({
    queryKey: [`KLVAllowance`, router.query.account],
    queryFn: () => KLVAllowancePromise(router.query.account as string),
    enabled: !!router?.isReady,
  });

  const { data: KFIAllowance, isLoading: isLoadingKFIAllowance } = useQuery({
    queryKey: [`KFIAllowance`, router.query.account],
    queryFn: () => KFIAllowancePromise(router.query.account as string),
    enabled: !!router?.isReady,
  });

  const { data: hasProprietaryAssets } = useQuery({
    queryKey: [`hasProprietaryAssets`, router.query.account],
    queryFn: () => accountAssetsOwnerCall(router.query.account as string),
    enabled: !!router?.isReady,
  });

  const getHeaders = () => {
    if (hasProprietaryAssets) {
      headers.splice(1, 0, 'Proprietary Assets');
    }
  };
  getHeaders();

  useEffect(() => {
    if (extensionInstalled) {
      connectExtension();
    }
  }, [extensionInstalled]);

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
    setQueryAndRouter(resetDate(router.query), router);
  };

  const filterQueryDate = (selectedDays: ISelectedDays) => {
    const getFilteredDays = filterDate(selectedDays);
    setQueryAndRouter({ ...router.query, ...getFilteredDays }, router);
  };

  const filterFromTo = (op: number) => {
    const updatedQuery = { ...router.query };
    if (op === 0) {
      delete updatedQuery.role;
      setQueryAndRouter(
        {
          ...updatedQuery,
        },
        router,
      );
    } else if (op === 1) {
      setQueryAndRouter({ ...updatedQuery, role: 'sender' }, router);
    } else if (op === 2) {
      setQueryAndRouter({ ...updatedQuery, role: 'receiver' }, router);
    }
  };

  const getRequest = (page: number, limit: number): Promise<any> => {
    const address = router.query.account as string;

    switch (router.query.tab) {
      case 'Assets':
        return assetsRequest(address)(page, limit);
      case 'Proprietary Assets':
        return ownedAssetsRequest(address)(page, limit);
      case 'Transactions':
        return transactionsRequest(address, router.query)(page, limit);
      case 'Buckets':
        return bucketsRequest(address)(page, limit);
      default:
        return assetsRequest(address)(page, limit);
    }
  };

  const assetsTableProps: IInnerTableProps = {
    scrollUp: false,
    dataName: 'assets',
    query: router.query,
    request: (page: number, limit: number) => getRequest(page, limit),
  };

  const proprietaryAssetsTableProps: IInnerTableProps = {
    scrollUp: false,
    dataName: 'assets',
    query: router.query,
    request: (page: number, limit: number) => getRequest(page, limit),
  };

  const transactionTableProps: IInnerTableProps = {
    scrollUp: false,
    dataName: 'transactions',
    request: (page: number, limit: number) => getRequest(page, limit),
    query: router.query,
  };

  const bucketsTableProps: IInnerTableProps = {
    scrollUp: false,
    dataName: 'buckets',
    request: (page: number, limit: number) => getRequest(page, limit),
    query: router.query,
  };

  const tabProps: ITabs = {
    headers,
    onClick: header => {
      setQueryAndRouter({ ...router.query, tab: header }, router);
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
    switch (router?.query?.tab || 'Assets') {
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

      case 'Proprietary Assets':
        return (
          <>
            <ContainerTabInteractions>
              {showInteractionsButtons(
                'Create Asset',
                'CreateAssetContract',
                false,
              )}
            </ContainerTabInteractions>
            <ProprietaryAssets
              assetsTableProps={proprietaryAssetsTableProps}
              address={router.query.account as string}
              showInteractionsButtons={showInteractionsButtons}
            />
          </>
        );
      case 'Transactions':
        return <Transactions transactionsTableProps={transactionTableProps} />;
      case 'Buckets':
        return (
          <Buckets
            bucketsTableProps={bucketsTableProps}
            showInteractionsButtons={showInteractionsButtons}
          />
        );
      default:
        return <div />;
    }
  };

  const availableBalance = (account?.balance || 0) / 10 ** KLV_PRECISION;
  const totalKLV = calculateTotalKLV();
  const pricedKLV = totalKLV * (priceCall || 0);
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
          setStakingRewards(value);
          break;
        case 'AssetTriggerContract':
          setCollectionSelected(value);
          break;
        default:
          return;
      }
    };

    if (walletAddress === router?.query?.account) {
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

  const getAccountAddress = () => {
    const address = router.query.account as string;
    if (!address) return;
    if (isTablet && address) {
      return parseAddress(address, 15);
    }
    return address && parseAddress(address, 50);
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
      </Header>
      <OverviewContainer>
        <Row isAddressRow={true}>
          <span>
            <strong>Address</strong>
          </span>
          <RowContent>
            <CenteredRow>
              <span>{getAccountAddress()}</span>
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
                      {!isLoadingAccount ? (
                        totalKLV.toLocaleString()
                      ) : (
                        <Skeleton height={19} />
                      )}
                    </span>
                    <p>
                      {!isLoadingAccount && !isLoadingPriceCall ? (
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
                    {!isLoadingAccount ? (
                      availableBalance.toLocaleString()
                    ) : (
                      <Skeleton height={19} />
                    )}
                  </span>
                </div>
                <div>
                  <strong>Frozen</strong>
                  <span>
                    {!isLoadingAccount ? (
                      getKLVfreezeBalance().toLocaleString()
                    ) : (
                      <Skeleton height={19} />
                    )}
                  </span>
                </div>
                <div>
                  <strong>Unfrozen</strong>
                  <span>
                    {!isLoadingAccount ? (
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
                  {!isLoadingKLVAllowance ? (
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
                  {!isLoadingKLVAllowance ? (
                    <>
                      <span>{getKLVStaking().toLocaleString()}</span>
                      {showInteractionsButtons(
                        'Staking Claim',
                        'ClaimContract',
                        'klv',
                      )}
                    </>
                  ) : (
                    <Skeleton height={19} />
                  )}
                </StakingRewards>
                <StakingRewards>
                  <strong>KFI Staking</strong>
                  {!isLoadingKFIAllowance ? (
                    <>
                      <span>{getKFIStaking().toLocaleString()}</span>
                      {showInteractionsButtons(
                        'Staking Claim',
                        'ClaimContract',
                        'kfi',
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
              {!isLoadingAccount ? account?.nonce : <Skeleton height={19} />}
            </small>
          </RowContent>
        </Row>
      </OverviewContainer>
      <Tabs {...tabProps}>
        {router?.query?.tab === 'Transactions' && (
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
