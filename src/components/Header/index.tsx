import React, { useEffect, useState } from 'react';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

import {
  Container,
  DesktopContainer,
  Input,
  Item,
  Logo,
  MenuIcon,
  MobileBackground,
  MobileContainer,
  MobileContent,
  MobileItem,
} from './styles';

import { INavbarItem, navbarItems } from '@/configs/navbar';

const Navbar: React.FC = () => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'visible';
  }, [isOpen]);

  const handleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  const NavbarItem: React.FC<INavbarItem> = ({ name, Icon, pathTo }) => {
    return (
      <Link href={pathTo}>
        <Item selected={router.pathname.includes(name.toLowerCase())}>
          <Icon />
          <span>{name}</span>
        </Item>
      </Link>
    );
  };

  const MobileNavbarItem: React.FC<INavbarItem> = ({ name, Icon, pathTo }) => {
    return (
      <Link href={pathTo}>
        <MobileItem
          onClick={handleMenu}
          selected={router.pathname.includes(name.toLowerCase())}
        >
          <span>{name}</span>
          <Icon />
        </MobileItem>
      </Link>
    );
  };

  return (
    <>
      <Container>
        <Link href="/">
          <Logo onClick={handleClose}>
            <Image src="/logo-large.png" alt="Logo" width="215" height="29" />
          </Logo>
        </Link>

        <DesktopContainer>
          {navbarItems.map((item, index) => (
            <NavbarItem key={String(index)} {...item} />
          ))}
        </DesktopContainer>

        <MobileContainer>
          <MenuIcon onClick={handleMenu} />
        </MobileContainer>
      </Container>

      <MobileBackground onClick={handleClose} opened={isOpen} />

      <MobileContent opened={isOpen}>
        {navbarItems.map((item, index) => (
          <MobileNavbarItem key={String(index)} {...item} />
        ))}
      </MobileContent>
    </>
  );
};

export default Navbar;
