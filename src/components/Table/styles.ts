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
  overflow-x: visible;
  width: 100%;
`;

/**
 * The card's own surface, plus the gradient hairline around it.
 *
 * The fill is `white` in both themes on purpose. That token is the raised
 * surface, not the colour white: #fff in the light theme and #151515 in the
 * dark one. Filling the dark card with `background` instead, as this did,
 * gave it exactly the page's own colour, so a table and a summary card had no
 * surface at all and the hairline was left holding them together on its own.
 * Measured: interior against page was 1.00 in dark and 1.10 in light; reading
 * `white` in both makes it 1.11, the same step the light theme has.
 */
export const TableGradientBorder = css`
  border: 1px solid transparent;
  background-image: linear-gradient(
      ${props => props.theme.white},
      ${props => props.theme.white}
    ),
    linear-gradient(
      to bottom,
      ${props =>
        props.theme.dark ? props.theme.black20 : props.theme.black10},
      ${props => props.theme.black2} 50%,
      ${props => (props.theme.dark ? props.theme.black20 : props.theme.black10)}
        175%
    );
  background-origin: border-box;
  background-clip: padding-box, border-box;
`;

export const TableBody = styled.div<{ smaller?: boolean; $stale?: boolean }>`
  min-width: fit-content;
  width: 100%;

  /* The rows of the page being replaced stay in place and step back rather
     than disappearing, so paging reads as a change instead of a flash. */
  opacity: ${props => (props.$stale ? 0.55 : 1)};
  transition: opacity 150ms ease-out;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  display: flex;
  flex-direction: column;
  gap: 16px;

  color: ${props => props.theme.black};

  @media screen and (min-width: ${props => props.theme.breakpoints.tablet}) {
    display: table;
    table-layout: auto;

    border-radius: 16px;
    padding: 16px;
    gap: 40px;

    ${props =>
      props.smaller &&
      css`
        padding: 8px;
      `}

    ${TableGradientBorder}
  }
`;

export const HeaderItem = styled.div<{
  smaller?: boolean;
  totalColumns?: number;
  currentColumn?: number;
  dynamicWidth?: number;
  maxWidth?: number;
}>`
  display: table-cell;
  padding: 6px 16px;
  padding-bottom: 32px;
  white-space: ${props => (props.maxWidth ? 'unset' : 'nowrap')};
  width: ${props =>
    props.dynamicWidth ? `${props.dynamicWidth}px` : 'fit-content'};
  max-width: ${props => (props.maxWidth ? `${props.maxWidth}px` : 'none')};

  ${props =>
    props.smaller &&
    css`
      font-size: 0.75rem;
      padding: 4px 8px;
      padding-bottom: 16px;
    `}
`;

/**
 * Opt-in sort control inside a header cell. Inherits the header typography so
 * tables that do not pass sortable columns look exactly as before; the arrow
 * only surfaces on the active column, or faintly on hover.
 */
export const HeaderSortButton = styled.button<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  font: inherit;
  color: inherit;
  text-transform: inherit;
  letter-spacing: inherit;

  svg {
    flex-shrink: 0;
    color: ${props => props.theme.violet};
    opacity: ${props => (props.$active ? 1 : 0)};
    transition: opacity 150ms ease-out;
  }

  &:hover svg,
  &:focus-visible svg {
    opacity: ${props => (props.$active ? 1 : 0.45)};
  }

  &:focus-visible {
    outline: 2px solid ${props => props.theme.violet};
    outline-offset: 2px;
    border-radius: 4px;
  }

  ${props =>
    props.$active &&
    css`
      color: ${props.theme.black};
    `}

  @media (prefers-reduced-motion: reduce) {
    svg {
      transition: none;
    }
  }
`;

export const TableRow = styled.div<TableRowProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: space-between;

  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(2, 1fr);
    gap: 4px;

    padding: 16px;

    border-radius: 16px;
    border: solid 1px
      ${props =>
        props.theme.dark ? props.theme.darkGray : props.theme.black10};

    background-color: ${props => props.theme.white};
  }

  @media screen and (min-width: ${props => props.theme.breakpoints.tablet}) {
    display: table-row;
  }
