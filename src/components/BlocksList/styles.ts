import {
  CompactFilterBar,
  compactFilterRow,
  DATA_LIST_ROW_HEIGHT,
  dataListTableSkin,
  SummaryCard,
  Tile,
  TilesGrid,
} from '@/components/DataList/styles';
import {
  HeaderItem,
  MobileCardItem,
  TableControls,
} from '@/components/Table/styles';
import styled, { css, DefaultTheme } from 'styled-components';
import { RIGHT_ALIGNED_COLUMNS } from './columns';

/* ------------------------------- summary --------------------------------- */

// 1.5rem is the rhythm the old CardContainer had, so the figures land where
// the cards used to. The loading shape carries the same margin, or the page
// shifts by 24px once the numbers arrive.
/* Four tiles hold one row down to here, with the 9rem the corner line needs
   still reserved beside them; below it they wrap and the line goes with them.
   Measured on the loaded card with that reservation in place: one row at
   890px, two at 880px. The .98 is for the same reason the theme's own
   breakpoints carry it, since max-width: N and min-width: N both match at
   exactly N. */
const TILES_ON_ONE_ROW = '890px';
const TILES_WRAP = '889.98px';

const pageSummarySpacing = css`
  margin-top: 1.5rem;
`;

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

export const BlocksSummaryCard = styled(SummaryCard)`
  ${pageSummarySpacing}
  ${tileHeight}

  /* Anchors the age line in the top-right corner. */
  position: relative;

  /* Room for that corner line, in rem so browser text zoom scales it along:
     with a px reservation the note painted through the third tile's label at
     125 percent text size and beyond (measured, 47px of overlap at 1026px).
     Applies to the loading card too, which shares this component. Reserved
     only where the line shows, or the narrow card loses a column to nothing. */
  @media screen and (min-width: ${TILES_ON_ONE_ROW}) {
    ${TilesGrid} {
      padding-right: 9rem;
    }
  }
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
  color: ${props => props.theme.darkText};
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;

  /* The card's top-right corner, out of the flow: as a grid child it claimed a
     cell whenever the tile count filled the last row, which dropped it to a
     row of its own and read as centred. The offsets match the card's own 20px
     padding.

     Hidden once the tiles wrap, because the corner it sits in then belongs to
     a tile rather than to empty space, and the line is the one thing on this
     card a reader can do without. */
  position: absolute;
  top: 20px;
  right: 20px;

  @media screen and (max-width: ${TILES_WRAP}) {
    display: none;
  }
`;

/* -------------------------------- cells ---------------------------------- */

/* --------------------------- scoped table skin --------------------------- */

/** `nth-child` is 1-based; the column indexes are not. */
const rightAligned = RIGHT_ALIGNED_COLUMNS.map(index => index + 1);

export const BlocksTableWrapper = styled.div`
  ${dataListTableSkin}
  ${compactFilterRow}

  /* Below this width the three controls do not fit on one line at all: the
     switch, the pills and the button measure 355px against the 328 a 360px
     screen leaves, which pushed the whole page sideways (measured: 11px of
     document overflow at 360, 51 at 320). The shared row forbids wrapping so
     the refresh button can never leave the pills; here the switch takes a line
     of its own instead, which keeps that rule intact. */
  @media screen and (max-width: 374px) {
    ${TableControls} {
      flex-wrap: wrap;
      /* The shared row also pins flex-shrink to 0; without lifting that the
         box stays at its 355px max-content and the wrap changes nothing. */
      flex-shrink: 1;
      min-width: 0;
    }

    ${TableControls} > *:first-child {
      flex-basis: 100%;
    }
  }

  /* The auto-update toggle rides along with the page-size controls here, so
     the row runs out at 585px rather than the 444 the shared rule assumes:
     measured, 182px filter, 355 controls, the 16px gap and the padding. Below
     that the lone date filter takes the row instead of leaving dead space. */
  @media screen and (max-width: 584px) {
    ${CompactFilterBar} {
      width: 100%;

      > div {
        flex: 1 1 0;
        min-width: 0;
      }
    }
  }

  @media screen and (min-width: ${props => props.theme.breakpoints.tablet}) {
    /* One row height across every data-list table on the site. */
    ${MobileCardItem} {
      height: ${DATA_LIST_ROW_HEIGHT};
      /* The amounts are the anonymous text of their cells, which the shared
         a/span rule cannot reach; under width pressure they wrapped mid-value. */
      white-space: nowrap;
    }

    /* One 20px content line, centered by the cell's vertical-align inside the
       60px row; the shared rule would pin these to 24px. */
    ${MobileCardItem} a,
    ${MobileCardItem} span {
      height: 20px;
    }

    /* The skin drops the permanent underline, so a link needs hover and focus
       affordances to stay distinguishable from the static text beside it. */
    ${MobileCardItem} a:hover,
    ${MobileCardItem} a:focus-visible {
      text-decoration: underline;
      text-underline-offset: 0.2rem;
    }

    ${rightAligned
      .map(
        position => `
    ${MobileCardItem}:nth-child(${position}),
    ${HeaderItem}:nth-child(${position}) {
      text-align: right;
    }`,
      )
      .join('')}
  }
`;

/* ------------------------------ auto update ------------------------------ */

/**
 * Sits in the table's control slot, directly beside Items per page. The click
 * lives on the wrapper as a convenience; the switch inside is the real button.
 */
export const AutoUpdateContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  cursor: pointer;
  user-select: none;
  white-space: nowrap;

  color: ${props => props.theme.black};
  font-size: 0.9rem;

  /* No offset of its own: it mirrored the 10px bottom margin LimitContainer
     used to carry below the tablet width, which compactFilterRow now zeroes.
     Keeping the mirror after the original left this switch floating 10px
     above the pills, measured on every width from 600 to 1024. */
`;
