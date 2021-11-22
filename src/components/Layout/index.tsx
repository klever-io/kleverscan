import React from 'react';

import Head from 'next/head';
import Navbar from '../Header';
import Footer from '../Footer';

const Layout: React.FC = ({ children }) => {
  return (
    <div>
      <Head>
        <title>Klever Explorer</title>
      </Head>

      <Navbar />

      <main>{children}</main>

      <Footer />
    </div>
  );
};

export default Layout;
