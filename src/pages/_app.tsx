import type { AppProps } from 'next/app';

// import PageNProgress from 'next-styled-nprogress';
// TODO: Fix NProgress type
import { ThemeProvider } from 'styled-components';

import Layout from '../components/Layout';

import GlobalStyle from '../styles/global';
import theme from '../styles/theme';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <GlobalStyle />
      {/* <PageNProgress
        color="#EE3F71"
        showSpinner={false}
        height="2px"
        delay={200}
      /> */}
    </ThemeProvider>
  );
};

export default MyApp;
