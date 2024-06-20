import { TableRowElementProps } from '@/types';
import { transparentize } from 'polished';
import styled, { css } from 'styled-components';

export const Container = styled.div`
  display: flex;

  flex-direction: column;

  margin-top: 40px;
`;

export const Header = styled.section<{ filterOn?: boolean }>`
  display: flex;

  flex-direction: ${props => (props.filterOn ? 'column' : 'row')};
  justify-content: space-between;
  align-items: ${props => (props.filterOn ? 'flex-start' : 'center')};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const Title = styled.div`
  display: flex;

  flex-direction: row;
  align-items: center;

  gap: 0.75rem;

  div {
    cursor: pointer;

    svg {
      height: auto;
      width: auto;
    }
  }
`;

export const CardContainer = styled.section`
  margin: 1.5rem 0;
  width: 100%;

  display: flex;

  flex-direction: row;

  gap: 0.75rem;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

export const DefaultCardStyles = css`
  background-color: ${props =>
    props.theme.dark ? props.theme.table.background : props.theme.white};
`;

export const DefaultCardStyleWithBorder = css`
  ${DefaultCardStyles}

  border: 1px solid ${props =>
    props.theme.dark ? props.theme.black20 : props.theme.black10};
  border-radius: 24px;
`;

export const Card = styled.div`
  ${DefaultCardStyleWithBorder}

  width: 100%;
  padding: 1.5rem;
  overflow: hidden;

  display: flex;

  flex-direction: column;

  justify-content: space-between;

  gap: 1rem;

  color: ${props => props.theme.black};

  span {
    a {
      &:hover {
        text-decoration: underline;
      }
    }
  }

  div {
    display: flex;
    gap: 0.5rem;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    span:nth-child(2) {
      text-align: right;
    }
    p:nth-child(2) {
      text-align: right;
    }

    strong {
      font-weight: 600;
    }

    p {
      opacity: 0.7;

      font-size: 0.85rem;
      font-weight: 400;
      color: ${props => props.theme.darkText};
    }

    small {
      font-size: 0.85rem;
      font-weight: 600;
      color: ${props => props.theme.darkText};
    }
  }
`;

export const tableEffects = css`
  div > div:first-child {
    opacity: 1;
    animation-name: fadeInOpacity;
    animation-iteration-count: 1;
    animation-timing-function: ease-in;
    animation-duration: 1s;

    @keyframes fadeInOpacity {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }
  }

  div > div:not(:first-child) {
    opacity: 1;
    animation-name: down;
    animation-iteration-count: 1;
    animation-timing-function: ease-in;
    animation-duration: 1s;

    @keyframes down {
      0% {
        transform: translateY(-50%);
      }

      100% {
        transform: translateY(0%);
      }
    }
  }
`;

export const Row = styled.div<{ isMobileRow?: boolean }>`
  width: 100%;

  padding: 1.5rem 2rem;

  display: flex;

  flex-direction: row;
  align-items: center;

  color: ${props => props.theme.black};

  &:not(:last-child) {
    border-bottom: 1px solid
      ${props =>
        props.theme.dark ? props.theme.black10 : props.theme.lightGray};

    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
  }

  > span {
    &:first-child {
      width: 10rem;
      flex-direction: column;
    }
  }

  span {
    width: fit-content;
    max-width: 100%;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    strong {
      font-weight: 600;
      color: ${props => props.theme.darkText};
    }

    small {
      font-weight: 400;
      font-size: 0.95rem;
      color: ${props => props.theme.darkText};
    }

    a {
      color: ${props => props.theme.black};
      font-size: 0.95rem;
      font-weight: 600;

      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    p {
      color: ${props => props.theme.darkText};
      font-weight: 400;
    }
  }
  > strong {
    min-width: 8rem;
    font-weight: 600;
    color: ${props => props.theme.darkText};
  }
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
    ${props =>
      props.isMobileRow &&
      css`
        flex-direction: row;
        align-items: center;
      `}
  }
`;

export const RowContent = styled.div`
  width: 100%;
  min-width: 30%;
`;

export const DoubleRow = styled.div<TableRowElementProps>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  gap: 10px;

  width: fit-content;

  ${props =>
    props.$smaller &&
    css`
      gap: 4px;
    `}

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    gap: 4px;
  }
