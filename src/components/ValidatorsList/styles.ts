import {
  BadgePill,
  compactFilterRow,
  DATA_LIST_ROW_HEIGHT,
  dataListTableSkin,
  IdentityCell,
  ShareTrack,
  SummaryCard,
  Tile,
  TilesGrid,
  TileSub,
} from '@/components/DataList/styles';
import {
  HeaderItem,
  MobileCardItem,
  MobileHeader,
  TableRow,
} from '@/components/Table/styles';
import styled, { css, DefaultTheme } from 'styled-components';
import { RIGHT_ALIGNED_COLUMNS } from './columns';

/* ------------------------------- summary --------------------------------- */

// The rhythm the old header card had, so the figures land where it sat.
const pageSummarySpacing = css`
  margin-top: 1.5rem;
`;

/** Holds a tile to the height /transactions and /blocks reach, so the cards
 *  line up across pages. Carried by the loading shape too, or the card grows
 *  when the figures arrive. */
const tileHeight = css`
  ${Tile} {
    min-height: 66.5px;
  }
`;

export const ValidatorsSummaryCard = styled(SummaryCard)`
  ${pageSummarySpacing}
  ${tileHeight}

  /* The shared grid drops to a hard two columns below the mobile breakpoint.
     Four 140px tiles plus three 16px gaps need 608px of inner width, so from
     660px up they fit on one row and the 2x2 wastes half the card. Below that
     the shared two-column layout stands: smallest screens stay 2x2, per the
     user's call. auto-fit is avoided on purpose, at 600px it lands on three
     columns and leaves the fourth tile orphaned on its own row. */
  @media screen and (min-width: 660px) and (max-width: ${props =>
    props.theme.breakpoints.mobile}) {
    ${TilesGrid} {
      grid-template-columns: repeat(4, 1fr);
    }
  }
`;

/**
 * The fifth tile, shown only where five fit on one row.
 *
 * `TilesGrid` is `auto-fit, minmax(150px, 1fr)` with a 24px gap, so five tiles
 * need 846px of inner width; below that the grid drops to four columns and the
 * fifth wraps onto a row of its own with three empty cells beside it. Below the
 * mobile breakpoint the grid is a fixed two columns and the same thing happens.
 * The tablet breakpoint is the first one above 846px, so it is the honest cut.
 *
 * The block count is the tile that goes, because it is the only chain-wide
 * figure in a card about validators.
 */
export const WideOnlyTile = styled(Tile)`
  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: none;
  }
`;

/** The legend dot's space in the placeholder: the same 8px circle LegendDot
 *  draws, without a state colour to claim. */
export const LegendPlaceholderDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.theme.lightGray};
`;

/** Two lines of sub, reserved for the loading shape only. On a narrow tile the
 *  real subs ("of network stake", "of room left") run onto a second line and
 *  the grid stretches its whole row, so a one-line placeholder left the card
 *  10px short of the loaded one at 390px. The crossover is between 390 and
 *  400px, not at the mobile breakpoint: scoping this to 768px made the loading
 *  card 31px TALLER than the loaded one at 480, where the real subs fit on one
 *  line. Both numbers measured. */
export const LoadingTileSub = styled(TileSub)`
  @media screen and (max-width: 399.98px) {
    min-height: 28px;
  }
