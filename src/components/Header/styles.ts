import styled, { css } from 'styled-components';

import { FiMenu } from 'react-icons/fi';
import { MdArrowDropDown } from 'react-icons/md';
import { IoIosLogOut } from 'react-icons/io';

import { default as DefaultInput } from '../Inputt';
import { transparentize } from 'polished';

interface IMobileMenu {
  opened: boolean;
}

export const Container = styled.div`
  padding: 1rem 5rem;

  display: flex;
  position: relative;

  flex-direction: row;
  align-items: center;

  gap: 1.5rem;

  background-color: ${props => props.theme.navbar.background};

  @media (max-width: 425px) {
    padding: 1rem 2.5rem;

    overflow: hidden;

    justify-content: space-between;
  }
`;

export const Logo = styled.div`
  margin-right: 0.5rem;

  cursor: pointer;
`;

export const Item = styled.div<{ selected: boolean }>`
  display: flex;

  flex-direction: row;
  align-items: center;

  gap: 0.5rem;

  cursor: pointer;

  transition: 0.2s ease;

  filter: brightness(${props => (props.selected ? 10 : 1)});

  &:hover {
    ${props =>
      !props.selected &&
      css`
        filter: brightness(1.5);
      `};
  }

  span {
    color: ${props => props.theme.navbar.text};
    font-weight: 600;
  }

  &:hover > div {
    display: flex;
    flex-direction: column;
  }
`;

export const ItemTransaction = styled.div<{ selected: boolean }>`
  display: flex;

  flex-direction: row;
  align-items: center;

  gap: 0.5rem;

  cursor: pointer;

  transition: 0.2s ease;

  filter: brightness(${props => (props.selected ? 10 : 1)});

  &:hover {
    ${props =>
      !props.selected &&
      css`
        filter: brightness(1.5);
      `};
  }

  &:hover > div {
    display: flex;
    flex-direction: column;
  }
`;

export const MobileItem = styled(Item)`
  justify-content: flex-end;

  font-size: 1.25rem;
`;

export const Input = styled(DefaultInput)`
  margin-left: auto;
  width: 25%;
  border-color: ${props => props.theme.input.border.dark};

  @media (max-width: 1024px) {
    display: none;
  }
`;

export const DesktopContainer = styled.div`
  display: flex;

  flex-direction: row;
  justify-content: space-around;

  width: 100%;
  gap: 1.5rem;

  @media (max-width: 1024px) {
    display: none;
  }
`;

export const ConnectButton = styled.div`
  background-color: ${props => props.theme.navbar.text};
  padding: 0.6rem;
  border-radius: 0.3rem;
  color: ${props => props.theme.white};
  font-size: 0.9rem;

  cursor: pointer;

  input {
    display: none;
  }

  label {
    cursor: pointer;
  }
`;

export const ConnectContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  user-select: none;
`;

export const IconsMenu = styled.div`
  display: flex;

  flex-direction: row;
  align-items: center;

  gap: 1.5rem;

  @media (max-width: 1024px) {
    display: none;
  }
`;

export const MobileContainer = styled.div`
  margin-left: auto;

  display: flex;
  position: relative;

  @media (min-width: 1025px) {
    display: none;
  }
`;

export const MobileContent = styled.div<IMobileMenu>`
  padding: 1.5rem;

  height: 100vh;

  top: 4rem;
  right: ${props => (props.opened ? 0 : '-100%')};

  display: flex;
  position: fixed;

  z-index: 500 !important;

  flex-direction: column;

  gap: 1rem;

  background-color: ${props => props.theme.navbar.background};

  transition: 0.5s ease;

  ul > li {
    display: flex;
    justify-content: flex-end;
  }
`;

export const MobileBackground = styled.div<IMobileMenu>`
  width: 100vw;
  height: 100vh;

  top: 4rem;
  left: 0;

  position: absolute;

  z-index: 500 !important;

  opacity: ${props => (props.opened ? 1 : 0)};
  visibility: ${props => (props.opened ? 'visible' : 'hidden')};

  background-color: ${props => transparentize(0.7, props.theme.black)};

  transition: 0.5s ease;

  @media (min-width: 1025px) {
    display: none;
  }
`;

export const DropdownMenu = styled.ul`
  width: max-content;
  background-color: ${props => props.theme.navbar.background};
  color: ${props => props.theme.navbar.text};
  border-radius: 10px;
  gap: 0.5rem;

  @media (max-width: 1024px) {
    background-color: ${props => transparentize(0.7, props.theme.black)};
  }
`;

export const MenuTransaction = styled.ul`
  width: max-content;
  background-color: ${props => props.theme.navbar.background};
  color: ${props => props.theme.navbar.text};
  border-radius: 10px;
  gap: 0.5rem;
  margin-top: 0.3rem;

  @media (max-width: 1024px) {
    background-color: ${props => transparentize(0.7, props.theme.black)};
  }
`;

export const DropdownItem = styled.li`
  display: flex;
  gap: 0.5rem;
  list-style: none;

  align-items: center;

  &:hover {
    filter: brightness(1.8);
  }
  padding: 0.4rem 0.7rem;
  span {
    margin: 0 0.4rem 0 0.4em;
  }

  a {
    display: flex;
    flex-direction: row;
  }

  @media (max-width: 1024px) {
    span {
      margin: 0 0.4rem 0 0;
    }
  }
`;

export const DropdownIcon = styled(MdArrowDropDown)`
  font-size: 1.4rem;
`;

export const LogoutIcon = styled(IoIosLogOut)`
  color: ${props => props.theme.borderLogo};
  cursor: pointer;
`;

export const DropdownContainer = styled.div`
  display: none;
  padding: 1rem;
  position: absolute;
  top: 1rem;
  left: -1rem;

  @media (max-width: 1024px) {
    left: 0.4rem;
  }
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

  @media screen and (min-width: 768px) {
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
        color: ${props => props.theme.white};
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
  font-size: 0.75rem;
  margin-left: 0.8rem;

  &:hover {
    svg {
      filter: brightness(1.5);
    }
  }

  @media screen and (min-width: 768px) {
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
        content: 'Copy address';
        position: absolute;
        top: 1rem;
        left: 0;
        background-color: ${props => props.theme.card.background};
        color: ${props => props.theme.white};
        padding: 0.5rem;
        border-radius: 5px;
        z-index: 500;
        transform: translate(-50%, 40%);
      }
    }
  }
`;

export const MenuIcon = styled(FiMenu).attrs(props => ({
  color: props.theme.navbar.text,
  size: 24,
}))``;
