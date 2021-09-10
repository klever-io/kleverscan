import React, { useEffect } from 'react';

import Link from 'next/link';

import {
  Item,
  ItemsContainer,
  LogoContainer,
  MobileButton,
  MobileContainer,
  NavbarContainer,
} from './styles';
import { Theme } from '../../styles/styles';

import Logo from '../../assets/logo.svg';

import { navbarItems, heightLimit, INavbarItem } from '../../configs/navbar';

import { AiOutlineMenu } from 'react-icons/ai';
import { withTheme } from 'styled-components';

export interface INavbar {
  background: boolean;
  theme: Theme;
}

interface IElement {
  position: string;
  top: string;
  backgroundColor: string;
  marginTop: string;
}

const Navbar: React.FC<INavbar> = ({ background, theme }) => {
  const haveBackground = background === undefined ? true : background;

  useEffect(() => {
    const scrollHandle = () => {
      const element = document.getElementById('navbar');
      const main = document.getElementsByTagName('main')[0];
      if (!element || !main) return;

      const passLimit = window.pageYOffset > heightLimit;
      const fixed: IElement = {
        position: 'fixed',
        top: '0',
        backgroundColor: theme.navbar.background,
        marginTop: '8.9375rem',
      };
      const unset: IElement = {
        position: 'unset',
        top: 'unset',
        backgroundColor: haveBackground
          ? theme.navbar.background
          : 'transparent',
        marginTop: 'unset',
      };

      const props = passLimit ? fixed : unset;

      Object.keys(props).map(item => {
        const el = item === 'marginTop' ? main : element;

        el.style[item] = props[item];
      });
    };

    document.addEventListener('scroll', scrollHandle);

    return () => {
      document.removeEventListener('scroll', scrollHandle);
    };
  }, [theme, haveBackground]);

  const handleMobileMenu = () => {
    const element = document.getElementById('mobile-menu');
    if (!element) return;

    const display = element.style.display;
    const hiddenTypes = ['none', ''];

    element.style.display = hiddenTypes.includes(display) ? 'flex' : 'none';
  };

  const MenuOptions: React.FC<INavbarItem> = ({ pathTo, Icon, name }) => (
    <Link href={pathTo} passHref>
      <Item>
        <Icon />
        <span>{name}</span>
      </Item>
    </Link>
  );

  return (
    <NavbarContainer id="navbar" background={haveBackground}>
      <Link href="/" passHref>
        <LogoContainer>
          <Logo alt="Klever Logo" />
        </LogoContainer>
      </Link>
      <ItemsContainer>
        {navbarItems.map((item, index) => (
          <MenuOptions key={index} {...item} />
        ))}
      </ItemsContainer>
      <MobileButton onClick={handleMobileMenu}>
        <AiOutlineMenu />
      </MobileButton>
      <MobileContainer id="mobile-menu">
        {navbarItems.map((item, index) => (
          <MenuOptions key={index} {...item} />
        ))}
      </MobileContainer>
    </NavbarContainer>
  );
};

export default withTheme(Navbar);
