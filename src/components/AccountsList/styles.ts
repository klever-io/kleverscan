import {
  compactFilterRow,
  DATA_LIST_ROW_HEIGHT,
  dataListTableSkin,
  MobileTopRow,
  SummaryCard,
  TilesGrid,
} from '@/components/DataList/styles';
import SummaryLoading from '@/components/DataList/SummaryLoading';
import { HeaderItem, MobileCardItem } from '@/components/Table/styles';
import styled, { css } from 'styled-components';

/* ------------------------------- summary --------------------------------- */

// 1.5rem is the rhythm the old CardContainer had, so the figures land where
// the card used to. The loading shape carries the same margin, or the page
// would shift by 24px once the numbers arrive.
const pageSummarySpacing = css`
  margin-top: 1.5rem;
`;

/* Three tiles on one row for as long as they hold their labels unbroken,
   rather than the shared two-column split that leaves the third alone on a
   second row. 75px is the widest of the three at max-content once the total
   drops its "Total" below this width, measured; the grid falls back to two
   columns on its own where three no longer fit. The loading shape carries the
   same rule, or the card re-flows from two columns to three once the figures
   land. */
const threeTilesOnOneRow = css`
  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}) {
    ${TilesGrid} {
      grid-template-columns: repeat(auto-fit, minmax(75px, 1fr));
    }
  }
`;

export const AccountsSummaryCard = styled(SummaryCard)`
  ${pageSummarySpacing}
  ${threeTilesOnOneRow}
`;

/* The total tile drops its "Total" only where the full wording no longer fits
   the third of the row it gets: it is 92px unbroken, so it needs a 308px grid
   and the 382px screen that carries one. Below that it took two lines while
   the other two labels took one. */
const TOTAL_LABEL_FITS = '382px';

export const LabelFull = styled.span`
  display: none;

  @media screen and (min-width: ${TOTAL_LABEL_FITS}) {
    display: inline;
  }
`;

export const LabelShort = styled.span`
  @media screen and (min-width: ${TOTAL_LABEL_FITS}) {
    display: none;
  }
`;

export const AccountsSummaryLoading = styled(SummaryLoading)`
  ${pageSummarySpacing}
  ${threeTilesOnOneRow}
`;

// Deliberately not colored by direction: the series runs in single and double
// digits (measured: 10, 9, 4, 82, 12, 8, 8 over a week), so one account lower
// is noise and red would read as a signal the number cannot carry.
export const TrendNote = styled.span`
  font-variant-numeric: tabular-nums;
`;

/* --------------------------- scoped table skin --------------------------- */

// The shared skin plus this table's needs: the single-line 60px row, and the
// three numeric columns right-aligned the way the assets table aligns its own.
export const AccountsTableWrapper = styled.div`
  ${dataListTableSkin}
  ${compactFilterRow}

  /* The card's top row is nowrap and needs 326.2px (169.1 address, 73.1 badge,
     68 actions, two 8px gaps) inside the viewport minus 62, which TableBody's
     min-width: fit-content publishes to the page: 12px of sideways scroll at
     360 and 52 at 320, measured. Break-even is 388.2px, so a threshold of 374
     left the badged rows 13.2px wider than the card above them at 375, which
     is an iPhone SE and a 12 mini and does not show up in an overflow sweep.
     Half the rows on page one carry the badge; those are the ones that need
     this. */
  @media screen and (max-width: 388px) {
    ${MobileTopRow} {
      flex-wrap: wrap;
    }
  }

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

    /* The skin drops the permanent underline, so a link needs hover and focus
       affordances to stay distinguishable from static text. */
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
