import { INavbarItem, navbarItems } from '@/configs/navbar';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import ConnectWallet from './ConnectWallet';
import {
  Container,
  DesktopContainer,
  DropdownContainer,
  DropdownIcon,
  DropdownItem,
  DropdownMenu,
  IconsMenu,
  Item,
  Logo,
  MenuIcon,
  MobileBackground,
  MobileContainer,
  MobileContent,
  MobileItem,
} from './styles';

interface IDropdownPages {
  page: INavbarItem;
  handleMenu?: () => void;
}

const DropdownDesktop = ({ page }: IDropdownPages) => {
  return (
    <DropdownItem>
      <Link href={page.pathTo}>
        <a>
          <page.Icon />
          <span>{page.name}</span>
        </a>
      </Link>
    </DropdownItem>
  );
};

const DropdownMobile = ({ page, handleMenu }: IDropdownPages) => {
  return (
    <DropdownItem onClick={handleMenu}>
      <Link href={page.pathTo}>
        <a>
          <span>{page.name}</span>
          <page.Icon />
        </a>
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
  const router = useRouter();

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

export const MobileNavbarItem: React.FC<INavbarItem> = ({
  name,
  Icon,
  pathTo,
  onClick,
  pages = [],
}) => {
  const router = useRouter();
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

  return (
    <>
      <Container>
        <Link href="/">
          <a>
            <Logo onClick={handleClose}>
              <Image src="/logo-large.svg" alt="Logo" width="215" height="29" />
            </Logo>
          </a>
        </Link>

        <DesktopContainer>
          <IconsMenu>
            {navbarItems.map((item, index) => (
              <NavbarItem key={String(index)} {...item} />
            ))}
          </IconsMenu>
          <ConnectWallet />
        </DesktopContainer>

        <MobileContainer>
          <MenuIcon onClick={handleMenu} />
        </MobileContainer>
      </Container>

      <MobileBackground onClick={handleClose} opened={isOpen} />

      <MobileContent opened={isOpen}>
        {navbarItems.map((item, index) => (
          <MobileNavbarItem
            key={String(index)}
            {...item}
            onClick={handleMenu}
          />
        ))}
        <ConnectWallet handleMenu={handleMenu} />
      </MobileContent>
    </>
  );
};

export default Navbar;
