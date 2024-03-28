import { transparentize } from 'polished';
import styled, { css, keyframes } from 'styled-components';

interface IStatus {
  status: string;
}

export interface TableRowProps {
  haveData?: number;
  pathname?: string;
  rowSections?: boolean;
  autoUpdate?: boolean;
}

export const ContainerView = styled.div`
  overflow-x: auto;
  width: 100%;
`;

export const TableBody = styled.div`
  min-width: fit-content;

  display: flex;
  flex-direction: column;
  gap: 40px;

  color: ${props => props.theme.black};

  @media screen and (min-width: ${props => props.theme.breakpoints.tablet}) {
    display: block;
    border-radius: 16px;
    border: solid 1px transparent;
    padding: 16px;

    /* background + gradient border */
    background-image: linear-gradient(
        ${props => props.theme.table.background},
        ${props => props.theme.table.background}
      ),
      linear-gradient(
        to bottom,
        ${props => props.theme.darkGray},
        transparent 50%
      );
    background-origin: border-box;
    background-clip: padding-box, border-box;
  }
`;

export const RowContainer = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  flex: 0 5 236px;

  display: table-row;

  gap: 0.25rem;
  padding: 0.5rem 0;
`;

export const HeaderItem = styled.div`
  display: table-cell;
  padding: 6px 16px;
  margin-bottom: 16px;
`;

export const TableRow = styled.div<TableRowProps>`
  display: flex;
  flex-direction: column;
  width: 100%;

  /* justify-content: space-between; */
  /* align-items: center; */

  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 0.75rem;

    padding: 16px;

    border-radius: 16px;
    border: solid 1px ${props => props.theme.darkGray};

    background-color: ${props => props.theme.table.background};
  }

  @media screen and (min-width: ${props => props.theme.breakpoints.tablet}) {
    display: table-row;
  }
`;

export const MobileCardItem = styled.span<{
  columnSpan?: number;
  isRightAligned?: boolean;
  isAssets?: boolean;
  isAccountPage?: boolean;
  isLastRow?: boolean;
}>`
  display: flex;
  flex-direction: column;

  font-size: 1rem;

  ${props =>
    !props.columnSpan || props.columnSpan >= 0
      ? css`
          grid-column: span ${props.columnSpan};
          gap: 0.25rem;
        `
      : css`
          display: none;
        `}

  a,span {
    display: flex;
    align-items: center;
  }

  a {
    text-decoration: underline;
    text-underline-offset: 0.2rem;
  }

  &:nth-last-child(1) {
    flex-grow: ${props => (props.isAssets ? '1' : '0')};
  }
  &:nth-last-child(2) {
    flex-grow: ${props => (props.isAssets ? '5000' : '0')};
  }

  ${props =>
    props.isRightAligned &&
    css`
      text-align: right;
      align-items: flex-end;
      span,
      a {
        justify-content: flex-end;
      }
    `}

  @media screen and (min-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: ${props => (props.isAssets ? 'column' : 'row')};
    gap: 0.5rem;
    grid-column: unset;

    display: table-cell;

    table-layout: auto;
    width: 236px;

    padding: 12px 16px;

    font-size: 0.875rem;
    line-height: 1rem;

    a,
    span {
      height: 24px;
      display: flex;
      align-items: center;
    }
  }

  ${props =>
    props.isLastRow
      ? css`
          border-bottom: none;
        `
      : css`
          border-bottom: solid 1px ${props => props.theme.darkGray};
        `}
`;

export const MobileHeader = styled.span`
  color: ${props => props.theme.table.text};
  font-weight: 600;
  font-size: 0.8rem;
`;

export const CustomFieldWrapper = styled.div`
  text-decoration: underline dashed;
  text-decoration-color: ${props => transparentize(0.5, props.theme.black)};
  text-underline-offset: 0.2rem;
`;

export const TimestampInfo = styled.span`
  width: 14ch;
`;

export const Status = styled.div<IStatus>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.9rem;

  width: 70%;
  max-width: 80px;
  font-weight: bold;

  color: ${props =>
    props.status === 'ApprovedProposal'
      ? props.theme.table['success']
      : props.theme.table[props.status]} !important;

  background-color: ${props =>
    props.status === 'ApprovedProposal'
      ? transparentize(0.8, props.theme.table['success'])
      : transparentize(0.8, props.theme.table[props.status])} !important;

  padding: 2px 6px;
  border-radius: 24px;

  ${props =>
    props.status === 'inactive' &&
    `
      color: ${props.theme.table.icon} !important;
      
    `}
`;

