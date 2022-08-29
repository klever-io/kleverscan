import { transparentize } from 'polished';
import styled, { css } from 'styled-components';
import { IFilterItem } from '../Filter';
import filterWidths from './filters';
import widths from './widths';

interface IStatus {
  status: string;
}

export interface ITableType {
  type:
    | 'transactions'
    | 'blocks'
    | 'accounts'
    | 'assets'
    | 'transactionDetail'
    | 'buckets'
    | 'accounts'
    | 'assetsPage'
    | 'holders'
    | 'validators'
    | 'validator'
    | 'nodes'
    | 'networkParams'
    | 'proposals'
    | 'votes'
    | 'delegations'
    | 'nfts';
  haveData?: number;
  filter?: IFilterItem;
  pathname?: string;
  rowSections?: boolean;
}

export const ContainerView = styled.div`
  overflow-x: auto;
  width: 100%;
`;

export const Container = styled.div`
  min-width: fit-content;
`;

export const Header = styled.div<ITableType>`
  display: ${props => (props.haveData ? 'flex' : 'none')};
  padding: 1rem 1.5rem;

  min-width: 100%;

  color: ${props => props.theme.table.text};
  font-weight: 600;
  font-size: 0.85rem;

  span {
    ${props => widths[props.type]}
    ${props =>
      props.filter &&
      props.filter.value !== 'all' &&
      filterWidths[props.filter.name]}
  }
`;

export const Body = styled.div<ITableType>`
  display: flex;
  width: 100%;

  min-width: fit-content;

  flex-direction: column;
  gap: 0.75rem;

  @media (max-width: 1300px) {
    width: ${props => (props.haveData ? 'fit-content' : 'initial')};
  }

  @media (max-width: 768px) {
    min-width: 100%;
  }
`;

export const Row = styled.div<ITableType>`
  padding: 1rem 1.5rem;

  display: flex;

  flex-direction: row;
  align-items: center;

  background-color: ${props => props.theme.white};

  border-radius: 0.5rem;

  width: 100%;

  > span,
  > a {
    @media screen and (min-width: 769px) {
      ${props => props.rowSections && widths[props.type]};
    }
  }
  span,
  a {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    font-size: 0.95rem;
    color: ${props => props.theme.black};

    ${props => !props.rowSections && widths[props.type]};

    ${props =>
      props.filter &&
      props.filter.value !== 'all' &&
      filterWidths[props.filter.name]}

    a {
      color: ${props => props.theme.black};
      font-weight: 600;
    }

    small {
      color: ${props => props.theme.table.text};
    }

    strong {
      font-weight: 400;
      font-size: 0.95rem;
      color: ${props => props.theme.table.text};
    }

    p {
      font-weight: 600;
      color: ${props => props.theme.black};
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .isVerified {
      position: absolute;
      left: 13rem;

      @media (max-width: 1600px) {
        left: 8rem;
      }

      @media (max-width: 768px) {
        left: 4rem;
      }
    }
  }
  .address {
    cursor: pointer;
    text-decoration: none;
    font-weight: 500;
    &:hover {
      text-decoration: underline;
    }
  }
  ${props =>
    props.rowSections &&
    css`
      span,
      a {
        span,
        p,
        strong,
        small {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      @media screen and (max-width: 768px) {
        width: 100%;

        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
        grid-gap: 0.75rem;

        span,
        a {
          span,
          p,
          strong,
          small {
            width: 100%;
            grid-column: span 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: ${props => props.theme.black};
          }
        }
        .address {
          width: 100% !important;
        }
      }
    `}
`;

export const MobileCardItem = styled.span<{ columnSpan?: number }>`
  display: flex;
  flex-direction: column;

  @media screen and (max-width: 768px) {
    ${props =>
      !props.columnSpan || props.columnSpan >= 0
        ? css`
            grid-column: span ${props.columnSpan};
          `
        : css`
            display: none;
          `}
  }
`;

export const MobileHeader = styled.div`
  color: ${props => props.theme.table.text};
  font-weight: 600;
  font-size: 0.8rem;
`;

export const Status = styled.div<IStatus>`
  display: flex;

  flex-direction: row;

  align-items: center;

  gap: 0.9rem;

  svg {
    min-width: fit-content;
  }

  span {
    color: ${props =>
      props.status === 'ApprovedProposal'
        ? props.theme.table['success']
        : props.theme.table[props.status]} !important;
    font-weight: bold;
  }

  p {
    color: ${props => props.theme.table[props.status]} !important;
    text-transform: capitalize;
  }

  ${props =>
    props.status === 'inactive' &&
    `
      color: ${props.theme.table.icon} !important;
      
    `}
  svg {
    path {
      fill: ${props => props.theme.white};
    }
  }
`;

export const EmptyRow = styled(Row)`
  width: 100% !important;

  justify-content: center;
  align-items: center;

  p {
    font-weight: 400;
    color: ${props => transparentize(0.5, props.theme.table.text)};
  }
`;
