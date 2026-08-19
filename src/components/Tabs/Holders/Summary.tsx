import SummaryLoading from '@/components/DataList/SummaryLoading';
import { useTranslation } from 'next-i18next';
import React from 'react';
import Tooltip from '@/components/Tooltip';
import { useTheme } from '@/contexts/theme';
import { IAsset } from '@/types';
import { formatAmount } from '@/utils/formatFunctions';
import {
  DistBar,
  DistSegment,
  LegendDot,
  LegendItem,
  LegendRow,
  SummaryCard,
  Tile,
  TileLabel,
  TileLabelRow,
  TileSub,
  TileValue,
  TileValueRow,
  TilesGrid,
} from '@/components/DataList/styles';
import {
  concentrationLevel,
  formatShare,
  IHoldersSummary,
} from './holdersMath';
import { Chip, ChipDot, segmentColor } from './styles';

interface IHoldersSummaryProps {
  asset: IAsset;
  summary: IHoldersSummary;
  isLoading: boolean;
}

/**
 * Analytics strip above the holders table: answers "is this concentrated?"
 * before the user reads a single row. Every figure comes from one cached
 * top-50 fetch plus asset-level supply fields; when either is missing the
 * affected tiles disappear instead of dashing out.
 */
const HoldersSummary: React.FC<IHoldersSummaryProps> = ({
  asset,
  summary,
  isLoading,
}) => {
  const { t } = useTranslation(['assets']);
  const { theme } = useTheme();

  if (!Number.isFinite(summary.grossSupply) || summary.grossSupply <= 0) {
    return null;
  }

  if (isLoading) {
    return (
      <SummaryLoading label={t('assets:Holders.SummaryAria')} tiles={4} bar />
    );
  }

  const formatAssetAmount = (raw: number): string =>
    `${formatAmount(raw / 10 ** asset.precision)} ${asset.ticker}`;

  const netMode =
    summary.voidAmount !== undefined && summary.netSupply < summary.grossSupply;

  const tiles: React.ReactNode[] = [];

  if (typeof summary.totalHolders === 'number') {
    tiles.push(
      <Tile key="holders">
        <TileLabel>{t('assets:Holders.Holders')}</TileLabel>
        <TileValue>{summary.totalHolders.toLocaleString('en-US')}</TileValue>
        <TileSub>
          {t('assets:Holders.AccountsHolding', { ticker: asset.ticker })}
        </TileSub>
      </Tile>,
    );
  }

  if (summary.top10ShareNet !== undefined) {
    const level = concentrationLevel(summary.top10ShareNet);
    tiles.push(
      <Tile key="top10">
        <TileLabelRow>
          <TileLabel>{t('assets:Holders.Top10Hold')}</TileLabel>
          <Tooltip
            msg={
              netMode
                ? t('assets:Holders.SharesAgainstTotalNet')
                : t('assets:Holders.SharesAgainstTotal')
            }
            customStyles={{ place: 'right' }}
            maxVw={24}
          />
        </TileLabelRow>
        <TileValueRow>
          <TileValue>
            {formatShare(summary.top10Amount, summary.grossSupply)}
          </TileValue>
          <Tooltip
            msg={t('assets:Holders.ConcentrationTooltip')}
            maxVw={24}
            Component={() => (
              <Chip>
                <ChipDot $tone={level.tone} />
                {t(level.label)}
              </Chip>
            )}
          />
        </TileValueRow>
        <TileSub>{formatAssetAmount(summary.top10Amount)}</TileSub>
      </Tile>,
    );
  }

  if (summary.top50Amount > 0) {
    tiles.push(
      <Tile key="top50">
        <TileLabel>{t('assets:Holders.Top50Hold')}</TileLabel>
        <TileValue>
          {formatShare(summary.top50Amount, summary.grossSupply)}
        </TileValue>
        <TileSub>{formatAssetAmount(summary.top50Amount)}</TileSub>
      </Tile>,
    );
  }

  if (tiles.length === 0 && summary.segments.length === 0) {
    return null;
  }

  const segmentSummary = summary.segments
    .map(
      segment =>
        `${t(segment.label)} ${formatShare(
          segment.amount,
          summary.grossSupply,
        )}`,
    )
    .join(', ');
  const barLabel = t('assets:Holders.DistributionAria', {
    segments: segmentSummary,
  });

  return (
    <SummaryCard aria-label={t('assets:Holders.SummaryAria')}>
      <TilesGrid>{tiles}</TilesGrid>
      {summary.segments.length > 0 && (
        <>
          <DistBar role="img" aria-label={barLabel}>
            {summary.segments.map((segment, index) => (
              <DistSegment
                key={segment.key}
                $color={segmentColor(segment.key, theme)}
                $delay={index * 60}
                style={{ width: `${segment.share * 100}%` }}
                title={`${t(segment.label)} · ${formatShare(
                  segment.amount,
                  summary.grossSupply,
                )} · ${formatAssetAmount(segment.amount)}`}
                aria-hidden="true"
              />
            ))}
          </DistBar>
          <LegendRow>
            {summary.segments.map(segment => (
              <LegendItem key={segment.key}>
                <LegendDot $color={segmentColor(segment.key, theme)} />
                {t(segment.label)}{' '}
                <strong>
                  {formatShare(segment.amount, summary.grossSupply)}
                </strong>
              </LegendItem>
            ))}
          </LegendRow>
        </>
      )}
    </SummaryCard>
  );
};

export default HoldersSummary;
