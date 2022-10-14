import { INavbarItem, navbarItems } from '@/configs/navbar';
import { useMobile } from '@/contexts/mobile';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useRef } from 'react';
import ConnectWallet from './ConnectWallet';
import OptionsContainer from './OptionsContainer';
import {
  Container,
  Content,
  DesktopContainer,
  DropdownContainer,
  DropdownIcon,
  DropdownItem,
  DropdownMenu,
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
  NavBarOptionsContainer,
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

  const { isMobile } = useMobile();

  const DropdownDesktop = ({ page }: IDropdownPages) => {
    return (
      <DropdownItem
        disabled={router.pathname.includes(page.name.toLowerCase())}
      >
        <Link href={page.pathTo}>
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
      <Item selected={router.pathname.includes(name.toLowerCase())}>
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
      <LinkStyled disabled={router.pathname.includes(name.toLowerCase())}>
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
  const { mobileNavbarRef, closeMenu, handleMenu, isMobile, mobileMenuOpen } =
    useMobile();
  const prevScrollpos = useRef<number>(0);

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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isMobile) {
        window.addEventListener('scroll', handleMobileScroll);
      } else {
        window.removeEventListener('scroll', handleMobileScroll);
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', handleMobileScroll);
      }
    };
  }, [isMobile]);

  return (
    <>
      <Container ref={mobileNavbarRef}>
        <Content>
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

          <DesktopContainer>
            <IconsMenu>
              {navbarItems.map((item, index) => (
                <NavbarItem key={String(index)} {...item} />
              ))}
            </IconsMenu>
            <NavBarOptionsContainer>
              <ConnectWallet />
              <OptionsContainer />
            </NavBarOptionsContainer>
          </DesktopContainer>

          <MobileContainer>
            <MenuIcon onClick={handleMenu} />
          </MobileContainer>
        </Content>
      </Container>

      <MobileBackground
        onClick={closeMenu}
        onTouchStart={closeMenu}
        opened={mobileMenuOpen}
      />

      <MobileContent opened={mobileMenuOpen}>
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

        <ConnectWallet />
      </MobileContent>
    </>
  );
};

export default Navbar;
