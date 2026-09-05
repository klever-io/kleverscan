import {
  accentText,
  AddressLink,
  badgeTint,
  compactFilterFloat,
  DATA_LIST_ROW_HEIGHT,
  dataListTableSkin,
  focusRing,
  inCard,
  LegendItem,
  LegendRow,
  SummaryCard,
  Tile,
  TileLabel,
  TilesGrid,
} from '@/components/DataList/styles';
import {
  ExportContainer,
  HeaderItem,
  LimitContainer,
  MobileCardItem,
  MobileHeader,
  TableControls,
  TableRow,
} from '@/components/Table/styles';
import { FilterContainer } from '@/components/TransactionsFilters/styles';
import Link from 'next/link';
import styled, { css } from 'styled-components';
import { RIGHT_ALIGNED_COLUMNS } from './columns';

/**
 * Two widths the shared theme has no name for, both measured on this page.
 *
 * Three summary tiles need 554px: the grid's own 150px minimum holds the
 * widest label, "Contract transactions", at 137px, and three of those plus the
 * 16px gaps, the card's padding and the container's come to that. The controls
 * fit on one line from 479px: the chip is 214px there, the page-size block and
 * the refresh button 217 together.
 */
const THREE_TILES = '600px';
const CONTROLS_ONE_ROW = '480px';

/**
 * The legend's six items (the five busiest contracts and "Other") need 921px
 * on one row, measured on mainnet. Below tablet width they sit on a grid of
 * three columns, two below 520px, so the row count is fixed whatever the
 * names are. The row is the item's line box: 16,5px at 12px, measured.
 */
const LEGEND_THREE_COLUMNS_MIN = '519.98px';
const LEGEND_LINE = '1.03125rem';

/**
 * Below 390px two tiles beside each other are 115 to 145px wide, where
 * "Contract transactions" needs two lines from 135px down; they used to stack
 * there. Both labels take two lines so the values stay level, and a tile holds
 * the 85px measured at 320px with a two-line label and a two-line sub line.
 */
const LABELS_ON_ONE_LINE_MIN = '389.98px';

/* ------------------------------- summary --------------------------------- */

// 1.5rem is the rhythm the old DataCardsContainer had, so the figures land
// where the cards used to. The loading shape carries the same margin, or the
// page shifts by 24px once the numbers arrive.
const pageSummarySpacing = css`
  margin-top: 1.5rem;
`;

/**
 * Holds every tile to the height of the tallest one (a label, a value row and
 * a sub line), the same 66,5px /blocks measured against /transactions. On the
 * loading shape too, or the card changes height when the figures land: the
 * shared loading tile stacks to 61px against the loaded 64,5, which moved the
 * whole page below it by 6px, measured here with stalled requests.
 */
const tileHeight = css`
  ${Tile} {
    min-height: 66.5px;
  }
`;

export const ContractsSummaryCard = styled(SummaryCard)`
  ${pageSummarySpacing}
  ${tileHeight}

  /* Auto-fit at every width, rather than the two fixed columns the shared grid
     drops to below 768. Those are 115px wide at a 320px viewport, where every
     label wraps and a tile runs to 109px against the 67 its loading shape
     reserves: the page jumped 60px when the figures landed. Measured. */
  ${TilesGrid} {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }

  /* A row that wraps by itself makes the card's height depend on contract
     names, which no loading shape can predict; it used to scroll sideways
     instead. The grid pins the rows, the loading shape sits on the same grid,
     and a name wider than its column ends in an ellipsis with the full text
     as its title. The minimum height covers a chain with fewer contracts. */
  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}) {
    ${LegendRow} {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      grid-auto-rows: ${LEGEND_LINE};
      min-height: calc(2 * ${LEGEND_LINE} + 8px);
    }

    ${LegendItem} {
      min-width: 0;

      strong {
        flex-shrink: 0;
      }
    }
  }

  @media screen and (max-width: ${LEGEND_THREE_COLUMNS_MIN}) {
    ${LegendRow} {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      min-height: calc(3 * ${LEGEND_LINE} + 16px);
    }
  }

  @media screen and (max-width: ${LABELS_ON_ONE_LINE_MIN}) {
    ${TilesGrid} {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    ${Tile} {
      min-height: 85px;
    }

    ${TileLabel} {
      display: block;
      /* Pinned, as on /blocks: two lines is only a fixed height once the
         ratio is. 9em makes "Contracts deployed" break where "Contract
         transactions" does, so the values under them stay level. */
      line-height: 1.4;
      min-height: 2.8em;
      max-width: 9em;
    }
  }
`;

/** A legend item's name, cut with an ellipsis where its grid column is narrower. */
export const LegendName = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

