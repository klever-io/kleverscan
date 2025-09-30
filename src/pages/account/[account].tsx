import { KLV } from '@/assets/coins';
import { AccountDetails as AccountIcon } from '@/assets/title-icons';
import Copy from '@/components/Copy';
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
  KFIAllowancePromise,
  KLVAllowancePromise,
  accountAssetsOwnerCall,
  accountCall,
  assetsRequest,
  bucketsRequest,
  getSCDeployedByAddress,
  nftCollectionsRequest,
  ownedAssetsRequest,
  pricesCall,
  rewardsFPRPool,
} from '@/services/requests/account';
import {
  CardContent,
  CardHeader,
  CardHeaderItem,
  CardTabContainer,
  CenteredRow,
  Container,
  FrozenContainer,
  Header,
  Row,
  RowAlert,
  RowContent,
} from '@/styles/common';
import { IInnerTableProps, IResponse } from '@/types/index';
import { IsTokenBurn, setQueryAndRouter } from '@/utils';
import { contractsList } from '@/utils/contracts';
import {
  filterOperations,
  hexToBinary,
  invertBytes,
  toLocaleFixed,
} from '@/utils/formatFunctions';
import { KLV_PRECISION } from '@/utils/globalVariables';
import { parseAddress } from '@/utils/parseValues';
import {
  AmountContainer,
  BalanceContainer,
  BalanceKLVValue,
  BalanceTransferContainer,
  ButtonExpand,
  CheckboxOperations,
  ContainerSigners,
  Em,
  FrozenContainerLi,
  FrozenContentRewards,
  IconContainer,
  ItemContainerPermissions,
  ItemContentPermissions,
  OperationsContainer,
  OperationsContent,
  RewardsAvailableContainer,
  StakingRewards,
  ValidOperation,
} from '@/views/accounts/detail';
import { ReceiveBackground } from '@/views/validator';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useQuery } from 'react-query';
import nextI18nextConfig from '../../../next-i18next.config';
import { requestTransactionsDefault } from '../transactions';
import { PermissionOperations } from '@/components/AccountPermission';
import NftCollections from '@/components/Tabs/NftCollections';
import SCDeployerdByAddress from '@/components/Tabs/SCDeployerdByAddress';

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

const EmptyComponent: React.FC<PropsWithChildren> = () => {
  return <></>;
};

