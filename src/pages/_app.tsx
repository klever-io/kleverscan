import type { AppProps } from 'next/app';

import { ThemeProvider } from 'styled-components';

import Layout from '../components/Layout';
import NProgress from '../components/NProgress';

import GlobalStyle from '../styles/global';
import theme from '../styles/theme';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <GlobalStyle />
      <NProgress />
    </ThemeProvider>
  );
};

export default MyApp;
