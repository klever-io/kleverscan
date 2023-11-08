/* eslint @typescript-eslint/no-var-requires: "off" */

const withImages = require('next-images');
const { i18n } = require('./next-i18next.config');

const defaultEnvs = [
  'DEFAULT_API_HOST',
  'DEFAULT_API_PORT',
  'DEFAULT_API_VERSION',
  'DEFAULT_PRICE_HOST',
  'DEFAULT_NODE_HOST',
  'DEFAULT_EXPLORER_HOST',
  'BUGSNAG_KEY',
  'BUGSNAG_DISABLED',
  'DEFAULT_API_MULTISIGN',
];

const getEnvs = () => {
  let envs = {};

  defaultEnvs.forEach(env => {
    envs = { ...envs, [env]: process.env[env] };
  });

  return envs;
};

module.exports = withImages({
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
  webpack: config => {
    config.resolve.fallback = { fs: false };

    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: process.env?.IS_PRODUCTION === 'true',
  },
});
