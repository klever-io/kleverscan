import {
  DATA_LIST_ROW_HEIGHT,
  dataListTableSkin,
  SummaryCard,
} from '@/components/DataList/styles';
import SummaryLoading from '@/components/DataList/SummaryLoading';
import { HeaderItem, MobileCardItem } from '@/components/Table/styles';
import styled, { css } from 'styled-components';

/* ------------------------------- summary --------------------------------- */

/**
 * The strip sits directly under the page title here, where the shared card was
 * built for pages that put it below a tab row and inherit their top spacing
 * from there. 1.5rem is the rhythm the old CardContainer had, so the figures
 * land where the card used to. The loading shape carries the same margin, or
 * the page would shift by 24px once the numbers arrive.
 */
const pageSummarySpacing = css`
  margin-top: 1.5rem;
`;

export const AccountsSummaryCard = styled(SummaryCard)`
  ${pageSummarySpacing}
`;

export const AccountsSummaryLoading = styled(SummaryLoading)`
  ${pageSummarySpacing}
`;

/**
 * The day-on-day change, as a count rather than a percentage.
 *
 * Deliberately not colored by direction. The series runs in single and double
 * digits (measured: 10, 9, 4, 82, 12, 8, 8 over a week), so a day that lands
 * one account lower is noise, and painting it red would read as a signal the
 * number cannot carry.
 */
export const TrendNote = styled.span`
  font-variant-numeric: tabular-nums;
`;

/* --------------------------- scoped table skin --------------------------- */

/**
 * The shared data-list skin plus what this table needs on top: the single-line
 * 60px row, and the three numeric columns right-aligned the way the assets
 * table aligns its own. The identity column stays left.
 */
export const AccountsTableWrapper = styled.div`
  ${dataListTableSkin}

  @media screen and (min-width: ${props => props.theme.breakpoints.tablet}) {
    /* One row height across every data-list table on the site. */
    ${MobileCardItem} {
      height: ${DATA_LIST_ROW_HEIGHT};
    }

    /* One 20px content line, centered by the cell's vertical-align inside the
       60px row; the shared rule would pin these to 24px. */
    ${MobileCardItem} a,
    ${MobileCardItem} span {
      height: 20px;
    }

    /* The skin drops the permanent underline, so a link needs a hover and
       focus affordance to stay distinguishable from the static text beside
       it. */
    ${MobileCardItem} a:hover,
    ${MobileCardItem} a:focus-visible {
      text-decoration: underline;
      text-underline-offset: 0.2rem;
    }

    ${MobileCardItem}:nth-child(2),
    ${MobileCardItem}:nth-child(3),
    ${MobileCardItem}:nth-child(4),
    ${HeaderItem}:nth-child(2),
    ${HeaderItem}:nth-child(3),
    ${HeaderItem}:nth-child(4) {
      text-align: right;
    }
  }
`;
