import {
  accentText,
  badgeColor,
  badgeTint,
  BadgePill,
  BadgeVariant,
  DATA_LIST_ROW_HEIGHT,
  dataListCardBand,
  dataListRowPadding,
  dataListTableSkin,
  focusRing,
  visuallyHiddenRules,
  inCard,
  MobileListCard,
  MobileTopRow,
  RowActions,
  SummaryCard,
  TilesGrid,
} from '@/components/DataList/styles';
import { belowWidth } from '@/components/DataList/layout';
import {
  FloatContainer,
  HeaderItem,
  MobileCardItem,
  MobileHeader,
  TableControls,
  TableRow,
} from '@/components/Table/styles';
import { FilterContainer } from '@/components/TransactionsFilters/styles';
import Link from 'next/link';
import styled, { css } from 'styled-components';

/**
 * The stop just under the mobile breakpoint. `max-width: 768px` and
 * `min-width: 768px` both match at exactly 768, which is an iPad in portrait,
 * and this card splits its layout across that pair: at 768 it drew the row
 * grid and the stacked card's right-aligned values at once, measured.
 */
const BELOW_ROW_LAYOUT = '767.98px';

interface IRowLayoutWidth {
  /** The viewport width from which this list's row fits, from
   *  `rowLayoutMinWidth`; it differs by one column between the variants. */
  $rowLayoutMin: number;
}

/** Same reason as BELOW_ROW_LAYOUT one breakpoint up: `max-width: N` and
 *  `min-width: N` both match at exactly N, and the row layout owns N. */
const belowRow = (props: IRowLayoutWidth): string =>
  belowWidth(props.$rowLayoutMin);

const fromRow = (props: IRowLayoutWidth): string => `${props.$rowLayoutMin}px`;

/**
 * The contract count inside the multi-contract badge. A `b`, not a span:
 * the shared cell rules pin every span to the line height, and the count
 * must only differ in weight.
 */
export const BadgeCount = styled.b`
  font-weight: 800;
`;

/**
 * The document mark behind a contract address in the To column, the
 * Basescan affordance: its focusable tooltip carries "Contract" plus the
 * invoked function, the data the dropped Misc column used to hold.
 */
export const ContractMark = styled.span`
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  color: ${props => props.theme.darkText};
  cursor: help;
`;

/**
 * The circled glyph between From and To: the row's status carrier. Green
 * arrow for success, red exclamation for fail, amber clock for pending: the
 * glyph varies with the color on purpose, so the state survives color
 * blindness, and the word rides in the shared tooltip and in visually
 * hidden text.
 */
export const DirectionStatusBadge = styled.span<{ $variant: BadgeVariant }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  color: ${props => badgeColor(props, props.$variant)};
  border: 1px solid ${props => badgeColor(props, props.$variant)};
  background-color: ${props => badgeTint(props, props.$variant)};

  svg {
    flex-shrink: 0;
  }
