import {
  DistBar,
  DistSegment,
  LegendDot,
  LegendItem,
  LegendRow,
  Tile,
  TileLabel,
  TileSub,
  TileValue,
  TileValueRow,
  TilesGrid,
  VisuallyHidden,
} from '@/components/DataList/styles';
// The same percent policy the holders and assets legends use, so the two
// visually identical legends cannot format the same quantity differently.
import { formatShare } from '@/components/DataList/format';
import TransactionsSummaryLoadingCard, {
  ContractsBarPlaceholder,
} from './LoadingCard';
import {
  ITransactionTypeShare,
  buildBreakdown,
  summaryVariation,
  totalGrowth,
  transactionsBreakdownCall,
  transactionsSummaryCall,
} from '@/services/requests/transactions/summary';
import { formatAmount } from '@/utils/formatFunctions';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { useTheme } from 'styled-components';
import { useDeferred } from '@/components/DataList/useDeferred';
import { PageSummaryCard, SummaryAssetLink, TrendValue } from './styles';

/**
 * A quarter of an hour. These are 24 hour figures, so a fresh reading moves
 * them by fractions of a percent, and every refetch costs two of the slow
 * transaction-list queries. Kept past the last observer too, so paging away
 * and back does not pay for them again.
 */
const FIGURE_CACHE = { staleTime: 15 * 60_000, gcTime: 15 * 60_000 };

/**
 * Percentage with its sign, e.g. "+18.6%". A rate, not a share, so it has no
 * ceiling: a figure that more than doubled reads "+140%" rather than being
 * clamped. The precision is a parameter because the day-on-day change lands
 * in whole percents while the chain's own growth is a fraction of one.
 */
const formatVariation = (variation: number, precision = 1): string =>
  `${variation > 0 ? '+' : ''}${(variation * 100).toFixed(precision)}%`;

/**
 * The figures above the transactions list: the last rolling 24 hours with
 * its change against the window before it, the chain's total, and the
 * leading fungible asset. Only the unscoped list shows it; the same table
 * inside an account, asset or block is narrowed to that subject, where
 * chain-wide figures would say nothing about what the reader came for.
 */
