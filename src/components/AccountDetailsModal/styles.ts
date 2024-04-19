import { transparentize } from 'polished';
import { MdArrowDropDown } from 'react-icons/md';
import styled, { css, keyframes } from 'styled-components';

export const FadeIn = keyframes`
  from {
    opacity: 0.1;
    transform: translateX(-25%) translateY(-4px);

  }
  to {
    opacity: 1;
    transform: translateX(-25%) translateY(0);
  }
`;

export const UserInfoContainer = styled.div<{
  openUserInfos: boolean;
  isMobile: boolean;
}>`
  position: fixed;
  top: 4.4rem;
  right: 5.6rem;
  z-index: 7;

  visibility: ${props => (props.openUserInfos ? 'visible' : 'hidden')};
  opacity: ${props => (props.openUserInfos ? '1' : '0')};

  transition: opacity 0.1s linear;

  background-color: ${props => props.theme.card.background};

  display: flex;
  flex-direction: column;

  width: ${props => (props.isMobile ? '95vw' : '20rem')};
  max-width: 25rem;
  border: 1px solid ${props => props.theme.card.border};
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  padding: 10px;

  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}) {
    right: unset;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    font-size: 1.3rem;
  }
`;

export const HeaderInfo = styled.div`
  position: relative;

  display: flex;
  justify-content: space-between;
  align-items: center;

  padding-inline-start: 0.75rem;
  padding-inline-end: 0.75rem;

  color: ${props => props.theme.true.white};
  font-size: 1.2rem;
  font-weight: 400;

  div {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }
`;

export const QRCodeContainer = styled.div`
  position: relative;
  gap: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  border-bottom: 1px solid ${props => props.theme.line.border};

  padding-top: 0.3rem;
  padding-bottom: 0.3rem;

  color: ${props => props.theme.true.white};

  small {
    font-weight: 400;
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}) {
    small {
      padding-top: 0.5rem;
    }
  }
`;

export const QRCodeContent = styled.div`
  display: flex;
  justify-content: center;
  border-radius: 1rem;
  padding: 1rem;

  div {
    --size: 114px;

    background-color: #fff;
    width: var(--size);
    height: var(--size);
    padding: 0.3rem;
    border-radius: 0.2rem;

    svg {
      width: 100%;
      height: 100%;
      margin: auto;
    }
  }
`;

export const ReloadContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
  min-height: 1.5rem;
`;

export const BalanceContainer = styled.span`
  font-weight: 600;
  color: ${props => props.theme.violet};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 0.5rem;
  padding: 0 0 0 1.5rem;
  white-space: nowrap;
  cursor: pointer;
`;

export const ContainerAsset = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

export const SpanDropdown = styled.div`
  display: flex;
  svg {
    cursor: pointer;
  }
`;

export const DropdownIcon = styled(MdArrowDropDown)<{
  $openOtherAssets: boolean;
}>`
  font-size: 2rem;
  transform: rotate(${props => (props.$openOtherAssets ? 0 : 180)}deg);
`;

export const OtherAssetsContainer = styled.div<{ isMobile?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
  max-width: 30rem;
  min-width: 10rem;
  max-height: 15rem;
  overflow: auto;
  position: absolute;
  top: ${props => (props.isMobile ? '15rem' : '13.5rem')};
  left: ${props => (props.isMobile ? '8.5rem' : '6.2rem')};
  padding: 0.75rem 0.75rem;
  box-shadow: 0 0.4rem 0.8rem 0 rgba(0, 0, 0, 0.2),
    0 0.6rem 1rem 0 rgba(0, 0, 0, 0.19);
  background-color: ${props => props.theme.card.assetText};
  border-radius: 0.5rem;
  transform: translateX(-25%);
  animation: ${FadeIn} 0.1s ease-in-out;
  z-index: 2;

  div {
    display: flex;
    white-space: nowrap;
    cursor: pointer;
    gap: 0.4rem;
    width: 100%;
    max-height: 5rem;
    min-height: 1.6rem;
    justify-content: flex-end;
    padding-right: 0.5rem;
    padding-left: 0.3rem;
    align-items: center;

    :hover {
      border-radius: 0.375rem;
      background-color: ${props => props.theme.footer.border};
      color: ${props => props.theme.true.white};
      font-weight: 500;
    }
  }
  span,
  p {
    text-overflow: ellipsis;
    font-weight: 600;
    color: ${props => props.theme.lightGray};
    font-size: 0.9rem;
  }

  &::-webkit-scrollbar {
    position: absolute;
    height: 0.5rem;
    width: 0.4rem;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 15px;
  }
  &:hover {
    &::-webkit-scrollbar-thumb {
      background: ${props => transparentize(0.75, props.theme.black)};
    }
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
  svg {
    cursor: pointer;
    margin-top: 0.3rem;
    margin-left: auto;
    color: ${props => props.theme.darkText};
    animation: ${props => (props.$loading ? rotate : 'none')} 1s linear infinite;
  }
`;

export const BodyContent = styled.div`
  position: relative;

  padding-top: 1rem;
  width: 100%;
  color: ${props => props.theme.lightGray};

  display: flex;
  flex-direction: column;
  gap: 4px;

  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}) {
    gap: 0.5rem;
  }
`;

export const ActionItem = styled.div<{
  secondary?: boolean;
  active?: boolean;
  disabled?: boolean;
}>`
  position: static;

  display: flex;
  align-items: center;
  gap: 0.45rem;

  height: 2.5rem;

  font-size: 14px;
  font-weight: 400;

  padding: 0.75rem;
  border: 1px solid transparent;
  border-radius: 6px;

  cursor: pointer;
  user-select: none;

  ${props =>
    props.active &&
    css`
      color: ${props.theme.true.white};
      background-color: ${props.theme.footer.border};
      border-bottom: 1px solid ${props => props.theme.card.border};

      border-radius: 6px 6px 0 0;
      font-weight: 500;
    `}

  ${props =>
    props.secondary &&
    css`
      margin-left: 24px;
      margin-right: 4px;

      background-color: ${props.theme.blue};

      &:last-child {
        margin-bottom: 4px;
      }
    `}

  ${props =>
    props.disabled &&
    css`
      cursor: not-allowed;
      opacity: 0.75;
      filter: grayscale(0.25);
    `}

    ${props =>
    !props.disabled &&
    !props.active &&
    css`
      :hover {
        border: 1px solid ${props => props.theme.card.border};

        background-color: ${props => props.theme.footer.border};
        color: ${props => props.theme.true.white};

        path:nth-child() {
          fill: ${props => props.theme.true.white};
        }
      }
    `}
  
  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 1.1rem;
    gap: 1rem;
  }

  svg {
    &:nth-child(3) {
      margin-left: auto;

      transition: transform 0.2s ease-in-out;
      ${props =>
        props.active &&
        css`
          transform: rotate(180deg);
        `}
    }
  }
`;

export const SubSection = styled.div<{ active?: boolean }>`
  ${props =>
    props.active &&
    css`
      display: flex;
      flex-direction: column;
      gap: 4px;

      border: 1px solid ${props => props.theme.card.border};
      border-radius: 6px;

      backdrop-filter: brightness(0.9);
    `}
`;
