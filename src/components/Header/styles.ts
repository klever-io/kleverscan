import { transparentize } from 'polished';
import { FiMenu } from 'react-icons/fi';
import { MdArrowDropDown } from 'react-icons/md';
import styled, { css, keyframes } from 'styled-components';
import { default as DefaultInput } from '../Inputt';

interface IMobileMenu {
  opened: boolean;
}

export const Container = styled.div`
  padding: 1rem 2rem;

  position: sticky;
  top: 0;
  left: 0;
  right: 0;

  background-color: ${props => props.theme.navbar.background};

  z-index: 1000;

  transition: top 0.1s linear;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 1rem 2.5rem;

    overflow: hidden;

    justify-content: space-between;
  }
`;

export const NavBarOptionsContainer = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  position: relative;

  gap: 0.5rem;

  max-width: ${props => props.theme.maxWidth};

  margin: 0 auto;
`;

export const Logo = styled.div`
  margin-right: 0.5rem;

  cursor: pointer;
`;

export const Item = styled.div<{ selected: boolean }>`
  display: flex;

  flex-direction: row;
  align-items: center;

  position: relative;

  gap: 0.5rem;

  cursor: pointer;

  transition: 0.2s ease;

  filter: brightness(${props => (props.selected ? 2.5 : 1)});

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

  pointer-events: ${props => (props.selected ? 'none' : 'all')};
  cursor: 'default';
`;

export const LinkStyled = styled.a<{ disabled: boolean }>`
  pointer-events: ${props => (props.disabled ? 'none' : 'all')};
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
`;

export const MobileItem = styled(Item)`
  justify-content: flex-end;

  font-size: 1.5rem;
`;

export const Input = styled(DefaultInput)`
  margin-left: auto;
  width: 25%;
  border-color: ${props => props.theme.darkText};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: none;
  }
`;

export const DesktopContainer = styled.div`
  display: flex;

  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 0.5rem;
  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: none;
  }
`;

export const IconsMenu = styled.div`
  display: flex;

  flex-direction: row;
  align-items: center;

  gap: 1.5rem;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: none;
  }
`;

export const MobileContainer = styled.div`
  margin-left: auto;

  position: relative;
  display: none;

  @media (max-width: 768px) {
    display: flex;
  }
`;

export const MobileContent = styled.div<IMobileMenu>`
  padding: 1.5rem;

  height: calc(100vh - 4rem);

  top: 4rem;
  right: ${props => (props.opened ? 0 : '-100%')};

  display: flex;
  position: fixed;

  z-index: 1000 !important;

  flex-direction: column;

  gap: 1.5rem;

  background-color: ${props => props.theme.navbar.background};

  transition: 0.3s ease-out;

  visibility: ${props => (props.opened ? 'visible' : 'hidden')};
  opacity: ${props => (props.opened ? 1 : 0)};

  ul > li {
    display: flex;
    justify-content: flex-end;
  }
`;

export const MobileOptions = styled.div`
  padding: 0.5rem 0;

  z-index: 10;
  > div {
    gap: 1.5rem;

    > div:last-child {
      padding-left: 1.5rem;
    }
  }
`;

export const MobileNavbarItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  overflow-y: auto;
`;

export const MobileBackground = styled.div<IMobileMenu>`
  width: 100%;
  height: 100vh;

  top: 4rem;
  left: 0;

  position: fixed;

  z-index: 1000 !important;

  opacity: ${props => (props.opened ? 1 : 0)};
  visibility: ${props => (props.opened ? 'visible' : 'hidden')};

  background-color: ${props =>
    transparentize(props.theme.dark ? 0.85 : 0.7, props.theme.black)};

  transition: opacity 0.5s ease, visibility 0.5s ease;
`;

const expand = keyframes`
  0% {
    transform: translateY(90%);
    opacity: 0;
  }
  100% {
    transform: translateY(100%);
    opacity: 1;
  }
`;

export const DropdownContainer = styled.div`
  display: none;
  position: absolute;
  bottom: 0;
  right: 0.4vw;

  animation: ${expand} 0.2s ease;

  background-color: ${props => props.theme.navbar.background};

  border-radius: 0 0 0.5rem 0.5rem;

  transform: translateY(100%);

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    left: 0.4rem;
  }
`;
export const DropdownItem = styled.li<{ disabled: boolean }>`
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
    pointer-events: ${props => (props.disabled ? 'none' : 'all')};
  }
  cursor: ${props => (props.disabled ? 'default' : 'pointer')};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    span {
      margin: 0 0.4rem 0 0;
    }
  }
`;

export const DropdownMenu = styled.ul`
  width: max-content;
  background-color: ${props => props.theme.navbar.background};
  color: ${props => props.theme.navbar.text};
  border-radius: 10px;
  gap: 0.5rem;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    background-color: ${props => transparentize(0.7, props.theme.black)};
  }
`;

export const DropdownIcon = styled(MdArrowDropDown)`
  font-size: 1.4rem;
`;

export const MenuIcon = styled(FiMenu).attrs(props => ({
  color: props.theme.navbar.text,
  size: 24,
}))``;
