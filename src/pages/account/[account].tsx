import { KLV } from '@/assets/coins';
import { PermissionOperations } from '@/components/AccountPermission';
import CopyAction from '@/components/DataList/CopyAction';
import FittedHash from '@/components/AccountDetail/FittedHash';
import {
  CARD_OVERVIEW,
  CARD_PERMISSION,
  accountListHeaders,
  accountListTabIndex,
  transactionDirectionLabel,
  visibleAccountCard,
} from '@/components/AccountDetail/state';
import {
  AccountBox,
  FactLabel,
  FactRow,
  FactValue,
  FactValueRow,
  FactsCard,
  FactsTab,
  FactsTabs,
  FigureRow,
  GroupBody,
  GroupRow,
  OperationsWrap,
  PermHeading,
  PermissionBlock,
  SignerLabel,
  SignerRow,
  StackedLabel,
  WeightText,
} from '@/components/AccountDetail/styles';
import { pickUrlEffect } from '@/components/BlockDetail/urlEffect';
import Filter, { IFilter } from '@/components/Filter';
import Title from '@/components/Layout/Title';
import QrCodeModal from '@/components/QrCodeModal';
import Skeleton from '@/components/Skeleton';
import Tabs, { ITabs } from '@/components/Tabs';
import Tooltip from '@/components/Tooltip/index';
import {
  ContainerFilter,
  FilterDiv,
  RightFiltersContent,
  TxsFiltersWrapper,
} from '@/components/TransactionsFilters/styles';
import { useContractModal } from '@/contexts/contractModal';
import { useExtension } from '@/contexts/extension';
import { useNetworkParams } from '@/contexts/contract/networkParams';
import api from '@/services/api';
import {
  KFIAllowancePromise,
  KLVAllowancePromise,
  accountAssetsOwnerCall,
  accountCall,
  pricesCall,
} from '@/services/requests/account';
import { Container, Header, RowAlert } from '@/styles/common';
import { IResponse } from '@/types/index';
import { IsTokenBurn, setQueryAndRouter } from '@/utils';
import { toLocaleFixed } from '@/utils/formatFunctions';
import { KLV_PRECISION } from '@/utils/globalVariables';
import {
  AmountContainer,
  BalanceContainer,
  BalanceKLVValue,
  BalanceTransferContainer,
  IconContainer,
  ItemContainerPermissions,
  ItemContentPermissions,
  RewardExpiry,
  StakingRewards,
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
import { useQuery } from '@tanstack/react-query';
import nextI18nextConfig from '../../../next-i18next.config';
import SelectedTabComponent, {
  EmptyComponent,
} from '@/components/Account/SelectedTabComponent';

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

const Account: React.FC<PropsWithChildren<IAccountPage>> = () => {
  const { t } = useTranslation(['common', 'accounts']);
  const { walletAddress, extensionInstalled, connectExtension } =
    useExtension();
  const { paramsList } = useNetworkParams();
  const router = useRouter();

  const { data: priceCall, isLoading: isLoadingPriceCall } = useQuery<
    number | undefined
  >({
    queryKey: ['pricesCall'],
    queryFn: pricesCall,
  });

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

  const { data: hasProprietaryAssets, isFetched: proprietaryFetched } =
    useQuery({
      queryKey: [`hasProprietaryAssets`, router.query.account],
      queryFn: () => accountAssetsOwnerCall(router.query.account as string),
      enabled: !!router?.isReady,
    });

  const { data: currentEpoch } = useQuery({
    queryKey: ['epoch'],
    queryFn: async () => {
      const res = await api.get({ route: 'block/list' });
      return res.data?.blocks[0]?.epoch as number | undefined;
    },
  });

  const maxEpochsUnclaimedRaw = Number(
    paramsList?.find(p => p.parameterLabel === 'MaxEpochsUnclaimed')
      ?.currentValue,
  );
  const maxEpochsUnclaimed = Number.isNaN(maxEpochsUnclaimedRaw)
    ? 100
    : maxEpochsUnclaimedRaw;

  const calcExpiry = (
    lastClaimEpoch: number | undefined,
  ): { days: number; warning: boolean } | null => {
    if (currentEpoch == null || lastClaimEpoch == null) return null;
    const remaining = maxEpochsUnclaimed - (currentEpoch - lastClaimEpoch);
    if (remaining <= 0) return { days: 0, warning: true };
    const days = Math.max(1, Math.floor(remaining / 4));
    return { days, warning: remaining < 12 };
  };

  const klvStakingExpiry = calcExpiry(account?.assets?.KLV?.lastClaim?.epoch);
  const kfiStakingExpiry = calcExpiry(account?.assets?.KFI?.lastClaim?.epoch);

  const hasBuckets = Object.values(account?.assets || {}).some(
    asset => (asset as { buckets?: unknown[] })?.buckets?.length,
  );

  const assetsLabel = t('common:Titles.Assets');
  const transactionsLabel = t('common:Titles.Transactions');
  const headers = accountListHeaders({
    assets: assetsLabel,
    proprietary: hasProprietaryAssets
      ? t('accounts:SingleAccount.Tabs.ProprietaryAssets')
      : null,
    transactions: transactionsLabel,
    buckets: hasBuckets ? t('accounts:SingleAccount.Tabs.Buckets') : null,
    rewards: hasBuckets ? t('accounts:SingleAccount.Tabs.Rewards') : null,
    contracts: t('accounts:SingleAccount.Tabs.SmartContracts'),
  });

  // Null until the address bar is read. The server does not see ?card= or
  // ?tab=, so starting on Overview and Assets painted those and then jumped.
  const [urlRead, setUrlRead] = useState(false);
  const [cardQuery, setCardQuery] = useState<string | null>(null);
  const [tabQuery, setTabQuery] = useState<string | null>(null);
  const useUrlLayoutEffect = pickUrlEffect(globalThis.window);
  useUrlLayoutEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setCardQuery(params.get('card'));
    setTabQuery(params.get('tab'));
    setUrlRead(true);
  }, [router.asPath]);

  const permissionsKnown = !isLoadingAccount && account !== undefined;
  const hasPermissions = (account?.permissions?.length || 0) > 0;
  const card = visibleAccountCard(
    cardQuery,
    urlRead,
    permissionsKnown,
    hasPermissions,
  );
  const headersSettled = !isLoadingAccount && proprietaryFetched;
  const tabIndex = accountListTabIndex(
    headers,
    tabQuery,
    urlRead,
    headersSettled,
  );

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

  const tabProps: ITabs = {
    headers,
    onClick: header => {
      setTabQuery(header);
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

  const availableBalance = (account?.balance || 0) / 10 ** KLV_PRECISION;
  const totalKLV = calculateTotalKLV();
  const pricedKLV = totalKLV * (priceCall || 0);
  const accountAddress = String(router.query.account || '');
  const directionLabel = transactionDirectionLabel(
    router.query,
    accountAddress,
  );

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
      current: directionLabel,
      overFlow: 'visible',
      inputType: 'button',
      isHiddenInput: false,
    },
  ];

  const selectCard = (next: typeof CARD_OVERVIEW | typeof CARD_PERMISSION) => {
    setCardQuery(next);
    setUrlRead(true);
    setQueryAndRouter({ ...router.query, card: next }, router);
  };

  const [
    SetAccountNameButton,
    TransferButton,
    AllowanceClaimButton,
    KLVStakingClaimButton,
    KFIStakingClaimButton,
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
      ])
    : Array.from({ length: 6 }, () => EmptyComponent);

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
      <>
        {account?.permissions?.map(permission => (
          <PermissionBlock key={permission.id}>
            <PermHeading>PermID {permission.id}</PermHeading>
            {permission.signers.map((signer, index) => (
              <SignerRow key={signer.address}>
                <SignerLabel $show={index === 0}>
                  {index === 0
                    ? t('accounts:SingleAccount.PermissionsTab.Signers')
                    : ''}
                </SignerLabel>
                <FactValueRow>
                  <FittedHash value={signer.address} />
                  <WeightText>
                    {t('accounts:SingleAccount.PermissionsTab.Weight')}{' '}
                    {signer.weight}
                  </WeightText>
                  <CopyAction
                    value={signer.address}
                    label={t('accounts:Common.CopyAddress')}
                    announcement={t('accounts:Common.AddressCopied')}
                  />
                </FactValueRow>
              </SignerRow>
            ))}
            <FactRow>
              <FactLabel>
                {t('accounts:SingleAccount.PermissionsTab.Type')}
              </FactLabel>
              <FactValueRow>
                <FactValue>
                  {permission.type === 0 ? 'Owner' : 'User'}
                </FactValue>
                <Tooltip msg={msg} />
              </FactValueRow>
            </FactRow>
            <FactRow>
              <FactLabel>
                {t('accounts:SingleAccount.PermissionsTab.Threshold')}
              </FactLabel>
              <FactValueRow>
                <FactValue>{permission.Threshold}</FactValue>
              </FactValueRow>
            </FactRow>
            <FactRow>
              <FactLabel>
                {t('accounts:SingleAccount.PermissionsTab.PermissionsName')}
              </FactLabel>
              <FactValueRow>
                <FactValue>{permission.permissionName || '--'}</FactValue>
              </FactValueRow>
            </FactRow>
            <OperationsWrap>
              <ItemContainerPermissions isOperations={true}>
                <strong>
                  {t('accounts:SingleAccount.PermissionsTab.Operations')}
                </strong>
                <ItemContentPermissions rowColumnMobile={true}>
                  <PermissionOperations {...permission} />
                </ItemContentPermissions>
              </ItemContainerPermissions>
            </OperationsWrap>
          </PermissionBlock>
        ))}
      </>
    );
  };

  const Overview: React.FC<PropsWithChildren> = () => {
    return (
      <>
        <FactRow>
          <FactLabel>{t('accounts:SingleAccount.Content.Address')}</FactLabel>
          <FactValueRow>
            <FittedHash value={accountAddress} />
            <CopyAction
              value={accountAddress}
              label={t('accounts:Common.CopyAddress')}
              announcement={t('accounts:Common.AddressCopied')}
            />
            <ReceiveBackground>
              <QrCodeModal value={accountAddress} isOverflow={false} />
            </ReceiveBackground>
            <SetAccountNameButton />
            {IsTokenBurn(accountAddress) && (
              <RowAlert>
                <span>{t('accounts:SingleAccount.Void')}</span>
              </RowAlert>
            )}
          </FactValueRow>
        </FactRow>
        <GroupRow>
          <StackedLabel>
            {t('accounts:SingleAccount.Content.Balance.Balance')}
          </StackedLabel>
          <GroupBody>
            <BalanceContainer>
              <FigureRow>
                <AmountContainer>
                  <IconContainer>
                    <KLV />
                    <span>KLV</span>
                  </IconContainer>
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
              </FigureRow>
              <AccountBox>
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
              </AccountBox>
            </BalanceContainer>
          </GroupBody>
        </GroupRow>
        <GroupRow>
          <StackedLabel>
            <span>
              {t('accounts:SingleAccount.Content.RewardsAvailable.Rewards')}
            </span>
            <span>
              {t('accounts:SingleAccount.Content.RewardsAvailable.Available')}
            </span>
          </StackedLabel>
          <GroupBody>
            <BalanceContainer>
              <AccountBox>
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
                      {klvStakingExpiry != null &&
                        (KLVAllowance?.data?.result?.stakingRewards ?? 0) >
                          0 && (
                          <RewardExpiry warning={klvStakingExpiry.warning}>
                            {klvStakingExpiry.days === 0
                              ? t(
                                  'accounts:SingleAccount.Content.RewardsAvailable.Expired',
                                )
                              : t(
                                  'accounts:SingleAccount.Content.RewardsAvailable.ExpiresIn',
                                  { count: klvStakingExpiry.days },
                                )}
                          </RewardExpiry>
                        )}
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
                      {kfiStakingExpiry != null &&
                        (KFIAllowance?.data?.result?.stakingRewards ?? 0) >
                          0 && (
                          <RewardExpiry warning={kfiStakingExpiry.warning}>
                            {kfiStakingExpiry.days === 0
                              ? t(
                                  'accounts:SingleAccount.Content.RewardsAvailable.Expired',
                                )
                              : t(
                                  'accounts:SingleAccount.Content.RewardsAvailable.ExpiresIn',
                                  { count: kfiStakingExpiry.days },
                                )}
                          </RewardExpiry>
                        )}
                      <KFIStakingClaimButton />
                    </>
                  ) : (
                    <Skeleton height={19} />
                  )}
                </StakingRewards>
              </AccountBox>
            </BalanceContainer>
          </GroupBody>
        </GroupRow>
        <FactRow>
          <FactLabel>{t('accounts:SingleAccount.Content.Nonce')}</FactLabel>
          <FactValueRow>
            <FactValue>
              {!isLoadingAccount ? account?.nonce : <Skeleton height={19} />}
            </FactValue>
          </FactValueRow>
        </FactRow>
      </>
    );
  };

  const showPermissionTab = hasPermissions || card === CARD_PERMISSION;

  return (
    <Container>
      <Header>
        <Title
          title={
            account?.name ? account.name : t('accounts:SingleAccount.Title')
          }
          route="/accounts"
        />
      </Header>
      <FactsCard>
        <FactsTabs aria-label={t('accounts:SingleAccount.Title')}>
          <FactsTab
            type="button"
            $selected={card === CARD_OVERVIEW}
            onClick={() => selectCard(CARD_OVERVIEW)}
          >
            {t('common:Tabs.Overview')}
          </FactsTab>
          {showPermissionTab && (
            <FactsTab
              type="button"
              $selected={card === CARD_PERMISSION}
              onClick={() => selectCard(CARD_PERMISSION)}
            >
              {t('accounts:SingleAccount.Tabs.Permission')}
            </FactsTab>
          )}
        </FactsTabs>
        {card === CARD_OVERVIEW && <Overview />}
        {card === CARD_PERMISSION && permissionsKnown && <Permission />}
      </FactsCard>
      <Tabs {...tabProps} selectedIndex={tabIndex}>
        {router.isReady &&
          tabIndex >= 0 &&
          router.query.tab === transactionsLabel && (
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
        {router.isReady && tabIndex >= 0 && (
          <SelectedTabComponent
            showInteractionButtons={showInteractionButtons}
          />
        )}
      </Tabs>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => {
  const props = await serverSideTranslations(
    locale,
    ['common', 'accounts', 'transactions'],
    nextI18nextConfig,
    ['en'],
  );

  return { props };
};

export default Account;
