import tseslint from 'typescript-eslint';
import js from "@eslint/js"

export default tseslint.config(
  {
  rules: {
    "no-unused-vars": "off",
    "no-explicit-any": "off",
    "no-empty-interface": "off",
    "react-hooks/exhaustive-deps": "off",
    "@next/next/link-passhref": "off",
  },
  }
)