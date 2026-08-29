import {
  accentText,
  AddressLink,
  DATA_LIST_ROW_HEIGHT,
  dataListTableSkin,
  focusRing,
  inCard,
  LegendItem,
  LegendRow,
  SummaryCard,
  Tile,
} from '@/components/DataList/styles';
import {
  HeaderItem,
  MobileCardItem,
  MobileHeader,
  TableRow,
} from '@/components/Table/styles';
import Link from 'next/link';
import styled, { css } from 'styled-components';
import { RIGHT_ALIGNED_COLUMNS } from './columns';

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

  /* One legend row on every width: below tablet it scrolls sideways instead
     of wrapping. Wrapping made its height depend on the length of contract
     names, which no loading shape can predict; measured, the card grew 17px
     under the reader when the legend landed three rows tall at 390px. */
  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}) {
    ${LegendRow} {
      flex-wrap: nowrap;
      overflow-x: auto;
    }

    ${LegendItem} {
      flex-shrink: 0;
    }
  }
`;

/** The one-line legend placeholder's row, sharing the legend's own metrics. */
export const PlaceholderLegendRow = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 8px;
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
 * 300px holds the 32 character ceiling `safeContractName` imposes.
 */
export const ContractIdentity = styled(Link)`
  ${inCard('inline-flex')}

  && {
    min-width: 300px;
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
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
 * that one is pinned at 300px to stop the contract column jumping when a name
 * lands, and borrowing it here widened this column from its declared 210px to
 * 358px, measured.
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

/** Digits of one width, so a column of them reads as a column. */
export const NumericCell = styled.span`
  font-variant-numeric: tabular-nums;
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
 */
export const FilterNote = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 0.8125rem;
  color: ${props => props.theme.darkText};

  strong {
    font-family: 'Fira Mono', monospace;
    font-weight: 400;
    color: ${props => props.theme.black};
  }
`;

export const FilterClear = styled(Link)`
  color: ${props => props.theme.violet};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
    text-underline-offset: 0.2rem;
  }

  ${focusRing}
`;

/* --------------------------- scoped table skin --------------------------- */

/** `nth-child` is 1-based; the column indexes are not. */
const rightAligned = RIGHT_ALIGNED_COLUMNS.map(index => index + 1);

export const ContractsTableWrapper = styled.div`
  ${dataListTableSkin}

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
