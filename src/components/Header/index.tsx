import React from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import { Container, Input, Item, Logo } from './styles';

import { INavbarItem, navbarItems } from '@/configs/navbar';

const Navbar: React.FC = () => {
  const router = useRouter();

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
