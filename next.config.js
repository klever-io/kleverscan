const path = require('path');
const { i18n } = require('./next-i18next.config');

const defaultEnvs = [
  'DEFAULT_API_HOST',
  'DEFAULT_API_PORT',
  'DEFAULT_API_VERSION',
  'DEFAULT_PRICE_HOST',
  'DEFAULT_APIKEY_KPRICES',
  'DEFAULT_KPRICES_HOST',
  'DEFAULT_NODE_HOST',
  'DEFAULT_EXPLORER_HOST',
  'DEFAULT_API_MULTISIGN',
  'DEFAULT_KLEVERSCAN_API_URL',
  'DEFAULT_KLEVERSCAN_API_KEY',
  'NEXT_PUBLIC_TRANSFER_ADDRESS',
  'NEXT_PUBLIC_ADD_ASSET_INFO_VALUE',
  'NEXT_PUBLIC_ENABLE_ASSET_APPLY',
  'DIRECTUS_STATIC_TOKEN',
  'DEFAULT_CDN_HOST',
  'GA_TRACKING_ID',
];

const getEnvs = () => {
  let envs = {};

  defaultEnvs.forEach(env => {
    envs = { ...envs, [env]: process.env[env] };
  });

  return envs;
};

module.exports = {
  env: getEnvs(),
  i18n,
  images: {
    formats: ['image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        pathname: '**',
      },
    ],
  },
  reactStrictMode: false,
  turbopack: {
    resolveAlias: {
      fs: { browser: './empty.ts' },
      path: { browser: './empty.ts' },
    },
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  typescript: {
    ignoreBuildErrors: process.env?.IS_PRODUCTION === 'true',
  },
  compiler: {
    styledComponents: {
      ssr: true,
      displayName: true,
    },
  },
  redirects: async () => {
    return [
      {
        source: '/itos',
        destination: '/ito',
        permanent: true,
      },
      {
        source: '/launchpad',
        destination: '/ito',
        permanent: true,
      },
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
};
