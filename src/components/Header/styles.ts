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

  display: flex;
  position: relative;

  flex-direction: row;
  align-items: center;

  gap: 0.5rem;

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
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 0.5rem;

  @media (max-width: 1024px) {
    display: none;
  }
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

  height: calc(100vh - 4rem);

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
  left: 0;

  animation: ${expand} 0.2s ease;

  background-color: ${props => props.theme.navbar.background};

  border-radius: 0 0 0.5rem 0.5rem;

  transform: translateY(100%);

  @media (max-width: 1024px) {
    left: 0.4rem;
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

export const DropdownIcon = styled(MdArrowDropDown)`
  font-size: 1.4rem;
`;

export const MenuIcon = styled(FiMenu).attrs(props => ({
  color: props.theme.navbar.text,
  size: 24,
}))``;
