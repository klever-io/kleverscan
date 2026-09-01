import fs from 'fs';
import path from 'path';

/**
 * Binds the keys this page asks for to the shipped bundles. Every `t()` on the
 * validators page carries a `defaultValue`, so a key that never made it into
 * the JSON renders correctly in English and stays invisible: the page looks
 * right while the namespace is empty, and only a translator ever finds out.
 *
 * Both locales, not just `en`, which is the half the blocks equivalent checks.
 * A key present in `en` and absent from `pt-BR` is the same silent failure with
 * a narrower audience, and this page ships 88 keys in each.
 */
const LOCALES = ['en', 'pt-BR'] as const;

const readKeys = (file: string, namespace: string): string[] => {
  const source = fs.readFileSync(path.join(process.cwd(), file), 'utf8');
  // Both shapes in use: `t('ns:Key')` at the call site, and `i18nKey: 'ns:Key'`
  // in the column table, which the heading hook feeds to `t`.
  const patterns = [
    new RegExp(`t\\(\\s*'${namespace}:([\\w.]+)'`, 'g'),
    new RegExp(`i18nKey:\\s*'${namespace}:([\\w.]+)'`, 'g'),
  ];
  return patterns.flatMap(pattern =>
    [...source.matchAll(pattern)].map(match => match[1]),
  );
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

const bundleFor = (locale: string, namespace: string): unknown =>
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

const sources = [
  ['src/components/ValidatorsList/Filters.tsx', 'validators'],
  ['src/components/ValidatorsList/Summary.tsx', 'validators'],
  ['src/components/ValidatorsList/LoadingCard.tsx', 'validators'],
  ['src/components/ValidatorsList/MobileCard.tsx', 'validators'],
  ['src/components/ValidatorsList/columns.ts', 'validators'],
  ['src/components/Validators/VersionDistribution/index.tsx', 'validators'],
  // The page, not rows.tsx: the row labels are translated here and handed into
  // the row builder, where t() cannot reach.
  ['src/pages/validators/index.tsx', 'validators'],
] as const;

/** A pluralised key exists as `_one`/`_other` rather than on its own, which is
 *  how i18next stores it. */
const present = (bundle: unknown, key: string): boolean =>
  typeof lookup(bundle, key) === 'string' ||
  (typeof lookup(bundle, `${key}_one`) === 'string' &&
    typeof lookup(bundle, `${key}_other`) === 'string');

describe('validators list locale keys', () => {
  it.each(sources)(
    '%s asks for keys that exist in %s.json',
    (file, namespace) => {
      const keys = readKeys(file, namespace);
      // Guards the regex itself: a rename that stops it matching would make
      // every assertion below pass by never running.
      expect(keys.length).toBeGreaterThan(0);

      LOCALES.forEach(locale => {
        const bundle = bundleFor(locale, namespace);
        expect({
          locale,
          missing: keys.filter(key => !present(bundle, key)),
        }).toEqual({ locale, missing: [] });
      });
    },
  );

  /* The distribution card was the last untranslated surface on this page, so
     it gets its own assertion rather than relying on the sweep above to keep
     covering it. */
  it('leaves no hardcoded English in the distribution card', () => {
    const source = fs.readFileSync(
      path.join(
        process.cwd(),
        'src/components/Validators/VersionDistribution/index.tsx',
      ),
      'utf8',
    );

    expect(source).not.toMatch(/aria-label="[A-Za-z]/);
    expect(source).toContain("useTranslation(['validators'])");
  });

  it('keeps both bundles on the same key set', () => {
    const flatten = (node: unknown, prefix = ''): string[] =>
      node && typeof node === 'object'
        ? Object.entries(node as Record<string, unknown>).flatMap(
            ([key, value]) =>
              value && typeof value === 'object'
                ? flatten(value, `${prefix}${key}.`)
                : [`${prefix}${key}`],
          )
        : [];

    const [en, ptBR] = LOCALES.map(locale =>
      flatten(bundleFor(locale, 'validators')).sort(),
    );

    expect(ptBR).toEqual(en);
  });
});