export const EmptyRow = styled.div`
  width: 100% !important;

  justify-content: center;
  align-items: center;

  p {
    font-weight: 400;
    color: ${props => transparentize(0.5, props.theme.darkText)};
  }
`;

export const CustomLink = styled.a<{
  tabAsset?: boolean;
}>`
  align-self: end;
  min-width: 13rem;
  text-align: center;
  color: ${props =>
    props.tabAsset ? props.theme.black : props.theme.true.white} !important;
  border: 2px solid ${props => props.theme.violet};
  background: ${props => (props.tabAsset ? '' : props.theme.violet)};
  padding: 0.625rem 2.94rem;
  font-weight: ${props => (props.tabAsset ? '500' : '600')}!important;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    filter: brightness(1.1);
    background: ${props => props.theme.violet};
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: flex;
    justify-content: center;
    width: 100%;
  }
`;

export const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const FloatContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 16px;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
`;

export const LimitContainer = styled.div`
  display: block;
  position: relative;
  float: right;
  width: fit-content;
  font-size: 15px;
  text-align: left;
  color: ${props => props.theme.gray700};
  margin-left: auto;
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    margin-bottom: 10px;
  }
  span {
    padding-left: 0.5rem;
    font-size: 0.9rem;
    color: ${props => props.theme.gray700};
    font-weight: 600;
  }
`;

export const LimitItems = styled.div`
  text-align: right;
  position: relative;
  color: ${props => props.theme.gray700};
  display: flex;
  margin-top: 5px;
  gap: 8px;

  transform: translateZ(0);
`;

export const LimitButton = styled.button<{ selected?: boolean }>`
  color: ${props => props.theme.black};
  overflow: hidden;
  border: 1px solid ${props => props.theme.violet};
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
  padding: 8px 16px;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1rem;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: small;
  }

  display: flex;

  align-items: center;
  justify-content: center;

  background-color: ${props =>
    props.active ? props.theme.violet : props.theme.blue};

  border-radius: 16px;

  color: ${props =>
    props.active ? props.theme.true.white : props.theme.blueGray300};

  cursor: pointer;

  transition: 0.2s ease;

  &:hover {
    ${props =>
      !props.active
        ? css`
            background-color: ${props => props.theme.violet};
            color: ${props => props.theme.true.white};
          `
        : css`
            cursor: not-allowed;
          `}
  }
`;

export const ExportContainer = styled.div`
  width: fit-content;

  display: flex;
  gap: 8px;

  color: ${props => props.theme.darkText};

  font-size: 0.9rem;
  font-weight: 600;
  height: fit-content;
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    margin-bottom: 10px;
  }
`;

export const ExportLabel = styled.div`
  padding-left: 0.2rem;
`;

export const ButtonsContainer = styled.div`
  display: flex;
`;

export const BackTopButton = styled.span<{ isHidden: boolean }>`
  display: ${props => (props.isHidden ? 'block' : 'none')};
  position: fixed;
  bottom: 5rem;
  right: 1.2rem;
  z-index: 4;
  border: none;
  outline: none;
  color: ${props => props.theme.violet};
  cursor: pointer;
  border-radius: 10px;
  font-size: 35px;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    right: 0.8rem;
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const IoReloadSharpWrapper = styled.div<{
  $loading: boolean;
}>`
  height: fit-content;

  cursor: pointer;

  display: grid;
  place-items: center;

  height: 40px;
  width: 40px;

  border-radius: 8px;

  background-color: ${props => props.theme.card.background};

  transition: 0.2s ease;

  svg {
    color: ${props =>
      props.theme.dark ? props.theme.black : props.theme.darkText};
    animation: ${props => (props.$loading ? rotate : 'none')} 1s linear infinite;
  }

  &:hover {
    background-color: ${props => props.theme.violet};
  }
`;

export const RetryContainer = styled.div<{
  $loading: boolean;
}>`
  cursor: pointer;
  display: flex;
  justify-content: center;
  margin-bottom: 0.5rem;
  svg {
    margin-left: 0.2rem;
    color: ${props =>
      props.theme.dark ? props.theme.black : props.theme.darkText};
    animation: ${props => (props.$loading ? rotate : 'none')} 1s linear infinite;
  }

  span {
    color: ${props => props.theme.black};
  }
`;
