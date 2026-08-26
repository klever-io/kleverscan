import { transparentize } from 'polished';
import { HiOutlineMenuAlt2 } from 'react-icons/hi';
import styled, { css, keyframes } from 'styled-components';
import { DefaultCardStyleWithBorder } from '@/styles/common';

interface IMobileMenu {
  opened: boolean;
  isOpenDrawer?: boolean;
}

export const Container = styled.div`
  padding: 0;
  min-height: 2.5rem;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 6;
  transition: top 0.1s linear;
  /* The raised surface, the same one the cards and tables sit on: #fff in the
     light theme, #151515 in the dark one. Reading the background token for
     dark gave the bar the page's own colour, so it had no edge of its own and
     only its hairline told a reader where the chrome ended. Identical in
     light, where both tokens are #fff. */
  background-color: ${props => props.theme.white};
  border-bottom: 1px solid
    ${props => (props.theme.dark ? props.theme.black20 : props.theme.black10)};
  @media (min-width: ${props => props.theme.breakpoints.mobile}) {
    width: 100%;
    justify-content: space-between;
  }
`;

export const NavBarOptionsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  width: 30vw;
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
    gap: 2rem;
  }
`;

export const Content = styled.div<{ isMainNet?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  justify-content: space-between;
  gap: 1.5rem;
  max-width: ${props => props.theme.headerMaxWidth};
  margin: 0 auto;
  padding: 0.75rem 1.5rem;
`;

export const HeaderContainer = styled.span<{
  isMainNet: boolean;
}>`
  flex-direction: column;
  width: ${props => (props.isMainNet ? '15rem' : '17rem')};
  display: flex;
  span {
    color: ${props => props.theme.navbar.text};
    font-size: 0.8rem;
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 18rem;
  }
`;

export const Logo = styled.div`
  margin-right: 0.5rem;
  min-width: 6rem;
  display: flex;
  align-items: center;
  span {
    fill: ${props => props.theme.dark && props.theme.true.white};
    svg {
      path {
        fill: ${props => props.theme.dark && props.theme.true.white};
      }
    }
  }
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

  span {
    color: ${({ theme, selected }) => (selected ? theme.violet : theme.black)};
  }
  svg {
    path {
      fill: ${props =>
        props.theme.dark ? props.theme.true.white : props.theme.true.black};
    }
  }
  &:hover > span {
    color: ${props => props.theme.violet};
  }

  &:hover > div {
    display: flex;
    flex-direction: column;
  }

  pointer-events: ${props => (props.selected ? 'none' : 'all')};
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
  justify-content: flex-start;
  color: ${props => props.theme.navbar.text};
  font-size: 1.5rem;
`;

export const DesktopContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 1rem;
  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: none;
  }
`;

export const DesktopSubWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1.5rem;

  width: 100%;
`;

