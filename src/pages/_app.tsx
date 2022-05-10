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

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  const router = useRouter();

  const handleRouteChange = (url: any) => {
    (window as any).gtag('config', 'G-ZB4W5DJX19', {
      page_path: url,
    });
  };

  useEffect(() => {
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

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

  return (ErrorBoundary ? <ErrorBoundary>{children}</ErrorBoundary> : children);
};

export default MyApp;
