import {
  DATA_LIST_ROW_HEIGHT,
  dataListTableSkin,
  inCard,
} from '@/components/DataList/styles';
import { HeaderItem, MobileCardItem } from '@/components/Table/styles';
import styled from 'styled-components';

export const RateCell = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;

  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}) {
    align-items: flex-start;
  }
`;

export const RateValue = styled.span`
  ${inCard('inline', 600)}
  font-size: 0.875rem;
  font-variant-numeric: tabular-nums;
  color: ${props => props.theme.black};
  white-space: nowrap;
`;

export const RateUnit = styled.span`
  ${inCard('inline')}
  font-size: 0.75rem;
  color: ${props => props.theme.darkText};
  white-space: nowrap;
`;

/** On a card the rate is the headline, and it needs to wrap inside 390px. */
export const MobileRateCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  min-width: 0;
`;

export const MobileRateValue = styled.span`
  ${inCard('inline')}
  font-size: 1rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: ${props => props.theme.black};
  text-align: right;
`;

export const OwnerCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  min-width: 0;
`;

export const OwnerRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;

  /* The shared cell gives every link and span a 24px box, which makes an
     owner-plus-admin cell outgrow the table's row height. These two lines get
     a tighter box so a second address still fits. */
  && a,
  && span {
    height: 20px;
  }
`;

export const AdminLabel = styled.span`
  ${inCard('inline')}
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${props => props.theme.darkText};
  opacity: 0.75;
`;

/** The owner is the primary account, so the admin line steps back to the
    size of its own label. */
export const AdminRow = styled(OwnerRow)`
  && a,
  && span {
    font-size: 0.6875rem;
    height: 16px;
  }
`;

/**
 * The shared data-list skin plus the pools-specific column rules: the three
 * numeric columns right-align, and the owner column keeps its own gutter
 * where the right-aligned KDA reserve would otherwise meet it at the border.
 */
export const PoolsTableWrapper = styled.div`
  ${dataListTableSkin}

  @media screen and (min-width: ${props => props.theme.breakpoints.tablet}) {
    /* One row height across the whole assets section. */
    ${MobileCardItem} {
      height: ${DATA_LIST_ROW_HEIGHT};
    }

    ${MobileCardItem}:nth-child(2),
    ${MobileCardItem}:nth-child(3),
    ${MobileCardItem}:nth-child(4),
    ${HeaderItem}:nth-child(2),
    ${HeaderItem}:nth-child(3),
    ${HeaderItem}:nth-child(4) {
      text-align: right;
    }

    ${MobileCardItem}:nth-child(5),
    ${HeaderItem}:nth-child(5) {
      padding-left: 48px;
    }
  }
`;
