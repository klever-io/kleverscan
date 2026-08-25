import CopyAction from '@/components/DataList/CopyAction';
import ExplorerLink from '@/components/DataList/ExplorerLink';
import { exactAmount } from '@/components/DataList/format';
import {
  AddressLink,
  AmountMuted,
  AmountPrimary,
  BadgePill,
  IdentityCell,
  RowActions,
} from '@/components/DataList/styles';
import Filter, { IFilter } from '@/components/Filter';
import AssetIdentity from '@/components/DataList/AssetIdentity';
import { FilterContainer } from '@/components/TransactionsFilters/styles';
import {
  requestAllAssetsPools,
  requestAssetsPoolsQuery,
} from '@/services/requests/assetsPools';
import { IAssetPoolRow, IRowSection } from '@/types';
import { setQueryAndRouter } from '@/utils';
import { formatAmount } from '@/utils/formatFunctions';
import { KLV_PRECISION } from '@/utils/globalVariables';
import { parseAddress } from '@/utils/parseValues';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { PropsWithChildren, useCallback } from 'react';

import Table, { ITable } from '../Table';
import { formatRate, getPoolRate, hasSeparateAdmin } from './helpers';
import PoolsMobileCard from './MobileCard';
import PoolsSummary from './PoolsSummary';
import {
  AdminLabel,
  AdminRow,
  OwnerCell,
  OwnerRow,
  PoolsTableWrapper,
  RateCell,
  RateUnit,
  RateValue,
} from './styles';
import {
  POOL_ADMIN_NOTE,
  POOL_DISABLED_TOOLTIP,
  POOL_KLV_RESERVE_TOOLTIP,
  POOL_RATE_TOOLTIP,
} from './texts';

const header = ['Pool', 'Fee Rate', 'KLV Reserve', 'KDA Reserve', 'Owner'];

/**
 * Asset search over the pools themselves. The full pool set is already
 * cached for the summary strip, so the dropdown lists exactly the assets
 * that have a pool: searching one that has none can never come up empty.
 */
