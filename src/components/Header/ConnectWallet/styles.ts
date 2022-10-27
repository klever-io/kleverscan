import { transparentize } from 'polished';
import { BiTransfer } from 'react-icons/bi';
import { IoIosLogOut } from 'react-icons/io';
import styled from 'styled-components';

export const ConnectButton = styled.div`
  background-color: ${props => props.theme.navbar.text};
  padding: 0.6rem;
  border-radius: 0.3rem;
  color: ${props => props.theme.card.white};
  font-size: 0.9rem;

  text-align: center;

  position: relative;

  min-width: 14rem;
  width: 100%;

  cursor: pointer;

  input {
    display: none;
  }

  label {
    cursor: pointer;
  }

  @media screen and (min-width: ${props => props.theme.breakpoints.mobile}) {
    width: 14rem;
    &:hover > div {
      display: flex;
      flex-direction: column;
    }
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

  @media screen and (max-width: 1025px) {
    margin-left: 0;
    margin-top: auto;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column-reverse;
    align-items: flex-end;
    gap: 1.5rem;
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
  position: absolute;

  -webkit-box-shadow: 3px 3px 8px 5px rgba(0, 0, 0, 0.05);
  box-shadow: 3px 3px 8px 5px rgba(0, 0, 0, 0.05);
`;

export const QRCodeContent = styled.div`
  position: relative;
  background-color: ${props => props.theme.qrcodeTooltip.background};
  border-radius: 1rem;
  padding: 1rem;
  top: 5.3rem;
  left: 0.2rem;

  div {
    background-color: #fff;
    padding: 0.3rem;
    border-radius: 0.2rem;
  }
`;
