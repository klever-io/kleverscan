import React from 'react';
import * as nextRouter from 'next/router';

import { fireEvent, screen } from '@testing-library/react';

import theme from '../../styles/theme';

import Navbar from '.';
import { renderWithTheme } from '../../test/utils/';


describe('Component: Header/navbar', () => {
  const navBarItems = ['Blocks', 'Accounts', 'Transactions', 'Assets', 'Validators', 'More'];

  let container: HTMLElement;
  jest.mock('next/router', () => ({
    useRouter() {
      return ({
        route: '/',
        pathname: '',
      });
    },
  }));
  
  beforeEach(() => {
    
    const useRouter: any = jest.spyOn(nextRouter, "useRouter");
    useRouter.mockImplementation(() => ({
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
      push: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn()
      },
      beforePopState: jest.fn(() => null),
      prefetch: jest.fn(() => null)
    }));
    

    container = renderWithTheme(<Navbar />).container;

  });
  
  it('Should render the navbar items ( Logo, Blocks, Accounts, Transactions, Assets, Validatores and More) - desktop version', () => {
    const logo = screen.getByAltText('Logo');
    expect(logo).toBeInTheDocument();

    const navbar = container.firstChild?.childNodes[1]
    navbar?.childNodes.forEach((element, index) => {
      expect(element).toBeInTheDocument();
      expect(element).toHaveTextContent(navBarItems[index]);
    })
  });

  it(`Should have the correct style background for the navbar\'s container`, () => {
    expect(container.firstChild).toHaveStyle(`background: ${theme.navbar.background}`);
  });

  it('Should have the correct style for the navbar items - desktop version', () => {
    const navbarItem = container.querySelector('div > div > div:nth-child(2) > div');
    const style = {
      filter: 'brightness(1)',
      cursor: 'pointer',
      transition: '0.2s ease',
    };
    expect(navbarItem).toHaveStyle(style);
  });

  it('Should not init with dropdown menu from "More" visible and match the style for the Dropdown" - desktop version', () => {
    const selector = `div > div > div:nth-child(2) > div:nth-child(6) div`;
    const dropDownContainer = container.querySelector(selector);
    const dropDownMenu = container.querySelector(`${selector} ul`);


    const dropDownContainerStyle = {
      display: 'none',
      position: 'absolute'
    };
    const dropDownMenuStyle = {
      width: 'max-content',
      background: theme.navbar.background,
      color: theme.navbar.text,
    };


    expect(dropDownContainer).toHaveStyle(dropDownContainerStyle);
    expect(dropDownMenu).toHaveStyle(dropDownMenuStyle);
  });

   it('Should appear the navbar menu when click on the icon and when click again should disappear - mobile version', async () => {
    const mobile = container.firstChild?.lastChild;
    const content = container.lastChild;
    const button: any = mobile?.firstChild;

    expect(mobile).toHaveStyle('position: relative');
    expect(content).toHaveStyle('right: -100%');
    
    fireEvent.click(button);
    expect(content).toHaveStyle('right: 0');
    
    fireEvent.click(button);
    expect(content).toHaveStyle('right: -100%');
  });

  it('Should render the navbar items ( Logo, Blocks, Accounts, Transactions, Assets, Validatores and More) - Mobile version', () => {
    const logo = screen.getByAltText('Logo');
    expect(logo).toBeInTheDocument();

    container.lastChild?.childNodes.forEach((element, index) => {
      expect(element).toBeInTheDocument();
      expect(element).toHaveTextContent(navBarItems[index])
    });
  });
});