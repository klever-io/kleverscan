import {
  AddressLink,
  BadgePill,
  compactFilterRow,
  MobileListCard,
  RowActions,
  DATA_LIST_ROW_HEIGHT,
  dataListTableSkin,
  IdentityCell,
  SummaryCard,
  Tile,
  TilesGrid,
  TileSub,
} from '@/components/DataList/styles';
import {
  HeaderItem,
  MobileCardItem,
  MobileHeader,
  TableBody,
  TableRow,
} from '@/components/Table/styles';
import styled, { css, DefaultTheme } from 'styled-components';
import { RIGHT_ALIGNED_COLUMNS, ROW_LAYOUT_MIN_WIDTH } from './columns';

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

/**
 * The composition slot when its source failed.
 *
 * 49px because that is what the bar and its legend occupy: the loaded card
 * measures 158px with them and 109 without, and the version card and the table
 * sit under it, so a slot that collapses moves the page when a poll recovers.
 */
export const CompositionNotice = styled.p`
  display: flex;
  align-items: center;
  min-height: 49px;
  margin: 0;
  font-size: 0.8125rem;
  color: ${props => props.theme.darkText};
`;

/** Left-aligned numerals. The `Amount*` pair flexes to the right edge, which
 *  is correct only in the columns the skin also right-aligns. */
export const NumericCell = styled.span`
  font-variant-numeric: tabular-nums;
`;

/* --------------------------- scoped table skin --------------------------- */

/** `nth-child` is 1-based; the column indexes are not. */
const rightAligned = RIGHT_ALIGNED_COLUMNS.map(index => index + 1);

/** `max-width: N` and `min-width: N` both match at exactly N, and the row
 *  layout owns N. */
const BELOW_ROW = `${ROW_LAYOUT_MIN_WIDTH - 0.02}px`;

export const ValidatorsTableWrapper = styled.div`
  ${dataListTableSkin}
  ${compactFilterRow}

  /* The copy and open buttons belong beside the status badge, at every card
     width. RowActions carries margin-left:auto for the table row it was drawn
     for, and the skin only zeroes it from the shared breakpoint up, so on a
     card the pair drifted with the width: 192px past the badge at 480, 717 at
     1024, then back against it at 1026. */
  ${MobileListCard} ${RowActions} {
    margin-left: 0;
  }

  /* On a phone the pair sits at the card's right edge, the same place on every
     card. Beside the identity it tracked the name's width, which varies per
     row: measured at 360 the icons landed anywhere from 107px to 212px in, so
     scanning a column of cards the buttons never sat still. Above this width
     the card is wide enough for them to stay next to the identity, which is
     where they belong when there is room. */
  @media screen and (max-width: 767.98px) {
    ${MobileListCard} ${RowActions} {
      margin-left: auto;
    }
  }

  /* The shared Table's mobile loading rows stack a heading over a bar for each
     of the ten columns, which made a loading card 361px against the 149 of a
     loaded one, measured at 390px. Loading rows are the only place TableRow
     exists below the tablet width here (loaded rows are MobileListCards and
     the header renders on desktop only), so this reshapes just them: no
     headings, two bars per row, and a 13px bar, which lands the loading card
     within 3px of the loaded one over ten rows (1565px against 1562). */
  @media screen and (max-width: ${BELOW_ROW}) {
    ${TableRow} ${MobileHeader} {
      display: none;
    }

    ${TableRow} ${MobileCardItem} {
      grid-column: span 1;
      min-width: 0;
    }

    ${TableRow} [data-testid='skeleton'] {
      height: 13px !important;
    }
  }

  /* Between the shared breakpoint and this list's own, the rows are cards and
     the shared stylesheet still lays the surface out as a table. A styled
     component's own media query is not reachable from outside it, so it is
     undone here.

     The TableBody rule is not cosmetic: display:table wraps each
     MobileListCard in an anonymous cell, which puts all ten of them side by
     side on a single line. */
  @media screen and (min-width: ${props =>
      props.theme.breakpoints.tablet}) and (max-width: ${BELOW_ROW}) {
    ${TableBody} {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 0;
      border: none;
      background-image: none;
    }

    ${TableRow} {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 4px;
      padding: 16px;
      border-radius: 16px;
      border: solid 1px
        ${props =>
          props.theme.dark ? props.theme.darkGray : props.theme.black10};
      background-color: ${props => props.theme.white};
    }

    /* Through TableRow to clear the skin's own :first-child and :last-child
       cell padding, which matches on class count alone. */
    ${TableRow} ${MobileCardItem} {
      display: flex;
      flex-direction: column;
      width: auto;
      max-width: none;
      height: auto;
      padding: 0;
      border-bottom: none;
      font-size: 0.75rem;
    }

    ${TableRow} ${MobileCardItem} a,
    ${TableRow} ${MobileCardItem} span {
      height: auto;
      min-width: 0;
      white-space: normal;
    }
  }

  @media screen and (min-width: ${props => props.theme.breakpoints.tablet}) {
    /* 8px of side padding rather than the skin's 12, and 12 rather than 16 on
       the outer edges, the same as the transactions row: ten columns is more
       than the skin's spacing was drawn for, and it spent 248px of the row on
       padding. This spends 168, which is the difference between a row that
       needs a 1297px viewport and one that needs 1217. */
    ${MobileCardItem} {
      padding: 8px;
    }

    ${MobileCardItem}:first-child {
      padding-left: 12px;
    }

    ${MobileCardItem}:last-child {
      padding-right: 12px;
    }

    ${HeaderItem} {
      padding: 12px 8px;
    }

    ${HeaderItem}:first-child {
      padding-left: 12px;
    }

    ${HeaderItem}:last-child {
      padding-right: 12px;
    }

    /* Whoever runs a validator chooses its name, so this column has no
       maximum of its own and one long name would widen the row past the
       breakpoint that was measured for it. Same treatment as the transactions
       To column: the longest name on mainnet renders at 219px (26 characters,
       "PRESIDENT2002-The-Countess") and the address it falls back to at 194,
       so 220 holds every one of them unclipped and bounds the rest. */
    ${IdentityCell} ${AddressLink} {
      /* min-width beside the max, and it is the load-bearing half: the shared
         cell rules give every link in a cell min-width:fit-content, and a used
         min-width beats a max-width, so the cap alone was inert. Measured with
         a 120-character name before this line existed: the link rendered
         1008px wide, the row 1953, and the page scrolled 595px sideways, which
         is the whole failure the cap exists to stop. */
      /* display too: the shared cell rules make every link in a cell a flex
         box, and text-overflow only acts on the inline content of a block
         container, so the name hard-clipped mid-character with no ellipsis
         even once the width held. */
      display: block;
      min-width: 0;
      max-width: 220px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

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

    /* text-align does not reach the items of a flex container, and the cell
       rules make every span in a cell one. Missed wraps its figure in a
       Tooltip, whose own wrapper is that flex container: the figure sat at the
       left of a right-aligned column, 30px short of where Produced beside it
       ends. The second selector aims at the wrapper rather than at Missed, so
       a tooltip added to another of these columns cannot repeat it. */
    ${rightAligned
      .map(
        position => `
    ${MobileCardItem}:nth-child(${position}),
    ${HeaderItem}:nth-child(${position}) {
      text-align: right;
    }

    ${MobileCardItem}:nth-child(${position}) > span,
    ${MobileCardItem}:nth-child(${position}) > div {
      justify-content: flex-end;
    }`,
      )
      .join('')}
  }
`;
