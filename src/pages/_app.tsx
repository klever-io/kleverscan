import { ContractProvider } from '@/contexts/contract';
import { ContractModalProvider } from '@/contexts/contractModal';
import { ExtensionProvider } from '@/contexts/extension';
import { InternalThemeProvider } from '@/contexts/theme';
import { MobileProvider } from 'contexts/mobile';
import { appWithTranslation, SSRConfig } from 'next-i18next';
import type { AppProps as NextJsAppProps } from 'next/app';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '../components/Layout';
import NProgress from '../components/NProgress';
import Bugsnag from '../lib/bugsnag';
import GlobalStyle from '../styles/global';
import * as gtag from '../utils/gtag/gtag';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

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
    <QueryClientProvider client={queryClient}>
      <InternalThemeProvider>
        <ToastContainer />
        <MobileProvider>
          <ExtensionProvider>
            <ContractProvider>
              <ContractModalProvider>
                <ToastContainer />
                <Layout>
                  <Component {...pageProps} />
                </Layout>
                <GlobalStyle />
                <NProgress />
              </ContractModalProvider>
            </ContractProvider>
          </ExtensionProvider>
        </MobileProvider>
      </InternalThemeProvider>
    </QueryClientProvider>
  );

  return ErrorBoundary ? <ErrorBoundary>{children}</ErrorBoundary> : children;
};

export default appWithTranslation(MyApp);