const TransactionsSummary: React.FC = () => {
  const { t } = useTranslation(['transactions']);
  const theme = useTheme();
  const label = t('transactions:Summary.Label', {
    defaultValue: 'Transaction statistics',
  });

  const deferred = useDeferred();

  const { data: summary } = useQuery({
    queryKey: ['transactionsSummary'],
    queryFn: transactionsSummaryCall,
    // Behind the list, not beside it. Two of these three are transaction-list
    // queries costing about two seconds each, and racing them against the
    // rows is what a reader actually feels.
    enabled: deferred,
    ...FIGURE_CACHE,
  });

  const { data: typeCounts, isPending: breakdownPending } = useQuery({
    queryKey: ['transactionsBreakdown'],
    queryFn: transactionsBreakdownCall,
    // Four requests for a bar nobody waits on, so they stay out of the
    // opening burst. Not gated on the tiles: waiting for the total first put
    // the bar six seconds out when the API answered slowly.
    enabled: deferred,
    ...FIGURE_CACHE,
  });

  if (!summary) {
    // Five: the breakdown names Transfer, Smart Contract, Claim, Freeze and
    // Other, and three placeholders left the legend a line short of the loaded
    // one at 390px, measured.
    return <TransactionsSummaryLoadingCard label={label} />;
  }

  /** One color per named type, with the computed remainder muted. */
  const segmentColor = (share: ITransactionTypeShare, index: number): string =>
    share.name === 'Other'
      ? theme.blueGray500
      : [theme.violet, theme.purple, theme.lightPurple, theme.green][index % 4];

  const variation = summaryVariation(summary);
  const growth = totalGrowth(summary);
  // Each figure is shown only when its own request answered; a failed part
  // leaves its tile out instead of printing a zero the chain never had.
  const hasFigures =
    summary.last24h !== undefined ||
    summary.totalTransactions !== undefined ||
    summary.mostTransactedAsset !== undefined;

  if (!hasFigures) return null;

  // The shares sum to the window's own total; using that sum rather than
  // last24h keeps the bar full even if the parts answered moments apart.
  const breakdown = typeCounts
    ? buildBreakdown(summary.last24h, typeCounts)
    : [];
  const breakdownTotal = breakdown.reduce((sum, share) => sum + share.count, 0);

  return (
    <PageSummaryCard aria-label={label}>
      <TilesGrid>
        {summary.last24h !== undefined && (
          <Tile>
            <TileLabel>
              {t('transactions:Summary.Last24h', {
                defaultValue: 'Transactions (24h)',
              })}
            </TileLabel>
            <TileValueRow>
              <TileValue>{formatAmount(summary.last24h)}</TileValue>
            </TileValueRow>
            {variation !== undefined && (
              <TileSub>
                {/* The same threshold the wording below uses. Splitting them
                    at zero painted an unchanged day in the falling colour
                    while the words beside it read "up 0.0%". */}
                <TrendValue $positive={variation >= 0}>
                  <span aria-hidden="true">{formatVariation(variation)}</span>
                  {/* The direction in words: a leading "+" is commonly not
                      announced, which would leave a rise and a fall sounding
                      identical. */}
                  <VisuallyHidden>
                    {t(
                      variation < 0
                        ? 'transactions:Summary.Down'
                        : 'transactions:Summary.Up',
                      {
                        defaultValue:
                          variation < 0
                            ? 'down {{percent}} compared with the previous 24 hours'
                            : 'up {{percent}} compared with the previous 24 hours',
                        // Without the sign: the word already carries the
                        // direction, and "up +23.5%" reads as a stutter.
                        percent: `${(Math.abs(variation) * 100).toFixed(1)}%`,
                      },
                    )}
                  </VisuallyHidden>
                </TrendValue>
              </TileSub>
            )}
          </Tile>
        )}

        {summary.totalTransactions !== undefined && (
          <Tile>
            <TileLabel>
              {t('transactions:Summary.Total', {
                defaultValue: 'Total transactions',
              })}
            </TileLabel>
            <TileValueRow>
              {/* Written out, not compacted: this is the figure a reader may
                  want to quote, and "58.55 M" throws five digits away.
                  Rendered the way the home page renders the same number, in
                  the reader's own locale, rather than through the pinned
                  toLocaleFixed. That helper exists to stop a server and a
                  browser disagreeing mid-hydration, which cannot happen here:
                  the query above is unresolved during SSR, so the server
                  renders the skeleton and never this number. */}
              <TileValue>
                {summary.totalTransactions.toLocaleString()}
              </TileValue>
            </TileValueRow>
            {growth !== undefined && (
              <TileSub>
                {/* formatVariation, not formatShare: a share formatter clamps
                    at 100% and carries a ">99.9%" branch, so a young chain
                    that more than doubled in a day would read "+100%". This
                    is a rate, and it has no ceiling. */}
                <TrendValue $positive={growth >= 0}>
                  <span aria-hidden="true">{formatVariation(growth, 2)}</span>
                  <VisuallyHidden>
                    {t('transactions:Summary.Growth', {
                      defaultValue: 'grew {{percent}} in the last 24 hours',
                      percent: `${(growth * 100).toFixed(2)}%`,
                    })}
                  </VisuallyHidden>
                </TrendValue>
              </TileSub>
            )}
          </Tile>
        )}

        {summary.mostTransactedAsset && (
          <Tile>
            <TileLabel>
              {t('transactions:Summary.MostTransacted', {
                defaultValue: 'Most transacted',
              })}
            </TileLabel>
            <TileValueRow>
              <TileValue>
                <SummaryAssetLink
                  href={`/asset/${summary.mostTransactedAsset.assetId}`}
                >
                  {summary.mostTransactedAsset.assetId}
                </SummaryAssetLink>
              </TileValue>
            </TileValueRow>
            <TileSub>
              {/* The ranking's basis, not its raw count. The count is on a
                  different footing than the total beside it: measured live,
                  the unfiltered figure for the same asset (71.1M) exceeds
                  this card's own chain total (58.6M), so an asset occurrence
                  is not a transaction. Its window is undocumented too. */}
              {t('transactions:Summary.FungibleBasis', {
                defaultValue: 'Leading fungible asset',
              })}
            </TileSub>
          </Tile>
        )}
      </TilesGrid>

      {/* Same shape as the assets registry strip, deliberately: tiles, then
          the bar, then its legend, with no heading in between, so both
          summary cards stand the same height on their pages.

          The tiles and the bar answer on separate requests, so the card is
          drawn once with only the first of them. Holding the bar's space
          until its own request settles keeps that middle state the same
          height as the two around it. */}
      {breakdownPending && <ContractsBarPlaceholder />}
      {!breakdownPending && breakdown.length > 1 && breakdownTotal > 0 && (
        <>
          <DistBar
            role="img"
            aria-label={t('transactions:Summary.Breakdown', {
              defaultValue: 'Contract types in the last 24 hours',
            })}
          >
            {breakdown.map((share, index) => (
              <DistSegment
                key={share.name}
                $color={segmentColor(share, index)}
                $delay={index * 60}
                style={{
                  width: `${(share.count / breakdownTotal) * 100}%`,
                }}
                title={`${share.name}: ${formatAmount(share.count)}`}
                aria-hidden="true"
              />
            ))}
          </DistBar>
          <LegendRow>
            {breakdown.map((share, index) => (
              <LegendItem key={share.name}>
                <LegendDot $color={segmentColor(share, index)} />
                {share.name === 'Other'
                  ? t('transactions:Summary.OtherTypes', {
                      defaultValue: 'Other',
                    })
                  : share.name}{' '}
                <strong>{formatAmount(share.count)}</strong>{' '}
                {formatShare(share.count, breakdownTotal)}
              </LegendItem>
            ))}
          </LegendRow>
        </>
      )}
    </PageSummaryCard>
  );
};

export default TransactionsSummary;
