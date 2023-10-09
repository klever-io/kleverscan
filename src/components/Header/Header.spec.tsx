import { fireEvent, screen } from '@testing-library/react';
import * as nextRouter from 'next/router';
import React from 'react';
import Navbar from '.';
import theme from '../../styles/theme';
import { renderWithTheme } from '../../test/utils/';
interface StyleProps {
  filter: string;
  cursor: string;
  transition: string;
}

describe('Component: Header/navbar', () => {
  const desktopNavBarItems = [
    'Blocks',
    'Accounts',
    'Transactions',
    'Assets',
    'Validators',
    // 'Nodes',
    'Proposals',
  ];

  const moreItems = [
    'Multisign',
    'Charts',
    'ITOs',
    'Encoding Converter',
    'Verify',
    'Marketplaces',
    'Feedback',
  ];

  const mobileNavBarItems = [...desktopNavBarItems, ...moreItems];

  jest.mock('next/router', () => ({
    useRouter() {
      return {
        route: '/',
        pathname: '',
      };
    },
  }));

  beforeEach(() => {
    jest.clearAllMocks();
    const useRouter = jest.spyOn(nextRouter, 'useRouter') as jest.Mock;
    useRouter.mockImplementation(() => ({
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
      push: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
      },
      beforePopState: jest.fn(() => null),
      prefetch: jest.fn(() => null),
    }));
  });

  it('Should render the navbar items ( Logo, Blocks, Accounts, Transactions, Assets, Validatores and More) - desktop version', () => {
    global.innerWidth = 1500;
    const { container } = renderWithTheme(<Navbar />);

    const logo = screen.getByAltText('Logo');
    expect(logo).toBeInTheDocument();

    const navbarElements = screen.getAllByTestId('navbar-item');

    desktopNavBarItems.forEach((item, index) => {
      expect(navbarElements[index]).toHaveTextContent(item);
    });
  });

  it(`Should have the correct style background for the navbar\'s container`, () => {
    const { container } = renderWithTheme(<Navbar />);
    expect(container.firstChild).toHaveStyle(`background: ${theme.white}`);
  });

  it('Should have the correct style for the navbar items - desktop version', () => {
    global.innerWidth = 1500;
    const { container } = renderWithTheme(<Navbar />);

    const navbarElements = screen.getAllByTestId('navbar-item');
    const style = {
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      gap: '0.5rem',
      cursor: 'pointer',
      transition: '0.2s ease',
    };

    navbarElements.forEach((item: HTMLElement) => {
      expect(item).toHaveStyle(style);
    });
  });

  it('Should not init with dropdown menu from "More" visible and match the style for the Dropdown" - desktop version', () => {
    global.innerWidth = 1500;
    const { container } = renderWithTheme(<Navbar />);

    const selector = `div > div > div:nth-child(1) > div:nth-child(6) div`;
    const dropDownContainer = container.querySelector(selector);
    const dropDownMenu = container.querySelector(`${selector} ul`);
    const dropDownContainerStyle = {
      display: 'none',
      position: 'absolute',
    };
    const dropDownMenuStyle = {
      display: 'block',
      backgroundColor: `${theme.white}`,
      'border-radius': '10px',
      visibility: 'visible',
    };

    expect(dropDownContainer).toHaveStyle(dropDownContainerStyle);
    expect(dropDownMenu).toHaveStyle(dropDownMenuStyle);
  });

  it('Should appear the navbar menu when click on the icon and when click again should disappear - mobile version', async () => {
    global.innerWidth = 500;

    const { container } = renderWithTheme(<Navbar />);

    const mobile = container.firstChild?.lastChild;
    const content = container.lastChild;
    const button = await screen.findByTestId('menu-icon');
    expect(mobile).toHaveStyle('position: relative');
    expect(content).toHaveStyle({ visibility: 'hidden', opacity: '0' });
    fireEvent.click(button);
    expect(content).toHaveStyle({ visibility: 'visible', opacity: '1' });

    fireEvent.click(button);
    expect(content).toHaveStyle({ visibility: 'hidden', opacity: '0' });
  });

  it('Should render the navbar items ( Logo, Blocks, Accounts, Transactions, Assets, Validatores and More) - Mobile version', () => {
    global.innerWidth = 500;

    const { container } = renderWithTheme(<Navbar />);
    const logo = screen.getByAltText('Logo');
    expect(logo).toBeInTheDocument();
    const navbarElements = screen.getAllByTestId('mobile-navbar-item');

    mobileNavBarItems.forEach((item, index) => {
      expect(navbarElements[index]).toHaveTextContent(item);
    });
  });

  it('Should change the overflow of the document.body when click to open mobile menu', () => {
    global.innerWidth = 500;
    const { container } = renderWithTheme(<Navbar />);
    const openMenuMobile = screen.getByTestId('menu-icon');
    fireEvent.click(openMenuMobile);
    expect(document.body.style.overflow).toBe('hidden');
  });
});
