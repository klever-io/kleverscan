import {
  DATA_LIST_ROW_HEIGHT,
  dataListTableSkin,
  SummaryCard,
  Tile,
  TilesGrid,
} from '@/components/DataList/styles';
import { HeaderItem, MobileCardItem } from '@/components/Table/styles';
import styled, { css, DefaultTheme } from 'styled-components';
import { RIGHT_ALIGNED_COLUMNS } from './columns';

/* ------------------------------- summary --------------------------------- */

// 1.5rem is the rhythm the old CardContainer had, so the figures land where
// the cards used to. The loading shape carries the same margin, or the page
// shifts by 24px once the numbers arrive.
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

  /* Narrow screens park the age line in the grid cell the wrapped tiles leave
     empty. Aligned on the last text baseline, not the cell edge: the tiles hold
     a 66,5px minimum while their "in total" line ends above it, by an amount
     that scales with the root font (9px at 390, 2px at 1000), so an edge or a
     fixed margin misses the line at one width or the other. */
  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}) {
    ${TilesGrid} {
      align-items: last baseline;
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

  /* Wide screens: the corner, above the single tile row. Narrow ones wrap the
     tiles, which leaves the grid cell beside the last tile empty; the line
     fills it there instead, on the baseline of that tile's "in total" sub. */
  @media screen and (min-width: ${props => props.theme.breakpoints.tablet}) {
    position: absolute;
    top: 20px;
    right: 20px;
  }
  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}) {
    justify-self: end;
  }
`;

/* -------------------------------- cells ---------------------------------- */

/** Digits of one width, so a column of them reads as a column. */
export const NumericCell = styled.span`
  font-variant-numeric: tabular-nums;
`;

/* --------------------------- scoped table skin --------------------------- */

/** `nth-child` is 1-based; the column indexes are not. */
const rightAligned = RIGHT_ALIGNED_COLUMNS.map(index => index + 1);

export const BlocksTableWrapper = styled.div`
  ${dataListTableSkin}

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

  /* The bottom margin LimitContainer carries below this width; the block
     aligns its children on their bottom edge, so without it the switch sits
     10px under the page-size buttons. Ends at the buttons' baseline, which is
     also why the label needs no extra offset above that width. */
  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}) {
    margin-bottom: 10px;
  }
`;
