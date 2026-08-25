module.exports = {
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  // Relative on purpose, and not built with path.resolve. next-i18next hands
  // this whole config to the browser inside __NEXT_DATA__, so an absolute path
  // here shipped the build machine's directory layout to every visitor; on
  // /block/<n> it was baked into the prerendered artifacts as well.
  //
  // Nothing server-side needs it pre-resolved: createConfig already does
  // path.resolve(process.cwd(), localePath + …) for the loader, and there is no
  // browser backend configured that would use it as a URL prefix.
  localePath: './public/locales',
};