/**
 * The most used contract, as a tile.
 *
 * Gone below 600px, where only two tiles fit on a row and a third would take
 * one of its own. Nothing is lost there: the podium directly under the card
 * opens with the same contract and the same figure.
 */
export const MostUsedTile = styled(Tile)`
  @media screen and (max-width: ${THREE_TILES}) {
    display: none;
  }
`;

/**
 * The most-used tile's contract link. The shared reset draws a link as plain
 * text, so the tile's value needs its colour and its focus ring back.
 */
export const SummaryContractLink = styled(Link)`
  ${inCard('inline-block')}

  && {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    /* Off the baseline: an inline-block on it gets the parent's descender
       space added under it, which made this tile 33px where its neighbours
       hold 27,5 and grew the whole card by 4,5px. Measured. */
    vertical-align: bottom;
  }

  color: ${accentText};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
    text-underline-offset: 0.2rem;
  }

  ${focusRing}
`;

/* -------------------------------- cells ---------------------------------- */

/**
 * The contract's identity, at one width whether it is showing a name or an
 * address.
 *
 * Fixed on purpose. On desktop a cell with no `dynamicWidth` is
 * `width: fit-content` (Table/styles.ts), and the name arrives on a second
 * request about a second after the row is readable; without a pinned box the
 * column grew when it landed and dragged the five columns beside it sideways.
 *
 * 230px, measured against all 50 rows mainnet returns at `limit=50`: the
 * longest name there, "KleverBridgedTokensWrapper", asks 191px and a row
 * without one asks 143. It was 300, which made the table 1056px wide against
 * the 994 a 1026px viewport gives it, so the whole page scrolled sideways
 * between 1026 and 1070. Nothing was holding the difference: 32 characters,
 * the ceiling `safeContractName` imposes, need 380 to 420px depending on the
 * letters, so a name that long has always ended in an ellipsis here.
 */
export const ContractIdentity = styled(Link)`
  ${inCard('block')}

  && {
    min-width: 230px;
    max-width: 230px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 20px;
  }

  color: ${props => props.theme.black};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
    text-underline-offset: 0.2rem;
  }

  ${focusRing}
`;

/**
 * The deployer's address. Its own component rather than `ContractIdentity`:
 * that one is pinned to a fixed width to stop the contract column jumping
 * when a name lands, and borrowing it here widened this column from its
 * declared 210px to 358px, measured when that pin stood at 300.
 */
export const DeployerLink = styled(Link)`
  ${inCard('inline-flex')}

  && {
    align-items: center;
    min-width: 0;
  }

  color: ${props => props.theme.black};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
    text-underline-offset: 0.2rem;
  }

  ${focusRing}
`;

/**
 * The deployer cell: the address, with its contract count beside it. The count
 * is a link when it leads somewhere, and plain text at 1, where filtering
 * would land the reader on the row they are already looking at.
 */
export const DeployerCellRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
`;

export const DeployerCountLink = styled(Link)`
  ${inCard('inline-flex')}

  && {
    align-items: center;
    /* Holds on the mobile card; in desktop cells the page skin's 20px
       line rule outranks it. */
    height: 18px;
    padding: 0 6px;
    font-weight: 600;
  }

  border-radius: 4px;
  border: 1px solid ${props => props.theme.black10};
  font-size: 0.6875rem;
  font-variant-numeric: tabular-nums;
  color: ${props => props.theme.darkText};
  text-decoration: none;
  transition: border-color 150ms ease-out;

  &:hover {
    border-color: ${props => props.theme.violet};
    color: ${props => props.theme.violet};
    text-decoration: none;
  }

  ${focusRing}

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

/* --------------------------- active filter note -------------------------- */

/**
 * What the list is narrowed to, and the way out of it. Without this the
 * deployer link is a one-way door: nothing else on the page writes
 * `?deployer=`, so nothing else knows how to clear it.
 *
 * A tinted chip rather than a bare text line: as a line above the table it
 * read as body copy and was missed. Which of its two spots it fills is decided
 * in ContractsTableWrapper, from the direction the filter bar is running in.
 */
export const FilterNote = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  /* One line at the height of the page-size pills, so the chip sits level
     with the controls beside it instead of growing taller than them. */
  height: 40px;
  padding: 0 12px;
  white-space: nowrap;
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid ${props => accentText(props)};
  background-color: ${props => badgeTint(props, 'accent')};
  font-size: 0.8125rem;
  color: ${props => props.theme.black};

  strong {
    font-family: 'Fira Mono', monospace;
    font-weight: 400;
    color: ${props => props.theme.black};
  }

  /* Bottom edge level with the dropdown boxes, whose labels stand above them. */
  align-self: flex-end;

  /* Half the right padding on a phone: the cross that replaces the words
     there carries its own 24px target, so the full 12px reads as a gap. */
  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding-right: 6px;
  }
