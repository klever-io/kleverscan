path = require('path');

module.exports = {
  i18n: {
    locales: [
      'en',
      // 'es',
      // 'pt-BR',
    ],
    defaultLocale: 'en',
  },
  fallbackLng: {
    default: ['en'],
  },
  localePath: path.resolve('./public/locales'),
};
