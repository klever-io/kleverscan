import { isValidContractAddress } from '@klever/connect';
import Filter, { IFilter } from '@/components/Filter';
import Table, { ITable } from '@/components/Table';
import api from '@/services/api';
import { IBalance, IHolders, IRowSection } from '@/types/index';
import { setQueryAndRouter } from '@/utils';
import { formatAmount } from '@/utils/formatFunctions';
import { useDidUpdateEffect } from '@/utils/hooks';
import { parseAddress, parseHolders } from '@/utils/parseValues';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import CopyAction from '@/components/DataList/CopyAction';
import ExplorerLink from '@/components/DataList/ExplorerLink';
import {
  AddressLink,
  AmountMuted,
  AmountPrimary,
  BadgePill,
  InlineShare,
  RowActions,
  ShareCell,
  ShareFill,
  ShareSegment,
  ShareTrack,
  ShareValue,
  VisuallyHidden,
} from '@/components/DataList/styles';
import {
  buildRowBar,
  computeHoldersSummary,
  formatShare,
  getMedalTier,
  isVoidAddress,
} from './holdersMath';
import HoldersMobileCard, { IHoldersMobileCardExtras } from './MobileCard';
import HoldersSummary from './Summary';
import {
  FilterContainerHolders,
  HolderCell,
  HoldersTableWrapper,
  RankBadge,
  VoidShareNote,
} from './styles';

const TOTAL_LABEL = 'Total Balance';
const LIQUID_LABEL = 'Liquid';
const SHARE_LABEL = 'Total Supply Share';

const VOID_TOOLTIP =
  'VOID is the chain burn address. Tokens held here are permanently removed from circulation.';
const CONTRACT_TOOLTIP = 'This address is a smart contract.';

/**
 * Holders tab: a concentration summary strip on top of the ranked holder
 * table. Every displayed share, in the rows and in the strip alike, measures
 * against the gross circulating supply, so the void address counts as the
 * holder it is and one wallet never shows two different percentages on one
 * screen. Only the concentration verdict, which is a label and never a number,
 * is judged against the net supply. Shares are rounded for display and floored
 * at "<0.01%", so a column does not add up to exactly 100%.
 */
