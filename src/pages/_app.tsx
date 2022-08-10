import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from 'styled-components';
import Layout from '../components/Layout';
import NProgress from '../components/NProgress';
import Bugsnag from '../lib/bugsnag';
import GlobalStyle from '../styles/global';
import theme from '../styles/theme';

const ErrorBoundary = Bugsnag.getPlugin('react')?.createErrorBoundary(React);

//add window methods to global scope
declare global {
  interface Window {
    kleverWeb: any;
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
