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
    padding-right: 0;
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
  position: relative;

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

export const UserInfoContainer = styled.div<{ openUserInfos: boolean }>`
  position: fixed;
  top: 4.4rem;
  right: 5.6rem;
  z-index: 1000 !important;

  visibility: ${props => (props.openUserInfos ? 'visible' : 'hidden')};
  opacity: ${props => (props.openUserInfos ? '1' : '0')};

  transition: opacity 0.1s linear;

  background-color: ${props => props.theme.card.background};

  display: flex;
  flex-direction: column;

  width: 20rem;

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
  z-index: 100 !important;
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
`;
