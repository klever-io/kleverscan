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
import { IoMdArrowDropdown } from 'react-icons/io';
import styled from 'styled-components';

const BELOW_ROW = belowWidth(ROW_LAYOUT_MIN_WIDTH);

/* The account holdings table. Same skin as the transactions table: tinted
   header, 60px rows, and cards below the width where nine columns fit. */
export const AssetsTableWrapper = styled.div`
  ${dataListTableSkin}
  ${dataListCardBand(BELOW_ROW)}

  @media screen and (min-width: ${props =>
    props.theme.breakpoints.tablet}) and (max-width: ${BELOW_ROW}) {
    ${TableRow} {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media screen and (min-width: ${ROW_LAYOUT_MIN_WIDTH}px) {
    ${dataListRowPadding}

    /* The actions-button shares of the 1280px row. They also fit the
       View NFTs link, and the loading row uses the same shares. */
    ${TableBody} {
      table-layout: fixed;
      min-width: 0;
    }

    ${HeaderItem}:nth-child(1),
    ${MobileCardItem}:nth-child(1) {
      width: 9.53%;
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
      width: 12.87%;
    }

    ${HeaderItem}:nth-child(6),
    ${MobileCardItem}:nth-child(6) {
      width: 10.47%;
    }

    ${HeaderItem}:nth-child(7),
    ${MobileCardItem}:nth-child(7) {
      width: 10.38%;
    }

    ${HeaderItem}:nth-child(8),
    ${MobileCardItem}:nth-child(8) {
      width: 12.54%;
    }

    /* Wide enough for View NFTs and for the actions button. An empty last
       column used the same share, so the headings do not move when either
       control appears. */
    ${HeaderItem}:nth-child(9),
    ${MobileCardItem}:nth-child(9) {
      width: 12.2%;
    }

    ${HeaderItem}:nth-child(8),
    ${MobileCardItem}:nth-child(8) {
      padding-left: 40px;
    }

    ${MobileCardItem} {
      height: ${DATA_LIST_ROW_HEIGHT};
    }

    ${MobileCardItem} a,
    ${MobileCardItem} span {
      height: 20px;
    }

    ${MobileCardItem} a:hover,
    ${MobileCardItem} a:focus-visible {
      text-decoration: underline;
      text-underline-offset: 0.2rem;
    }

    /* Balance, Staking and Unfrozen. The shared assets flag grows the last
       cells; here every column keeps its own width. */
    ${HeaderItem}:nth-child(5),
    ${HeaderItem}:nth-child(6),
    ${HeaderItem}:nth-child(7),
    ${MobileCardItem}:nth-child(5),
    ${MobileCardItem}:nth-child(6),
    ${MobileCardItem}:nth-child(7) {
      text-align: right;
    }

    /* The loading bar is a span too. Leaving it out keeps the short bar,
       pushed to the same edge as the amount, instead of a full-cell stripe. */
    ${MobileCardItem}:nth-child(5) span:not([data-testid='skeleton']),
    ${MobileCardItem}:nth-child(6) span:not([data-testid='skeleton']),
    ${MobileCardItem}:nth-child(7) span:not([data-testid='skeleton']) {
      width: 100%;
      justify-content: flex-end;
      font-variant-numeric: tabular-nums;
    }

    ${MobileCardItem}:nth-last-child(1),
    ${MobileCardItem}:nth-last-child(2) {
      flex-grow: 0;
    }
  }
`;

export const ActionsDropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

export const ActionsDropdownButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${props => props.theme.violet};
  color: ${props => props.theme.true.white};
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    filter: brightness(1.2);
  }

  svg {
    transition: transform 0.2s ease;
  }
`;

export const DropdownIcon = styled(IoMdArrowDropdown)<{ $isOpen: boolean }>`
  transform: rotate(${props => (props.$isOpen ? '180deg' : '0deg')});
  transition: transform 0.2s ease;
`;

export const ActionsDropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 150px;
  background-color: ${props => props.theme.dropdown.background};
  border: 1px solid ${props => props.theme.card.border};
  border-radius: 0.5rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 10;
  display: ${props => (props.$isOpen ? 'block' : 'none')};
  overflow: hidden;
`;

export const DropdownItem = styled.div`
  width: 100%;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.white};
  }

  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.card.border};
  }

  button {
    width: 100%;
    padding: 0.25rem 0.5rem;
    border: none;
    border-radius: 0;
  }
`;
