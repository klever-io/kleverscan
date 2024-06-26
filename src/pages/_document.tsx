import Document, {
  DocumentContext,
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';
import React from 'react';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext,
  ): Promise<DocumentInitialProps> {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);

      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render(): JSX.Element {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Rubik:wght@300;400;500;600;700&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Rubik:wght@500&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Fira+Mono:wght@400;500;700&display=swap"
            rel="stylesheet"
          />
          <link
            rel="stylesheet"
            href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
            integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
            crossOrigin=""
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <meta
            name="description"
            content="KleverScan is a part of Klever Ecosystem, which allows you to explore, follow transactions, accounts, and block creations. This is the first step to achieve an ultimate Blockchain with Klever empowerment, to support the KLV community and all transactions in its Blockchain."
          />

          <meta property="og:url" content="https://kleverscan.org/" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="KleverChain" />
          <meta property="og:image" content="%PUBLIC_URL%/social-logo.png" />
          <meta
            property="og:description"
            content="KleverScan is a part of Klever Ecosystem, which allows you to explore, follow transactions, accounts, and block creations. This is the first step to achieve an ultimate Blockchain with Klever empowerment, to support the KLV community and all transactions in its Blockchain."
          />
          <meta property="og:site_name" content="KleverChain" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@klever_io" />
          <meta name="twitter:title" content="KleverChain" />
          <meta
            name="twitter:description"
            content="KleverScan is a part of Klever Ecosystem, which allows you to explore, follow transactions, accounts, and block creations. This is the first step to achieve an ultimate Blockchain with Klever empowerment, to support the KLV community and all transactions in its Blockchain."
          />
          <meta
            property="twitter:image:src"
            content="%PUBLIC_URL%/social-logo.png"
          />
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GA_TRACKING_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
          `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
