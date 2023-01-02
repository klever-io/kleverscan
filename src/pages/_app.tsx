import { ExtensionProvider } from '@/contexts/extension';
import { PrecisionProvider } from '@/contexts/precision';
import { InternalThemeProvider } from '@/contexts/theme';
import { MobileProvider } from 'contexts/mobile';
import { appWithTranslation, SSRConfig } from 'next-i18next';
import type { AppProps as NextJsAppProps } from 'next/app';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '../components/Layout';
import NProgress from '../components/NProgress';
import Bugsnag from '../lib/bugsnag';
import GlobalStyle from '../styles/global';

const ErrorBoundary =
  !process.env.BUGSNAG_DISABLED &&
  Bugsnag.getPlugin('react')?.createErrorBoundary(React);

//add window methods to global scope
declare global {
  interface Window {
    kleverWeb: any;
  }
}

declare type AppProps = NextJsAppProps & {
  pageProps: SSRConfig;
};
const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  const children = (
    <InternalThemeProvider>
      <ToastContainer />
      <MobileProvider>
        <ExtensionProvider>
          <PrecisionProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
            <GlobalStyle />
            <NProgress />
          </PrecisionProvider>
        </ExtensionProvider>
      </MobileProvider>
    </InternalThemeProvider>
  );

  return ErrorBoundary ? <ErrorBoundary>{children}</ErrorBoundary> : children;
};

export default appWithTranslation(MyApp);
