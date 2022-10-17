import { transparentize } from 'polished';
import styled, { css } from 'styled-components';
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
    | 'nfts'
    | 'validatorsList';
  haveData?: number;
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

  color: ${props => props.theme.darkText};
  font-weight: 600;
  font-size: 0.85rem;

  span {
    ${props => widths[props.type]}
  }
`;

export const Body = styled.div<ITableType>`
  display: flex;
  width: 100%;

  min-width: fit-content;

  flex-direction: column;
  gap: 0.75rem;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: ${props => (props.haveData ? 'fit-content' : 'initial')};
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
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
    @media screen and (min-width: ${props => props.theme.breakpoints.tablet}) {
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

    a {
      color: ${props => props.theme.black};
      font-weight: 600;
    }

    small {
      color: ${props => props.theme.darkText};
    }

    strong {
      font-weight: 400;
      font-size: 0.95rem;
      color: ${props => props.theme.darkText};
    }

    p {
      font-weight: 600;
      color: ${props => props.theme.black};
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .isVerified {
      position: relative;
      left: -0.9rem;
      top: -1rem;
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

      @media screen and (max-width: ${props =>
          props.theme.breakpoints.tablet}) {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
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

export const MobileCardItem = styled.span<{
  columnSpan?: number;
  isRightAligned?: boolean;
}>`
  display: flex;
  flex-direction: column;
  &:last-child {
    flex-grow: 1;
  }

  ${props =>
    props.isRightAligned &&
    css`
      text-align: right;
      align-items: flex-end;
      span {
        justify-content: right;
      }
    `}
  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}) {
    ${props =>
      !props.columnSpan || props.columnSpan >= 0
        ? css`
            grid-column: span ${props.columnSpan};
            gap: 0.25rem;
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
    min-width: 20px;
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
    color: ${props => transparentize(0.5, props.theme.darkText)};
  }
`;

export const CustomLink = styled.a`
  align-self: end;
  color: ${props => props.theme.text};
  background: ${props => props.theme.violet};
  padding: 0.625rem 2.94rem;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: flex;
    justify-content: center;
    width: 100%;
  }
`;

export const FloatContainer = styled.div`
  width: 100%;
`;

export const LimitContainer = styled.div`
  display: block;
  position: relative;
  float: right;
  width: fit-content;
  font-size: 15px;
  text-align: left;
  color: ${props => props.theme.black};
  border-radius: 7px;
  background-color: ${props => props.theme.white};
  padding: 5px;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    margin-bottom: 10px;
  }
  span {
    padding-left: 0.5rem;
    font-size: 0.9rem;
    color: #7b7db2;
    font-weight: 600;
  }
`;

export const LimitText = styled.div`
  text-align: right;
  position: relative;
  color: ${props => props.theme.black};
  display: flex;
  margin-top: 5px;

  transform: translateZ(0);
`;

export const LimitButton = styled.button<{ selected?: boolean }>`
  color: ${props => props.theme.black};
  overflow: hidden;
  border: 1px solid ${props => props.theme.purple};
  height: fit-content;
  padding: 0.35rem 0.9rem;
  font-size: 0.8rem;
  opacity: ${props => (props.selected ? 1 : 0.8)};
  transform: scaleY(${props => (props.selected ? 1.05 : 1)});

  &:hover {
    cursor: pointer;
    opacity: 1;
    transform: scale(1.05);
  }

  &:first-child {
    margin-left: 5px;
    border-radius: 5px 0 0 5px;
  }

  &:last-child {
    border-radius: 0 5px 5px 0;
  }
`;

export const ItemContainer = styled.div<{
  active: boolean;
}>`
  height: 1.9rem;
  width: 1.9rem;
  font: 500 15px Montserrat, sans-serif;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: small;
  }

  display: flex;

  align-items: center;
  justify-content: center;

  background-color: ${props =>
    props.active ? props.theme.purple : 'transparent'};

  border-radius: 50%;

  color: ${props =>
    props.active ? props.theme.true.white : props.theme.black};

  cursor: pointer;

  transition: 0.2s ease;

  &:hover {
    ${props =>
      !props.active
        ? css`
            background-color: ${props => props.theme.purple};
            color: ${props => props.theme.white};
          `
        : css`
            cursor: not-allowed;
          `}
  }
`;
