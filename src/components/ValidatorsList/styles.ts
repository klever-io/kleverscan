import { ROW_LAYOUT_MIN_WIDTH, belowWidth } from '@/components/DataList/layout';
import {
  AddressLink,
  BadgePill,
  compactFilterRow,
  MobileListCard,
  RowActions,
  DATA_LIST_ROW_HEIGHT,
  dataListCardBand,
  holdFourTiles,
  dataListRowPadding,
  dataListTableSkin,
  IdentityCell,
  SummaryCard,
  Tile,
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
  ${holdFourTiles(600)}
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
 * The delegation badge against the card's right group, left of the copy and
 * open buttons, which stay outermost like on every other card. This carries
 * the auto margin; a second one on the buttons would split the free space and
 * park the badge mid-row.
 */
export const DelegateSlot = styled.span`
  /* Centred like the row's other children, so its baseline and its bottom edge
     line up with the state badge rather than with the text beside it. */
  display: inline-flex;
  align-items: center;
  margin-left: auto;

  /* The tooltip renders wrapper span plus an inner block div, and the pill
     rides the text baseline of that div's line box, 2px below the state badge
     beside it (measured). Flexed, both wrappers hug the pill and the row
     centres it the same as its neighbour. */
  > span,
  > span > div {
    display: flex;
    align-items: center;
  }
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

/* --------------------------- scoped table skin --------------------------- */

/** `nth-child` is 1-based; the column indexes are not. */
const rightAligned = RIGHT_ALIGNED_COLUMNS.map(index => index + 1);

const BELOW_ROW = belowWidth(ROW_LAYOUT_MIN_WIDTH);

export const ValidatorsTableWrapper = styled.div`
  ${dataListTableSkin}
  ${compactFilterRow}

  /* The buttons stay outermost right on every card at every width; the
     delegation badge before them carries the auto margin that pushes the
     pair to the edge. */
  ${MobileListCard} ${RowActions} {
    margin-left: 0;
  }

  /* The shared loading rows stack a heading over a bar per column, 361px per
     card against the 149 of a loaded one at 390. Loading rows are the only
     TableRow below the tablet width here, so this reshapes just them; the
     13px bar lands ten loading cards within 3px of ten loaded ones. */
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

  ${dataListCardBand(BELOW_ROW)}

  @media screen and (min-width: ${props =>
    props.theme.breakpoints.tablet}) and (max-width: ${BELOW_ROW}) {
    ${TableRow} {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media screen and (min-width: ${props => props.theme.breakpoints.tablet}) {
    ${dataListRowPadding}

    /* Names are chosen by whoever runs the validator: the longest on mainnet
       renders at 219px, so 220 holds every one unclipped and bounds the rest.
       min-width is the load-bearing half (the shared cell rules set
       min-width:fit-content, which beats a max-width), and display:block is
       needed because text-overflow only acts inside a block container. */
    ${IdentityCell} ${AddressLink} {
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

    /* One 20px content line inside the 60px row; the share cell is exempt,
       it stacks a value over a bar. */
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

    /* text-align does not reach flex items, and the cell rules make every
       span one: the Missed figure sat 30px left of its right-aligned column.
       The second selector aims at the wrapper, not at Missed, so a tooltip on
       another of these columns cannot repeat it. */
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
