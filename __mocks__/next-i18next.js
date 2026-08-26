module.exports = {
  useTranslation: () => ({
    // Mirrors the real t() for the path tests exercise: no resources are
    // loaded here, so every lookup misses and falls back to
    // options.defaultValue when the caller provides one, else to the key.
    t: (key, options) => options?.defaultValue ?? key,
  }),
};
