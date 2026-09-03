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
  TilesGrid,
} from '@/components/DataList/styles';
import {
  exactAmount,
  formatShare,
  klvAmount,
  NUMBER_LOCALE,
} from '@/components/DataList/format';
import { useTheme } from '@/contexts/theme';
import {
  blockTotalStatsCall,
  blockYesterdayStatsCall,
  blockYesterdayTransactionsCall,
} from '@/services/requests/block';
import { KLV_PRECISION } from '@/utils/globalVariables';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { BlocksSummaryCard, feeSegmentColor } from './styles';
import BlocksSummaryLoadingCard from './LoadingCard';
import UpdatedAgo from './UpdatedAgo';
import {
  feeSplit,
  summaryComplete,
  summaryRefetchInterval,
} from './summaryFigures';

/**
 * What yesterday cost and where it went. Yesterday rather than a rolling 24
 * hours because block production is flat (0,71 percent standard deviation over
 * 365 days), so the rolling window buys nothing and would make the figure move
 * on every refresh.
 */
const BlocksSummary: React.FC = () => {
  const { t } = useTranslation(['blocks', 'common']);
  const { theme } = useTheme();
  const label = t('blocks:List.SummaryAria', {
    defaultValue: 'Block statistics',
  });

  const { data, isLoading, dataUpdatedAt } = useQuery({
    queryKey: ['blocksSummary'],
    queryFn: async () => {
      // The two stat calls map every failure to undefined (api.get itself
      // resolves an error object), so a half-failed pair still lands here as
      // data rather than an error.
      const [yesterday, total, transactions] = await Promise.all([
        blockYesterdayStatsCall(),
        blockTotalStatsCall(),
        blockYesterdayTransactionsCall(),
      ]);
      return { yesterday, total, transactions };
    },
    // A function, not a constant: a failure caches as a successful undefined,
    // and a constant would hold that for five minutes. Every source, not any
    // one: with `||` a half-failed answer counted as fresh and the card it
    // degrades survived remounts for the full five minutes.
    staleTime: query =>
      summaryComplete(
        query.state.data as
          | { yesterday?: unknown; total?: unknown; transactions?: unknown }
          | undefined,
      )
        ? 5 * 60 * 1000
        : 0,
    refetchInterval: query =>
      summaryRefetchInterval(
        query.state.data as
          | { yesterday?: unknown; total?: unknown; transactions?: unknown }
          | undefined,
      ),
  });

  if (isLoading) {
    return <BlocksSummaryLoadingCard label={label} />;
  }
  if (!data) return null;

  const { yesterday, total, transactions } = data;
  const fees = feeSplit(yesterday);
  // Every tile hangs off `yesterday` (`total` only feeds the sub-lines), so
  // without it the card would render as an empty rectangle holding nothing
  // but the age line in its corner.
  if (!yesterday) return null;

  const segments = [
    {
      key: 'burned' as const,
      label: t('blocks:List.FeesBurned', { defaultValue: 'Fees burned' }),
    },
    {
      key: 'validators' as const,
      label: t('blocks:List.ToValidators', { defaultValue: 'To validators' }),
    },
    {
      key: 'kapp' as const,
      label: t('blocks:List.KAppFees', { defaultValue: 'kApp fees' }),
    },
  ].map(segment => ({
    ...segment,
    amount: fees?.segments.find(s => s.key === segment.key)?.amount ?? 0,
  }));

  const barLabel = segments
    .map(s => `${s.label} ${formatShare(s.amount, fees?.total ?? 0)}`)
    .join(', ');

  return (
    <BlocksSummaryCard aria-label={label} data-testid="blocks-summary">
      <TilesGrid>
        <Tile>
          <TileLabel>
            {t('blocks:List.BlocksYesterday', {
              defaultValue: 'Blocks (yesterday)',
            })}
          </TileLabel>
          <TileValue>
            {yesterday.totalBlocks.toLocaleString(NUMBER_LOCALE)}
          </TileValue>
          {total && (
            <TileSub>
              {/* Not `count`: i18next reserves that for plural selection
                  and interpolates the raw number, unformatted. */}
              {t('blocks:List.CumulativeBlocks', {
                defaultValue: '{{blocks}} in total',
                blocks: total.totalBlocks.toLocaleString(NUMBER_LOCALE),
              })}
            </TileSub>
          )}
        </Tile>

        {fees && (
          <Tile>
            <TileLabel>
              {t('blocks:List.TransactionFees', {
                defaultValue: 'Transaction fees (yesterday)',
              })}
            </TileLabel>
            {/* Compact headline, exact figure on hover: two segments already
                render identically compacted on real data. */}
            <TileValue title={`${exactAmount(fees.total, KLV_PRECISION)} KLV`}>
              {klvAmount(fees.total)}
            </TileValue>
            <TileSub>
              {t('blocks:List.ShareBurned', {
                defaultValue: '{{share}} of it burned',
                share: formatShare(segments[0].amount, fees.total),
              })}
            </TileSub>
          </Tile>
        )}

        {transactions !== undefined && (
          <Tile>
            <TileLabel>
              {t('blocks:List.TransactionsYesterday', {
                defaultValue: 'Transactions (yesterday)',
              })}
            </TileLabel>
            <TileValue>{transactions.toLocaleString(NUMBER_LOCALE)}</TileValue>
            {yesterday.totalBlocks > 0 && (
              <TileSub>
                {/* The share of blocks that carried anything, not transactions
                    per block: at 8275 over 21599 that average reads "0.4 per
                    block", which says less. Kept to the length of its
                    neighbours (18 to 21 characters): at 33 it wrapped to two
                    lines at 390px and grew the card 14px when the figures
                    landed. Guarded on a non-zero divisor, or formatShare
                    answers "--" and the line reads "-- of blocks used".
                    `count` is avoided because i18next reserves it for plural
                    selection and interpolates the number unformatted. */}
                {t('blocks:List.BlocksUsed', {
                  defaultValue: '{{share}} of blocks used',
                  share: formatShare(transactions, yesterday.totalBlocks),
                })}
              </TileSub>
            )}
          </Tile>
        )}

        <Tile>
          <TileLabel>
            {t('blocks:List.TotalBurned', {
              defaultValue: 'Total burned (yesterday)',
            })}
          </TileLabel>
          <TileValue>{klvAmount(yesterday.totalBurned)}</TileValue>
          {total && (
            <TileSub>
              {t('blocks:List.CumulativeBurned', {
                defaultValue: '{{amount}} in total',
                amount: klvAmount(total.totalBurned),
              })}
            </TileSub>
          )}
        </Tile>

        {/* Inside the grid so it can anchor to the tiles' own bottom, but
            absolutely positioned, so it never claims a cell. */}
        <UpdatedAgo at={dataUpdatedAt} />
      </TilesGrid>

      {fees && (
        <>
          <DistBar role="img" aria-label={barLabel}>
            {segments.map((segment, index) => (
              <DistSegment
                key={segment.key}
                $color={feeSegmentColor(segment.key, theme)}
                $delay={index * 60}
                style={{ width: `${(segment.amount / fees.total) * 100}%` }}
                title={`${segment.label} · ${exactAmount(segment.amount, KLV_PRECISION)} KLV`}
                aria-hidden="true"
              />
            ))}
          </DistBar>
          <LegendRow>
            {segments.map(segment => (
              <LegendItem key={segment.key}>
                <LegendDot $color={feeSegmentColor(segment.key, theme)} />
                {segment.label} <strong>{klvAmount(segment.amount)}</strong>
              </LegendItem>
            ))}
          </LegendRow>
        </>
      )}
    </BlocksSummaryCard>
  );
};

export default BlocksSummary;
