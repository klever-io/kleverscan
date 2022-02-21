import React from 'react';

import Head from 'next/head';
import Navbar from '../Header';
import Footer from '../Footer';
import { Main } from '@/views/home';

const Layout: React.FC = ({ children }) => {
  return (
    <div>
      <Head>
        <title>Klever Explorer</title>
      </Head>

      <Navbar />

      <Main>{children}</Main>

      <Footer />
    </div>
  );
};

export default Layout;
