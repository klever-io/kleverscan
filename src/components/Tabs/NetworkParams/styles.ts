import filterWidths from '@/components/Table/filters';
import { ITableType } from '@/components/Table/styles';
import widths from '@/components/Table/widths';
import styled from 'styled-components';

export const TabProposal = styled.div``;
export const Row = styled.div<ITableType>`
  padding: 1rem 1.5rem;
  font-family: Rubik;
  display: flex;

  flex-direction: row;
  align-items: center;

  background-color: ${props => props.theme.white};

  border-radius: 0.5rem;

  span,
  a, Status {
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
      color: ${props => props.theme.purple};
      font-weight: 600;
      font-size: 0.7rem;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 24px;
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
      font-weight: 500;
      color: ${props => props.theme.black};
      font-family: Rubik;
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 24px;
    }
    .currentValue{
        text-align: start;
    }
  }
`;
