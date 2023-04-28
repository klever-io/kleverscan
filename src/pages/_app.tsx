import { ContractProvider } from '@/contexts/contract';
import { ExtensionProvider } from '@/contexts/extension';
import { InternalThemeProvider } from '@/contexts/theme';
import { MobileProvider } from 'contexts/mobile';
import { appWithTranslation, SSRConfig } from 'next-i18next';
import type { AppProps as NextJsAppProps } from 'next/app';
import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '../components/Layout';
import NProgress from '../components/NProgress';
import Bugsnag from '../lib/bugsnag';
import { initGA, logPageView } from '../services/GoogleAnalytics';
import GlobalStyle from '../styles/global';

const queryClient = new QueryClient();

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
  useEffect(() => {
    if (process.env.DEFAULT_API_HOST === 'https://api.mainnet.klever.finance') {
      initGA(process.env.GA_TRACKING_ID as string);
      logPageView();
    }
  }, []);

  const children = (
    <QueryClientProvider client={queryClient}>
      <InternalThemeProvider>
        <ToastContainer />
        <MobileProvider>
          <ContractProvider>
            <ExtensionProvider>
              <ToastContainer />
              <Layout>
                <Component {...pageProps} />
              </Layout>
              <GlobalStyle />
              <NProgress />
            </ExtensionProvider>
          </ContractProvider>
        </MobileProvider>
      </InternalThemeProvider>
    </QueryClientProvider>
  );

  return ErrorBoundary ? <ErrorBoundary>{children}</ErrorBoundary> : children;
};

export default appWithTranslation(MyApp);
