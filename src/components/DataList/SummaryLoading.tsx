import Skeleton from '@/components/Skeleton';
import React from 'react';
import { SummaryCard, Tile, TilesGrid } from './styles';

interface ISummaryLoadingProps {
  /** Names the card for assistive tech while its content is still unknown. */
  label: string;
  tiles: number;
  /** Strips that end in a distribution bar reserve its height too. */
  bar?: boolean;
  /** Lets a page add its own spacing without the loaded card and this one
   * drifting apart, which would jump the page once the figures arrive. */
  className?: string;
}

/**
 * The line heights of a loaded tile, measured rather than guessed: label at
 * 11px, value at 20px, sub at 12px. Reserving 56px for the three together
 * left the card 36px short of the one that replaced it.
 */
const LABEL = 15;
const VALUE = 27.5;
const SUB = 16.5;

/** The bar and the legend under it, each with the margin above it. */
const BAR = 8;
const LEGEND = 16.5;

/**
 * Loading shape for a summary strip.
 *
 * Built from the same grid and tile the loaded card uses, so both the column
 * widths and the height follow from one definition instead of two sets of
 * numbers drifting apart.
 */
const SummaryLoading: React.FC<ISummaryLoadingProps> = ({
  label,
  tiles,
  bar,
  className,
}) => (
  <SummaryCard aria-label={label} className={className}>
    <TilesGrid>
      {Array.from({ length: tiles }, (_, index) => (
        <Tile key={index}>
          <Skeleton width="55%" height={LABEL} />
          <Skeleton width="45%" height={VALUE} />
          <Skeleton
            width="35%"
            height={SUB}
            containerCustomStyles={{ marginTop: 2 }}
          />
        </Tile>
      ))}
    </TilesGrid>
    {bar && (
      <>
        <Skeleton
          width="100%"
          height={BAR}
          containerCustomStyles={{ marginTop: 16 }}
        />
        <Skeleton
          width="70%"
          height={LEGEND}
          containerCustomStyles={{ marginTop: 8 }}
        />
      </>
    )}
  </SummaryCard>
);

export default SummaryLoading;
