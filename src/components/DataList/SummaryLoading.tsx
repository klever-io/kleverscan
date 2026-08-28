import Skeleton from '@/components/Skeleton';
import React from 'react';
import styled from 'styled-components';
import { SummaryCard, Tile, TilesGrid } from './styles';

interface ISummaryLoadingProps {
  /** Names the card for assistive tech while its content is still unknown. */
  label: string;
  tiles: number;
  /** Strips that end in a distribution bar reserve its height too. */
  bar?: boolean;
  /** Page-added spacing; must match the loaded card or the page jumps. */
  className?: string;
}

// Measured from a loaded tile, not guessed: label at 11px, value at 20px, sub
// at 12px; reserving 56px for the three left the card 36px short.
const LABEL = 15;
const VALUE = 27.5;
const SUB = 16.5;

// Bar widths, just above the median of what the real lines occupy, measured
// across the three strips that render this: labels take 14 to 36 percent of a
// tile, values 6 to 28, subs 12 to 32. 55/45/35 drew a bar seven times "86".
const LABEL_W = '32%';
const VALUE_W = '18%';
const SUB_W = '24%';

/** The bar and the legend under it, each with the margin above it. */
const BAR = 8;
const LEGEND = 16.5;

/** Near the median of a real legend entry (dot, label, figure). */
const LEGEND_ITEM_W = 150;

// The same wrap metrics as LegendRow, so the placeholder breaks onto a second
// line at the widths the real legend does: one 70%-wide line here held the
// card 33px short of its loaded height at 390px, measured on /blocks.
const LegendPlaceholderRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  margin-top: 8px;
`;

// Exported because tiles-arrived-bar-pending is a state of its own: without
// this it drew the tiles alone and lost 48px.
export const SummaryBarPlaceholder: React.FC<{ legendItems?: number }> = ({
  legendItems = 3,
}) => (
  <>
    <Skeleton
      width="100%"
      height={BAR}
      containerCustomStyles={{ marginTop: 16 }}
    />
    <LegendPlaceholderRow>
      {Array.from({ length: legendItems }, (_, index) => (
        <Skeleton key={index} width={LEGEND_ITEM_W} height={LEGEND} />
      ))}
    </LegendPlaceholderRow>
  </>
);

// Built from the same grid and tile the loaded card uses, so column widths
// and height follow from one definition.
const SummaryLoading: React.FC<ISummaryLoadingProps> = ({
  label,
  tiles,
  bar,
  className,
}) => (
  <SummaryCard aria-busy="true" aria-label={label} className={className}>
    <TilesGrid>
      {Array.from({ length: tiles }, (_, index) => (
        <Tile key={index}>
          <Skeleton width={LABEL_W} height={LABEL} />
          <Skeleton width={VALUE_W} height={VALUE} />
          <Skeleton
            width={SUB_W}
            height={SUB}
            containerCustomStyles={{ marginTop: 2 }}
          />
        </Tile>
      ))}
    </TilesGrid>
    {bar && <SummaryBarPlaceholder />}
  </SummaryCard>
);

export default SummaryLoading;
