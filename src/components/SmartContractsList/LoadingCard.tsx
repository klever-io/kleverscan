import { LegendRow, Tile, TilesGrid } from '@/components/DataList/styles';
import Skeleton from '@/components/Skeleton';
import React from 'react';
import { ContractsSummaryCard, MostUsedTile } from './styles';

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
 * The distribution bar and its legend, before the statistics arrive. Six
 * pills, one per legend item (the five busiest contracts and "Other"), on the
 * card's own legend row, so they take the row's grid at every width and the
 * two states cannot differ in height. The pill is a rem width rather than a
 * share of the row, since in a grid cell a percentage would be of the cell,
 * and bar plus margins make the item's 1,03125rem line box (16,5px at 12px).
 */
export const FiguresBarPlaceholder: React.FC = () => (
  <>
    <Skeleton
      width="100%"
      height={8}
      containerCustomStyles={{ marginTop: 16 }}
    />
    <LegendRow>
      {Array.from({ length: 6 }, (unused, index) => (
        <Skeleton
          key={index}
          width="6.5rem"
          height="0.75rem"
          containerCustomStyles={{ margin: '0.140625rem 0' }}
        />
      ))}
    </LegendRow>
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
      {Array.from({ length: 3 }, (unused, tileIndex) => {
        // The third is the most-used tile, which the card drops below 600px;
        // the loading shape has to drop it at the same width or it reserves a
        // row the figures never fill. By position: Summary renders
        // [contracts, transactions, most-used], and nothing but these two
        // comments holds the pairing.
        const TileBox = tileIndex === 2 ? MostUsedTile : Tile;
        return (
          <TileBox key={tileIndex}>
            {TILE_LINES.map((tileLine, lineIndex) => (
              <Skeleton
                key={lineIndex}
                width={tileLine.width}
                height={tileLine.bar}
                containerCustomStyles={{ margin: tileLine.margin }}
              />
            ))}
          </TileBox>
        );
      })}
    </TilesGrid>
    <FiguresBarPlaceholder />
  </ContractsSummaryCard>
);

export default ContractsSummaryLoadingCard;
