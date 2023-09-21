import { AiOutlineClose } from 'react-icons/ai';
import styled, { css } from 'styled-components';

export const TooltipBody = styled.article<{ isInHomePage: boolean }>`
  position: absolute;
  z-index: 7;
  background-color: ${props =>
    props.theme.dark ? props.theme.black : props.theme.footer.border};
  border-radius: 8px;
  transform: ${props =>
    props.isInHomePage ? 'translate(-5%, 112%)' : 'translate(-5%, 112%)'};
  left: 1rem;
  bottom: 1rem;

  @media (min-width: ${props => props.theme.breakpoints.mobile}) {
    transform: ${props =>
      props.isInHomePage ? 'translate(0%, 112%)' : 'translate(0%, 112%)'};
    left: 0rem;
  }

  :after {
    content: '';
    display: inline-block;
    background-color: ${props =>
      props.theme.dark ? props.theme.black : props.theme.footer.border};
    position: absolute;
    width: 12.08px;
    height: 12.08px;
    left: 23.73px;
    top: -5.82px;
    border-radius: 3px;
    transform: rotate(45deg);
  }
`;

export const LeaveButton = styled(AiOutlineClose)`
  position: absolute;
  text-align: right;
  fill: ${props => props.theme.white};
  top: 22px;
  :hover {
    cursor: pointer;
  }
  fill: ${props => props.theme.white} !important;
  path {
    fill: ${props => props.theme.white} !important;
  }
  z-index: 1;
  left: 326px;
  @media (min-width: ${props => props.theme.breakpoints.mobile}) {
    left: 373px;
  }
`;
export const TooltipWrapper = styled.div`
  position: relative;
  min-width: 25rem;
  min-height: 15rem;
  padding: 1.5rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 0.75rem;
  span,
  a {
    span,
    p,
    strong,
    small {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    span {
      max-width: 11rem;
    }
  }
`;

export const LoaderWrapper = styled.div`
  width: 25rem;
  height: 15rem;
  display: grid;
  place-items: center;
  padding: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.status.error};
`;

export const ErrorWrapper = styled(LoaderWrapper)``;

export const ErrorContent = styled.div`
  align-self: start;
`;

export const ErrorTitle = styled.h4`
  font-weight: 800;
  font-size: larger;
`;

export const CardItem = styled.span<{
  columnSpan?: number;
  isRightAligned?: boolean;
}>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
  ${props =>
    props.isRightAligned &&
    css`
      text-align: right;
      align-items: flex-end;
      justify-self: end;
    `}

  ${props =>
    !props.columnSpan || props.columnSpan >= 0
      ? css`
          grid-column: span ${props.columnSpan};
          gap: 0.25rem;
          max-width: 11rem;
        `
      : css`
          display: none;
        `}

        ${props =>
    props.columnSpan === 2 &&
    css`
      max-width: 22rem;
    `}
  
  min-height: 2.5rem;
`;

export const TitleSpan = styled.span`
  color: ${props => props.theme.white};
  font-weight: 700;
`;
const SpanDefault = styled.span`
  font-weight: 700;
  display: flex;
  align-items: center;
`;

export const TitleWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  max-width: initial !important;
  gap: 0.5rem;
`;

export const RedirectButton = styled.button`
  color: ${props => props.theme.white};
`;

export const SuccessSpan = styled(SpanDefault)`
  color: ${props => props.theme.green};
`;

export const FailSpan = styled(SpanDefault)`
  color: ${props => props.theme.red};
`;

export const DateSpan = styled.span`
  color: ${props => props.theme.navbar.text};
  font-weight: 500;
`;

export const HashSpan = styled.span`
  color: ${props => props.theme.violet};
  font-weight: 700;
  text-decoration: underline;
`;

export const TxTypeSpan = styled.span`
  width: fit-content;
  background-color: ${props =>
    props.theme.dark
      ? props.theme.card.backGroundTooltip
      : props.theme.true.white};
  border-radius: 8px;
  padding: 0.3rem;
`;

export const SpanWithIcon = styled(TxTypeSpan)`
  display: flex;
  align-items: center;
`;

export const UnderlineSpan = styled.span`
  text-decoration: underline;
  max-width: 11rem;
`;

export const SpanWrapper = styled.span`
  color: ${props => props.theme.white};
  overflow: hidden;
  width: fit-content;
`;

export const DivWrapper = styled.div`
  color: ${props => props.theme.white};
`;

export const LogoWrapper = styled.div`
  display: flex;
  gap: 1rem;
`;
export const AssetNameWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const HoverDiv = styled.div`
  :hover {
    cursor: pointer;
  }
`;
export const TokenNameSpan = styled.span`
  color: ${props => props.theme.navbar.text};
  font-weight: 700;
`;

export const TokenTicker = styled(TitleSpan)`
  text-decoration: underline;
`;

export const AssetTypeSpan = styled.span`
  color: ${props => props.theme.violet};
  font-weight: 700;
`;

export const SpanWrapperBottom = styled(SpanWrapper)`
  padding-bottom: 0.2rem;
`;

export const RedirectSVG = styled.span`
  display: table;
  & path {
    fill: ${props => props.theme.white};
  }
  :hover {
    cursor: pointer;
  }
  svg {
    display: table-cell;
    vertical-align: middle;
  }
`;
