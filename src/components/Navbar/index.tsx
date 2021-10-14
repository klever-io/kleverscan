import React from 'react';

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

import { navbarItems, INavbarItem } from '../../configs/navbar';

import { AiOutlineMenu } from 'react-icons/ai';
import { withTheme } from 'styled-components';

export interface INavbar {
  background: boolean;
  theme: Theme;
}

const Navbar: React.FC<INavbar> = ({ background }) => {
  const haveBackground = background === undefined ? true : background;

  const handleMobileMenu = () => {
    const element = document.getElementById('mobile-menu');
    if (!element) return;

    const display = element.style.display;
    const hiddenTypes = ['none', ''];

    element.style.display = hiddenTypes.includes(display) ? 'flex' : 'none';
  };

  // TODO: Scroll behavior

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