const Holders: React.FC<IHolders> = ({ asset }) => {
  const router = useRouter();
  const { t } = useTranslation(['assets']);
  const grossSupply = asset.circulatingSupply;
  const precisionDivisor = 10 ** asset.precision;

  // KFI staking doubles as governance weight, hence the longer label.
  const stakedLabel =
    asset.assetId === 'KFI' ? 'Staked / Voting Power' : 'Staked';

  const sortFieldByLabel: Record<string, string> = useMemo(
    () => ({
      [TOTAL_LABEL]: 'total',
      [stakedLabel]: 'frozen',
      [LIQUID_LABEL]: 'balance',
    }),
    [stakedLabel],
  );

  // Seeded from the URL rather than corrected afterwards: the table fetches
  // during the same effect flush, so a label set later would leave the rows
  // sorted one way and the header claiming another.
  const [sortLabel, setSortLabel] = useState<string>(
    () =>
      Object.keys(sortFieldByLabel).find(
        label => sortFieldByLabel[label] === router.query.sortBy,
      ) ?? TOTAL_LABEL,
  );
  const [sortAnnouncement, setSortAnnouncement] = useState('');

  // Sorting restarts from page 1: keeping a deep page position in a
  // differently ordered list would silently show unrelated rows.
  useDidUpdateEffect(() => {
    const apiValue = sortFieldByLabel[sortLabel];
    if (router.query.sortBy === apiValue) return;
    setQueryAndRouter({ ...router.query, sortBy: apiValue, page: '1' }, router);
  }, [sortLabel]);

  const handleSort = (label: string): void => {
    setSortLabel(label);
    setSortAnnouncement(`Sorted by ${label}, descending`);
  };

  // One top-50 fetch per asset feeds the summary strip, the medal shift away
  // from the void row, and the global bar scale. Cached so revisits within
  // the session do not double the holders-endpoint load.
  const { data: topHolders, isLoading: isSummaryLoading } = useQuery({
    queryKey: ['holdersTop50', asset.assetId],
    queryFn: async () => {
      const response = await api.get({
        route: `assets/holders/${asset.assetId}`,
        query: { page: 1, limit: 50, sortBy: 'total' },
      });
      if (response.error) throw new Error(response.error);
      return {
        holders: parseHolders(
          response.data.accounts,
          asset.assetId,
          response.pagination,
        ),
        totalRecords: response?.pagination?.totalRecords as number | undefined,
      };
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const summary = useMemo(
    () =>
      computeHoldersSummary(
        asset,
        topHolders?.holders ?? [],
        topHolders?.totalRecords,
      ),
    [asset, topHolders],
  );

  const sortedByTotal = sortLabel === TOTAL_LABEL;

  const rowSections = (props: IBalance): IRowSection[] => {
    const { address, frozenBalance, index, rank, balance, totalBalance } =
      props;
    const isVoid = isVoidAddress(address);
    const isContract = !isVoid && !!address && isValidContractAddress(address);
    const medal = getMedalTier(rank, isVoid, sortedByTotal, summary.medalRanks);
    const bar = isVoid ? undefined : buildRowBar(props, grossSupply);
    const stakedOfHolder =
      totalBalance > 0 ? Math.round((frozenBalance / totalBalance) * 100) : 0;
    const shareText = formatShare(totalBalance, grossSupply);

    return [
      {
        element: () => (
          <RankBadge $medal={medal} title="Rank reflects the current sort">
            {rank}
          </RankBadge>
        ),
        span: 1,
        width: 56,
      },
      {
        element: () => (
          <HolderCell>
            <AddressLink href={`/account/${address}`} title={address}>
              {parseAddress(address, 20)}
            </AddressLink>
            {isVoid && (
              <BadgePill $variant="void" title={VOID_TOOLTIP}>
                {t('assets:Overview.Void')}
              </BadgePill>
            )}
            {isContract && (
              <BadgePill $variant="contract" title={CONTRACT_TOOLTIP}>
                Contract
              </BadgePill>
            )}
            <RowActions>
              <CopyAction
                value={address}
                label="Copy address"
                announcement="Address copied to clipboard"
              />
              <ExplorerLink href={`/account/${address}`} subject="account" />
            </RowActions>
          </HolderCell>
        ),
        span: 1,
      },
      {
        element: () => (
          <AmountPrimary>
            {formatAmount(totalBalance / precisionDivisor)}
          </AmountPrimary>
        ),
        span: 1,
        width: 180,
      },
      {
        element: () => (
          <AmountMuted>
            <span>{formatAmount(frozenBalance / precisionDivisor)}</span>
            <InlineShare>
              ({formatShare(frozenBalance, grossSupply)})
            </InlineShare>
          </AmountMuted>
        ),
        span: 1,
        width: 170,
      },
      {
        element: () => (
          <AmountMuted>
            <span>{formatAmount(balance / precisionDivisor)}</span>
            <InlineShare>({formatShare(balance, grossSupply)})</InlineShare>
          </AmountMuted>
        ),
        span: 1,
        width: 170,
      },
      {
        element: () =>
          isVoid ? (
            <ShareCell>
              <VoidShareNote>{shareText} · burned</VoidShareNote>
            </ShareCell>
          ) : (
            <ShareCell
              title={`${shareText} of supply · Staked ${stakedOfHolder}% · Liquid ${
                100 - stakedOfHolder
              }%`}
            >
              <ShareValue>{shareText}</ShareValue>
              {bar && (
                <ShareTrack aria-hidden="true">
                  <ShareFill $delay={Math.min(index, 15) * 20}>
                    {balance > 0 && (
                      <ShareSegment
                        $kind="liquid"
                        style={{
                          width: `${bar.fillRatio * bar.liquidFraction * 100}%`,
                        }}
                      />
                    )}
                    {frozenBalance > 0 && (
                      <ShareSegment
                        $kind="staked"
                        style={{
                          width: `${
                            bar.fillRatio * (1 - bar.liquidFraction) * 100
                          }%`,
                        }}
                      />
                    )}
                  </ShareFill>
                </ShareTrack>
              )}
            </ShareCell>
          ),
        span: 1,
        width: 210,
      },
    ];
  };

  const tableHeader = [
    'Rank',
    'Holder',
    TOTAL_LABEL,
    stakedLabel,
    LIQUID_LABEL,
    SHARE_LABEL,
  ];

  const filters: IFilter[] = [
    {
      title: 'Sort By',
      firstItem: TOTAL_LABEL,
      data: [stakedLabel, LIQUID_LABEL],
      onClick: value => handleSort(value),
      current: sortLabel,
      inputType: 'button',
      isHiddenInput: false,
    },
  ];

  const requestAssetHolders = async (page: number, limit: number) => {
    if (asset) {
      const response = await api.get({
        route: `assets/holders/${asset.assetId}`,
        query: {
          ...router.query,
          sortBy: sortFieldByLabel[sortLabel] || 'total',
          page,
          limit,
        },
      });

      let parsedHolders: IBalance[] = [];
      if (!response.error) {
        parsedHolders = parseHolders(
          response.data.accounts,
          asset.assetId,
          response.pagination,
        );
      }

      return { ...response, data: { accounts: parsedHolders } };
    }
    return { data: { accounts: [] } };
  };

  // Rendered by the table itself, so the filters share the row with the
  // items-per-page selector. Desktop sorts through the column headers; this
  // dropdown only exists where those headers do not render.
  const HoldersFilters = useCallback(
    () => (
      <FilterContainerHolders>
        {filters.map(filter => (
          <Filter key={filter.title} {...filter} />
        ))}
      </FilterContainerHolders>
    ),
    [sortLabel],
  );

  const tableProps: ITable<IHoldersMobileCardExtras> = {
    rowSections,
    header: tableHeader,
    type: 'holders',
    dataName: 'accounts',
    request: (page: number, limit: number) => requestAssetHolders(page, limit),
    Filters: HoldersFilters,
    sortableColumns: [TOTAL_LABEL, stakedLabel, LIQUID_LABEL],
    activeSortColumn: sortLabel,
    onSortColumn: handleSort,
    MobileCard: HoldersMobileCard,
    mobileCardProps: { asset, summary, sortedByTotal },
    singleLineSkeleton: true,
  };

  return (
    <>
      <HoldersSummary
        asset={asset}
        summary={summary}
        isLoading={isSummaryLoading}
      />
      <HoldersTableWrapper>
        <Table {...tableProps} />
      </HoldersTableWrapper>
      <VisuallyHidden aria-live="polite">{sortAnnouncement}</VisuallyHidden>
    </>
  );
};

export default Holders;
