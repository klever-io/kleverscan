import { Search } from '@/assets/icons';
import { transparentize } from 'polished';
import { AiOutlineClose } from 'react-icons/ai';
import { FiMenu } from 'react-icons/fi';
import { MdArrowDropDown } from 'react-icons/md';
import styled, { css, keyframes } from 'styled-components';
import { default as DefaultInput } from '../InputGlobal';

interface IMobileMenu {
  opened: boolean;
  isOpenDrawer?: boolean;
}

export const Container = styled.div`
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  background-color: ${props => props.theme.navbar.background};
  border-bottom: 1px solid ${props => props.theme.footer.border};
  z-index: 6;
  transition: top 0.1s linear;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 1rem 1.5rem;

    justify-content: space-between;
  }
`;

export const NavBarOptionsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
  }
`;

export const Content = styled.div<{ isMainNet?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;

  position: relative;

  gap: 0.5rem;

  max-width: ${props => props.theme.maxWidth};

  margin: 0 auto;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    justify-content: space-between;
    min-height: ${props => (props.isMainNet ? '2.8rem' : '4rem')};
  }
`;

export const HeaderContainer = styled.span<{
  $isMainNet: boolean;
  $openSearch: boolean;
}>`
  display: ${props => (props.$openSearch ? 'none' : 'flex')};
  flex-direction: column;
  width: ${props => (props.$isMainNet ? '15rem' : '17rem')};
  span {
    color: ${props => props.theme.navbar.text};
    font-size: 0.8rem;
  }
`;

export const Logo = styled.div`
  margin-right: 0.5rem;
  min-width: 6rem;

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
  color: ${props => props.theme.navbar.text};
  font-size: 1.5rem;
`;

export const Input = styled(DefaultInput)`
  width: 19rem;
  background-color: ${props => props.theme.input.searchBar};
  border-color: ${props => props.theme.lightGray};
  input {
    color: ${props => props.theme.text.inputHeader};
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
  gap: 1rem;
  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 100%;
    max-width: 65vw;
  }
  animation: ${fadeInContainer} 0.3s;
`;

export const CloseSearch = styled(AiOutlineClose)<{ $openSearch: boolean }>`
  display: ${props => (props.$openSearch ? 'block' : 'none')};
  color: ${props => props.theme.true.white};
  height: 15px;
  width: 15px;
`;
export const SearchIcon = styled(Search)<{ $openSearch: boolean }>`
  display: ${props => (props.$openSearch ? 'none' : 'block')};
  & path {
    fill: ${props => props.theme.true.white};
  }
`;
export const DesktopContainer = styled.div`
  display: flex;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 0.5rem;
  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: none;
  }
`;

export const IconsMenu = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;

  gap: 1rem;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: none;
  }
`;

export const MobileContainer = styled.div<{ $openSearch: boolean }>`
  z-index: 6;
  position: relative;
  display: none;
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: ${props => (props.$openSearch ? '100%' : 'auto')};
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }
`;

export const MobileContent = styled.div<IMobileMenu>`
  padding: 1.5rem;
  height: calc(100vh - 4rem);

  top: 4rem;
  right: 0;

  transform: translateX(${props => (props.opened ? 0 : '100%')});

  display: flex;
  position: fixed;

  z-index: 6;

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
`;

export const MobileBackground = styled.div<IMobileMenu>`
  width: 100%;
  height: 100vh;

  top: 4rem;
  left: 0;

  position: fixed;

  z-index: 6;

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

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
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

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
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

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    background-color: ${props => transparentize(0.7, props.theme.black)};
  }
`;

export const DropdownIcon = styled(MdArrowDropDown)`
  font-size: 1.4rem;
`;

export const MenuIcon = styled(FiMenu).attrs(props => ({
  color: props.theme.true.white,
  size: 25,
}))`
  box-sizing: content-box;
  padding: 0.25rem 0.5rem;
`;

export const ConnectContainer = styled.div`
  display: flex;
  z-index: 2;
  align-items: center;
  gap: 0.3rem;
`;
