import React from 'react';

import Link from 'next/link';
import { isMobile } from 'react-device-detect';

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

  const handleMobileMenu = (behavior: 'open' | 'close' | undefined) => {
    const element = document.getElementById('mobile-menu');
    if (!element || !isMobile) return;

    const display = element.style.display;
    const hiddenTypes = ['none', ''];

    if (behavior) {
      element.style.display = behavior === 'open' ? 'flex' : 'none';
      return;
    }

    element.style.display = hiddenTypes.includes(display) ? 'flex' : 'none';
  };

  const MenuOptions: React.FC<INavbarItem> = ({
    pathTo,
    Icon,
    name,
    onClick,
  }) => (
    <Link href={pathTo} passHref>
      <Item onClick={onClick}>
        <Icon />
        <span>{name}</span>
      </Item>
    </Link>
  );

  return (
    <NavbarContainer id="navbar" background={haveBackground}>
      <Link href="/" passHref>
        <LogoContainer onClick={() => handleMobileMenu('close')}>
          <Logo alt="Klever Logo" />
        </LogoContainer>
      </Link>
      <ItemsContainer>
        {navbarItems.map((item, index) => (
          <MenuOptions key={index} {...item} />
        ))}
      </ItemsContainer>
      <MobileButton onClick={() => handleMobileMenu(undefined)}>
        <AiOutlineMenu />
      </MobileButton>
      <MobileContainer id="mobile-menu">
        {navbarItems.map((item, index) => (
          <MenuOptions
            key={index}
            onClick={() => handleMobileMenu(undefined)}
            {...item}
          />
        ))}
      </MobileContainer>
    </NavbarContainer>
  );
};

export default withTheme(Navbar);