export const SpotlightTrigger = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  flex-shrink: 0;
  height: 2.5rem;
  padding: 0 0.7rem 0 0.75rem;
  border-radius: 999px;
  cursor: pointer;
  color: ${props =>
    props.theme.dark ? props.theme.lightGray : props.theme.gray800};
  background: ${props =>
    props.theme.dark ? 'rgba(255, 255, 255, 0.04)' : props.theme.true.white};
  border: 1px solid
    ${props =>
      props.theme.dark ? 'rgba(255, 255, 255, 0.1)' : props.theme.black10};
  transition:
    border-color 0.15s ease,
    background 0.15s ease;

  span {
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    white-space: nowrap;
  }

  kbd {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.4rem;
    height: 1.25rem;
    padding: 0 0.35rem;
    border-radius: 6px;
    font-size: 0.68rem;
    font-weight: 700;
    font-family: inherit;
    color: ${props =>
      props.theme.dark ? 'rgba(198, 199, 235, 0.85)' : props.theme.gray800};
    background: ${props =>
      props.theme.dark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)'};
    border: 1px solid
      ${props =>
        props.theme.dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'};
  }

  svg {
    width: 0.9rem;
    height: 0.9rem;
    path {
      fill: ${props =>
        props.theme.dark ? props.theme.lightGray : props.theme.gray800};
    }
  }

  &:hover {
    border-color: ${props =>
      props.theme.dark ? 'rgba(125, 63, 241, 0.45)' : props.theme.purple};
    background: ${props =>
      props.theme.dark
        ? 'rgba(125, 63, 241, 0.08)'
        : 'rgba(125, 63, 241, 0.06)'};
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    height: 2.25rem;
    padding: 0 0.6rem;

    span {
      display: none;
    }
  }
`;

export const IconsMenu = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  align-content: flex-start;
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: none;
  }
`;

export const MobileContainer = styled.div`
  z-index: 6;
  position: relative;
  display: none;
  svg {
    path {
      color: ${props => props.theme.dark && props.theme.true.white};
      fill: ${props => props.theme.dark && props.theme.true.white};
    }
  }
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }
`;

export const MobileContent = styled.div<IMobileMenu>`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  padding: 1.5rem;
  height: 100vh;

  right: 0;

  transform: translateX(${props => (props.opened ? 0 : '100%')});
  transition: 0.3s ease-out;

  position: fixed;

  z-index: 12;

  background-color: ${props =>
    props.theme.dark ? props.theme.navbar.background : props.theme.true.white};

  visibility: ${props => (props.opened ? 'visible' : 'hidden')};
  opacity: ${props => (props.opened ? 1 : 0)};

  ul > li {
    display: flex;
    justify-content: flex-end;
  }
`;

export const MobileOptions = styled.div`
  padding: 0.5rem 0;

  z-index: 1;
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
  padding-right: 0.5rem;
  margin-bottom: 10rem;
  padding-bottom: 3rem;

  mask-image: linear-gradient(to bottom, black 85%, transparent);

  &::-webkit-scrollbar {
    position: absolute;
    width: 0.25rem;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
    margin: 0.75rem;
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

export const MobileBackground = styled.div<IMobileMenu>`
  width: 100%;
  height: 100vh;

  left: 0;

  position: fixed;

  z-index: 7;
  opacity: ${props => (props.opened ? 1 : 0)};
  visibility: ${props => (props.opened ? 'visible' : 'hidden')};

  background-color: ${props =>
    transparentize(props.theme.dark ? 0.85 : 0.7, props.theme.black)};

  transition:
    opacity 0.5s ease,
    visibility 0.5s ease;
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
  right: -5vw;
  animation: ${expand} 0.2s ease;

  border-radius: 0 0 0.5rem 0.5rem;

  transform: translateY(100%);

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    left: 0.4rem;
  }
`;
export const DropdownItem = styled.li<{ disabled: boolean }>`
  display: flex;
  gap: 0.5rem;
  list-style: none;
  align-items: center;
  padding: 0.4rem 0.7rem;
  span {
    color: ${({ theme, disabled }) => (disabled ? theme.violet : theme.black)};
    &:hover {
      color: ${({ theme }) => theme.violet};
    }
    font-weight: 500;
    width: 100%;
  }

  a {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    pointer-events: ${props => (props.disabled ? 'none' : 'all')};
  }
  cursor: ${props => (props.disabled ? 'default' : 'pointer')};

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    span {
      margin: 0 0.4rem 0 0;
    }
  }
`;

export const DropdownMenu = styled.ul`
  ${DefaultCardStyleWithBorder}
  width: max-content;
  padding: 0.7rem;
  background-color: ${props =>
    props.theme.dark ? '#151515' : props.theme.true.white};
  border-radius: 10px;
`;

export const MenuIcon = styled(HiOutlineMenuAlt2).attrs(props => ({
  color: props.theme.true.black,
  size: 26,
}))`
  box-sizing: content-box;
  padding: 0.3rem 0;
  margin-left: 1.5rem;
  min-width: 2rem;
  cursor: pointer;
`;

export const ConnectContainer = styled.div`
  display: flex;
  width: 100%;
  z-index: 5;
  position: sticky;
  align-items: center;
  gap: 0.3rem;
  span {
    color: ${props => props.theme.dark && props.theme.true.white};
  }

  @media (min-width: ${props => props.theme.breakpoints.mobile}) {
    z-index: 12;
  }
`;

export const SvgWrapper = styled.div`
  align-items: center;
  gap: 0.3rem;
  display: flex;
  justify-content: center;
`;

export const ConnectionWrapper = styled.div`
  width: 100%;
  position: relative;
  z-index: 3;
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid
    ${props => (props.theme.dark ? props.theme.black20 : props.theme.black10)};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
