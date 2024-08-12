import { Search } from '@/assets/icons';
import { transparentize } from 'polished';
import { AiOutlineClose } from 'react-icons/ai';
import { HiOutlineMenuAlt2 } from 'react-icons/hi';
import styled, { css, keyframes } from 'styled-components';
import { default as DefaultInput } from '../InputGlobal';
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
  background-color: ${props =>
    props.theme.dark ? props.theme.background : props.theme.true.white};
  border-bottom: 1px solid
    ${props => (props.theme.dark ? props.theme.blue : props.theme.black10)};
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
  openSearch: boolean;
}>`
  flex-direction: column;
  width: ${props => (props.isMainNet ? '15rem' : '17rem')};
  display: ${props => (props.openSearch ? 'none' : 'flex')};
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

export const Input = styled(DefaultInput)`
  border-color: ${props => props.theme.lightGray};
  padding: 0.5rem 1rem;
  max-width: 30rem;
  input {
    color: ${props => props.theme.text.inputHeader};
    font-size: 0.9rem;
    &::placeholder {
      color: ${props => props.theme.text.inputHeader};
    }
  }
  input:placeholder-shown {
    text-overflow: ellipsis;
  }
  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 100%;
  }
`;

const fadeInContainer = keyframes`
  from {
    opacity: 0.3;
    transform: translateX(-50%);

  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const SearchContainer = styled.div<{ $openSearch: boolean }>`
  display: ${props => (props.$openSearch ? 'flex' : 'none')};
  align-items: center;
  width: 20vw;
  max-width: 20rem;
  gap: 0.2rem;
  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 100%;
    max-width: 65vw;
  }
  animation: ${fadeInContainer} 0.3s;
`;

export const CloseSearch = styled(AiOutlineClose)<{ $openSearch: boolean }>`
  display: ${props => (props.$openSearch ? 'block' : 'none')};
  color: ${props => props.theme.black};
  padding: 0.3rem;

  height: 1.7rem;
  width: 1.7rem;
  cursor: pointer;
`;
export const SearchIcon = styled(Search)`
  & path {
    fill: ${props => props.theme.black};
  }
  cursor: pointer;
  overflow: visible;
`;

export const SearchIconWrapper = styled.div<{ openSearch: boolean }>`
  display: ${props => (props.openSearch ? 'none' : 'grid')};
  padding: 0.5rem;
  place-items: center;
  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 1rem;
  }
  cursor: pointer;
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

export const MobileContainer = styled.div<{ $openSearch: boolean }>`
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
    width: ${props => (props.$openSearch ? '100%' : 'auto')};
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
    ${props => (props.theme.dark ? props.theme.blue : props.theme.black10)};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
