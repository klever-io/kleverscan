import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

// One config object, WITH `files`: a flat-config object without it applies to
// every file another object makes lintable, which is how an earlier "inert"
// rules block silently became global the moment this block arrived.
export default tseslint.config({
  files: ['src/**/*.{ts,tsx}'],
  languageOptions: {
    // Required, not decorative: the default parser reports 646 errors on this
    // tree, starting at the first `interface`.
    parser: tseslint.parser,
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
  plugins: {
    'react-hooks': reactHooks,
    // Registered so the inline disable comments across the tree name a rule
    // that exists; without it each one is itself an error.
    '@typescript-eslint': tseslint.plugin,
  },
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'off',
  },
});
