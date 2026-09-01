import { Assets as Icon } from '@/assets/title-icons';
import ExplainedBadge from '@/components/DataList/ExplainedBadge';
import AssetsPools from '@/components/AssetsPools';
import {
  APR_CONFIGURED_TOOLTIP,
  APR_TOOLTIP,
  ASSET_BADGE_TOOLTIPS,
  FPR_TOOLTIP,
} from '@/components/AssetsList/badgeTexts';
import {
  assetSupplyViews,
  getCapUsage,
  getRewardsModel,
} from '@/components/AssetsList/helpers';
import { hasVoidSupply } from '@/utils/voidSupply';
import AssetsMobileCard from '@/components/AssetsList/MobileCard';
import RegistryStrip from '@/components/AssetsList/RegistryStrip';
import {
  AssetsTableWrapper,
  ROW_LAYOUT_MIN_WIDTH,
  CapContext,
  RewardsCell,
  RewardsMuted,
  RewardsRate,
  RewardsUnit,
  ShareValueLine,
  SupplyCell,
  SupplyPrimary,
} from '@/components/AssetsList/styles';
import CopyAction from '@/components/DataList/CopyAction';
import ExplorerLink from '@/components/DataList/ExplorerLink';
import { exactAmount, formatShare } from '@/components/DataList/format';
import {
  AmountMuted,
  BadgePill,
  IdentityCell,
  InlineShare,
  RowActions,
  ShareCell,
  ShareFill,
  ShareSegment,
  ShareTrack,
  ShareValue,
  VisuallyHidden,
} from '@/components/DataList/styles';
import Filter, { IFilter } from '@/components/Filter';
import Title from '@/components/Layout/Title';
import AssetIdentity from '@/components/DataList/AssetIdentity';
import Table, { ITable } from '@/components/Table';
import Tabs, { ITabs } from '@/components/Tabs';
import { FilterContainer } from '@/components/TransactionsFilters/styles';
import { requestAssetsQuery } from '@/services/requests/assets';
import { Header } from '@/styles/common';
import { AssetsListContainer } from '@/views/assets';
import { IAsset, IRowSection } from '@/types/index';
import { setQueryAndRouter } from '@/utils';
import { formatAmount } from '@/utils/formatFunctions';
import { useFetchPartial } from '@/utils/hooks';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, {
  PropsWithChildren,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { IoIosInfinite } from 'react-icons/io';
import nextI18nextConfig from '../../../next-i18next.config';

const AssetsFilters: React.FC<PropsWithChildren> = () => {
  const router = useRouter();
  const { t } = useTranslation(['common', 'assets', 'table']);

  const [filterAssets, fetchPartialAsset, loading, setLoading] =
    useFetchPartial<IAsset>('assets', 'assets/list', 'assetId');

  const handleSelected = async (
    selected: string,
    filterType: string,
  ): Promise<void> => {
    while (!router.isReady) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (selected === 'All') {
      const updatedQuery = { ...router.query };
      delete updatedQuery[filterType];
      setQueryAndRouter(updatedQuery, router);
    } else if (filterType === 'type') {
      setQueryAndRouter({ ...router.query, [filterType]: selected }, router);
    } else if (selected !== router.query[filterType]) {
      setQueryAndRouter({ ...router.query, [filterType]: selected }, router);
    }
  };

  const filters: IFilter[] = [
    {
      title: `${t('common:Titles.Assets')}`,
      // Stated rather than inferred from the title. Filter used to match on
      // `title === 'Asset'`, which this never was, so this box has been showing
      // the generic prompt.
      placeholder: 'Type the token ID',
      data: filterAssets.map(asset => asset.assetId),
      onClick: value => handleSelected(value, 'asset'),
      onChange: async value => {
        setLoading(true);
        await fetchPartialAsset(value.toUpperCase());
      },
      current: (router.query.asset as string) || undefined,
      loading,
    },
    {
      title: `${t('common:Buttons.Asset Type')}`,
      data: [`Fungible`, `NonFungible`, `SemiFungible`],
      onClick: value => handleSelected(value, 'type'),
      inputType: 'button',
      current: (router.query.type as string) || undefined,
      loading,
      isHiddenInput: false,
    },
  ];

  return (
    <FilterContainer>
      {filters.map(filter => (
        <Filter key={filter.title} {...filter} />
      ))}
    </FilterContainer>
  );
};

const header = [
  'Asset',
  'Maximum Supply',
  'Circulating Supply',
  'Cap Used',
  'Staked',
  'Rewards',
];

const Assets: React.FC<PropsWithChildren> = () => {
  const router = useRouter();
  const { t } = useTranslation(['common', 'assets', 'table']);

  const rowSections = (asset: IAsset): IRowSection[] => {
    const {
      ticker,
      name,
      logo,
      assetId,
      assetType,
      maxSupply,
      burnedValue,
      initialSupply,
      staking,
      precision,
      verified,
      attributes,
      hasKdaPool,
    } = asset;

    const precisionDivisor = 10 ** precision;
    const { circulating, capBasis } = assetSupplyViews(asset);
    // Exact digit twins from the parse boundary (#679), preferred wherever a
    // figure is promised exactly; the number stays the fallback. The
    // circulating twin mirrors assetSupplyViews' net-versus-raw choice.
    const circulatingExact = hasVoidSupply(asset)
      ? (asset.netCirculatingSupplyString ?? circulating)
      : (asset.circulatingSupplyString ?? circulating);
    const maxSupplyExact = asset.maxSupplyString ?? maxSupply;
    const initialSupplyExact = asset.initialSupplyString ?? initialSupply;
    const burnedValueExact = asset.burnedValueString ?? burnedValue;
    // The cap limits minted minus burned, which is the gross circulating
    // supply: tokens parked on the void address were minted and never
    // burned, so they still take up cap headroom.
    const cap = getCapUsage(capBasis, maxSupply);
    const rewards = getRewardsModel(staking);
    const totalStaked = staking?.totalStaked ?? 0;
    const totalStakedExact = staking?.totalStakedString ?? totalStaked;

    // The cell shows a net circulating figure beside a gross cap, so without
    // the void amount the row reads as a contradiction: "Max 10 M ·
    // Circulating 209 K · Cap Used >99.9%". Burned is a different quantity and
    // invites the wrong reconciliation, so name the void explicitly.
    const supplyTitle = [
      `Circulating ${exactAmount(circulatingExact, precision)} ${ticker}`,
      `Max ${
        maxSupply > 0 ? exactAmount(maxSupplyExact, precision) : 'unlimited'
      }`,
      `Initial ${exactAmount(initialSupplyExact, precision)}`,
      `Burned ${exactAmount(burnedValueExact, precision)}`,
      ...(hasVoidSupply(asset)
        ? [
            `Void ${exactAmount(
              asset.voidedSupplyString ?? asset.voidedSupply,
              precision,
            )}`,
          ]
        : []),
      `Precision ${precision}`,
    ].join(' · ');

    let capTitle: string | undefined;
    if (cap.hasCap) {
      capTitle = `${formatShare(capBasis, maxSupply)} of the ${formatAmount(
        maxSupply / precisionDivisor,
      )} cap minted and not burned`;
    }

    return [
      {
        element: () => (
          <IdentityCell>
            <AssetIdentity
              href={`/asset/${assetId}`}
              testId="asset-link"
              name={name}
              assetId={assetId}
              ticker={ticker}
              logo={logo}
              verified={verified}
            />
            {assetType === 'NonFungible' && (
              <ExplainedBadge
                variant="neutral"
                msg={t(ASSET_BADGE_TOOLTIPS.nft)}
              >
                {t('assets:List.Nft')}
              </ExplainedBadge>
            )}
            {assetType === 'SemiFungible' && (
              <ExplainedBadge
                variant="neutral"
                msg={t(ASSET_BADGE_TOOLTIPS.sft)}
              >
                {t('assets:List.Sft')}
              </ExplainedBadge>
            )}
            {attributes?.isPaused && (
              <ExplainedBadge
                variant="warning"
                msg={t(ASSET_BADGE_TOOLTIPS.paused)}
              >
                {t('assets:List.Paused')}
              </ExplainedBadge>
            )}
            {hasKdaPool && (
              <ExplainedBadge
                variant="accent"
                msg={t(ASSET_BADGE_TOOLTIPS.pool)}
              >
                Fee Pool
              </ExplainedBadge>
            )}
            <RowActions>
              <CopyAction
                value={assetId}
                label={t('assets:Common.CopyAssetId')}
                announcement={t('assets:Common.AssetIdCopied')}
              />
              <ExplorerLink
                href={`/asset/${assetId}`}
                label={t('assets:Common.OpenAsset')}
                title={t('assets:Common.OpenInNewTab')}
              />
            </RowActions>
          </IdentityCell>
        ),
        span: 1,
      },
      {
        element: () =>
          maxSupply > 0 ? (
            <SupplyCell
              title={`${exactAmount(maxSupplyExact, precision)} ${ticker}`}
            >
              <SupplyPrimary>
                {formatAmount(maxSupply / precisionDivisor)}
              </SupplyPrimary>
            </SupplyCell>
          ) : (
            <SupplyCell title={t('assets:List.NoMaximumSupply')}>
              <SupplyPrimary>
                <IoIosInfinite size={14} aria-hidden="true" />
                <VisuallyHidden>{t('assets:List.Unlimited')}</VisuallyHidden>
              </SupplyPrimary>
            </SupplyCell>
          ),
        span: 1,
        width: 170,
      },
      {
        element: () => (
          <SupplyCell title={supplyTitle}>
            <SupplyPrimary>
              {formatAmount(circulating / precisionDivisor)} {ticker}
            </SupplyPrimary>
          </SupplyCell>
        ),
        span: 1,
        width: 180,
      },
      {
        element: () =>
          cap.hasCap ? (
            <ShareCell title={capTitle}>
              <ShareValueLine>
                <ShareValue>{formatShare(capBasis, maxSupply)}</ShareValue>
                <CapContext>{t('assets:List.OfCap')}</CapContext>
              </ShareValueLine>
              <ShareTrack aria-hidden="true">
                <ShareFill $delay={0}>
                  {cap.usedShare > 0 && (
                    <ShareSegment
                      $kind="liquid"
                      style={{ width: `${cap.usedShare * 100}%` }}
                    />
                  )}
                </ShareFill>
              </ShareTrack>
              <VisuallyHidden>
                of the maximum supply minted and not burned.
              </VisuallyHidden>
            </ShareCell>
          ) : (
            <ShareCell>
              <RewardsMuted>{t('assets:List.NotAvailable')}</RewardsMuted>
            </ShareCell>
          ),
        span: 1,
        width: 200,
      },
      {
        element: () =>
          staking ? (
            <AmountMuted
              title={`${exactAmount(totalStakedExact, precision)} ${ticker} staked · ${formatShare(
                totalStaked,
                circulating,
              )} of the circulating supply`}
            >
              <span>{formatAmount(totalStaked / precisionDivisor)}</span>
              <InlineShare>
                ({formatShare(totalStaked, circulating)})
              </InlineShare>
            </AmountMuted>
          ) : (
            <AmountMuted>
              <RewardsMuted>{t('assets:List.NotAvailable')}</RewardsMuted>
            </AmountMuted>
          ),
        span: 1,
        width: 170,
      },
      {
        element: () => (
          <RewardsCell>
            {rewards.kind === 'apr' && (
              <>
                <RewardsRate title={t(APR_TOOLTIP)}>{rewards.rate}</RewardsRate>
                <RewardsUnit>{t('assets:List.Apr')}</RewardsUnit>
              </>
            )}
            {rewards.kind === 'apr-configured' && (
              <RewardsMuted title={t(APR_CONFIGURED_TOOLTIP)}>
                {t('assets:List.Apr')}
              </RewardsMuted>
            )}
            {rewards.kind === 'fpr' && (
              <ExplainedBadge variant="neutral" msg={t(FPR_TOOLTIP)}>
                FPR
              </ExplainedBadge>
            )}
            {rewards.kind === 'none' && (
              <RewardsMuted>{t('assets:List.NotAvailable')}</RewardsMuted>
            )}
          </RewardsCell>
        ),
        span: 1,
        width: 130,
      },
    ];
  };

  const tableProps: ITable = {
    rowSections,
    header,
    type: 'assetsPage',
    request: (page, limit) => requestAssetsQuery(page, limit, router),
    dataName: 'assets',
    Filters: AssetsFilters,
    MobileCard: AssetsMobileCard,
    singleLineSkeleton: true,
    // Same constant the wrapper's media queries read, so the loading rows and
    // the loaded rows cannot end up in different shapes.
    cardBreakpoint: ROW_LAYOUT_MIN_WIDTH,
    rightAlignedSkeletonColumns: [1, 2, 4, 5],
  };

  const tableHeaders = [
    `${t('common:Titles.Overview')}`,
    `${t('common:Titles.Pools')}`,
  ];
  const [selectedTab, setSelectedTab] = useState(tableHeaders[0]);

  const tabProps: ITabs = {
    headers: tableHeaders,
    onClick: header => {
      setSelectedTab(header);
      // Both tabs read the same page and asset params while listing different
      // things: page 12 of the assets list does not exist in the four pages of
      // pools, and an asset without a pool filters that tab down to nothing.
      // Switching tabs therefore starts from the top of the new list.
      const { page, asset, ...rest } = router.query;
      setQueryAndRouter({ ...rest, tab: header }, router);
    },
  };

  // Rendered as elements, not as a component defined during render: a fresh
  // component identity on every render remounts the whole tab, which refetches
  // everything and makes paging feel like a full page reload.
  const renderSelectedTab = (): ReactNode => {
    switch (selectedTab) {
      case `${t('common:Titles.Overview')}`:
        return (
          <>
            <RegistryStrip />

            <AssetsTableWrapper>
              <Table {...tableProps} />
            </AssetsTableWrapper>
          </>
        );
      case `${t('common:Titles.Pools')}`:
        return <AssetsPools />;
      default:
        return <div />;
    }
  };

  useEffect(() => {
    if (!router.isReady) return;
    setSelectedTab((router.query.tab as string) || tableHeaders[0]);
  }, [router.isReady]);

  return (
    <AssetsListContainer>
      <Header>
        <Title title={t('common:Titles.Assets')} Icon={Icon} />
      </Header>
      <Tabs {...tabProps}>{renderSelectedTab()}</Tabs>
    </AssetsListContainer>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => {
  const props = await serverSideTranslations(
    locale,
    ['common', 'assets', 'table'],
    nextI18nextConfig,
    ['en'],
  );

  return { props };
};

export default Assets;
