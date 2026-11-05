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
import { MdKeyboardArrowDown } from 'react-icons/md';
import styled from 'styled-components';

const BELOW_ROW = belowWidth(ROW_LAYOUT_MIN_WIDTH);

export const RewardsTableWrapper = styled.div`
  ${dataListTableSkin}
  ${dataListCardBand(BELOW_ROW)}

  /* Two span-2 bars stacked to 88px. A one-line reward card is two span-1
     cells and 84px (the example account: four of five). The three-line card
     grows past that, the same way the desktop row grows past 60px. */
  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}) {
    ${TableRow} ${MobileCardItem}:has([data-testid='skeleton']) {
      grid-column: span 1;
      min-width: 0;
    }

    ${TableRow} [data-testid='skeleton'] {
      height: 50px !important;
    }
  }

  @media screen and (min-width: ${props =>
      props.theme.breakpoints.tablet}) and (max-width: ${BELOW_ROW}) {
    ${TableRow} {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    /* A one-line card at this width is 90px. Four of the five rows on the
       example account are that; the three-line row grows past it. */
    ${TableRow} [data-testid='skeleton'] {
      height: 56px !important;
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
      width: 36%;
    }

    ${HeaderItem}:nth-child(2),
    ${MobileCardItem}:nth-child(2) {
      width: 64%;
    }

    /* Table cells ignore min-height. Height is the minimum, so one reward
       line stays on the 60px row and extra lines grow the row. */
    ${MobileCardItem} {
      height: ${DATA_LIST_ROW_HEIGHT};
    }
  }
`;

export const RewardLines = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  min-width: 0;
`;

export const RewardLine = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
`;

export const ExpandButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  width: fit-content;
  margin-top: 4px;
  padding: 0;
  border: 0;
  background: none;
  color: ${props => props.theme.violet};
  font: inherit;
  cursor: pointer;
`;

export const ArrowExpand = styled(MdKeyboardArrowDown)<{ $open: boolean }>`
  width: 18px;
  height: 18px;
  transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'none')};
`;
