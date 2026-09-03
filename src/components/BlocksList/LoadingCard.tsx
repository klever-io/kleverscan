import { HOLD_LINE, SKELETON_INLINE } from '@/components/DataList/loadingText';
import Skeleton from '@/components/Skeleton';
import {
  DistBar,
  LegendDot,
  LegendItem,
  LegendRow,
  Tile,
  TileLabel,
  TileSub,
  TileValue,
  TilesGrid,
} from '@/components/DataList/styles';
import { useTheme } from '@/contexts/theme';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { BlocksSummaryCard, UpdatedNote, feeSegmentColor } from './styles';

/**
 * The card's loading shape, built from the loaded card's own components with
 * the real labels in place and bars only where figures go.
 *
 * The generic `SummaryLoading` reserves fixed pixel heights, and those miss
 * twice, measured with the statistics requests held open: the root font
 * scales below the tablet width (a 16,5px legend line against a real 14px
 * one), and "Transaction fees (yesterday)" wraps at 390px where the skeleton
 * reserves one line, together a 33px jump when the figures landed. Real text
 * wraps and scales exactly like itself, so neither can drift.
 */
const BlocksSummaryLoadingCard: React.FC<{ label: string }> = ({ label }) => {
  const { t } = useTranslation(['blocks']);
  const { theme } = useTheme();

  const tiles = [
    t('blocks:List.BlocksYesterday', { defaultValue: 'Blocks (yesterday)' }),
    t('blocks:List.TransactionFees', {
      defaultValue: 'Transaction fees (yesterday)',
    }),
    t('blocks:List.TransactionsYesterday', {
      defaultValue: 'Transactions (yesterday)',
    }),
    t('blocks:List.TotalBurned', { defaultValue: 'Total burned (yesterday)' }),
  ];
  const legend = [
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
  ];

  return (
    <BlocksSummaryCard aria-busy="true" aria-label={label}>
      <TilesGrid>
        {tiles.map(title => (
          <Tile key={title}>
            <TileLabel>{title}</TileLabel>
            {/* Inline, or the bar opens a block of its own and the line
                holder ends up under it as a second row. */}
            <TileValue>
              <Skeleton
                width="38%"
                height="1em"
                containerCustomStyles={SKELETON_INLINE}
              />
              {HOLD_LINE}
            </TileValue>
            <TileSub>
              <Skeleton
                width="52%"
                height="1em"
                containerCustomStyles={SKELETON_INLINE}
              />
              {HOLD_LINE}
            </TileSub>
          </Tile>
        ))}
        <UpdatedNote aria-hidden="true">{HOLD_LINE}</UpdatedNote>
      </TilesGrid>

      <DistBar aria-hidden="true">
        <Skeleton width="100%" height={8} />
      </DistBar>
      <LegendRow>
        {legend.map(segment => (
          <LegendItem key={segment.key}>
            <LegendDot $color={feeSegmentColor(segment.key, theme)} />
            {segment.label}{' '}
            <Skeleton
              width={64}
              height="1em"
              containerCustomStyles={SKELETON_INLINE}
            />
          </LegendItem>
        ))}
      </LegendRow>
    </BlocksSummaryCard>
  );
};

export default BlocksSummaryLoadingCard;
