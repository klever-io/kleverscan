import {
  DATA_LIST_ROW_HEIGHT,
  dataListTableSkin,
  inCard,
} from '@/components/DataList/styles';
import { HeaderItem, MobileCardItem } from '@/components/Table/styles';
import styled from 'styled-components';

/* ------------------------------ supply cells ----------------------------- */

export const SupplyCell = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;

  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}) {
    align-items: flex-start;
  }
`;

export const SupplyPrimary = styled.span`
  ${inCard('inline', 600)}
  font-size: 0.875rem;
  font-variant-numeric: tabular-nums;
  color: ${props => props.theme.black};
  white-space: nowrap;
`;

export const ShareValueLine = styled.div`
  display: flex;
  align-items: baseline;
  gap: 4px;
`;

export const CapContext = styled.span`
  ${inCard('inline')}
  font-size: 0.75rem;
  font-weight: 400;
  color: ${props => props.theme.darkText};
`;

/* ------------------------------ rewards cell ----------------------------- */

export const RewardsCell = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: baseline;
  gap: 4px;

  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}) {
    justify-content: flex-start;
  }
`;

export const RewardsRate = styled.span`
  ${inCard('inline', 600)}
  font-size: 0.8125rem;
  font-variant-numeric: tabular-nums;
  color: ${props => props.theme.black};
`;

export const RewardsUnit = styled.span`
  ${inCard('inline', 600)}
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${props => props.theme.darkText};
`;

export const RewardsMuted = styled.span`
  ${inCard('inline')}
  font-size: 0.75rem;
  color: ${props => props.theme.darkText};
  opacity: 0.75;
`;

/* ------------------------------ registry strip --------------------------- */

/** The composition bar and legend are desktop-and-tablet only; on phones the
    strip keeps just its tiles to protect above-the-fold space. */
export const StripBarArea = styled.div`
  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: none;
  }
`;

/* --------------------------- mobile card pieces -------------------------- */

export const MobileCapCaption = styled.span`
  ${inCard('inline-flex')}
  align-items: center;
  gap: 4px;
  margin-top: 4px;
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  color: ${props => props.theme.darkText};

  svg {
    flex-shrink: 0;
  }
`;

/* --------------------------- scoped table skin --------------------------- */

/**
 * The shared data-list skin plus the assets-specific column rules: numeric
 * columns right-aligned, and the Cap Used column gets its own gutter where
 * the right-aligned supply column would otherwise meet it at the border.
 */
export const AssetsTableWrapper = styled.div`
  ${dataListTableSkin}

  @media screen and (min-width: ${props => props.theme.breakpoints.tablet}) {
    /* One row height across the whole assets section. */
    ${MobileCardItem} {
      height: ${DATA_LIST_ROW_HEIGHT};
    }

    ${MobileCardItem}:nth-child(2),
    ${MobileCardItem}:nth-child(3),
    ${MobileCardItem}:nth-child(5),
    ${MobileCardItem}:nth-child(6),
    ${HeaderItem}:nth-child(2),
    ${HeaderItem}:nth-child(3),
    ${HeaderItem}:nth-child(5),
    ${HeaderItem}:nth-child(6) {
      text-align: right;
    }

    ${MobileCardItem}:nth-child(4),
    ${HeaderItem}:nth-child(4) {
      padding-left: 48px;
    }
  }
`;