const PoolsFilters: React.FC<PropsWithChildren> = () => {
  const router = useRouter();
  const { t } = useTranslation(['common']);

  const { data: pools, isLoading } = useQuery({
    queryKey: ['assetsPoolsAll'],
    queryFn: requestAllAssetsPools,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const handleSelected = async (selected: string): Promise<void> => {
    while (!router.isReady) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (selected === 'All') {
      const updatedQuery = { ...router.query };
      delete updatedQuery.asset;
      setQueryAndRouter({ ...updatedQuery, page: '1' }, router);
      return;
    }
    if (selected !== router.query.asset) {
      // Back to page 1: a filtered set is shorter than the page you were on.
      setQueryAndRouter(
        { ...router.query, asset: selected, page: '1' },
        router,
      );
    }
  };

  const filter: IFilter = {
    title: `${t('common:Titles.Assets')}`,
    // See the assets list: Filter used to infer this from `title === 'Asset'`,
    // which this never was, so the box has been showing the generic prompt.
    placeholder: 'Type the token ID',
    data: (pools || [])
      .map(pool => pool.kda)
      .sort((a, b) => a.localeCompare(b)),
    onClick: handleSelected,
    current: (router.query.asset as string) || undefined,
    loading: isLoading,
  };

  return (
    <FilterContainer>
      <Filter {...filter} />
    </FilterContainer>
  );
};

const AssetsPools: React.FC<PropsWithChildren> = () => {
  const { t } = useTranslation(['assets']);
  const router = useRouter();

  // The shared Table also calls this with a header label to read the column
  // widths, so every field has to survive a non-pool argument.
  const rowSections = (pool: IAssetPoolRow): IRowSection[] => {
    const {
      active,
      adminAddress = '',
      kda = '',
      kdaBalance = 0,
      klvBalance = 0,
      ownerAddress = '',
      name,
      logo,
      ticker,
      assetVerified,
      precision,
    } = pool ?? ({} as Partial<IAssetPoolRow>);

    const displayTicker = ticker || kda.split('-')[0] || 'KDA';
    const rate = getPoolRate(pool?.fRatioKLV, pool?.fRatioKDA, precision);
    const separateAdmin = !!pool && hasSeparateAdmin(pool);

    return [
      {
        element: () => (
          <IdentityCell>
            <AssetIdentity
              href={`/asset/${kda}`}
              testId="pool-link"
              name={name || kda}
              assetId={kda}
              ticker={displayTicker}
              logo={logo || ''}
              verified={assetVerified}
            />
            {!active && (
              <BadgePill $variant="warning" title={t(POOL_DISABLED_TOOLTIP)}>
                {t('assets:Pools.Disabled')}
              </BadgePill>
            )}
            <RowActions>
              <CopyAction
                value={kda}
                label={t('assets:Common.CopyAssetId')}
                announcement={t('assets:Common.AssetIdCopied')}
              />
              <ExplorerLink
                href={`/asset/${kda}`}
                label={t('assets:Common.OpenAsset')}
                title={t('assets:Common.OpenInNewTab')}
              />
            </RowActions>
          </IdentityCell>
        ),
        span: 1,
      },
      {
        element: () => (
          <RateCell title={t(POOL_RATE_TOOLTIP)}>
            <RateValue>
              {rate === undefined
                ? '--'
                : `${formatRate(rate)} ${displayTicker}`}
            </RateValue>
            <RateUnit>{t('assets:Pools.PerOneKlv')}</RateUnit>
          </RateCell>
        ),
        span: 1,
        width: 190,
      },
      {
        element: () => (
          <AmountPrimary
            title={`${exactAmount(klvBalance, KLV_PRECISION)} KLV · ${t(POOL_KLV_RESERVE_TOOLTIP)}`}
          >
            {formatAmount(klvBalance / 10 ** KLV_PRECISION)}
          </AmountPrimary>
        ),
        span: 1,
        width: 170,
      },
      {
        element: () => (
          <AmountMuted
            title={
              precision === undefined
                ? t('assets:Pools.PrecisionUnavailable')
                : `${exactAmount(kdaBalance, precision)} ${displayTicker}`
            }
          >
            <span>
              {precision === undefined
                ? '--'
                : formatAmount(kdaBalance / 10 ** precision)}
            </span>
          </AmountMuted>
        ),
        span: 1,
        width: 170,
      },
      {
        element: () => (
          <OwnerCell>
            <OwnerRow>
              <AddressLink
                href={`/account/${ownerAddress}`}
                title={ownerAddress}
              >
                {parseAddress(ownerAddress, 16)}
              </AddressLink>
              <RowActions>
                <CopyAction
                  value={ownerAddress}
                  label={t('assets:Common.CopyOwnerAddress')}
                  announcement={t('assets:Common.OwnerAddressCopied')}
                />
              </RowActions>
            </OwnerRow>
            {separateAdmin && (
              <AdminRow title={t(POOL_ADMIN_NOTE)}>
                <AdminLabel>{t('assets:Pools.Admin')}</AdminLabel>
                <AddressLink
                  href={`/account/${adminAddress}`}
                  title={adminAddress}
                >
                  {parseAddress(adminAddress, 12)}
                </AddressLink>
              </AdminRow>
            )}
          </OwnerCell>
        ),
        span: 1,
      },
    ];
  };

  const Filters = useCallback(() => <PoolsFilters />, []);

  const tableProps: ITable = {
    rowSections,
    header,
    type: 'assetsPage',
    request: (page, limit) => requestAssetsPoolsQuery(page, limit, router),
    dataName: 'pools',
    MobileCard: PoolsMobileCard,
    Filters,
    singleLineSkeleton: true,
  };

  // The assets page renders one shared title above its tabs, so this tab
  // brings no header of its own.
  return (
    <>
      <PoolsSummary />
      <PoolsTableWrapper>
        <Table {...tableProps} />
      </PoolsTableWrapper>
    </>
  );
};

export default AssetsPools;
