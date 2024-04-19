import { TableRowElementProps } from '@/types';
import { transparentize } from 'polished';
import styled, { css } from 'styled-components';

export const Container = styled.div`
  display: flex;

  gap: 2rem;

  padding-top: 40px;

  flex-direction: column;
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

export const Card = styled.div`
  ${DefaultCardStyles}

  width: 100%;
  padding: 1.5rem;
  overflow: hidden;
  border-radius: 24px;
  border: 1px solid ${props => props.theme.darkGray};

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
        props.theme.dark ? props.theme.footer.border : props.theme.lightGray};

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

  width: 100%;

  ${props =>
    props.smaller &&
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
    text-decoration: none;

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
    flex-wrap: wrap;
  }
`;

export const FrozenContainer = styled.div`
  margin-top: 0.5rem;
  width: 100%;

  display: flex;

  flex-direction: column;

  border: 1px solid ${props => props.theme.black};
  border-radius: 0.75rem;

  div {
    overflow: hidden;
    padding: 1.25rem 2rem;

    display: flex;

    flex-direction: row;
    align-items: center;

    &:not(:last-child) {
      border-bottom: 1px solid ${props => props.theme.black};
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;
    }
    &:not(:first-child) {
      /* border-top: 1px solid ${props => props.theme.card.border}; */
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

  border-radius: 0 0.75rem 0.75rem 0.75rem;
`;

export const CardHeaderItem = styled.div<{ selected: boolean }>`
  ${DefaultCardStyles}
  border-bottom: none;
  border-right: none;
  box-shadow: none;
  padding: 1rem;

  background-color: ${props =>
    props.selected ? props.theme.white : 'transparent'};

  border-radius: 0;

  cursor: pointer;

  transition: 0.2s ease;

  span {
    font-weight: 600;
    font-size: 0.95rem;
    color: ${props => props.theme.black};
    white-space: nowrap;

    opacity: ${props => (props.selected ? 1 : 0.33)};

    transition: 0.2s ease;
  }

  &:first-of-type {
    border-radius: 0.75rem 0 0 0;
  }
  &:last-of-type {
    border-radius: 0 0.75rem 0 0;
    border-right: 1px solid
      ${props =>
        props.theme.dark ? props.theme.footer.border : props.theme.lightGray};
  }
  &:only-child {
    border-radius: 0.75rem 0.75rem 0 0;
  }
`;

export const DefaultScrollBar = css`
  ::-webkit-scrollbar {
    width: 0.3em;
    z-index: 1;
  }
  ::-webkit-scrollbar-track {
    margin-top: 0.75rem;
    margin-bottom: 0.75rem;
    box-shadow: inset 0 0 0.25rem rgba(0, 0, 0, 0.1);
    background: transparent;
    cursor: pointer !important;
  }

  ::-webkit-scrollbar-thumb {
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
