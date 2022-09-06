import { LayoutContainer, Main } from '@/views/home';
import Head from 'next/head';
import React from 'react';
import Footer from '../Footer';
import Navbar from '../Header';

const Layout: React.FC = ({ children }) => {
  return (
    <LayoutContainer>
      <Head>
        <title>Klever Explorer</title>
      </Head>

      <Navbar />

      <Main>{children}</Main>

      <Footer />
    </LayoutContainer>
  );
};

export default Layout;