`;

export const FilterClear = styled(Link)`
  display: inline-flex;
  align-items: center;
  font-weight: 600;
  color: ${props => accentText(props)};
  text-decoration: none;
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
    text-underline-offset: 0.2rem;
  }

  ${focusRing}
`;

/** The words, on the screens with room for them. */
export const ClearLabel = styled.span`
  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: none;
  }
`;

/**
 * The same action as a cross on a phone, which takes the chip from 253px to
 * 214px there. 24px square rather than the glyph's own 14, so the target still
 * clears the WCAG minimum.
 */
export const ClearIcon = styled.span`
  display: none;

  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
  }
`;

/* --------------------------- scoped table skin --------------------------- */

/** `nth-child` is 1-based; the column indexes are not. */
const rightAligned = RIGHT_ALIGNED_COLUMNS.map(index => index + 1);

export const ContractsTableWrapper = styled.div`
  ${dataListTableSkin}
  ${compactFilterFloat}

  /* The active-filter chip is rendered twice and exactly one is visible: in
     the filter bar where that bar is a row, and beside the page-size controls
     below that, where the bar is a column and a chip at the end of it would
     take a line of its own. */
  ${FilterContainer} > [data-testid='deployer-filter-note'] {
    display: none;
  }

  /* The page-size pills and the refresh button, on one line at every width.
     They share the top row with the filter bar, which is wide enough to shrink
     them: between 1026 and 1090px that squeezed the refresh button onto a
     second line under the pills, measured. Nothing here needs to give way,
     the bar wraps its own chip instead. */
  ${TableControls} {
    flex-shrink: 0;
    flex-wrap: nowrap;
  }

  /* Fixed slots rather than the shared wrapping flex row, which broke per
     item: there was always a width where the chip and the pills still fit and
     the refresh button alone dropped under them. Chip left, the two controls
     packed right, one row. */
  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}) {
    ${TableControls} {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto auto;
      align-items: end;
      column-gap: 16px;
      row-gap: 4px;
    }

    ${TableControls} > [data-testid='deployer-filter-note'] {
      grid-column: 1;
      justify-self: start;
      /* The two controls beside it carry a 10px bottom margin at this width;
         without the same one the chip hangs 10px below them. */
      margin-bottom: 10px;
    }

    ${LimitContainer} {
      grid-column: 3;
    }

    ${ExportContainer} {
      grid-column: 4;
    }
  }

  /* Under 480px the three no longer fit on one line, so the chip takes the
     row above and the two controls stay together on the one below. */
  @media screen and (max-width: ${CONTROLS_ONE_ROW}) {
    ${TableControls} {
      grid-template-columns: minmax(0, 1fr) auto;
    }

    ${TableControls} > [data-testid='deployer-filter-note'] {
      grid-column: 1 / -1;
      margin-bottom: 0;
    }

    ${LimitContainer} {
      grid-column: 1;
      justify-self: end;
    }

    ${ExportContainer} {
      grid-column: 2;
    }
  }

  @media screen and (min-width: ${props => props.theme.breakpoints.tablet}) {
    ${FilterContainer} > [data-testid='deployer-filter-note'] {
      display: inline-flex;
    }

    ${TableControls} > [data-testid='deployer-filter-note'] {
      display: none;
    }
  }

  /* The shared Table's mobile loading rows stack a heading over a bar for
     every column: six pairs, 204px per card, against the 107 to 110px of the
     loaded mobile card. Loading rows are the only place ${'${TableRow}'} exists
     below tablet width on this page (the loaded rows are MobileListCards and
     the header row renders on desktop only), so this reshapes just them:
     no headings, two bars per row, and a bar height that lands the card at
     109px, the median of the loaded cards. */
  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}) {
    ${TableRow} ${MobileHeader} {
      display: none;
    }

    ${TableRow} ${MobileCardItem} {
      grid-column: span 1;
    }

    ${TableRow} [data-testid='skeleton'] {
      height: 23px !important;
    }
  }

  @media screen and (min-width: ${props => props.theme.breakpoints.tablet}) {
    /* One row height across every data-list table on the site. */
    ${MobileCardItem} {
      height: ${DATA_LIST_ROW_HEIGHT};
      /* The counts are the anonymous text of their cells, which the shared
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

/**
 * The contract's identity on the mobile card. A name is words and gets the
 * page font; an address is a hash and keeps the monospace that makes its
 * middle ellipsis line up. Same rule the transactions list follows.
 */
export const MobileContractLink = styled(AddressLink)<{ $isName: boolean }>`
  font-family: ${props =>
    props.$isName ? "'Manrope', sans-serif" : "'Fira Mono', monospace"};
`;
