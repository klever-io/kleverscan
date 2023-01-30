import { parseAddress } from '@/utils';
import { LayoutContainer, Main } from '@/views/home';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import Footer from '../Footer';
import Navbar from '../Header';

const Layout: React.FC = ({ children }) => {
  const { pathname, asPath } = useRouter();
  const titleFormatted = () => {
    const klever = 'Klever Explorer';
    const pathName = pathname;
    const pathNameArray = (asPath &&
      (
        asPath.replace(/[[\]]/g, '').substring(1).charAt(0).toUpperCase() +
        asPath.slice(2)
      ).split('/')) || [''];
    if (pathName.length === 1) {
      return klever;
    } else if (
      pathName.includes('[asset]') ||
      pathName.includes('[number]') ||
      pathName.includes('[block]')
    ) {
      return `${pathNameArray[0]} - ${pathNameArray[1]} | ${klever}`;
    } else if (pathName.includes('/collection')) {
      if (pathNameArray.length === 5) {
        return `NFT Details - ${pathNameArray[pathNameArray.length - 2]} - ${
          pathNameArray[pathNameArray.length - 1]
        } | ${klever}`;
      }
      return `NFT Collection - ${
        pathNameArray[pathNameArray.length - 1]
      } | ${klever}`;
    } else if (pathName.includes('[hash]') || pathName.includes('[account]')) {
      return `${pathNameArray[0]} - ${parseAddress(
        pathNameArray[1],
        10,
      )} | ${klever}`;
    }
    return `${pathNameArray[0].replace('-', ' ')} | ${klever}`;
  };

  return (
    <LayoutContainer>
      <Head>
        <title>{titleFormatted()}</title>
      </Head>

      <Navbar />

      <Main>{children}</Main>

      <Footer />
    </LayoutContainer>
  );
};

export default Layout;
