import {
  accentText,
  badgeColor,
  badgeTint,
  BadgePill,
  BadgeVariant,
  DATA_LIST_ROW_HEIGHT,
  dataListTableSkin,
  focusRing,
  inCard,
  SummaryCard,
} from '@/components/DataList/styles';
import SummaryLoading from '@/components/DataList/SummaryLoading';
import { MobileCardItem } from '@/components/Table/styles';
import Link from 'next/link';
import styled, { css } from 'styled-components';

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
 * carve-outs, and the link affordances. No overflow container on purpose:
 * a contained scroll was measured to clip the hover dropdowns on the bottom
 * rows, hide columns without any affordance, and silence the sticky header,
 * while wide data past its cap still pushed the page sideways. On desktop
 * widths the table does not always fit below roughly 1170px; there the page
 * scrolls horizontally like the app's other wide tables, and every popover,
 * key control and the sticky header keep working.
 */
export const TransactionsTableWrapper = styled.div`
  ${dataListTableSkin}

  @media screen and (min-width: ${props => props.theme.breakpoints.tablet}) {
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

    /* Set by TransactionTypeBadge on every badge sharing the hovered
       contract type. */
    ${BadgePill}.type-hover-match {
      outline: 1px dashed
        ${props => (props.theme.dark ? '#C95ED4' : props.theme.violet)};
      outline-offset: 1px;
    }
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

export const PageSummaryCard = styled(SummaryCard)`
  ${pageSummarySpacing}
`;

export const PageSummaryLoading = styled(SummaryLoading)`
  ${pageSummarySpacing}
`;

/**
 * The box a contract name is allowed to occupy.
 *
 * Whoever deploys a contract chooses its name, and the To cell clips rather
 * than ellipsises and grows to fit whatever it is given. Measured at a 1280px
 * viewport: a 200 character name widened the page to 3017px, and even a name
 * capped at 33 characters reached 1400px, so bounding the text alone does not
 * hold the layout. The cap here matches the column's own 150px, which is what
 * the truncated address it replaces was sized for.
 */
export const ContractName = styled.span`
  ${inCard('inline-block')}

  && {
    /* Same floor as ceiling: the name lands about a second after the row is
       readable, and a box that grows on arrival drags every column with it.
       Measured before this was fixed: all nine columns changed width when the
       names resolved, moving the row under the reader's pointer. */
    min-width: 150px;
    max-width: 150px;
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
export const CardRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  margin-top: 10px;

  /* Only phones keep the label-left value-right spread; from tablet width
     the card spans the page and space-between would put half a screen of
     gutter between a label and its value. */
  @media screen and (min-width: ${props => props.theme.breakpoints.mobile}) {
    justify-content: flex-start;
  }
`;

export const CardLabel = styled.span`
  flex-shrink: 0;
  font-size: 0.75rem;
  color: ${props => props.theme.darkText};
`;

export const CardValue = styled.span`
  display: flex;
  align-items: baseline;
  gap: 4px;
  min-width: 0;
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
