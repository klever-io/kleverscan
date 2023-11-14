import { ArrowDropdown } from '@/assets/icons';
import { INavbarItem, navbarItems } from '@/configs/navbar';
import { useMobile } from '@/contexts/mobile';
import { useTheme } from '@/contexts/theme';
import { useScroll } from '@/utils/hooks';
import { getNetwork } from '@/utils/networkFunctions';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import NetworkRedirectButton from '../NetworkRedirectButton';
import ConnectWallet from './ConnectWallet';
import OptionsContainer from './OptionsContainer';
import {
  CloseSearch,
  ConnectContainer,
  ConnectionWrapper,
  Container,
  Content,
  DesktopContainer,
  DesktopSubWrapper,
  DropdownContainer,
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
  SearchContainer,
  SearchIcon,
  SearchIconWrapper,
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
        <ArrowDropdown />
      </Item>
    );
  }

  return (
    <Link href={pathTo}>
      <LinkStyled
        disabled={router.pathname.includes(name.toLowerCase())}
        href={pathTo}
      >
        <Item
          selected={router.pathname.includes(name.toLowerCase())}
          data-testid="navbar-item"
        >
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
      <a>
        <MobileItem
          onClick={onClick}
          selected={router.pathname.includes(name.toLowerCase())}
          data-testid="mobile-navbar-item"
        >
          <span>{name}</span>
        </MobileItem>
      </a>
    </Link>
  );
};

const Navbar: React.FC = () => {
  const {
    mobileNavbarRef,
    closeMenu,
    handleMenu,
    mobileMenuOpen,
    isTablet,
    isMobile,
  } = useMobile();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const prevScrollpos = useRef<number>(0);
  const router = useRouter();
  const { isDarkTheme } = useTheme();

  const handleMobileScroll = () => {
    const navbar = mobileNavbarRef.current;

    const currentScrollPos = window.pageYOffset;

    if (navbar === null) {
      return;
    }

    if (prevScrollpos.current > currentScrollPos) {
      navbar.style.top = '0';
    } else {
      navbar.style.top = '-10rem';
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
            isMainNet={network === 'Mainnet'}
            openSearch={!isTablet ? false : openSearch}
          >
            <Link href="/">
              <a>
                <Logo onClick={closeMenu}>
                  <Image
                    src={isDarkTheme ? '/logo-large.svg' : '/NewLogo.svg'}
                    alt="Logo"
                    width="215"
                    height="29"
                    loader={({ src, width }) => `${src}?w=${width}`}
                  />
                </Logo>
              </a>
            </Link>
            {network !== 'Mainnet' && (
              <span>Running on KleverChain {network}</span>
            )}
          </HeaderContainer>
          {!isTablet && (
            <>
              <DesktopContainer>
                <IconsMenu>
                  {navbarItems.map((item, index) => (
                    <NavbarItem key={String(index)} {...item} />
                  ))}
                </IconsMenu>
                <DesktopSubWrapper>
                  {router.pathname !== '/' && <Input />}
                  <ConnectWallet clickConnection={closeDrawer} />
                  <NetworkRedirectButton />
                  <OptionsContainer />
                </DesktopSubWrapper>
              </DesktopContainer>
            </>
          )}

          <MobileContainer $openSearch={openSearch}>
            {isMobile && router.pathname !== '/' && (
              <SearchIconWrapper
                onClick={() => setOpenSearch(!openSearch)}
                openSearch={openSearch}
              >
                <SearchIcon />
              </SearchIconWrapper>
            )}
            <SearchContainer $openSearch={openSearch}>
              {openSearch && (
                <Input setOpenSearch={setOpenSearch} openSearch={openSearch} />
              )}

              <CloseSearch
                onClick={() => setOpenSearch(false)}
                $openSearch={openSearch}
              />
            </SearchContainer>
            {!isMobile && (
              <>
                {router.pathname !== '/' && (
                  <SearchIconWrapper
                    onClick={() => setOpenSearch(!openSearch)}
                    openSearch={openSearch}
                  >
                    <SearchIcon />
                  </SearchIconWrapper>
                )}
                <ConnectContainer
                  onClick={() => {
                    handleClickConnection();
                    closeMenu();
                  }}
                >
                  <ConnectWallet clickConnection={closeDrawer} />
                </ConnectContainer>
                <NetworkRedirectButton />
              </>
            )}

            <MenuIcon onClick={handleMenu} data-testid="menu-icon" />
          </MobileContainer>
        </Content>

        {isMobile && (
          <ConnectionWrapper>
            <ConnectContainer
              onClick={() => {
                handleClickConnection();
                closeMenu();
              }}
            >
              <ConnectWallet clickConnection={closeDrawer} />
            </ConnectContainer>
            <NetworkRedirectButton />
          </ConnectionWrapper>
        )}
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
        <MobileNavbarItemList>
          <MobileOptions>
            <OptionsContainer />
          </MobileOptions>
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
