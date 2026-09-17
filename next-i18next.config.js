const path = require('path');

/**
 * Where the translation files live, resolved once, here.
 *
 * next-i18next resolves a relative localePath with path.resolve(process.cwd(),
 * …) on every request instead. In the Lambdas that serve this site the working
 * directory at request time is not the application root, so a relative value
 * loads every namespace empty and each t() renders its own key
 * ("Titles.Accounts" instead of "Accounts") across the whole site. Resolving at
 * module load captures the application root while the process still reports it.
 *
 * The cost is that next-i18next hands this config to the browser inside
 * __NEXT_DATA__, so the absolute location is visible to visitors.
 */
module.exports = {
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  localePath: path.resolve('./public/locales'),
};
