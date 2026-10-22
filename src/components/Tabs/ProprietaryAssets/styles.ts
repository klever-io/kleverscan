import { ROW_LAYOUT_MIN_WIDTH, belowWidth } from '@/components/DataList/layout';
import {
  DATA_LIST_ROW_HEIGHT,
  dataListCardBand,
  dataListRowPadding,
  dataListTableSkin,
} from '@/components/DataList/styles';
import {
  HeaderItem,
  MobileCardItem,
  TableBody,
  TableRow,
} from '@/components/Table/styles';
import styled, { css } from 'styled-components';

const BELOW_ROW = belowWidth(ROW_LAYOUT_MIN_WIDTH);

export const ProprietaryTableWrapper = styled.div<{
  $ownerActions?: boolean;
}>`
  ${dataListTableSkin}
  ${dataListCardBand(BELOW_ROW)}

  /* Same mismatch as the holdings table: eight span-2 bars (262px at 390)
     against seven span-1 cells (194px). The last cell is an empty View NFTs
     slot on a fungible row, height 0. */
  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}) {
    ${TableRow} ${MobileCardItem}:has([data-testid='skeleton']) {
      grid-column: span 1;
      min-width: 0;
    }

    ${TableRow} ${MobileCardItem}:nth-child(8):has([data-testid='skeleton']) {
      grid-column: span 2;
    }

    /* The owner actions cell is not on a public row. Hide its bar so the
       measured card height stays the eight-cell fungible card. */
    ${TableRow} ${MobileCardItem}:nth-child(9):has([data-testid='skeleton']) {
      display: none;
    }

    ${TableRow}
    ${MobileCardItem}:nth-child(8):has([data-testid='skeleton'])
      [data-testid='skeleton'] {
      height: 0 !important;
    }

    ${TableRow}
    ${MobileCardItem}:nth-child(1):has([data-testid='skeleton'])
      [data-testid='skeleton'],
    ${TableRow}
      ${MobileCardItem}:nth-child(2):has([data-testid='skeleton'])
      [data-testid='skeleton'] {
      height: 50px !important;
    }

    ${TableRow}
    ${MobileCardItem}:nth-child(3):has([data-testid='skeleton'])
      [data-testid='skeleton'],
    ${TableRow}
      ${MobileCardItem}:nth-child(4):has([data-testid='skeleton'])
      [data-testid='skeleton'],
    ${TableRow}
      ${MobileCardItem}:nth-child(5):has([data-testid='skeleton'])
      [data-testid='skeleton'],
    ${TableRow}
      ${MobileCardItem}:nth-child(6):has([data-testid='skeleton'])
      [data-testid='skeleton'] {
      height: 32px !important;
    }

    /* 30 rather than the loaded 32: 32 lands the card at 196 against 194. */
    ${TableRow}
    ${MobileCardItem}:nth-child(7):has([data-testid='skeleton'])
      [data-testid='skeleton'] {
      height: 30px !important;
    }
  }

  @media screen and (min-width: ${props =>
      props.theme.breakpoints.tablet}) and (max-width: ${BELOW_ROW}) {
    ${TableRow} {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    ${TableRow} ${MobileCardItem}:nth-child(8) {
      grid-column: span 2;
    }

    ${TableRow} ${MobileCardItem}:nth-child(8):has([data-testid='skeleton']) {
      height: 0;
    }

    ${TableRow} ${MobileCardItem}:nth-child(9):has([data-testid='skeleton']) {
      display: none;
    }

    ${TableRow}
    ${MobileCardItem}:nth-child(1):has([data-testid='skeleton'])
      [data-testid='skeleton'],
    ${TableRow}
      ${MobileCardItem}:nth-child(2):has([data-testid='skeleton'])
      [data-testid='skeleton'] {
      height: 56px !important;
    }

    ${TableRow}
    ${MobileCardItem}:nth-child(3):has([data-testid='skeleton'])
      [data-testid='skeleton'],
    ${TableRow}
      ${MobileCardItem}:nth-child(4):has([data-testid='skeleton'])
      [data-testid='skeleton'],
    ${TableRow}
      ${MobileCardItem}:nth-child(5):has([data-testid='skeleton'])
      [data-testid='skeleton'],
    ${TableRow}
      ${MobileCardItem}:nth-child(6):has([data-testid='skeleton'])
      [data-testid='skeleton'],
    ${TableRow}
      ${MobileCardItem}:nth-child(7):has([data-testid='skeleton'])
      [data-testid='skeleton'] {
      height: 40px !important;
    }

    ${TableRow}
    ${MobileCardItem}:nth-child(8):has([data-testid='skeleton'])
      [data-testid='skeleton'] {
      height: 0 !important;
    }
  }

  @media screen and (min-width: ${ROW_LAYOUT_MIN_WIDTH}px) {
    ${dataListRowPadding}

    ${TableBody} {
      table-layout: fixed;
      min-width: 0;
    }

    ${HeaderItem}:nth-child(1),
    ${MobileCardItem}:nth-child(1) {
      width: 13.53%;
    }

    ${HeaderItem}:nth-child(2),
    ${MobileCardItem}:nth-child(2) {
      width: 12.56%;
    }

    ${HeaderItem}:nth-child(3),
    ${MobileCardItem}:nth-child(3) {
      width: 12.73%;
    }

    ${HeaderItem}:nth-child(4),
    ${MobileCardItem}:nth-child(4) {
      width: 6.72%;
      white-space: nowrap;
    }

    ${HeaderItem}:nth-child(5),
    ${MobileCardItem}:nth-child(5) {
      width: 14.5%;
    }

    ${HeaderItem}:nth-child(6),
    ${MobileCardItem}:nth-child(6) {
      width: 14.56%;
    }

    ${HeaderItem}:nth-child(7),
    ${MobileCardItem}:nth-child(7) {
      width: 13.2%;
    }

    ${HeaderItem}:nth-child(8),
    ${MobileCardItem}:nth-child(8) {
      width: 12.2%;
    }

    /* Owner actions are a ninth cell. The eight measured shares keep their
       ratio and give 12.2 points to that cell, the same share the holdings
       actions column uses. A public row has no ninth cell, so it keeps the
       shares above. */
    ${({ $ownerActions }) =>
      $ownerActions &&
      css`
        ${HeaderItem}:nth-child(1),
        ${MobileCardItem}:nth-child(1) {
          width: 11.88%;
        }

        ${HeaderItem}:nth-child(2),
        ${MobileCardItem}:nth-child(2) {
          width: 11.03%;
        }

        ${HeaderItem}:nth-child(3),
        ${MobileCardItem}:nth-child(3) {
          width: 11.18%;
        }

        ${HeaderItem}:nth-child(4),
        ${MobileCardItem}:nth-child(4) {
          width: 5.9%;
        }

        ${HeaderItem}:nth-child(5),
        ${MobileCardItem}:nth-child(5) {
          width: 12.73%;
        }

        ${HeaderItem}:nth-child(6),
        ${MobileCardItem}:nth-child(6) {
          width: 12.78%;
        }

        ${HeaderItem}:nth-child(7),
        ${MobileCardItem}:nth-child(7) {
          width: 11.59%;
        }

        ${HeaderItem}:nth-child(8),
        ${MobileCardItem}:nth-child(8) {
          width: 10.71%;
        }

        ${HeaderItem}:nth-child(9),
        ${MobileCardItem}:nth-child(9) {
          width: 12.2%;
        }
      `}

    ${MobileCardItem} {
      height: ${DATA_LIST_ROW_HEIGHT};
    }

    ${HeaderItem}:nth-child(5),
    ${HeaderItem}:nth-child(6),
    ${MobileCardItem}:nth-child(5),
    ${MobileCardItem}:nth-child(6) {
      text-align: right;
    }

    ${MobileCardItem}:nth-child(5) span:not([data-testid='skeleton']),
    ${MobileCardItem}:nth-child(6) span:not([data-testid='skeleton']) {
      width: 100%;
      justify-content: flex-end;
      font-variant-numeric: tabular-nums;
    }
  }
`;
