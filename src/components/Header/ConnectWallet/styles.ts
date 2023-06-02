import { transparentize } from 'polished';
import { BiTransfer } from 'react-icons/bi';
import { IoIosLogOut } from 'react-icons/io';
import { MdArrowDropDown } from 'react-icons/md';
import styled, { keyframes } from 'styled-components';

export const ConnectButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    to right,
    ${props => props.theme.violet},
    ${props => props.theme.purple}
  );
  padding: 0.6rem;
  border-radius: 1.3rem;
  color: ${props => props.theme.true.white};
  font-weight: 700;
  font-size: 0.84rem;

  text-align: center;
  div {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  position: relative;
  width: 100%;
  cursor: pointer;

  input {
    display: none;
  }

  span {
    padding-left: 0.4rem;
  }
  label {
    cursor: pointer;
  }
  min-width: 9rem;

  span {
    white-space: nowrap;
  }
  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}) {
    min-width: unset;
    svg {
      width: 18px;
      height: 18px;
    }
    span {
      display: none;
    }
    background: 0;
    width: auto;
  }

  :hover {
    filter: brightness(1.2);
  }
`;

export const ButtonAndCopy = styled.div`
  display: flex;
  align-items: center;
`;

export const ConnectContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  user-select: none;

  justify-content: flex-start;
  align-items: flex-start;

  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}) {
    margin-left: 0;
    margin-top: auto;
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column-reverse;
    align-items: flex-end;
    gap: 1.5rem;
  }
`;

export const NavBarOptionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    justify-content: flex-end;
    margin: 0;
  }
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    justify-content: flex-end;
    margin: 0;
    flex-direction: column;
  }
`;

export const NavBarOptionsItems = styled.div`
  display: flex;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 100%;
    justify-content: flex-end;
  }
`;

export const LogoutIcon = styled(IoIosLogOut)`
  color: ${props => props.theme.borderLogo};
  cursor: pointer;
`;

export const LogoutContainer = styled.div`
  position: relative;
  font-size: 0.75rem;
  margin-left: 0.8rem;

  &:hover {
    svg {
      filter: brightness(1.5);
    }
  }

  @media screen and (min-width: ${props => props.theme.breakpoints.mobile}) {
    &:hover {
      &::before {
        content: '';
        position: absolute;
        top: 2rem;
        left: 0.25rem;
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-bottom: 10px solid ${props => props.theme.card.background};
        transform: translate(-25%, 100%);
      }

      &::after {
        content: 'Logout';
        position: absolute;
        top: 1rem;
        left: 0;
        background-color: ${props => props.theme.card.background};
        color: ${props => props.theme.card.white};
        padding: 0.5rem;
        border-radius: 5px;
        z-index: 1;
        transform: translate(-25%, 100%);
      }
    }
  }
`;

export const CopyContainer = styled.div`
  position: relative;
  font-size: 0.9rem;
  margin-left: 0.8rem;
  margin-top: 0.41rem;

  svg {
    g {
      fill: ${props => props.theme.navbar.text};
    }
  }

  &:hover {
    svg {
      filter: brightness(1.5);
    }
  }

  @media screen and (min-width: ${props => props.theme.breakpoints.mobile}) {
    &:hover {
      &::before {
        content: '';
        position: absolute;
        top: 1.25rem;
        left: 0.25rem;
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-bottom: 10px solid ${props => props.theme.card.background};
        transform: translate(-25%, 100%);
      }

      &::after {
        content: 'Copy address';
        position: absolute;
        top: 1rem;
        left: 0;
        background-color: ${props => props.theme.card.background};
        color: ${props => props.theme.card.white};
        padding: 0.5rem;
        border-radius: 5px;
        z-index: 1;
        transform: translate(-50%, 40%);
      }
    }
  }
`;
export const MenuTransaction = styled.ul`
  color: ${props => props.theme.navbar.text};
  border-radius: 10px;
  gap: 0.5rem;
  margin-top: 0.3rem;

  @media ${props => props.theme.breakpoints.mobile} {
    background-color: ${props => transparentize(0.7, props.theme.black)};
  }
`;

export const MobileTransaction = styled.a`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: ${props => props.theme.navbar.text};
`;

export const MobileStyledTransfer = styled(BiTransfer)`
  color: ${props => props.theme.navbar.text};
  size: 20px;
`;

export const StyledTransfer = styled(BiTransfer)`
  color: ${props => props.theme.navbar.text};

  width: 25px;
  height: 25px;
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

export const ReloadContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
  min-height: 1.5rem;
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

export const BodyContent = styled.div`
  position: relative;

  padding-top: 1rem;
  width: 100%;
  color: ${props => props.theme.lightGray};

  display: flex;
  flex-direction: column;

  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}) {
    gap: 0.5rem;
  }
`;

export const ActionItem = styled.div`
  position: static;

  display: flex;
  align-items: center;
  gap: 0.45rem;

  height: 2.5rem;

  font-size: 14px;
  font-weight: 400;

  padding: 0.75rem;
  border: 1px solid transparent;

  cursor: pointer;

  :hover {
    border: 1px solid ${props => props.theme.card.border};
    border-radius: 0.375rem;

    background-color: ${props => props.theme.footer.border};
    color: ${props => props.theme.true.white};

    font-weight: 500;

    path:nth-child() {
      fill: ${props => props.theme.true.white};
    }
  }
  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 1.1rem;
    gap: 1rem;
  }

  svg {
    &:nth-child(3) {
      margin-left: auto;
    }
  }
`;

export const BackGroundUserInfo = styled.div<{ isOpen?: boolean }>`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;

  background-color: ${props => transparentize(0.5, props.theme.true.black)};
  visibility: ${props => (props.isOpen ? 'visible' : 'hidden')};
  opacity: ${props => (props.isOpen ? 1 : 0)};

  transition: all 0.1s linear;
  z-index: 3;
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

export const BackgroundHelper = styled.div<{ opened: boolean }>`
  width: 100%;
  height: 100%;

  top: 0;
  left: 0;

  position: fixed;
  visibility: ${props => (props.opened ? 'visible' : 'hidden')};
  opacity: ${props => (props.opened ? 1 : 0)};

  background-color: ${props =>
    transparentize(props.theme.dark ? 0.85 : 0.7, props.theme.black)};

  transition: opacity 0.5s ease, visibility 0.5s ease;
  z-index: 2;
`;
