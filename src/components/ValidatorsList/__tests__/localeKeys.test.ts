import fs from 'fs';
import path from 'path';
import {
  bundleFor,
  flattenBundle,
  present,
  readKeys,
  subtreeKeys,
} from '@/utils/localeKeys';
import { LIST_STATES } from '../summaryFigures';

/**
 * Binds the keys this page asks for to the shipped bundles. Every `t()` on the
 * validators page carries a `defaultValue`, so a key that never made it into
 * the JSON renders correctly in English and stays invisible: the page looks
 * right while the namespace is empty, and only a translator ever finds out.
 *
 * Both locales, not just `en`. A key present in `en` and absent from `pt-BR` is
 * the same silent failure with a narrower audience.
 */
const LOCALES = ['en', 'pt-BR'] as const;

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

describe('validators list locale keys', () => {
  it.each(sources)(
    '%s asks for keys that exist in %s.json',
    (file, namespace) => {
      const { keys } = readKeys(file, namespace);
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

  /* A key built from a template literal carries no tail in the source, so the
     sweep above cannot see it at all. Its prefix must at least resolve to a
     populated subtree in both bundles. */
  it.each(sources)(
    '%s resolves its dynamic prefixes in %s.json',
    (file, ns) => {
      const { prefixes } = readKeys(file, ns);

      prefixes.forEach(prefix => {
        LOCALES.forEach(locale => {
          expect({ file, prefix, locale, keys: [] }).not.toEqual({
            file,
            prefix,
            locale,
            keys: subtreeKeys(bundleFor(locale, ns), prefix),
          });
        });
      });
    },
  );

  /* The members a prefix must carry, which no scraper can read off the source.
     `States` is the set the composition legend, the loading placeholder and the
     row badge all index into, and it is the one that went unguarded: deleting
     `States.jailed` from both bundles left the whole suite green. */
  it('ships every list state the page can index into', () => {
    const expected = [...LIST_STATES, 'other'].sort();

    LOCALES.forEach(locale => {
      expect({
        locale,
        states: subtreeKeys(bundleFor(locale, 'validators'), 'States').sort(),
      }).toEqual({ locale, states: expected });
    });
  });

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
    const [en, ptBR] = LOCALES.map(locale =>
      flattenBundle(bundleFor(locale, 'validators')).sort(),
    );

    expect(ptBR).toEqual(en);
  });
});
