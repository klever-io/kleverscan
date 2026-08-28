import {
  DATA_LIST_ROW_HEIGHT,
  dataListTableSkin,
  SummaryCard,
  Tile,
  TilesGrid,
} from '@/components/DataList/styles';
import SummaryLoading from '@/components/DataList/SummaryLoading';
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
 * Sits in the table's Filters slot, so it shares a row with Items per page.
 * A button, not a div: it toggles state, and a div swallows keyboard use.
 */
export const AutoUpdateContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  /* Lines the label up with the table's first heading and the card's first
     tile: the float container it sits in starts at the table's outer edge,
     while a heading starts a 1px border and 16px of cell padding further in. */
  padding-left: 17px;

  cursor: pointer;
  user-select: none;

  color: ${props => props.theme.black};
  font-size: 0.9rem;
`;
