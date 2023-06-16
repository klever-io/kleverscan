import { KLV } from '@/assets/coins';
import { AccountDetails as AccountIcon } from '@/assets/title-icons';
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
import Rewards from '@/components/Tabs/Rewards';
import Transactions from '@/components/Tabs/Transactions';
import Tooltip from '@/components/Tooltip/index';
import TransactionsFilters from '@/components/TransactionsFilters';
import {
  ContainerFilter,
  FilterDiv,
  RightFiltersContent,
  TxsFiltersWrapper,
} from '@/components/TransactionsFilters/styles';
import { useContractModal } from '@/contexts/contractModal';
import { useExtension } from '@/contexts/extension';
import { useMobile } from '@/contexts/mobile';
import {
  accountAssetsOwnerCall,
  accountCall,
  assetsRequest,
  bucketsRequest,
  KFIAllowancePromise,
  KLVAllowancePromise,
  ownedAssetsRequest,
  pricesCall,
  rewardsFPRPool,
  transactionsRequest,
} from '@/services/requests/account/account';
import { IAccountAsset, IInnerTableProps, IResponse } from '@/types/index';
import { setQueryAndRouter } from '@/utils';
import { contractsList } from '@/utils/contracts';
import {
  filterDate,
  filterOperations,
  hexToBinary,
} from '@/utils/formatFunctions';
import { KLV_PRECISION } from '@/utils/globalVariables';
import { parseAddress } from '@/utils/parseValues';
import { resetDate } from '@/utils/resetDate';
import {
  AmountContainer,
  BalanceContainer,
  ButtonExpand,
  CardContainer,
  CardContent,
  CardHeader,
  CardHeaderItem,
  CenteredRow,
  CheckboxOperations,
  Container,
  ContainerSigners,
  ContainerTabInteractions,
  FrozenContainer,
  FrozenContainerPermissions,
  FrozenContentRewards,
  Header,
  IconContainer,
  ItemContainerPermissions,
  ItemContentPermissions,
  OperationsContainer,
  OperationsContent,
  OverviewContainer,
  Row,
  RowContent,
  StakingRewards,
  ValidOperation,
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

export interface IAllowanceResponse extends IResponse {
  data: {
    result: { allowance: number; stakingRewards: number };
  };
}
interface IPermissionOperations {
  id: number;
  operations: string;
  type: number;
}

const PermissionOperations: React.FC<IPermissionOperations> = ({
  operations,
  type,
}) => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => {
    setExpanded(!expanded);
  };
  const displayOperations = expanded
    ? contractsList
    : contractsList.slice(0, 6);

  return (
    <OperationsContainer>
      {operations ? (
        displayOperations.map((item: string, key: number) => {
          const filterResults = filterOperations(hexToBinary(operations));
          const isChecked = filterResults[key];
          return (
            <OperationsContent key={contractsList[key]} isChecked={isChecked}>
              {isChecked ? (
                <ValidOperation />
              ) : (
                <CheckboxOperations
                  checked={isChecked}
                  type="checkbox"
                  disabled
                />
              )}
              <p>{item}</p>
            </OperationsContent>
          );
        })
      ) : (
        <>
          {type === 0 &&
            displayOperations.map((item, key) => (
              <OperationsContent key={contractsList[key]}>
                <ValidOperation />
                <p>{item}</p>
              </OperationsContent>
            ))}
        </>
      )}
      <ButtonExpand onClick={toggleExpand}>
        {expanded ? 'Hide' : 'Expand'}
      </ButtonExpand>
    </OperationsContainer>
  );
};

