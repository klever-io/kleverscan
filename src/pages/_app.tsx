import ContextProviders from '@/components/ContextProviders';
import { appWithTranslation, SSRConfig } from 'next-i18next';
import App from 'next/app';
import type { AppContext, AppProps as NextJsAppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '../components/Layout';
import NProgress from '../components/NProgress';
import Bugsnag from '../lib/bugsnag';
import GlobalStyle from '../styles/global';
import * as gtag from '../utils/gtag/gtag';

import { getCookie } from 'cookies-next';
import { InternalThemeProvider } from '@/contexts/theme';

const ErrorBoundary =
  !process.env.BUGSNAG_DISABLED &&
  Bugsnag.getPlugin('react')?.createErrorBoundary(React);

//add window methods to global scope
declare global {
  interface Window {
    kleverWeb: any;
    kleverHub: any;
    Canny: any;
    attachEvent: any;
  }
}

declare type AppProps = NextJsAppProps & {
  pageProps: SSRConfig;
  initialDarkTheme: boolean;
};

const LayoutWrapper: React.FC = ({ children }) => {
  return <Layout>{children}</Layout>;
};

const MyApp = ({ Component, pageProps, initialDarkTheme }: AppProps) => {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      gtag.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  const children = (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      <InternalThemeProvider initialDarkTheme={initialDarkTheme}>
        <ContextProviders>
          <LayoutWrapper>
            <Component {...pageProps} />
          </LayoutWrapper>
          <GlobalStyle />
          <NProgress />
        </ContextProviders>
      </InternalThemeProvider>
    </>
  );

  return ErrorBoundary ? <ErrorBoundary>{children}</ErrorBoundary> : children;
};

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  const isDarkTheme = getCookie('isDarkTheme', appContext.ctx) === 'true';

  return { ...appProps, initialDarkTheme: isDarkTheme };
};

export default appWithTranslation(MyApp);
