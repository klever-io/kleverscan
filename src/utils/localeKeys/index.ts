/* Jest-only: this module reads the filesystem, so importing it from app code
   turns into a client-bundle build failure. Nothing enforces that (eslint is a
   repo-wide no-op), which is why it says so here. */
import fs from 'fs';
import path from 'path';

export interface IScrapedKeys {
  /** Keys written out in full, e.g. `List.CopyAddress`. */
  keys: string[];
  /**
   * Prefixes of keys assembled from a template literal, e.g. `States` for
   * ``t(`ns:States.${state}`)``. The tail is not in the source, so a caller
   * that cares which members must exist has to name them itself.
   */
  prefixes: string[];
}

/**
 * The namespace keys a source file asks for.
 *
 * Three shapes are in use: `t('ns:Key')` at the call site, `i18nKey: 'ns:Key'`
 * in a column table, and the template form. The template form was invisible to
 * the first version of this scraper, which is why the whole `validators:States`
 * set went unguarded: deleting one of its keys from BOTH bundles left the suite
 * green.
 */
export const readKeys = (file: string, namespace: string): IScrapedKeys => {
  const source = fs.readFileSync(path.join(process.cwd(), file), 'utf8');

  const literal = [
    new RegExp(`t\\(\\s*'${namespace}:([\\w.]+)'`, 'g'),
    new RegExp(`i18nKey:\\s*'${namespace}:([\\w.]+)'`, 'g'),
  ];
  const template = new RegExp(`t\\(\\s*\`${namespace}:([\\w.]+)\\.\\$\\{`, 'g');

  return {
    keys: literal.flatMap(pattern =>
      Array.from(source.matchAll(pattern), match => match[1]),
    ),
    prefixes: Array.from(source.matchAll(template), match => match[1]),
  };
};

export const bundleFor = (locale: string, namespace: string): unknown =>
  JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        'public',
        'locales',
        locale,
        `${namespace}.json`,
      ),
      'utf8',
    ),
  );

export const lookup = (bundle: unknown, key: string): unknown =>
  key
    .split('.')
    .reduce<unknown>(
      (node, part) =>
        node && typeof node === 'object'
          ? (node as Record<string, unknown>)[part]
          : undefined,
      bundle,
    );

/** A pluralised key exists as `_one`/`_other` rather than on its own, which is
 *  how i18next stores it. */
export const present = (bundle: unknown, key: string): boolean =>
  typeof lookup(bundle, key) === 'string' ||
  (typeof lookup(bundle, `${key}_one`) === 'string' &&
    typeof lookup(bundle, `${key}_other`) === 'string');

/** Every leaf key under a prefix, or an empty list when the prefix resolves to
 *  nothing at all. */
export const subtreeKeys = (bundle: unknown, prefix: string): string[] => {
  const node = lookup(bundle, prefix);
  return node && typeof node === 'object'
    ? Object.keys(node as Record<string, unknown>)
    : [];
};

/** Every key in a bundle, dot-joined, for comparing two locales. */
export const flattenBundle = (node: unknown, prefix = ''): string[] =>
  node && typeof node === 'object'
    ? Object.entries(node as Record<string, unknown>).flatMap(([key, value]) =>
        value && typeof value === 'object'
          ? flattenBundle(value, `${prefix}${key}.`)
          : [`${prefix}${key}`],
      )
    : [];
