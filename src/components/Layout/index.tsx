import React from 'react';

import { useRouter } from 'next/dist/client/router';

import Head from 'next/head';
import Navbar from '../Navbar';
import Footer from '../Footer';

const Layout: React.FC = ({ children }) => {
  const router = useRouter();
  const haveBackground = router.pathname !== '/';

  return (
    <div>
      <Head>
        <title>Klever Explorer</title>
      </Head>

      <Navbar background={haveBackground} />

      <main>{children}</main>

      <Footer />
    </div>
  );
};

export default Layout;
