/* eslint @typescript-eslint/no-var-requires: "off" */

const withImages = require('next-images');
const withPlugins = require('next-compose-plugins');

const images = withImages({
  esModule: true,
});

const defaultEnvs = [
  'DEFAULT_API_HOST',
  'DEFAULT_API_PORT',
  'DEFAULT_API_VERSION',
  'DEFAULT_PRICE_HOST',
];

const getEnvs = () => {
  let envs = {};

  defaultEnvs.forEach(env => {
    envs = { ...envs, [env]: process.env[env] };
  });

  return envs;
};

module.exports = withPlugins([images], {
  env: getEnvs(),
});
