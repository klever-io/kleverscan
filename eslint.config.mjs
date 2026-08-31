import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    rules: {
      'no-unused-vars': 'off',
      'no-explicit-any': 'off',
      'no-empty-interface': 'off',
      'react-hooks/exhaustive-deps': 'off',
      '@next/next/link-passhref': 'off',
    },
  },
  {
    // Without `files` the config above matches nothing, so every rule in it was
    // inert. This block is the one that actually applies to the source tree.
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
  },
);