`;

/**
 * The shared data-list skin plus what the single-line transactions table
 * needs on top of it: the 60px row with one 20px content line, the badge
 * carve-outs, the link affordances, and the two layouts either side of
 * ROW_LAYOUT_MIN_WIDTH.
 *
 * No overflow container on purpose: a contained scroll was measured to clip
 * the hover dropdowns on the bottom rows, hide columns without any
 * affordance, and silence the sticky header. The row is not made to fit a
 * narrow viewport either; it is simply not used on one, which is what keeps
 * the page from scrolling sideways at any width.
 */
export const CardHashLink = styled(Link)`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.875rem;
  color: ${props => props.theme.black};

  &:focus-visible {
    outline: 2px solid ${props => props.theme.violet};
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

/** The header badges as one unit: the type badge and its status (and the
 *  in/out badge on account lists) either share the hash's line or drop
 *  together, never one without the other. */
export const HeaderBadges = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

/** The age beside the card's action buttons, as one corner group. */
export const HeaderMeta = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;

  ${RowActions} {
    margin-left: 0;
  }
`;

export const CardTime = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.darkText};
  white-space: nowrap;
`;

export const TransactionsTableWrapper = styled.div<IRowLayoutWidth>`
  ${dataListTableSkin}

  /* ---------------------------- the card band ----------------------------- */

  /* The shared Table's mobile loading rows keep a heading over a bar for every
     column, which made the loading row 398px wide inside a 358px screen at
     390px (24px of page overflow) and the card far taller than a loaded one.
     Loading rows are the only place TableRow exists in this band: loaded rows
     are MobileListCards and the header renders on the row layout only. */
  @media screen and (max-width: ${belowRow}) {
    /* minmax(0, 1fr), not the shared repeat(2, 1fr): an auto minimum lets a
       wide cell push the track, and the loading row came out 398px inside a
       358px screen at 390. */
    ${TableRow} {
      min-width: 0;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    ${TableRow} ${MobileHeader} {
      display: none;
    }

    ${TableRow} ${MobileCardItem} {
      grid-column: span 1;
      min-width: 0;
    }

    ${TableRow} [data-testid='skeleton'] {
      height: 21px !important;
    }
  }

  ${dataListCardBand(belowRow)}

  /* The age and the two buttons live in one group in the card's top-right
     corner, the same spot on every card at every width. In flow they wrapped
     per card: a wide type badge pushed just the buttons onto a second line
     hard left while the time stayed up right, so two neighbouring cards put
     them in different places. Out of flow, the badges are the element that
     wraps when the header is tight, and the top row reserves the group's
     widest width per band so nothing slides under it: below the mobile width
     the exact date is hidden and the group is the short age plus 76px of
     buttons; above it the date adds ~140px. */
  ${MobileListCard} {
    position: relative;
  }

  /* rem, not px: the corner's occupants are text-sized, so a text-only scale
     (root font bumped, viewport unchanged) grew the group past a px reserve
     and into the badges (measured 179px against 160 at 2x). Zoom was already
     fine, it re-engages the media bands. 18.5rem is the measured 296px. */
  ${MobileListCard} ${MobileTopRow} {
    padding-right: 18.5rem;
  }

  ${MobileListCard} ${CardHashLink} {
    flex-shrink: 1;
    min-width: 56px;
  }

  /* One shape per width, not per card: below this every card puts its badge
     group on a second line, above it every card holds one line, so no width
     mixes the two shapes the way content-driven wrapping did. The cut is the
     floor at which the widest header still fits with the hash shrunk to its
     56px minimum (smart contract badge, status, the account lists' in/out
     badge, the reserved corner: 556px of viewport, measured); above it only
     the hash gives, into its ellipsis. */
  @media screen and (max-width: 559.98px) {
    ${MobileListCard} ${MobileTopRow} {
      flex-wrap: wrap;
    }

    ${MobileListCard} ${HeaderBadges} {
      flex-basis: 100%;
    }
  }

  ${MobileListCard} ${HeaderMeta} {
    position: absolute;
    top: 8px;
    right: 14px;
    height: 2rem;
  }

  @media screen and (max-width: ${BELOW_ROW_LAYOUT}) {
    ${MobileListCard} ${MobileTopRow} {
      /* The measured 160px: the exact date is hidden here. */
      padding-right: 10rem;
    }
  }

  /* --------------------- filter bar and page-size controls ----------------- */

  /* Four filters need 878px and the page-size controls 265, which with the
     16px gap between them fit side by side from a 1191px viewport up. Below
     that the shared bar wraps them into each other; here they part instead,
     the filters as a 2x2 block on a full-width row and the controls on their
     own row underneath.

     The controls keep one line at every width: 161px of pager plus the 88px
     of refresh and export is 265, which fits inside the 288px content box a
     320px screen leaves. nowrap says so rather than leaving it to luck. */
  @media screen and (max-width: ${belowRow}) {
    ${FloatContainer} {
      flex-direction: column;
      align-items: stretch;
    }

    ${FilterContainer} {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    /* Each control fills its half rather than sitting at 13rem inside it: the
       shared Filter caps itself at fit-content from the tablet width up, which
       left a "Coin" dropdown 208px wide against a 578px column. */
    ${FilterContainer} > div {
      width: 100%;
      max-width: none;
      min-width: 0;
    }

    ${TableControls} {
      flex-wrap: nowrap;
      justify-content: flex-end;
      margin-left: auto;
    }
  }

  /* Two 13rem controls plus their gap need roughly 480px; below that the 2x2
     becomes a stack. */
  @media screen and (max-width: 480px) {
    ${FilterContainer} {
      grid-template-columns: 1fr;
    }
  }

  /* Selecting Contract = Buy adds a fifth filter, and five of them are 1098px
     against a 1280px content box, so they can never share a row with the
     controls whatever the viewport. Read off the DOM rather than passed as a
     prop: the bar decides for itself how many filters it renders. */
  @media screen and (min-width: ${fromRow}) {
    ${FloatContainer}:has(${FilterContainer} > div:nth-child(5)) {
      flex-direction: column;
      align-items: stretch;
    }

    ${FloatContainer}:has(${FilterContainer} > div:nth-child(5))
      ${FilterContainer} {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    ${FloatContainer}:has(${FilterContainer} > div:nth-child(5))
      ${FilterContainer}
      > div {
      width: 100%;
      max-width: none;
      min-width: 0;
    }

    ${FloatContainer}:has(${FilterContainer} > div:nth-child(5))
      ${TableControls} {
      justify-content: flex-end;
    }
  }

  /* ----------------------------- the row band ------------------------------ */

  @media screen and (min-width: ${fromRow}) {
    /* The 72px this frees against the skin's own spacing is what lets a
       nine-column row fit a 1280px laptop instead of asking for 1360. */
    ${dataListRowPadding}

    ${MobileCardItem} {
      height: ${DATA_LIST_ROW_HEIGHT};
      /* Inherited by the anonymous text of the amount sections, which the
         shared a/span rule cannot reach; under width pressure that text
         wrapped mid-amount ("20 K" over two lines). */
      white-space: nowrap;
    }

    /* One 20px content line, centered by the cell's vertical-align inside
       the 60px row; the shared rule would pin these to 24px. */
    ${MobileCardItem} a,
    ${MobileCardItem} span {
      height: 20px;
    }

    /* More specific than the 20px line above, so badges keep the intrinsic
       height they have everywhere else in the data-list system. A minimum
       rather than a fixed height: at 200 percent browser text size the
       0.625rem badge text outgrows 18px, and a fixed pill strikes through
       its own label (WCAG 1.4.4); the 60px row has the vertical room. */
    ${MobileCardItem} ${BadgePill},
    ${MobileCardItem} ${DirectionStatusBadge} {
      height: auto;
      min-height: 18px;
    }

    /* The skin removes the permanent underline; without a hover or focus
       replacement a link is indistinguishable from the static text next to
       it (the block number sits directly above the fee in the same style). */
    ${MobileCardItem} a:hover,
    ${MobileCardItem} a:focus-visible {
      text-decoration: underline;
      text-underline-offset: 0.2rem;
    }
  }

  /* Outside the row band on purpose: the hover handler sits on the badge,
     which the mobile card renders too, so scoping the paint to the row left
     every width below it sweeping the whole table body on each pointer move
     and painting nothing. */
  ${BadgePill}.type-hover-match {
    outline: 1px dashed
      ${props => (props.theme.dark ? '#C95ED4' : props.theme.violet)};
    outline-offset: 1px;
  }
`;

/* ------------------------------- summary --------------------------------- */

/**
 * Both directions read as small text (13px), so both need 4.5:1. The badge
 * palette's success is the darker derived green; the raw successColor is
 * calibrated for icons at 3:1 and measures 3.54:1 here.
 */
export const TrendValue = styled.span<{ $positive: boolean }>`
  font-size: 0.8125rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: ${props => badgeColor(props, props.$positive ? 'success' : 'danger')};
`;

/**
 * Here the summary is the first thing under the page title, where the shared
 * card sits below a tab row on the pages it was built for and inherits its
 * top spacing from there. 1.5rem is the shared CardContainer's rhythm, so it
 * matches what the other list pages put under their title. The loading shape
 * carries the same margin, or the page would drop 24px once the figures land.
 */
const pageSummarySpacing = css`
  margin-top: 1.5rem;
`;

/* Three tiles side by side for as long as the widest holds its label unbroken:
   115px measured, so three of them plus the gaps need a 377px grid and the
   451px screen that carries one. Below that the third is dropped rather than
   wrapped onto a row of its own; it is the leading-asset tile, the one figure
   here a reader can do without. Both rules sit on the loading shape too, or
   the card re-flows once the figures land. */
const threeTilesThenTwo = css`
  @media screen and (max-width: ${BELOW_ROW_LAYOUT}) {
    ${TilesGrid} {
      grid-template-columns: repeat(auto-fit, minmax(115px, 1fr));
    }
  }

  @media screen and (max-width: 450px) {
    ${TilesGrid} > *:nth-child(3) {
      display: none;
    }
  }
`;

export const PageSummaryCard = styled(SummaryCard)`
  ${pageSummarySpacing}
  ${threeTilesThenTwo}
`;

/**
 * The box a contract name is allowed to occupy.
 *
 * Whoever deploys a contract chooses its name, and the To cell clips rather
 * than ellipsises and grows to fit whatever it is given. Measured at a 1280px
 * viewport: a 200 character name widened the page to 3017px, and even a name
 * capped at 33 characters reached 1400px, so bounding the text alone does not
 * hold the layout.
 *
 * 160px because that is what the box actually holds: a 16-character truncated
 * bech32 address renders at 160px, and the 150 this used to carry cut its last
 * character off in seven of ten rows, at every width from 1100 to 1920.
 */
export const ContractName = styled.span`
  ${inCard('inline-block')}

  && {
    /* Same floor as ceiling: the name lands about a second after the row is
       readable, and a box that grows on arrival drags every column with it.
       Measured before this was fixed: all nine columns changed width when the
       names resolved, moving the row under the reader's pointer. */
    min-width: 160px;
    max-width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
  }
`;

/** The asset link, which the global reset would otherwise render as text. */
export const SummaryAssetLink = styled(Link)`
  color: ${accentText};
  ${focusRing}

  &:hover {
    text-decoration: underline;
    text-underline-offset: 0.2rem;
  }
`;

/* --------------------------- mobile card pieces -------------------------- */

/* 10px rather than a tighter rhythm: From, To and Block are three adjacent
   links, and sub-24px targets need 24px center-to-center spacing (WCAG
   2.5.8) to keep a thumb off the neighbouring address. */
/**
 * The card's facts, on one line for as long as they fit.
 *
 * Measured on a Transfer row: the five fields need 791px together and a card
 * has that from 851px screen width up, so they wrap to a second line below
 * that and to a stacked list on phones. Six fields never fit; the timestamp
 * moved to the header row, which is what bought the single line.
 */
export const CardFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;

  /* Fixed lanes, not auto-fit tracks: auto-fit collapses the lanes a shorter
     card leaves empty, which resizes the rest and lands the same field at a
     different x on every card. Reading ten rows down a page, they have to line
     up. The second lane is the status glyph's own, between the two addresses,
     the way the desktop row carries it. */
  @media screen and (min-width: ${props => props.theme.breakpoints.mobile}) {
    display: grid;
    grid-template-columns:
      minmax(0, 1fr) auto minmax(0, 1fr)
      minmax(0, 1fr) minmax(0, 1fr);
    align-items: baseline;
    column-gap: 16px;
    row-gap: 8px;

    /* Wrapped fields skip the glyph lane, which measures 18px and would squash
       them. A card carries at most seven items here: three base fields, the
       glyph, and the three of the widest contract label set (Delegate),
       measured, so the second row is the last one that can fill. */
    > *:nth-child(6) {
      grid-column: 1;
    }
    > *:nth-child(7) {
      grid-column: 3;
    }
    > *:nth-child(8) {
      grid-column: 4;
    }
    > *:nth-child(9) {
      grid-column: 5;
    }
  }
`;

/** The glyph's own lane, between the two addresses. Only where the fields are
 *  a row: stacked on a phone it became a line holding one icon, with the
 *  receiver below it carrying no label at all. */
export const CardStatusCell = styled.div`
  display: none;

  @media screen and (min-width: ${props => props.theme.breakpoints.mobile}) {
    display: flex;
    align-items: center;
  }
`;

/** The status as a pill beside the type badge, for exactly the widths where
 *  that lane is hidden. */
export const HeaderStatusPill = styled.span`
  display: inline-flex;
  align-items: center;

  @media screen and (min-width: ${props => props.theme.breakpoints.mobile}) {
    display: none;
  }
`;

export const CardRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  min-width: 0;

  /* Phones keep the label-left value-right spread. In the lane grid the label
     goes above its value instead: side by side inside one lane, a label and an
     address want 236px (100 for "Contract Address", 128 for the address, 8 of
     gap) where a lane is 214px at a 1000px viewport and 189 at 900, and it was
     the address that gave. Measured before this changed: five values clipped
     at 1000, six at 900, thirty at 820. Stacked, the address has the whole
     lane and clips at none of them. */
  @media screen and (min-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }
`;

/** The date beside the elapsed time costs 130px, which the phone header does
 *  not have; the full moment stays in the title attribute. */
export const TimeExact = styled.span`
  @media screen and (max-width: ${BELOW_ROW_LAYOUT}) {
    display: none;
  }
`;

export const CardLabel = styled.span`
  flex-shrink: 0;
  font-size: 0.75rem;
  color: ${props => props.theme.darkText};
`;

/** "To" as a word on a phone, where nothing else names the receiver, and as
 *  hidden text from the width where the glyph lane takes over. */
export const ToLabel = styled(CardLabel)`
  @media screen and (min-width: ${props => props.theme.breakpoints.mobile}) {
    ${visuallyHiddenRules}
  }
`;

export const CardValue = styled.span`
  display: flex;
  align-items: baseline;
  gap: 4px;
  min-width: 0;

  /* A label whose field has nothing to show reads as a rendering fault, so it
     gets the same two dashes the receiver already uses. The value arrives as
     an empty span from the contract's own section builder, which is the only
     hook there is: the card is handed a React element, not a string. */
  > span:empty:only-child::after {
    content: '--';
  }

  /* The stacked layout puts every value against the right edge. Without this
     a short value ("Bitcoin.me") sat at the left of its box while a full
     address filled it, so the two read as misaligned. */
  @media screen and (max-width: ${BELOW_ROW_LAYOUT}) {
    justify-content: flex-end;
    text-align: right;
  }
  font-size: 0.8125rem;
  color: ${props => props.theme.black};

  /* Truncation lives on the children: text-overflow only acts on inline
     content of a block container, and this container's children are flex
     items, so the trio on the container itself would clip without the
     ellipsis. */
  > * {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  a {
    color: ${props => props.theme.black};
    /* Persistent, not hover-only: a touch screen has no hover, and these
       values sit next to non-link values in the same color. */
    text-decoration: underline;
    text-underline-offset: 0.2rem;
  }
`;
