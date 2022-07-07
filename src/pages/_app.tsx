import type { AppProps } from 'next/app';
import React from 'react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { ThemeProvider } from 'styled-components';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from '../components/Layout';
import NProgress from '../components/NProgress';

import GlobalStyle from '../styles/global';
import theme from '../styles/theme';

import Bugsnag from '../lib/bugsnag';

const ErrorBoundary = Bugsnag.getPlugin('react')?.createErrorBoundary(React);

//add window methods to global scope
declare global {
  interface Window {
    klever: any;
    kleverchainUrls: any;
  }
}

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  const router = useRouter();

  const children = (
    <ThemeProvider theme={theme}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <GlobalStyle />
      <NProgress />
      <ToastContainer />
    </ThemeProvider>
  );

  return ErrorBoundary ? <ErrorBoundary>{children}</ErrorBoundary> : children;
};

export default MyApp;