const Account: React.FC<PropsWithChildren<IAccountPage>> = () => {
  const { t } = useTranslation(['common', 'accounts']);
  const headers = [
    t('common:Titles.Assets'),
    t('common:Titles.Transactions'),
    t('accounts:SingleAccount.Tabs.Buckets'),
    t('accounts:SingleAccount.Tabs.Rewards'),
    t('accounts:SingleAccount.Tabs.NFTCollections'),
    t('accounts:SingleAccount.Tabs.SmartContracts'),
  ];
  const tabHeaders = [t('common:Tabs.Overview')];
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
      headers.splice(1, 0, t('accounts:SingleAccount.Tabs.ProprietaryAssets'));
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

  const getKLVfreezeBalance = useCallback((): string => {
    const fronzenBalance = account?.assets?.KLV?.frozenBalance || 0;
    return toLocaleFixed(fronzenBalance / 10 ** KLV_PRECISION, KLV_PRECISION);
  }, [account?.assets, KLV_PRECISION]);

  const getKLVunfreezeBalance = (): string => {
    const unfrozenBalance = account?.assets?.KLV?.unfrozenBalance || 0;
    return toLocaleFixed(unfrozenBalance / 10 ** KLV_PRECISION, KLV_PRECISION);
  };

  const getKLVAllowance = (): string => {
    const allowance = KLVAllowance?.data?.result?.allowance || 0;
    return toLocaleFixed(allowance / 10 ** KLV_PRECISION, KLV_PRECISION);
  };

  const getKLVStaking = (): string => {
    const stakingRewards = KLVAllowance?.data?.result?.stakingRewards || 0;
    return toLocaleFixed(stakingRewards / 10 ** KLV_PRECISION, KLV_PRECISION);
  };

  const getKFIStaking = (): string => {
    const stakingRewards = KFIAllowance?.data?.result?.stakingRewards || 0;
    return toLocaleFixed(stakingRewards / 10 ** KLV_PRECISION, KLV_PRECISION);
  };

  const filterFromTo = (op: number) => {
    const address = router.query.account as string;
    const updatedQuery = { ...router.query };
    if (op === 0) {
      delete updatedQuery.role;
      delete updatedQuery.fromAddress;
      delete updatedQuery.toAddress;
      setQueryAndRouter(
        {
          ...updatedQuery,
        },
        router,
      );
    } else if (op === 1) {
      delete updatedQuery.toAddress;
      setQueryAndRouter({ ...updatedQuery, fromAddress: address }, router);
    } else if (op === 2) {
      delete updatedQuery.fromAddress;
      setQueryAndRouter({ ...updatedQuery, toAddress: address }, router);
    }
  };

  const getRequest = useCallback(
    (page: number, limit: number): Promise<any> => {
      const address = router.query.account as string;

      switch (router.query.tab) {
        case t('common:Titles.Assets'):
          return assetsRequest(address)(page, limit);
        case t('accounts:SingleAccount.Tabs.ProprietaryAssets'):
          return ownedAssetsRequest(address)(page, limit);
        case t('common:Titles.Transactions'):
          return requestTransactionsDefault(page, limit, router);
        case t('accounts:SingleAccount.Tabs.Buckets'):
          return bucketsRequest(address)(page, limit);
        case t('accounts:SingleAccount.Tabs.Rewards'):
          return rewardsFPRPool(address)(page, limit);
        case t('accounts:SingleAccount.Tabs.NFTCollections'):
          return nftCollectionsRequest(address)(page, limit);
        case t('accounts:SingleAccount.Tabs.SmartContracts'):
          return getSCDeployedByAddress(address)(page, limit);
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

  const nftCollectionsTableProps: IInnerTableProps = {
    scrollUp: false,
    dataName: 'assets',
    query: router.query,
    request: getRequest,
  };

  const smartContractsTableProps: IInnerTableProps = {
    scrollUp: false,
    dataName: 'sc',
    query: router.query,
    request: getRequest,
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
  };

  const transactionsFiltersProps = {
    query: router.query,
    setQuery: setQueryAndRouter,
  };

  const SelectedComponent: React.FC<PropsWithChildren> = () => {
    switch (selectedTabHeader) {
      case t('common:Tabs.Overview'):
        return <Overview />;
      case t('accounts:SingleAccount.Tabs.Permission'):
        return <Permission />;
      default:
        return <div />;
    }
  };
  const SelectedTabComponent: React.FC<PropsWithChildren> = () => {
    const Filters = showInteractionButtons ? CreateAssetButton : undefined;

    switch (router?.query?.tab || t('common:Titles.Assets')) {
      case t('common:Titles.Assets'):
        return (
          <Assets
            assetsTableProps={assetsTableProps}
            address={router.query.account as string}
            showInteractionButtons={showInteractionButtons}
            Filters={Filters}
          />
        );

      case t('accounts:SingleAccount.Tabs.ProprietaryAssets'):
        return (
          <ProprietaryAssets
            assetsTableProps={proprietaryAssetsTableProps}
            address={router.query.account as string}
            showInteractionButtons={showInteractionButtons}
            Filters={Filters}
          />
        );
      case t('common:Titles.Transactions'):
        return <Transactions transactionsTableProps={transactionTableProps} />;
      case t('accounts:SingleAccount.Tabs.Buckets'):
        return (
          <Buckets
            bucketsTableProps={bucketsTableProps}
            showInteractionButtons={showInteractionButtons}
          />
        );
      case t('accounts:SingleAccount.Tabs.Rewards'):
        return <Rewards rewardsTableProps={rewardsTableProps} />;
      case t('accounts:SingleAccount.Tabs.NFTCollections'):
        return (
          <NftCollections
            nftCollectionsTableProps={nftCollectionsTableProps}
            address={router.query.account as string}
          />
        );
      case t('accounts:SingleAccount.Tabs.SmartContracts'):
        return (
          <SCDeployerdByAddress
            smartContractsTableProps={smartContractsTableProps}
            address={router.query.account as string}
          />
        );
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
      isHiddenInput: false,
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
  ] = showInteractionButtons
    ? getInteractionsButtons([
        {
          title: t('accounts:SingleAccount.Buttons.SetAccountName'),
          contractType: 'SetAccountNameContract',
          defaultValues: {
            name: account?.name ? account.name : '',
          },
        },
        {
          title: t('accounts:SingleAccount.Buttons.Transfer'),
          contractType: 'TransferContract',
        },
        {
          title: t('accounts:SingleAccount.Buttons.Allowance'),
          contractType: 'ClaimContract',
          defaultValues: {
            claimType: 1,
            id: 'KLV',
          },
        },
        {
          title: t('accounts:SingleAccount.Buttons.StakingClaim', {
            asset: 'KLV',
          }),
          contractType: 'ClaimContract',
          defaultValues: {
            claimType: 0,
            id: 'KLV',
          },
        },
        {
          title: t('accounts:SingleAccount.Buttons.StakingClaim', {
            asset: 'KFI',
          }),
          contractType: 'ClaimContract',
          defaultValues: {
            claimType: 0,
            id: 'KFI',
          },
        },
        {
          title: t('accounts:SingleAccount.Buttons.CreateAsset'),
          contractType: 'CreateAssetContract',
        },
      ])
    : Array.from({ length: 6 }, () => EmptyComponent);

  (account?.permissions?.length || 0) > 0 &&
    tabHeaders.push(t('accounts:SingleAccount.Tabs.Permission'));
  const Permission: React.FC<PropsWithChildren> = () => {
    const msg = `Owner - This is the default permission, 
    granting the holder the ability to execute all contracts.
    The permission can be transferred to another person and
    shared with a certain threshold and weight.
    User - This permission allows the signer to execute only
    those contracts explicitly authorized by the permission contract,
    based on the weight assigned to their signature. 
      `;

    return (
      <Container>
        {account?.permissions?.map(permission => {
          return (
            <Row key={permission.id}>
              <span>
                <strong>PermID {permission.id}</strong>
              </span>
              <RowContent>
                <BalanceContainer>
                  <FrozenContainer>
                    <ItemContainerPermissions isOperations={true}>
                      <strong>
                        {t('accounts:SingleAccount.PermissionsTab.Signers')}
                      </strong>
                      <ContainerSigners
                        isSignersRow={true}
                        rowColumnMobile={true}
                      >
                        {permission.signers.map((signer, key) => (
                          <FrozenContentRewards key={key}>
                            <ul key={key}>
                              <FrozenContainerLi>
                                <Em>{getAccountAddress(signer.address)}</Em>
                                <Copy info="Address" data={signer.address} />
                              </FrozenContainerLi>
                              <li>
                                <Em>
                                  {t(
                                    'accounts:SingleAccount.PermissionsTab.Weight',
                                  )}
                                </Em>
                                {signer.weight}
                              </li>
                            </ul>
                          </FrozenContentRewards>
                        ))}
                      </ContainerSigners>
                    </ItemContainerPermissions>
                    <ItemContainerPermissions>
                      <strong>
                        {t('accounts:SingleAccount.PermissionsTab.Type')}
                      </strong>
                      <ItemContentPermissions>
                        <p>{permission.type === 0 ? 'Owner' : 'User'}</p>
                        <Tooltip msg={msg} />
                      </ItemContentPermissions>
                    </ItemContainerPermissions>

                    <ItemContainerPermissions>
                      <strong>
                        {t('accounts:SingleAccount.PermissionsTab.Threshold')}
                      </strong>
                      <ItemContentPermissions>
                        <p>{permission.Threshold}</p>
                      </ItemContentPermissions>
                    </ItemContainerPermissions>
                    <ItemContainerPermissions isOperations={true}>
                      <strong>
                        {t('accounts:SingleAccount.PermissionsTab.Operations')}
                      </strong>
                      <ItemContentPermissions rowColumnMobile={true}>
                        <PermissionOperations {...permission} />
                      </ItemContentPermissions>
                    </ItemContainerPermissions>
                    <ItemContainerPermissions>
                      <strong>
                        {t(
                          'accounts:SingleAccount.PermissionsTab.PermissionsName',
                        )}
                      </strong>
                      <ItemContentPermissions rowColumnMobile={true}>
                        <p>{permission.permissionName || '--'}</p>
                      </ItemContentPermissions>
                    </ItemContainerPermissions>
                  </FrozenContainer>
                </BalanceContainer>
              </RowContent>
            </Row>
          );
        })}
      </Container>
    );
  };

  const Overview: React.FC<PropsWithChildren> = () => {
    return (
      <Container>
        <Row isMobileRow>
          <span>
            <strong>{t('accounts:SingleAccount.Content.Address')}</strong>
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
            {IsTokenBurn(router.query.account as string) && (
              <RowAlert>
                <span>{t('accounts:SingleAccount.BlackHole')}</span>
              </RowAlert>
            )}
          </RowContent>
        </Row>
        <Row>
          <span>
            <strong>
              {t('accounts:SingleAccount.Content.Balance.Balance')}
            </strong>
          </span>
          <RowContent>
            <BalanceContainer>
              <AmountContainer>
                {!isTablet && (
                  <IconContainer>
                    <KLV />
                    <span>KLV</span>
                  </IconContainer>
                )}
                <BalanceTransferContainer>
                  <div>
                    <BalanceKLVValue>
                      {!isLoadingAccount ? (
                        <span data-testid="klv-balance">
                          {toLocaleFixed(totalKLV, KLV_PRECISION)}
                        </span>
                      ) : (
                        <Skeleton height={19} />
                      )}
                      {isTablet && (
                        <IconContainer>
                          <KLV />
                          <span>KLV</span>
                        </IconContainer>
                      )}
                    </BalanceKLVValue>
                    <p>
                      {!isLoadingAccount && !isLoadingPriceCall ? (
                        <>USD {pricedKLV.toLocaleString()}</>
                      ) : (
                        <Skeleton height={16} />
                      )}
                    </p>
                  </div>
                  <TransferButton />
                </BalanceTransferContainer>
              </AmountContainer>
              <FrozenContainer>
                <div>
                  <strong>
                    {t('accounts:SingleAccount.Content.Balance.Available')}
                  </strong>
                  <span>
                    {!isLoadingAccount ? (
                      toLocaleFixed(availableBalance, KLV_PRECISION)
                    ) : (
                      <Skeleton height={19} />
                    )}
                  </span>
                </div>
                <div>
                  <strong>
                    {t('accounts:SingleAccount.Content.Balance.Frozen')}
                  </strong>
                  <span>
                    {!isLoadingAccount ? (
                      getKLVfreezeBalance()
                    ) : (
                      <Skeleton height={19} />
                    )}
                  </span>
                </div>
                <div>
                  <strong>
                    {t('accounts:SingleAccount.Content.Balance.Unfrozen')}
                  </strong>
                  <span>
                    {!isLoadingAccount ? (
                      getKLVunfreezeBalance()
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
            <RewardsAvailableContainer>
              <strong>
                {t('accounts:SingleAccount.Content.RewardsAvailable.Rewards')}
              </strong>
              <strong>
                {t('accounts:SingleAccount.Content.RewardsAvailable.Available')}
              </strong>
            </RewardsAvailableContainer>
          </span>
          <RowContent>
            <BalanceContainer>
              <FrozenContainer>
                <StakingRewards>
                  <strong>
                    {t(
                      'accounts:SingleAccount.Content.RewardsAvailable.Allowance',
                    )}
                  </strong>
                  {!isLoadingKLVAllowance ? (
                    <>
                      <span>{getKLVAllowance()}</span>
                      <AllowanceClaimButton />
                    </>
                  ) : (
                    <Skeleton height={19} />
                  )}
                </StakingRewards>
                <StakingRewards>
                  <strong>
                    {t(
                      'accounts:SingleAccount.Content.RewardsAvailable.Staking',
                      { asset: 'KLV' },
                    )}
                  </strong>
                  {!isLoadingKLVAllowance ? (
                    <>
                      <span>{getKLVStaking()}</span>
                      <KLVStakingClaimButton />
                    </>
                  ) : (
                    <Skeleton height={19} />
                  )}
                </StakingRewards>
                <StakingRewards>
                  <strong>
                    {t(
                      'accounts:SingleAccount.Content.RewardsAvailable.Staking',
                      { asset: 'KFI' },
                    )}
                  </strong>
                  {!isLoadingKFIAllowance ? (
                    <>
                      <span>{getKFIStaking()}</span>
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
            <strong>{t('accounts:SingleAccount.Content.Nonce')}</strong>
          </span>
          <RowContent>
            <small>
              {!isLoadingAccount ? account?.nonce : <Skeleton height={19} />}
            </small>
          </RowContent>
        </Row>
      </Container>
    );
  };

  return (
    <Container>
      <Header>
        <Title
          title={
            account?.name ? account?.name : t('accounts:SingleAccount.Title')
          }
          Icon={AccountIcon}
          route={-1}
          isAccountOwner={!!account?.name}
        />
      </Header>
      <CardTabContainer>
        <CardHeader>
          {tabHeaders.map((header, index) => (
            <CardHeaderItem
              key={String(index)}
              selected={selectedTabHeader === header}
              onClick={() => {
                setSelectedTabHeader(header);
              }}
              data-testid={`header-tab`}
            >
              <span>{header}</span>
            </CardHeaderItem>
          ))}
        </CardHeader>
        <CardContent>
          <SelectedComponent />
        </CardContent>
      </CardTabContainer>
      <Tabs {...tabProps}>
        {router?.query?.tab ===
          t('accounts:SingleAccount.Tabs.Transactions') && (
          <TxsFiltersWrapper>
            <ContainerFilter>
              <RightFiltersContent>
                <FilterDiv>
                  <span>Transaction In/Out</span>
                  {filters.map((filter, index) => (
                    <Filter key={index} {...filter} />
                  ))}
                </FilterDiv>
              </RightFiltersContent>
            </ContainerFilter>
          </TxsFiltersWrapper>
        )}
        <SelectedTabComponent />
      </Tabs>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => {
  const props = await serverSideTranslations(
    locale,
    ['common', 'accounts'],
    nextI18nextConfig,
    ['en'],
  );

  return { props };
};

export default Account;
