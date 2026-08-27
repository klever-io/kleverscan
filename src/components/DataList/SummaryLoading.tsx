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

/**
 * Bar widths, set just above the median of what the real lines occupy.
 * Measured across the three strips that render this: the labels take 14 to 36
 * percent of a tile, the values 6 to 28, the subs 12 to 32. The previous
 * 55/45/35 drew a bar seven times the width of "86", which is what made the
 * loading state read as a different layout rather than the same one.
 */
const LABEL_W = '32%';
const VALUE_W = '18%';
const SUB_W = '24%';

/** The bar and the legend under it, each with the margin above it. */
const BAR = 8;
const LEGEND = 16.5;

/**
 * The space a distribution bar and its legend will take.
 *
 * Exported because a card whose tiles have arrived while its bar has not is a
 * state of its own: without this it drew the tiles alone and lost 48px, so
 * the card shrank between its skeleton and its finished self.
 */
export const SummaryBarPlaceholder: React.FC = () => (
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
);

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
