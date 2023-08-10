import { INavbarItem, navbarItems } from '@/configs/navbar';
import { useMobile } from '@/contexts/mobile';
import { useScroll } from '@/utils/hooks';
import { getNetwork } from '@/utils/networkFunctions';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import CreateTxShortcut from '../CreateTxShortCut';
import ConnectWallet from './ConnectWallet';
import OptionsContainer from './OptionsContainer';
import {
  CloseSearch,
  ConnectContainer,
  Container,
  Content,
  DesktopContainer,
  DropdownContainer,
  DropdownIcon,
  DropdownItem,
  DropdownMenu,
  HeaderContainer,
  IconsMenu,
  Input,
  Item,
  LinkStyled,
  Logo,
  MenuIcon,
  MobileBackground,
  MobileContainer,
  MobileContent,
  MobileItem,
  MobileNavbarItemList,
  MobileOptions,
  NavBarOptionsContainer,
  SearchContainer,
  SearchIcon,
} from './styles';

interface IDropdownPages {
  page: INavbarItem;
  onClick?: () => void;
}

const NavbarItem: React.FC<INavbarItem> = ({
  name,
  Icon,
  pathTo,
  pages = [],
}) => {
  const router = useRouter();
  const DropdownDesktop = ({ page }: IDropdownPages) => {
    return (
      <DropdownItem
        disabled={router.pathname.includes(page.name.toLowerCase())}
      >
        <Link href={page.pathTo} data-testid="navbar-item">
          <a>
            <page.Icon />
            <span>{page.name}</span>
          </a>
        </Link>
      </DropdownItem>
    );
  };

  if (name === 'More') {
    return (
      <Item
        selected={router.pathname.includes(name.toLowerCase())}
        data-testid="navbar-item"
      >
        <span>{name}</span>
        <DropdownContainer>
          <DropdownMenu>
            {pages.map((page, index) => (
              <DropdownDesktop key={index} page={page} />
            ))}
          </DropdownMenu>
        </DropdownContainer>
        <span>
          <DropdownIcon />
        </span>
      </Item>
    );
  }

  return (
    <Link href={pathTo}>
      <LinkStyled
        disabled={router.pathname.includes(name.toLowerCase())}
        href={pathTo}
      >
        <Item selected={router.pathname.includes(name.toLowerCase())}>
          <Icon />
          <span>{name}</span>
        </Item>
      </LinkStyled>
    </Link>
  );
};

export const MobileNavbarItem: React.FC<INavbarItem> = ({
  name,
  Icon,
  pathTo,
  onClick,
  pages = [],
}) => {
  const router = useRouter();

  if (name === 'More') {
    return (
      <>
        {pages.map((item, index) => (
          <MobileNavbarItem key={String(index)} {...item} onClick={onClick} />
        ))}
      </>
    );
  }
  return (
    <Link href={pathTo}>
      <MobileItem
        onClick={onClick}
        selected={router.pathname.includes(name.toLowerCase())}
      >
        <span>{name}</span>
        <Icon />
      </MobileItem>
    </Link>
  );
};

const Navbar: React.FC = () => {
  const { mobileNavbarRef, closeMenu, handleMenu, mobileMenuOpen, isTablet } =
    useMobile();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const prevScrollpos = useRef<number>(0);
  const router = useRouter();

  const handleMobileScroll = () => {
    const navbar = mobileNavbarRef.current;

    const currentScrollPos = window.pageYOffset;

    if (navbar === null) {
      return;
    }

    if (prevScrollpos.current > currentScrollPos) {
      navbar.style.top = '0';
    } else {
      navbar.style.top = '-4.5rem';
    }
    prevScrollpos.current = currentScrollPos;
  };
  const handleClickConnection = () => {
    if (openDrawer) {
      setOpenDrawer(false);
    } else {
      setOpenDrawer(true);
    }
  };

  const closeDrawer = () => {
    setOpenDrawer(false);
  };

  const network = getNetwork();
  useScroll(isTablet, handleMobileScroll);

  return (
    <>
      <Container ref={mobileNavbarRef}>
        <Content isMainNet={network === 'Mainnet'}>
          <HeaderContainer
            $isMainNet={network === 'Mainnet'}
            $openSearch={!isTablet ? false : openSearch}
          >
            <Link href="/">
              <a>
                <Logo onClick={closeMenu}>
                  <Image
                    src="/logo-large.svg"
                    alt="Logo"
                    width="215"
                    height="29"
                  />
                </Logo>
              </a>
            </Link>
            {network !== 'Mainnet' && (
              <span>Running on KleverChain {network}</span>
            )}
          </HeaderContainer>
          {!isTablet && (
            <DesktopContainer>
              <IconsMenu>
                {navbarItems.map((item, index) => (
                  <NavbarItem key={String(index)} {...item} />
                ))}
              </IconsMenu>
              <NavBarOptionsContainer>
                <SearchContainer $openSearch={true}>
                  <Input />
                </SearchContainer>
                <ConnectWallet
                  clickConnection={() => {
                    openDrawer;
                  }}
                />
                <OptionsContainer />
              </NavBarOptionsContainer>
            </DesktopContainer>
          )}

          {isTablet && (
            <MobileContainer $openSearch={openSearch}>
              <SearchContainer $openSearch={openSearch}>
                {openSearch && <Input />}
                <CloseSearch
                  onClick={() => setOpenSearch(false)}
                  $openSearch={openSearch}
                />
              </SearchContainer>
              <ConnectContainer
                onClick={() => {
                  handleClickConnection();
                  closeMenu();
                }}
              >
                <SearchIcon
                  onClick={() => setOpenSearch(!openSearch)}
                  $openSearch={openSearch}
                />
                <ConnectWallet clickConnection={closeDrawer} />
                <MenuIcon onClick={handleMenu} data-testid="menu-icon" />
              </ConnectContainer>
            </MobileContainer>
          )}
        </Content>
        {router.pathname === '/' && <CreateTxShortcut />}
      </Container>

      <MobileBackground
        onClick={() => {
          closeMenu();
          setOpenDrawer(false);
        }}
        onTouchStart={closeMenu}
        opened={mobileMenuOpen}
      />

      <MobileContent opened={mobileMenuOpen} isOpenDrawer={openDrawer}>
        <MobileOptions>
          <OptionsContainer />
        </MobileOptions>
        <MobileNavbarItemList>
          {navbarItems.map((item, index) => (
            <MobileNavbarItem
              key={String(index)}
              {...item}
              onClick={handleMenu}
            />
          ))}
        </MobileNavbarItemList>
      </MobileContent>
    </>
  );
};

export default Navbar;