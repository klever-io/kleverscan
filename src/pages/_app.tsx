import { InternalThemeProvider } from 'contexts/theme';
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '../components/Layout';
import NProgress from '../components/NProgress';
import Bugsnag from '../lib/bugsnag';
import GlobalStyle from '../styles/global';

const ErrorBoundary = Bugsnag.getPlugin('react')?.createErrorBoundary(React);

//add window methods to global scope
declare global {
  interface Window {
    kleverWeb: any;
  }
}

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  const children = (
    <InternalThemeProvider>
      <ToastContainer />
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <GlobalStyle />
      <NProgress />
    </InternalThemeProvider>
  );

  return ErrorBoundary ? <ErrorBoundary>{children}</ErrorBoundary> : children;
};

export default appWithTranslation(MyApp);
