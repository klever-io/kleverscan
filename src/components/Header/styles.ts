import styled, { css } from 'styled-components';

import { FiMenu } from 'react-icons/fi';

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
`;

export const MobileItem = styled(Item)`
  justify-content: flex-end;

  font-size: 1.25rem;
`;

export const Input = styled(DefaultInput)`
  margin-left: auto;

  border-color: ${props => props.theme.input.border.dark};

  @media (max-width: 1024px) {
    display: none;
  }
`;

export const DesktopContainer = styled.div`
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

export const MenuIcon = styled(FiMenu).attrs(props => ({
  color: props.theme.navbar.text,
  size: 24,
}))``;
