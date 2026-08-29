import { Tile, TilesGrid } from '@/components/DataList/styles';
import Skeleton from '@/components/Skeleton';
import React from 'react';
import { ContractsSummaryCard, PlaceholderLegendRow } from './styles';

/**
 * Skeleton heights in rem, not px. The root font is 93,75% below 1440px and
 * 87,5% below tablet width (global.ts), so every real text line shrinks with
 * the viewport while a px skeleton stays put; measured before this, the loaded
 * card sat 17px under its own loading shape at 390px. Each pair below is a bar
 * height plus vertical margins that sum to the line box of the text it stands
 * for, so the sum scales exactly as the text does.
 */
const line = (
  width: string,
  bar: string,
  margin: string,
): React.CSSProperties & { bar: string; width: string } => ({
  bar,
  width,
  margin: `${margin} 0`,
});

/** Label 0.9375rem, value 1.71875rem, sub 1.03125rem: the measured line boxes
 *  of TileLabel, TileValue and TileSub at the default root. */
const TILE_LINES = [
  line('32%', '0.6875rem', '0.125rem'),
  line('18%', '1.09375rem', '0.3125rem'),
  line('24%', '0.65625rem', '0.1875rem'),
];

/**
 * The distribution bar and its one-line legend, before the statistics arrive.
 * Its own shape rather than the shared SummaryBarPlaceholder: that one wraps
 * its fixed-width items like a multi-row legend, while this card's legend is
 * a single row on every width (it scrolls on mobile), so the shared shape
 * reserved two rows where one would land.
 */
export const FiguresBarPlaceholder: React.FC = () => (
  <>
    <Skeleton
      width="100%"
      height={8}
      containerCustomStyles={{ marginTop: 16 }}
    />
    <PlaceholderLegendRow>
      {Array.from({ length: 4 }, (unused, index) => (
        <Skeleton
          key={index}
          width={index === 0 ? '18%' : '12%'}
          height="0.75rem"
          containerCustomStyles={{ margin: '0.15625rem 0' }}
        />
      ))}
    </PlaceholderLegendRow>
  </>
);

/**
 * The whole summary while every figure is still out. The card and its tile
 * minimum are the same components the loaded state uses, so the two states
 * cannot drift apart in height.
 */
const ContractsSummaryLoadingCard: React.FC<{ label: string }> = ({
  label,
}) => (
  <ContractsSummaryCard aria-busy="true" aria-label={label}>
    <TilesGrid>
      {Array.from({ length: 3 }, (unused, tileIndex) => (
        <Tile key={tileIndex}>
          {TILE_LINES.map((tileLine, lineIndex) => (
            <Skeleton
              key={lineIndex}
              width={tileLine.width}
              height={tileLine.bar}
              containerCustomStyles={{ margin: tileLine.margin }}
            />
          ))}
        </Tile>
      ))}
    </TilesGrid>
    <FiguresBarPlaceholder />
  </ContractsSummaryCard>
);

export default ContractsSummaryLoadingCard;
