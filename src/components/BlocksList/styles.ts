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
     Applies to the loading card too, which shares this component. */
  @media screen and (min-width: ${props => props.theme.breakpoints.tablet}) {
    ${TilesGrid} {
      padding-right: 9rem;
    }
  }

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
