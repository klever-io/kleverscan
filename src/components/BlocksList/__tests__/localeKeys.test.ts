import fs from 'fs';
import path from 'path';

/**
 * Binds the keys the summary asks for to the shipped bundle. Every `t()` here
 * carries a `defaultValue`, so a key that never made it into the JSON renders
 * correctly and stays invisible: the page looks right while the namespace is
 * empty, and only a translator ever finds out.
 */
const readKeys = (file: string, namespace: string): string[] => {
  const source = fs.readFileSync(path.join(process.cwd(), file), 'utf8');
  const pattern = new RegExp(`t\\(\\s*'${namespace}:([\\w.]+)'`, 'g');
  return [...source.matchAll(pattern)].map(match => match[1]);
};

const lookup = (bundle: unknown, key: string): unknown =>
  key
    .split('.')
    .reduce<unknown>(
      (node, part) =>
        node && typeof node === 'object'
          ? (node as Record<string, unknown>)[part]
          : undefined,
      bundle,
    );

const sources = [
  ['src/components/BlocksList/Summary.tsx', 'blocks'],
  ['src/components/BlocksList/UpdatedAgo.tsx', 'common'],
] as const;

describe('blocks list locale keys', () => {
  it.each(sources)(
    '%s asks for keys that exist in %s.json',
    (file, namespace) => {
      const keys = readKeys(file, namespace);
      // Guards the regex itself: a rename that stops it matching would make
      // every assertion below pass by never running.
      expect(keys.length).toBeGreaterThan(0);

      const bundle = JSON.parse(
        fs.readFileSync(
          path.join(
            process.cwd(),
            'public',
            'locales',
            'en',
            `${namespace}.json`,
          ),
          'utf8',
        ),
      );

      const missing = keys.filter(
        key => typeof lookup(bundle, key) !== 'string',
      );
      expect(missing).toEqual([]);
    },
  );
});
