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
import styled from 'styled-components';

const BELOW_ROW = belowWidth(ROW_LAYOUT_MIN_WIDTH);

export const BucketsTableWrapper = styled.div`
  ${dataListTableSkin}
  ${dataListCardBand(BELOW_ROW)}

  /* The loaded card mixes span 1 and span 2. The shared skeleton spans every
     cell across both tracks, so the card was 291px against 239 at 390.
     Heights and spans are that loaded card. */
  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}) {
    ${TableRow} ${MobileCardItem}:has([data-testid='skeleton']) {
      grid-column: span 1;
      min-width: 0;
    }

    ${TableRow} ${MobileCardItem}:nth-child(5):has([data-testid='skeleton']),
    ${TableRow} ${MobileCardItem}:nth-child(8):has([data-testid='skeleton']),
    ${TableRow} ${MobileCardItem}:nth-child(9):has([data-testid='skeleton']) {
      grid-column: span 2;
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
      ${MobileCardItem}:nth-child(6):has([data-testid='skeleton'])
      [data-testid='skeleton'],
    ${TableRow}
      ${MobileCardItem}:nth-child(7):has([data-testid='skeleton'])
      [data-testid='skeleton'] {
      height: 32px !important;
    }

    ${TableRow}
    ${MobileCardItem}:nth-child(5):has([data-testid='skeleton'])
      [data-testid='skeleton'] {
      height: 42px !important;
    }

    /* Most rows carry a delegation link in this cell (32px). An empty one is 16. */
    ${TableRow}
    ${MobileCardItem}:nth-child(8):has([data-testid='skeleton'])
      [data-testid='skeleton'] {
      height: 32px !important;
    }

    /* 13 rather than the loaded 16: the same cells at 16 land the card 3px
       above the six delegation rows (255). */
    ${TableRow}
    ${MobileCardItem}:nth-child(9):has([data-testid='skeleton'])
      [data-testid='skeleton'] {
      height: 13px !important;
    }
  }

  @media screen and (min-width: ${props =>
      props.theme.breakpoints.tablet}) and (max-width: ${BELOW_ROW}) {
    ${TableRow} {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    ${TableRow} ${MobileCardItem}:nth-child(5),
    ${TableRow} ${MobileCardItem}:nth-child(8),
    ${TableRow} ${MobileCardItem}:nth-child(9) {
      grid-column: span 2;
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
      ${MobileCardItem}:nth-child(6):has([data-testid='skeleton'])
      [data-testid='skeleton'],
    ${TableRow}
      ${MobileCardItem}:nth-child(7):has([data-testid='skeleton'])
      [data-testid='skeleton'] {
      height: 40px !important;
    }

    ${TableRow}
    ${MobileCardItem}:nth-child(5):has([data-testid='skeleton'])
      [data-testid='skeleton'] {
      height: 48px !important;
    }

    /* Six of the seven rows put a delegation link here and the card is 294.
       An empty delegation is the 270px row. */
    ${TableRow}
    ${MobileCardItem}:nth-child(8):has([data-testid='skeleton'])
      [data-testid='skeleton'] {
      height: 40px !important;
    }

    ${TableRow}
    ${MobileCardItem}:nth-child(9):has([data-testid='skeleton'])
      [data-testid='skeleton'] {
      height: 16px !important;
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
      width: 13.25%;
    }
    ${HeaderItem}:nth-child(2),
    ${MobileCardItem}:nth-child(2) {
      width: 10.26%;
    }
    ${HeaderItem}:nth-child(3),
    ${MobileCardItem}:nth-child(3) {
      width: 6.13%;
    }
    ${HeaderItem}:nth-child(4),
    ${MobileCardItem}:nth-child(4) {
      width: 10.26%;
    }
    ${HeaderItem}:nth-child(5),
    ${MobileCardItem}:nth-child(5) {
      width: 20.53%;
    }
    ${HeaderItem}:nth-child(6),
    ${MobileCardItem}:nth-child(6) {
      width: 11.75%;
    }
    ${HeaderItem}:nth-child(7),
    ${MobileCardItem}:nth-child(7) {
      width: 11.26%;
    }
    ${HeaderItem}:nth-child(8),
    ${MobileCardItem}:nth-child(8) {
      width: 9.11%;
    }
    ${HeaderItem}:nth-child(9),
    ${MobileCardItem}:nth-child(9) {
      width: 7.45%;
    }

    ${MobileCardItem} {
      height: ${DATA_LIST_ROW_HEIGHT};
    }

    ${HeaderItem}:nth-child(2),
    ${HeaderItem}:nth-child(4),
    ${HeaderItem}:nth-child(6),
    ${HeaderItem}:nth-child(7),
    ${MobileCardItem}:nth-child(2),
    ${MobileCardItem}:nth-child(4),
    ${MobileCardItem}:nth-child(6),
    ${MobileCardItem}:nth-child(7) {
      text-align: right;
    }
  }
`;

export const Status = styled.span<{ staked: boolean }>`
  font-weight: 600;
  color: ${props =>
    props.theme.table[
      (props.staked ? 'green' : 'red') as keyof typeof props.theme.table
    ]} !important;
`;

export const ContractContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const ValidatorStatusBadge = styled.span<{ status: string }>`
  font-size: 0.7rem;
  font-weight: 600;
  padding: 1px 5px;
  border-radius: 4px;
  width: fit-content;

  ${props =>
    props.status === 'jailed' &&
    `
    color: ${props.theme.table.fail};
    background-color: ${props.theme.table.fail}22;
  `}

  ${props =>
    props.status === 'inactive' &&
    `
    color: ${props.theme.table.icon};
    background-color: ${props.theme.table.icon}22;
  `}
`;
