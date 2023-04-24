import { screen } from '@testing-library/react';
import React from 'react';
import { contents, socials } from '../../configs/footer';
import theme from '../../styles/theme';
import { renderWithTheme } from '../../test/utils';
import Footer from './';

describe('Component: Footer', () => {
  let container: HTMLElement;
  beforeEach(() => {
    container = renderWithTheme(<Footer />).container;
  });

  it('Should render the footer with the Klever logo and description', () => {
    const footerDesc =
      'Klever Explorer is our main platform to visualize assets, blocks, nodes, accounts and transactions in an intuitive and interactive manner. Everything happening in KleverChain can be consulted here on our Explorer.';
    const logo = screen.getByRole('img');
    const description = screen.getByText(footerDesc);

    expect(logo).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });

  it("Should render all social media links and each should have the correct address to Klever's socials pages", () => {
    const getSocials =
      container.firstChild?.firstChild?.firstChild?.childNodes[2].childNodes;

    getSocials?.forEach((element, index) => {
      expect(element).toHaveAttribute('href', socials[index].link);
    });
  });

  it('Should render all the links for Klever Exchange, Klever wallet App and Klever Ecosystem', () => {
    contents.forEach(({ title, infoLinks }) => {
      expect(screen.getByText(title)).toBeInTheDocument();
      infoLinks.forEach(({ name, href }, index) => {
        if (name === 'KLV') {
          const paragraph = screen.getByText(name);
          expect(paragraph).toBeInTheDocument();
        } else if (name !== 'WhitePaper') {
          const link = screen.getByRole('link', { name });
          expect(link).toBeInTheDocument();
          expect(link).toHaveAttribute('href', href);
        } else {
          const link = screen.getAllByRole('link', { name });
          expect(link[index > 1 ? 0 : 1]).toBeInTheDocument();
          expect(link[index > 1 ? 0 : 1]).toHaveAttribute('href', href);
        }
      });
    });
  });

  it('Should match the style for socials icons', () => {
    const style = {
      width: '2.5rem',
      height: '2.5rem',
      display: 'flex',
      border: `2px solid ${theme.footer.socialBorder}`,
      color: 'white',
    };

    const getSocials =
      container.firstChild?.firstChild?.firstChild?.childNodes[2].childNodes;
    getSocials?.forEach(item => {
      expect(item.firstChild).toHaveStyle(style);
    });
  });

  it('Should match the style for links of the Klever Exchange, Klever wallet App and Klever Ecosystem', () => {
    const style = {
      textDecoration: 'none',
      gap: '0.5rem',
      fontSize: '0.9rem',
      fontWeight: '400',
      color: `${theme.footer.text}`,
    };

    const linkItem = screen.getByRole('link', { name: /Privacy Policy/i });
    expect(linkItem).toHaveStyle(style);
  });
});