`;

export const CenteredRow = styled.div`
  display: flex;
  align-items: center;
  flex: 1;

  gap: 0.5rem;

  width: 100%;

  overflow: visible;

  strong {
    font-weight: 600;
  }

  a {
    color: ${props => props.theme.black};

    font-weight: 600;

    padding-bottom: 1px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  p {
    font-weight: 600;
  }

  svg {
    cursor: pointer;
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    span,
    a,
    p {
      min-width: fit-content;
    }
  }
`;

export const Mono = styled.span`
  font-family: 'Fira Mono', monospace;
`;

export const FrozenContainer = styled.div`
  width: 100%;

  display: flex;

  flex-direction: column;

  border: 1px solid ${props => props.theme.black20};
  border-radius: 0.75rem;

  div {
    overflow: hidden;
    padding: 1.25rem 2rem;

    display: flex;

    flex-direction: row;
    align-items: center;

    &:not(:last-child) {
      border-bottom: 1px solid ${props => props.theme.black20};
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;
    }
    strong {
      width: 10rem;
      margin-right: 5px;
      font-weight: 600;
      color: ${props => props.theme.darkText};
    }

    span {
      color: ${props => props.theme.darkText};
      padding-right: 1rem;
      min-width: 10rem;
    }
  }
`;

export const CardHeader = styled.div`
  display: flex;

  flex-direction: row;
  overflow-x: auto;
`;

export const CardTabContainer = styled.div`
  display: flex;

  flex-direction: column;
`;

export const CardContent = styled.div`
  ${DefaultCardStyles};
  width: 100%;

  border-radius: 0.75rem;
`;

export const CardHeaderItem = styled.div<{ selected: boolean }>`
  border-bottom: none;
  border-right: none;
  box-shadow: none;
  padding: 1rem;

  border-radius: 0;

  cursor: pointer;

  transition: 0.2s ease;

  span {
    font-weight: 600;
    font-size: 0.95rem;
    color: ${props => props.theme.black};
    white-space: nowrap;

    opacity: ${props => (props.selected ? 1 : 0.33)};

    ${props =>
      props.selected &&
      css`
        border-bottom: 2px solid ${props => props.theme.violet};
      `}
  }
`;

export const DefaultScrollBar = css`
  &::-webkit-scrollbar {
    width: 0.3em;
    z-index: 1;
  }
  &::-webkit-scrollbar-track {
    margin-top: 0.75rem;
    margin-bottom: 0.75rem;
    box-shadow: inset 0 0 0.25rem rgba(0, 0, 0, 0.1);
    background: transparent;
    cursor: pointer !important;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${props => transparentize(0.2, props.theme.violet)};
    border-radius: 10px;
    cursor: pointer !important;
  }
`;

export const FlexSpan = styled.span`
  display: flex;
  gap: 0.3rem;
  align-items: center;
`;

interface IStatus {
  status: string;
}

export const Status = styled.div<IStatus>`
  display: flex;

  flex-direction: row;

  align-items: center;

  gap: 0.9rem;

  svg {
    min-width: 24px;
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
`;
export const CustomLink = styled.a<{
  tabAsset?: boolean;
  fullWidth?: boolean;
  secondary?: boolean;
}>`
  align-self: end;
  text-align: center;

  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 16px;

  height: 34px !important;

  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: ${props => (props.tabAsset ? '500' : '600')}!important;

  min-width: 8rem;
  max-width: 15rem;

  background: ${props => (props.tabAsset ? '' : props.theme.violet)};
  color: ${props =>
    props.tabAsset ? props.theme.black : props.theme.true.white} !important;
  border: 1px solid ${props => transparentize(0.75, props.theme.black)};
  border-radius: 24px;

  cursor: pointer;

  transition: all 0.1s ease;

  ${props =>
    props.fullWidth &&
    css`
      width: 100%;
      min-width: 0;
      max-width: 100%;
    `}

  ${props =>
    props.secondary &&
    css`
      background: transparent;
      color: ${props.theme.violet} !important;
      border: 1px solid ${props.theme.violet};

      &:hover {
        background: ${props.theme.violet};
        color: ${props.theme.true.white} !important;
      }
    `}

  &:hover {
    background: ${props => props.theme.violet};
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: flex;
    justify-content: center;
    width: 100%;
  }
`;
