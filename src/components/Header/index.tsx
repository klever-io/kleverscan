import React, { useEffect, useState } from 'react';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

import {
  Container,
  DesktopContainer,
  DropdownMenu,
  Input,
  Item,
  Logo,
  MenuIcon,
  MobileBackground,
  MobileContainer,
  MobileContent,
  MobileItem,
  DropdownIcon,
  DropdownContainer,
  DropdownItem,
} from './styles';

import { INavbarItem, navbarItems } from '@/configs/navbar';

interface IDropdownPages {
  page: INavbarItem;
}

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

  const DropdownDesktop = ({ page }: IDropdownPages) => {
    return (
      <DropdownItem>
        <Link href={page.pathTo}>
          <page.Icon />
        </Link>
        <Link href={page.pathTo}>
          <a>
            <span>{page.name}</span>
          </a>
        </Link>
      </DropdownItem>
    );
  };

  const DropdownMobile = ({ page }: IDropdownPages) => {
    return (
      <DropdownItem onClick={handleMenu}>
        <Link href={page.pathTo}>
          <span>{page.name}</span>
        </Link>
        <Link href={page.pathTo}>
          <page.Icon />
        </Link>
      </DropdownItem>
    );
  };

  const NavbarItem: React.FC<INavbarItem> = ({
    name,
    Icon,
    pathTo,
    pages = [],
  }) => {
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
        <a>
          <Item selected={router.pathname.includes(name.toLowerCase())}>
            <Icon />
            <span>{name}</span>
          </Item>
        </a>
      </Link>
    );
  };

  const MobileNavbarItem: React.FC<INavbarItem> = ({
    name,
    Icon,
    pathTo,
    pages = [],
  }) => {
    const [showMore, setShowMore] = useState(false);
    const handleClick = () => {
      setShowMore(!showMore);
    };
    if (name === 'More') {
      return (
        <MobileItem
          onClick={handleClick}
          selected={router.pathname.includes(name.toLowerCase())}
        >
          <span>{name}</span>
          {showMore && (
            <DropdownContainer>
              <DropdownMenu>
                {pages.map((page, index) => (
                  <DropdownMobile key={index} page={page} />
                ))}
              </DropdownMenu>
            </DropdownContainer>
          )}
          <span>
            <DropdownIcon />
          </span>
        </MobileItem>
      );
    }
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
          <a>
            <Logo onClick={handleClose}>
              <Image src="/logo-large.png" alt="Logo" width="215" height="29" />
            </Logo>
          </a>
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
