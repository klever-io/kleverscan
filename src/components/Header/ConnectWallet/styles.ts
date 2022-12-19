import { transparentize } from 'polished';
import { BiTransfer } from 'react-icons/bi';
import { IoIosLogOut } from 'react-icons/io';
import styled from 'styled-components';

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
  font-size: 14px;

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
  span,
  small {
    padding-left: 0.4rem;
  }
  label {
    cursor: pointer;
  }
  width: 9rem;
  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}) {
    span,
    small {
      display: none;
    }
    padding: 0 0.25rem 0 0;
    background: 0;
    width: auto;
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

  padding-right: 0.5rem;
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
        z-index: 500;
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
        z-index: 500;
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
  border-bottom: 1px solid ${props => props.theme.line.border};
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  color: ${props => props.theme.black};
  display: flex;
  flex-direction: column;
  align-items: center;
  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}) {
    small {
      padding-top: 0.5rem;
    }
  }
`;

export const UserInfoContainer = styled.div`
  position: fixed;
  top: 4.4rem;
  right: 5.6rem;
  z-index: 10000 !important;
  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}) {
    right: 1rem;
  }
`;

export const ContentUserInfo = styled.div`
  background-color: ${props => props.theme.background};
  display: flex;
  flex-direction: column;
  width: 20rem;
  border-width: 1px;
  border-style: solid;
  border-color: #404264;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  padding: 10px;
`;

export const HeaderInfo = styled.div`
  display: flex;
  justify-content: space-between;
  padding-inline-start: 0.75rem;
  padding-inline-end: 0.75rem;
  align-items: center;
  color: ${props => props.theme.black};
  font-size: 16px;
  font-weight: 700;
  div {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }
`;

export const BodyContent = styled.div`
  padding-top: 1rem;
  width: 100%;
  color: ${props => props.theme.navbar.text};

  > div {
    display: flex;
    position: static;
    align-items: center;
    height: 2.5rem;
    gap: 0.45rem;
    font-size: 14px;
    font-weight: 700;
    padding-bottom: 0.5rem;
    padding: 0.75rem;
    cursor: pointer;
  }
  div:nth-child(2) {
    cursor: auto;
  }
  > div:hover {
    border-width: 1px;
    border-style: solid;
    border-color: #404264;
    border-radius: 0.375rem;
    background-color: ${props => props.theme.footer.border};
    color: ${props => props.theme.true.white};
    path:nth-child() {
      fill: ${props => props.theme.true.white};
    }
  }
`;

export const BackGroundUserInfo = styled.div<{ isOpen?: boolean }>`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  visibility: ${props => (props.isOpen ? 'visible' : 'hidden')};
  z-index: 100 !important;
`;

export const QRCodeContent = styled.div`
  display: flex;
  justify-content: center;
  background-color: ${props => props.theme.background};
  border-radius: 1rem;
  padding: 1rem;

  div {
    background-color: #fff;
    width: 114px;
    padding: 0.3rem;
    border-radius: 0.2rem;
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
`;