`;

export const TableEmptyData = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
`;

export const MobileCardItem = styled.div<{
  columnSpan?: number;
  isRightAligned?: boolean;
  isAssets?: boolean;
  isAccountPage?: boolean;
  isLastRow?: boolean;
  dynamicWidth?: number;
  maxWidth?: number;
  smaller?: boolean;
  totalColumns?: number;
  currentColumn?: number;
}>`
  display: flex;
  flex-direction: column;

  font-size: 0.75rem;

  a,
  span {
    display: flex;
    align-items: center;
    font-weight: 400;
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
      a,
      div {
        justify-content: flex-end;
      }
    `}

  ${props =>
    !props.columnSpan || props.columnSpan >= 0
      ? css`
          grid-column: span ${props.columnSpan};
          gap: 2px;
        `
      : css`
          display: none;
        `}


  @media screen and (min-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: ${props => (props.isAssets ? 'column' : 'row')};
    gap: 0.5rem;
    grid-column: unset;

    display: table-cell;
    vertical-align: middle;

    width: ${props =>
      props.dynamicWidth ? `${props.dynamicWidth}px` : 'fit-content'};

    max-width: ${props => (props.maxWidth ? `${props.maxWidth}px` : 'none')};

    padding: 12px 16px;

    font-size: 0.875rem;
    line-height: 1rem;

    a,
    span {
      height: 24px;
      display: flex;

      align-items: center;

      min-width: fit-content;
      white-space: nowrap;
    }

    ${props =>
      props.isLastRow
        ? css`
            border-bottom: none;
          `
        : css`
            border-bottom: solid 1px
              ${props =>
                props.theme.dark ? props.theme.darkGray : props.theme.black10};
          `}

    ${props =>
      props.smaller &&
      css`
        font-size: 0.75rem;
        padding: 8px 8px;
      `}
  }
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

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const TimestampInfo = styled.span`
  width: 14ch;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 12ch;
  }
`;

export const Status = styled.span<IStatus>`
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
      : props.theme.table[
          props.status as keyof typeof props.theme.table
        ]} !important;

  background-color: ${props =>
    props.status === 'ApprovedProposal'
      ? transparentize(0.8, props.theme.table['success'])
      : transparentize(
          0.8,
          props.theme.table[props.status as keyof typeof props.theme.table],
        )} !important;

  padding: 2px 6px;
  border-radius: 24px;

  ${props =>
    props.status === 'inactive' &&
    `
      color: ${props.theme.table.icon} !important;
      
    `}

  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: fit-content;
  }
`;

export const EmptyRow = styled.div`
  width: 100% !important;

  justify-content: center;
  align-items: center;
  text-align: center;

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

  display: flex;
  justify-content: center;
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

  &:hover {
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
    font-size: 0.9rem;
    color: ${props =>
      props.theme.dark ? props.theme.gray700 : props.theme.darkText};
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
    props.active
      ? props.theme.violet
      : props.theme.dark
        ? props.theme.blue
        : props.theme.black10};

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

/**
 * Items per page and the refresh control as one unit.
 *
 * They used to be two siblings of the filters, so the two-column grid below
 * the tablet width had three children to place and dropped the refresh button
 * onto a row of its own, floating under the filters. One child instead of two
 * keeps them together at every width.
 */
export const TableControls = styled.div`
  display: flex;
  align-items: end;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 16px;

  margin-left: auto;

  /* The float container is a two-column grid below this width, and one 171px
     column cannot hold these controls: they wrapped into three rows with the
     refresh button alone again. The full row can. */
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-column: 1 / -1;
    justify-content: flex-start;
    margin-left: 0;
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
    place-self: end;
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
  cursor: pointer;

  display: grid;
  place-items: center;

  height: 40px;
  width: 40px;

  border-radius: 8px;

  background-color: ${props =>
    props.theme.dark ? props.theme.card.background : props.theme.blueGray300};

  transition: 0.2s ease;

  svg {
    color: ${props => props.theme.true.white};
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
