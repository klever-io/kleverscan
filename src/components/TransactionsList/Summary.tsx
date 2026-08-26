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
import {
  ITransactionTypeShare,
  summaryVariation,
  totalGrowth,
  transactionsSummaryCall,
} from '@/services/requests/transactions/summary';
import { formatAmount } from '@/utils/formatFunctions';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { useTheme } from 'styled-components';
import {
  PageSummaryCard,
  PageSummaryLoading,
  SummaryAssetLink,
  TrendValue,
} from './styles';

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
  const { data: summary, isLoading } = useQuery({
    queryKey: ['transactionsSummary'],
    queryFn: transactionsSummaryCall,
    // The figures move by the second; refetching on every mount would make
    // the card flicker without telling the reader anything new.
    staleTime: 60_000,
  });

  if (isLoading) {
    return <PageSummaryLoading label={label} tiles={3} bar />;
  }

  /** One color per named type, with the computed remainder muted. */
  const segmentColor = (share: ITransactionTypeShare, index: number): string =>
    share.name === 'Other'
      ? theme.blueGray500
      : [theme.violet, theme.purple, theme.lightPurple, theme.green][index % 4];

  const variation = summary ? summaryVariation(summary) : undefined;
  const growth = summary ? totalGrowth(summary) : undefined;
  // Each figure is shown only when its own request answered; a failed part
  // leaves its tile out instead of printing a zero the chain never had.
  const hasFigures =
    summary &&
    (summary.last24h !== undefined ||
      summary.totalTransactions !== undefined ||
      summary.mostTransactedAsset !== undefined);

  if (!summary || !hasFigures) return null;

  // The shares sum to the window's own total; using that sum rather than
  // last24h keeps the bar full even if the parts answered moments apart.
  const breakdownTotal = summary.breakdown.reduce(
    (sum, share) => sum + share.count,
    0,
  );

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
          summary cards stand the same height on their pages. */}
      {summary.breakdown.length > 1 && breakdownTotal > 0 && (
        <>
          <DistBar
            role="img"
            aria-label={t('transactions:Summary.Breakdown', {
              defaultValue: 'Contract types in the last 24 hours',
            })}
          >
            {summary.breakdown.map((share, index) => (
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
            {summary.breakdown.map((share, index) => (
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
