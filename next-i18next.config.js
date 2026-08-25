/**
 * Where the translation files live.
 *
 * next-i18next resolves a relative path with path.resolve(process.cwd(), …)
 * on every request, so a relative value only finds the files while the
 * server's working directory happens to be the project root. Started from
 * anywhere else, every namespace loads empty and each t() renders its own
 * key ("Titles.Accounts" instead of "Accounts") across the whole site, which
 * is what testnet showed. Reproduced by serving one build from two working
 * directories.
 *
 * The deployment therefore states the absolute location itself, and the
 * relative value stays the default for local runs, where the working
 * directory is the project root anyway.
 */
const localePath = process.env.LOCALES_PATH || './public/locales';

module.exports = {
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  localePath,
};
