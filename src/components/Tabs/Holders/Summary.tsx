import SummaryLoading from '@/components/DataList/SummaryLoading';
import React from 'react';
import Skeleton from '@/components/Skeleton';
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

const CONCENTRATION_TOOLTIP =
  'Top 10 concentration, ignoring burned (VOID) tokens. Top holders can include exchanges.';

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
  const { theme } = useTheme();

  if (!Number.isFinite(summary.grossSupply) || summary.grossSupply <= 0) {
    return null;
  }

  if (isLoading) {
    return <SummaryLoading label="Holder distribution summary" tiles={4} bar />;
  }

  const formatAssetAmount = (raw: number): string =>
    `${formatAmount(raw / 10 ** asset.precision)} ${asset.ticker}`;

  const netMode =
    summary.voidAmount !== undefined && summary.netSupply < summary.grossSupply;

  const tiles: React.ReactNode[] = [];

  if (typeof summary.totalHolders === 'number') {
    tiles.push(
      <Tile key="holders">
        <TileLabel>Holders</TileLabel>
        <TileValue>{summary.totalHolders.toLocaleString('en-US')}</TileValue>
        <TileSub>accounts holding {asset.ticker}</TileSub>
      </Tile>,
    );
  }

  if (summary.top10ShareNet !== undefined) {
    const level = concentrationLevel(summary.top10ShareNet);
    tiles.push(
      <Tile key="top10">
        <TileLabelRow>
          <TileLabel>Top 10 hold</TileLabel>
          <Tooltip
            msg={
              netMode
                ? 'Shares are measured against the total supply. Only the verdict ignores burned (VOID) tokens.'
                : 'Shares are measured against the circulating supply.'
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
            msg={CONCENTRATION_TOOLTIP}
            maxVw={24}
            Component={() => (
              <Chip>
                <ChipDot $tone={level.tone} />
                {level.label}
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
        <TileLabel>Top 50 hold</TileLabel>
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

  const barLabel = `Distribution of the total circulating supply: ${summary.segments
    .map(
      segment =>
        `${segment.label} ${formatShare(segment.amount, summary.grossSupply)}`,
    )
    .join(', ')}.`;

  return (
    <SummaryCard aria-label="Holder distribution summary">
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
                title={`${segment.label} · ${formatShare(
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
                {segment.label}{' '}
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
