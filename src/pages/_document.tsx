import React from 'react';

import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentInitialProps,
  DocumentContext,
} from 'next/document';

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
            href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Rubik:wght@300;400;500;600;700&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Rubik:wght@500&display=swap"
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
            dangerouslySetInnerHTML={{
              __html: `
              !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
              posthog.init('phc_eI5meHMYHg87zyXahjbnsxZKCUVPaR9rXzQMX2K8958',{api_host:'https://app.posthog.com'})
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
