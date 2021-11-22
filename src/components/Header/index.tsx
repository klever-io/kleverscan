import React from 'react';

import Link from 'next/link';

import { Container, Input, Item, Logo } from './styles';

import { INavbarItem, navbarItems } from '@/configs/navbar';

const Navbar: React.FC = () => {
  const NavbarItem: React.FC<INavbarItem> = ({ name, Icon, pathTo }) => {
    return (
      <Link href={pathTo}>
        <Item>
          <Icon />
          <span>{name}</span>
        </Item>
      </Link>
    );
  };

  return (
    <Container>
      <Link href="/">
        <Logo />
      </Link>

      {navbarItems.map((item, index) => (
        <NavbarItem key={String(index)} {...item} />
      ))}

      <Input />
    </Container>
  );
};

export default Navbar;