const Account: React.FC<IAccountPage> = () => {
  const headers = ['Assets', 'Transactions', 'Buckets', 'Rewards'];
  const [openModalTransactions, setOpenModalTransactions] =
    useState<boolean>(false);
  const [titleModal, setTitleModal] = useState<string>('');
  const [stakingRewards, setStakingRewards] = useState<number>(0);
  const [contractValue, setContractValue] = useState<string>('');
  const [collectionSelected, setCollectionSelected] = useState<IAccountAsset>();
  const [valueContract, setValueContract] = useState<any>();
  const tabHeaders = ['Overview'];

  const [selectedTabHeader, setSelectedTabHeader] = useState(tabHeaders[0]);

  const { walletAddress, extensionInstalled, connectExtension } =
    useExtension();
  const { isTablet } = useMobile();
  const router = useRouter();

  const { data: priceCall, isLoading: isLoadingPriceCall } = useQuery(
    ['pricesCall'],
    pricesCall,
  );

  const { data: account, isLoading: isLoadingAccount } = useQuery({
    queryKey: [`account`, router.query.account],
    queryFn: () => accountCall(router),
    enabled: !!router?.isReady,
  });
  const { getInteractionsButtons } = useContractModal();

  const showInteractionButtons = Boolean(
    walletAddress && account?.address === walletAddress,
  );

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

  useEffect(() => {
    setSelectedTabHeader(tabHeaders[0]);
  }, [account, router.isReady]);

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

  const getRequest = useCallback(
    (page: number, limit: number): Promise<any> => {
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
        case 'Rewards':
          return rewardsFPRPool(address)(page, limit);
        default:
          return assetsRequest(address)(page, limit);
      }
    },
    [router.query.account, router.query.tab, router.query],
  );

  const assetsTableProps: IInnerTableProps = {
    scrollUp: false,
    dataName: 'assets',
    query: router.query,
    request: getRequest,
  };

  const proprietaryAssetsTableProps: IInnerTableProps = {
    scrollUp: false,
    dataName: 'proprietaryAssets',
    query: router.query,
    request: getRequest,
  };

  const transactionTableProps: IInnerTableProps = {
    scrollUp: false,
    dataName: 'transactions',
    request: getRequest,
    query: router.query,
  };

  const bucketsTableProps: IInnerTableProps = {
    scrollUp: false,
    dataName: 'buckets',
    request: getRequest,
    query: router.query,
  };

  const rewardsTableProps: IInnerTableProps = {
    scrollUp: false,
    dataName: 'rewards',
    request: (page: number, limit: number) => getRequest(page, limit),
    query: router.query,
  };

  const tabProps: ITabs = {
    headers,
    onClick: header => {
      const updatedQuery = { ...router.query };
      delete updatedQuery.page;
      delete updatedQuery.limit;
      setQueryAndRouter(
        {
          ...updatedQuery,
          tab: header,
        },
        router,
      );
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

  const SelectedComponent: React.FC = () => {
    switch (selectedTabHeader) {
      case 'Overview':
        return <Overview />;
      case 'Permission':
        return <Permission />;
      default:
        return <div />;
    }
  };
  const SelectedTabComponent: React.FC = () => {
    switch (router?.query?.tab || 'Assets') {
      case 'Assets':
        return (
          <>
            <ContainerTabInteractions>
              {showInteractionButtons && <CreateAssetButton />}
            </ContainerTabInteractions>
            <Assets
              assetsTableProps={assetsTableProps}
              address={router.query.account as string}
              showInteractionButtons={showInteractionButtons}
            />
          </>
        );

      case 'Proprietary Assets':
        return (
          <>
            <ContainerTabInteractions>
              {showInteractionButtons && <CreateAssetButton />}
            </ContainerTabInteractions>
            <ProprietaryAssets
              assetsTableProps={proprietaryAssetsTableProps}
              address={router.query.account as string}
              showInteractionButtons={showInteractionButtons}
            />
          </>
        );
      case 'Transactions':
        return <Transactions transactionsTableProps={transactionTableProps} />;
      case 'Buckets':
        return (
          <Buckets
            bucketsTableProps={bucketsTableProps}
            showInteractionButtons={showInteractionButtons}
          />
        );
      case 'Rewards':
        return <Rewards rewardsTableProps={rewardsTableProps} />;
      default:
        return <div />;
    }
  };

  const availableBalance = (account?.balance || 0) / 10 ** KLV_PRECISION;
  const totalKLV = calculateTotalKLV();
  const pricedKLV = totalKLV * (priceCall || 0);

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

  const getAccountAddress = (address: string) => {
    if (!address) return;
    if (isTablet && address) {
      return parseAddress(address, 15);
    }
    return address && parseAddress(address, 50);
  };

  const [
    SetAccountNameButton,
    TransferButton,
    AllowanceClaimButton,
    KLVStakingClaimButton,
    KFIStakingClaimButton,
    CreateAssetButton,
  ] = getInteractionsButtons([
    {
      title: 'Set Account Name',
      contractType: 'SetAccountNameContract',
      defaultValues: {
        name: account?.name ? account.name : '',
      },
    },
    {
      title: 'Transfer',
      contractType: 'TransferContract',
    },
    {
      title: 'Allowance Claim',
      contractType: 'ClaimContract',
      defaultValues: {
        claimType: 1,
        id: 'KLV',
      },
    },
    {
      title: 'KLV Staking Claim',
      contractType: 'ClaimContract',
      defaultValues: {
        claimType: 0,
        id: 'KLV',
      },
    },
    {
      title: 'KFI Staking Claim',
      contractType: 'ClaimContract',
      defaultValues: {
        claimType: 0,
        id: 'KFI',
      },
    },
    {
      title: 'Create Asset',
      contractType: 'CreateAssetContract',
    },
  ]);

  (account?.permissions?.length || 0) > 0 && tabHeaders.push('Permission');
  const Permission: React.FC = () => {
    const msg = `Owner - This is the default permission, 
    granting the holder the ability to execute all contracts.
    The permission can be transferred to another person and
    shared with a certain threshold and weight.
    User - This permission allows the signer to execute only
    those contracts explicitly authorized by the permission contract,
    based on the weight assigned to their signature. 
      `;
    return (
      <OverviewContainer>
        {account?.permissions?.map(permission => {
          return (
            <Row key={permission.id}>
              <span>
                <strong>PermID {permission.id}</strong>
              </span>
              <RowContent>
                <BalanceContainer>
                  <FrozenContainerPermissions>
                    <ItemContainerPermissions isOperations={true}>
                      <strong>Signers</strong>
                      <ContainerSigners
                        isSignersRow={true}
                        rowColumnMobile={true}
                      >
                        {permission.signers.map((signer, key) => (
                          <FrozenContentRewards key={key}>
                            <ul key={key}>
                              <li>
                                {getAccountAddress(signer.address)}
                                <Copy info="Address" data={signer.address} />
                              </li>
                              <li>
                                <strong>Weight</strong>
                                {signer.weight}
                              </li>
                            </ul>
                          </FrozenContentRewards>
                        ))}
                      </ContainerSigners>
                    </ItemContainerPermissions>
                    <ItemContainerPermissions>
                      <strong>Type</strong>
                      <ItemContentPermissions>
                        <p>{permission.type === 0 ? 'Owner' : 'User'}</p>
                        <Tooltip msg={msg} />
                      </ItemContentPermissions>
                    </ItemContainerPermissions>

                    <ItemContainerPermissions>
                      <strong>Threshold</strong>
                      <ItemContentPermissions>
                        <p>{permission.Threshold}</p>
                      </ItemContentPermissions>
                    </ItemContainerPermissions>
                    <ItemContainerPermissions isOperations={true}>
                      <strong>Operations</strong>
                      <ItemContentPermissions rowColumnMobile={true}>
                        <PermissionOperations {...permission} />
                      </ItemContentPermissions>
                    </ItemContainerPermissions>
                    <ItemContentPermissions rowColumnMobile={true}>
                      <strong>Permissions Name</strong>
                      <p>{permission.permissionName || '--'}</p>
                    </ItemContentPermissions>
                  </FrozenContainerPermissions>
                </BalanceContainer>
              </RowContent>
            </Row>
          );
        })}
      </OverviewContainer>
    );
  };

  const Overview: React.FC = () => {
    return (
      <OverviewContainer>
        <Row isAddressRow={true}>
          <span>
            <strong>Address</strong>
          </span>
          <RowContent>
            <CenteredRow>
              <span>{getAccountAddress(router.query.account as string)}</span>
              <Copy info="Address" data={router.query.account as string} />
              <ReceiveBackground>
                <QrCodeModal
                  value={router.query.account as string}
                  isOverflow={false}
                />
              </ReceiveBackground>
              <SetAccountNameButton />
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
                  <TransferButton />
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
                      <AllowanceClaimButton />
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
                      <KLVStakingClaimButton />
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
                      <KFIStakingClaimButton />
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
    );
  };

  return (
    <Container>
      <Header>
        <Title
          title={account?.name ? account?.name : 'Account'}
          Icon={AccountIcon}
          route={'/accounts'}
          isAccountOwner={!!account?.name}
        />
      </Header>
      <CardContainer>
        <CardHeader>
          {tabHeaders.map((header, index) => (
            <CardHeaderItem
              key={String(index)}
              selected={selectedTabHeader === header}
              onClick={() => {
                setSelectedTabHeader(header);
              }}
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
