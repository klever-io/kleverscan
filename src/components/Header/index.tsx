import { PropsWithChildren } from 'react';
import { ArrowDropdown, Search } from '@/assets/icons';
import { INavbarItem, navbarItems } from '@/configs/navbar';
import { useMobile } from '@/contexts/mobile';
import { useSpotlight } from '@/contexts/spotlight';
import { useTheme } from '@/contexts/theme';
import { useScroll } from '@/utils/hooks';
import { getNetwork } from '@/utils/networkFunctions';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import ConnectWallet from './ConnectWallet';
import OptionsContainer from './OptionsContainer';
import {
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
  SpotlightTrigger,
} from './styles';

interface IDropdownPages {
  page: INavbarItem;
  onClick?: () => void;
}

const NavbarItem: React.FC<PropsWithChildren<INavbarItem>> = ({
  name,
  pathTo,
  pages = [],
}) => {
  const router = useRouter();
  const DropdownDesktop = ({ page }: IDropdownPages) => {
    return (
      <DropdownItem disabled={router.pathname === page.pathTo}>
        <Link href={page.pathTo} data-testid="navbar-item">
          <span>{page.name}</span>
        </Link>
      </DropdownItem>
    );
  };

  if (name === 'More') {
    return (
      <Item selected={router.pathname === pathTo} data-testid="navbar-item">
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
    <Link href={pathTo} legacyBehavior>
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

export const MobileNavbarItem: React.FC<PropsWithChildren<INavbarItem>> = ({
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
        selected={router.pathname === pathTo}
        data-testid="mobile-navbar-item"
      >
        <span>{name}</span>
      </MobileItem>
    </Link>
  );
};

const Navbar: React.FC<PropsWithChildren> = () => {
  const {
    mobileNavbarRef,
    closeMenu,
    handleMenu,
    mobileMenuOpen,
    isTablet,
    isCompactHeader,
  } = useMobile();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [modKey, setModKey] = useState('⌘');
  const prevScrollpos = useRef<number>(0);
  const router = useRouter();
  const { isDarkTheme } = useTheme();
  const { openSpotlight } = useSpotlight();
  // Home uses HomeSpotlightHero as the primary CTA — avoid a second Spotlight control.
  const showHeaderSpotlight = router.pathname !== '/';

  useEffect(() => {
    const isApple = /Mac|iPhone|iPad|iPod/i.test(navigator.platform);
    setModKey(isApple ? '⌘' : 'Ctrl');
  }, []);

  // The navbar wraps to a second line below 1440px, so anything sticking
  // underneath it has to follow its real height rather than assume one.
  useEffect(() => {
    const navbar = mobileNavbarRef.current;
    if (!navbar || typeof ResizeObserver === 'undefined') return;

    const publishHeight = () => {
      document.documentElement.style.setProperty(
        '--navbar-height',
        `${Math.round(navbar.getBoundingClientRect().height)}px`,
      );
    };

    publishHeight();
    const observer = new ResizeObserver(publishHeight);
    observer.observe(navbar);
    return () => observer.disconnect();
  }, [mobileNavbarRef]);

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
          <HeaderContainer isMainNet={network === 'Mainnet'}>
            <Link href="/">
              <Logo onClick={closeMenu}>
                <Image
                  src={isDarkTheme ? '/logo-large.svg' : '/NewLogo.svg'}
                  alt="Logo"
                  width="215"
                  height="29"
                  loader={({ src, width }) => `${src}?w=${width}`}
                />
              </Logo>
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
                  {showHeaderSpotlight && (
                    <SpotlightTrigger
                      type="button"
                      onClick={() => openSpotlight()}
                      aria-label="Open spotlight search"
                      data-testid="spotlight-trigger"
                      title="Open spotlight (⌘K / Ctrl+K)"
                    >
                      <Search />
                      <span>Spotlight</span>
                      <kbd>{modKey}K</kbd>
                    </SpotlightTrigger>
                  )}
                  <ConnectWallet clickConnection={closeDrawer} />
                  <OptionsContainer />
                </DesktopSubWrapper>
              </DesktopContainer>
            </>
          )}

          {isTablet && (
            <MobileContainer>
              {showHeaderSpotlight && (
                <SpotlightTrigger
                  type="button"
                  onClick={() => openSpotlight()}
                  aria-label="Open spotlight search"
                  data-testid="spotlight-trigger-mobile"
                  title="Open spotlight"
                >
                  {/* No shortcut badge here: this variant renders on screens
                      that answer to touch, where a key hint is noise. The
                      label stays as long as the row can hold it. */}
                  <Search />
                  <span>Spotlight</span>
                </SpotlightTrigger>
              )}
              {!isCompactHeader && (
                <ConnectContainer
                  onClick={() => {
                    handleClickConnection();
                    closeMenu();
                  }}
                >
                  <ConnectWallet clickConnection={closeDrawer} />
                </ConnectContainer>
              )}

              <MenuIcon onClick={handleMenu} data-testid="menu-icon" />
            </MobileContainer>
          )}
        </Content>

        {isCompactHeader && (
          <ConnectionWrapper>
            <ConnectContainer
              onClick={() => {
                handleClickConnection();
                closeMenu();
              }}
            >
              <ConnectWallet clickConnection={closeDrawer} />
            </ConnectContainer>
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
