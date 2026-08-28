import { SummaryCard, Tile, TilesGrid } from '@/components/DataList/styles';
import SummaryLoading from '@/components/DataList/SummaryLoading';
import styled, { css, DefaultTheme } from 'styled-components';

/* ------------------------------- summary --------------------------------- */

// 1.5rem is the rhythm the old CardContainer had, so the figures land where
// the cards used to. The loading shape carries the same margin, or the page
// shifts by 24px once the numbers arrive.
const pageSummarySpacing = css`
  margin-top: 1.5rem;
`;

/**
 * Room for the age line in the corner. Above this width the third tile's label
 * ends 118px before the line starts; at 1000px that gap is down to 14px, and a
 * line reading "Updated 59 mins ago" is wider than the one measured. Below it
 * the tiles start a line lower instead of running under it.
 *
 * On the loading shape as well, which carries no line: without it the card
 * would be 20px shorter while loading and grow when the figures land.
 */
/**
 * Holds the tile to the height a tile reaches on /transactions, so the two
 * cards line up. Theirs carries a `TrendValue` at 0.8125rem where a plain
 * `TileSub` is 0.75rem, which is 18px of line box against 16,5px: without this
 * a card with no trend figure sits 1,5px lower than one with. Measured, and on
 * the loading shape too so the card does not grow when the figures land.
 */
const tileHeight = css`
  ${Tile} {
    min-height: 66.5px;
  }
`;

const cornerNoteRoom = css`
  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}) {
    ${TilesGrid} {
      padding-top: 20px;
    }
  }
`;

export const BlocksSummaryCard = styled(SummaryCard)`
  ${pageSummarySpacing}
  ${cornerNoteRoom}
  ${tileHeight}

  /* Anchors the age line in the top-right corner. */
  position: relative;
`;

export const BlocksSummaryLoading = styled(SummaryLoading)`
  ${pageSummarySpacing}
  ${cornerNoteRoom}
  ${tileHeight}
`;

// Same red the holders bar uses for its burned segment, so one colour means
// one thing across the site.
const SEGMENT_COLOR = {
  burned: (theme: DefaultTheme) => (theme.dark ? '#FF4465' : theme.red),
  validators: (theme: DefaultTheme) => theme.violet,
  kapp: (theme: DefaultTheme) => theme.lightPurple,
};

export type FeeSegmentKey = keyof typeof SEGMENT_COLOR;

export const feeSegmentColor = (
  key: FeeSegmentKey,
  theme: DefaultTheme,
): string => SEGMENT_COLOR[key](theme);

/**
 * The age of the figures, in the card's top-right corner. Out of the flow on
 * purpose: in it, the line and its margin added 28,5px that the loading shape
 * has no counterpart for, so the card grew by that much the moment the numbers
 * arrived. `top`/`right` match the card's own 20px padding.
 */
export const UpdatedNote = styled.p`
  position: absolute;
  top: 20px;
  right: 20px;

  color: ${props => props.theme.darkText};
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
`;
