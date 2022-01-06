import styled from 'styled-components';

import { transparentize } from 'polished';

import { IFilterItem } from '../Filter';

import widths from './widths';
import filterWidths from './filters';

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
    | 'holders';
  filter?: IFilterItem;
}

export const Container = styled.div`
  overflow-x: auto;
`;

export const Header = styled.div<ITableType>`
  padding: 1rem 1.5rem;

  display: flex;

  color: ${props => props.theme.table.text};
  font-weight: 600;
  font-size: 0.85rem;

  span {
    /* flex: 1; */
    ${props => widths[props.type]}

    ${props =>
      props.filter &&
      props.filter.value !== 'all' &&
      filterWidths[props.filter.name]}
  }

  @media (max-width: 768px) {
    width: fit-content;
  }
`;

export const Body = styled.div`
  display: flex;

  flex-direction: column;

  gap: 0.75rem;

  @media (max-width: 768px) {
    width: fit-content;
  }
`;

export const Row = styled.div<ITableType>`
  padding: 1rem 1.5rem;

  display: flex;

  flex-direction: row;
  align-items: center;

  background-color: ${props => props.theme.white};

  border-radius: 0.5rem;

  span,
  a {
    /* flex: 1; */
    overflow: hidden;

    text-overflow: ellipsis;
    white-space: nowrap;

    font-size: 0.95rem;
    color: ${props => props.theme.black};

    ${props => widths[props.type]};
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
    }
  }
  .address {
    cursor: pointer;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const Status = styled.div<IStatus>`
  display: flex;

  flex-direction: row;

  gap: 0.5rem;

  span {
    color: ${props => props.theme.table[props.status]} !important;

    text-transform: capitalize;
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
