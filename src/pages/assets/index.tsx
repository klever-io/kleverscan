import { Assets as Icon } from '@/assets/title-icons';
import AssetsPools from '@/components/AssetsPools';
import {
  APR_CONFIGURED_TOOLTIP,
  APR_TOOLTIP,
  ASSET_BADGE_TOOLTIPS,
  FPR_TOOLTIP,
} from '@/components/AssetsList/badgeTexts';
import { getCapUsage, getRewardsModel } from '@/components/AssetsList/helpers';
import AssetsMobileCard from '@/components/AssetsList/MobileCard';
import RegistryStrip from '@/components/AssetsList/RegistryStrip';
import {
  AssetsTableWrapper,
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
import { exactAmount, formatShare } from '@/components/DataList/format';
import {
  ActionLink,
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
import { getCirculatingSupply } from '@/utils/voidSupply';
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
import { MdOpenInNew } from 'react-icons/md';
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
    const circulating = getCirculatingSupply(asset);
    // The cap limits minted minus burned, which is the gross circulating
    // supply: tokens parked on the void address were minted and never
    // burned, so they still take up cap headroom.
    const capBasis = asset.circulatingSupply;
    const cap = getCapUsage(capBasis, maxSupply);
    const rewards = getRewardsModel(staking);
    const totalStaked = staking?.totalStaked ?? 0;

    const supplyTitle = [
      `Circulating ${exactAmount(circulating, precision)} ${ticker}`,
      `Max ${maxSupply > 0 ? exactAmount(maxSupply, precision) : 'unlimited'}`,
      `Initial ${exactAmount(initialSupply, precision)}`,
      `Burned ${exactAmount(burnedValue, precision)}`,
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
              <BadgePill $variant="neutral" title={ASSET_BADGE_TOOLTIPS.nft}>
                NFT
              </BadgePill>
            )}
            {assetType === 'SemiFungible' && (
              <BadgePill $variant="neutral" title={ASSET_BADGE_TOOLTIPS.sft}>
                SFT
              </BadgePill>
            )}
            {attributes?.isPaused && (
              <BadgePill $variant="warning" title={ASSET_BADGE_TOOLTIPS.paused}>
                Paused
              </BadgePill>
            )}
            {hasKdaPool && (
              <BadgePill $variant="accent" title={ASSET_BADGE_TOOLTIPS.pool}>
                Fee Pool
              </BadgePill>
            )}
            <RowActions>
              <CopyAction
                value={assetId}
                label="Copy asset ID"
                announcement="Asset ID copied to clipboard"
              />
              <ActionLink
                href={`/asset/${assetId}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open asset in a new tab"
                title="Open in a new tab"
              >
                <MdOpenInNew size={14} />
              </ActionLink>
            </RowActions>
          </IdentityCell>
        ),
        span: 1,
      },
      {
        element: () =>
          maxSupply > 0 ? (
            <SupplyCell
              title={`${exactAmount(maxSupply, precision)} ${ticker}`}
            >
              <SupplyPrimary>
                {formatAmount(maxSupply / precisionDivisor)}
              </SupplyPrimary>
            </SupplyCell>
          ) : (
            <SupplyCell title="No maximum supply">
              <SupplyPrimary>
                <IoIosInfinite size={14} aria-hidden="true" />
                <VisuallyHidden>Unlimited</VisuallyHidden>
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
                <CapContext>of cap</CapContext>
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
              <RewardsMuted>n/a</RewardsMuted>
            </ShareCell>
          ),
        span: 1,
        width: 200,
      },
      {
        element: () =>
          staking ? (
            <AmountMuted
              title={`${exactAmount(totalStaked, precision)} ${ticker} staked · ${formatShare(
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
              <RewardsMuted>n/a</RewardsMuted>
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
                <RewardsRate title={APR_TOOLTIP}>{rewards.rate}</RewardsRate>
                <RewardsUnit>APR</RewardsUnit>
              </>
            )}
            {rewards.kind === 'apr-configured' && (
              <RewardsMuted title={APR_CONFIGURED_TOOLTIP}>APR</RewardsMuted>
            )}
            {rewards.kind === 'fpr' && (
              <BadgePill $variant="neutral" title={FPR_TOOLTIP}>
                FPR
              </BadgePill>
            )}
            {rewards.kind === 'none' && <RewardsMuted>n/a</RewardsMuted>}
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
