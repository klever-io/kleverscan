import { PropsWithChildren, useCallback } from 'react';
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
import GlobalStyle from '../styles/global';
import * as gtag from '../utils/gtag/gtag';

import { getCookie } from 'cookies-next';
import { InternalThemeProvider } from '@/contexts/theme';
import Maintenance from '@/components/Maintenance';

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

const LayoutWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  return <Layout>{children}</Layout>;
};

const MyApp = ({ Component, pageProps, initialDarkTheme }: AppProps) => {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (url === '/') {
        gtag.pageview(url);
      } else {
        const cleanUrl = url.split(/[?#]/)[0];
        const splitUrl: string[] = cleanUrl.split('/').filter(Boolean);
        const slicedUrl = splitUrl.slice(0, 1);
        const newUrl = '/' + slicedUrl.join('/') + '/';
        gtag.pageview(newUrl);
      }
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  const startDate = new Date(Date.UTC(2025, 1, 6, 16, 0, 0)); // Month is 0-indexed (1 = February)
  const endDate = new Date(Date.UTC(2025, 1, 6, 16, 0, 0)); // Month is 0-indexed (1 = February)

  const currentDate = new Date();

  const isTargetDate = currentDate >= startDate && currentDate <= endDate;

  const RenderedComponent: React.FC = useCallback(() => {
    if (isTargetDate) {
      return <Maintenance />;
    }
    return (
      <LayoutWrapper>
        <Component {...pageProps} />
      </LayoutWrapper>
    );
  }, [isTargetDate, pageProps]);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      <InternalThemeProvider initialDarkTheme={initialDarkTheme}>
        <ContextProviders>
          <RenderedComponent />
          <GlobalStyle />
          <NProgress />
        </ContextProviders>
      </InternalThemeProvider>
    </>
  );
};

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  const isDarkTheme = getCookie('isDarkTheme', appContext.ctx) === 'true';

  return { ...appProps, initialDarkTheme: isDarkTheme };
};

export default appWithTranslation(MyApp);