`;

/**
 * One colour per chain list state, ordered as a lifecycle from producing to
 * punished. The row badges carry their own mapping through `statusVariant`,
 * which resolves through the badge palette and does NOT land on these hexes:
 * checked, waiting is #B28DF6 here and #7D3FF1 in the badge. Keep the two in
 * step by state, not by colour.
 */
export const stateSegmentColor = (
  theme: DefaultTheme,
  state: string,
): string => {
  switch (state) {
    case 'elected':
      return theme.green;
    case 'eligible':
      return theme.violet;
    case 'waiting':
      /* lightPurple in both themes. `purple` computes to the same relative
         luminance as the `violet` beside it (1.00:1, and in BOTH themes, not
         just light), so those two segments merged into one block. This raises
         that pair to 2.09:1 at the cost of waiting/inactive, which drops from
         2.42 to 1.16. It is the best minimum the palette allows: of every
         token, the highest worst-adjacency is 1.37 (lightGray), so no choice
         clears the 3:1 of SC 1.4.11 on both sides. The bar is identified by
         its legend, which names every segment in the same order. */
      return theme.lightPurple;
    case 'inactive':
      // The amber the warning badge is built on, not the darkened value its
      // text uses: that one exists to clear 4.5:1 at 10px on a tint, and in an
      // 8px bar it reads as brown against the violet beside it.
      return '#EB9C27';
    case 'jailed':
      return theme.red;
    default:
      return theme.dark ? '#33355C' : '#D6D8E8';
  }
};

/**
 * The version badge keeps the string as the node reports it.
 *
 * `BadgePill` uppercases, which is right for a state word like ELECTED and
 * wrong for a version: it rendered `v1.7.21-rc2` as `V1.7.21-RC2`, a string
 * that matches nothing you could paste into a search or a release note.
 */
export const VersionPill = styled(BadgePill)`
  text-transform: none;
  letter-spacing: 0;
  font-family: inherit;
`;

/** Left-aligned numerals. The `Amount*` pair flexes to the right edge, which
 *  is correct only in the columns the skin also right-aligns. */
export const NumericCell = styled.span`
  font-variant-numeric: tabular-nums;
`;

/* --------------------------- scoped table skin --------------------------- */

/** `nth-child` is 1-based; the column indexes are not. */
const rightAligned = RIGHT_ALIGNED_COLUMNS.map(index => index + 1);

export const ValidatorsTableWrapper = styled.div`
  ${dataListTableSkin}
  ${compactFilterRow}

  /* The shared Table's mobile loading rows stack a heading over a bar for each
     of the ten columns, which made a loading card 361px against the 149 of a
     loaded one, measured at 390px. Loading rows are the only place TableRow
     exists below the tablet width here (loaded rows are MobileListCards and
     the header renders on desktop only), so this reshapes just them: no
     headings, two bars per row, and a 13px bar, which lands the loading card
     within 3px of the loaded one over ten rows (1565px against 1562). */
  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}) {
    ${TableRow} ${MobileHeader} {
      display: none;
    }

    ${TableRow} ${MobileCardItem} {
      grid-column: span 1;
    }

    ${TableRow} [data-testid='skeleton'] {
      height: 13px !important;
    }
  }

  /* The row must never grow past the cards above it: blocks and
     smart-contracts hold that line, and transactions breaking it is a known
     defect, not the pattern. Ten nowrap cells put this table's min-content at
     1194px, so between the tablet breakpoint and 1300px three things give
     way, each verified live at 1030px (row 1194px -> 996px against a 998px
     card, page overflow 0): cells may shrink and truncate, the capacity track
     narrows, and the cell padding drops to 7px. */
  @media screen and (min-width: ${props =>
      props.theme.breakpoints.tablet}) and (max-width: 1300px) {
    ${TableRow} {
      min-width: 0;
    }

    ${TableRow} > div {
      overflow: hidden;
    }

    ${IdentityCell} {
      min-width: 0;
      overflow: hidden;
    }

    ${IdentityCell} a {
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 0;
    }

    ${ShareTrack} {
      width: 90px;
    }

    ${MobileCardItem} {
      padding: 8px 7px;
    }

    ${MobileCardItem}:first-child {
      padding-left: 14px;
    }

    ${MobileCardItem}:last-child {
      padding-right: 14px;
    }

    ${HeaderItem} {
      padding-left: 7px;
      padding-right: 7px;
    }
  }

  @media screen and (min-width: ${props => props.theme.breakpoints.tablet}) {
    /* One row height across every data-list table on the site. */
    ${MobileCardItem} {
      height: ${DATA_LIST_ROW_HEIGHT};
      white-space: nowrap;
    }

    /* One 20px content line, centered by the cell's vertical-align inside the
       60px row; the shared rule would pin these to 24px. The share cell is
       exempt: it stacks a value over a bar and needs its own height. */
    ${MobileCardItem} a,
    ${MobileCardItem} > span {
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
