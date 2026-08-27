import fs from 'fs';
import path from 'path';

const LOCALES = path.join(process.cwd(), 'public', 'locales');

const flatten = (node: unknown, prefix = ''): string[] =>
  node && typeof node === 'object'
    ? Object.entries(node as Record<string, unknown>).flatMap(([key, value]) =>
        value && typeof value === 'object'
          ? flatten(value, `${prefix}${key}.`)
          : [`${prefix}${key}`],
      )
    : [];

const read = (locale: string, file: string): Record<string, unknown> => {
  const full = path.join(LOCALES, locale, file);
  if (!fs.existsSync(full)) return {};
  return JSON.parse(fs.readFileSync(full, 'utf8'));
};

/**
 * Keys pt-BR is still short of, per namespace, measured 2026-08-27.
 *
 * A ceiling rather than an exact count: a namespace may only improve. Adding an
 * English key without its counterpart pushes a namespace over its number and
 * fails here, which is the drift this guards. Only `en` is wired into the i18n
 * config today, so nothing here is user-visible yet; it is the record that
 * stops the gap growing while that stays true.
 */
const KNOWN_GAPS: Record<string, number> = {
  'contractValidator.json': 34,
  'common.json': 6,
  'marketPlaces.json': 3,
  'wizards.json': 2,
  'table.json': 1,
};

/**
 * Keys whose pt-BR text expects a variable the English one does not pass,
 * measured 2026-08-27. All three predate this and sit in namespaces nothing
 * here touches: `Cards.ViewAll` carries two `{{type}}` against an English
 * string with none, and the other two add a `{{type}}` and a `{{vogal}}` for
 * Portuguese agreement that no call site supplies. Listed rather than rewritten
 * because guessing at the intended wording is not a translation, and only `en`
 * is wired into the config today. Fixing one means deleting its line here.
 */
const PLACEHOLDER_GAPS = new Set([
  'common.json::Cards.ViewAll',
  'encodingConverter.json::PlaceHolderValues',
  'verify.json::PlaceHolder',
]);

const namespaces = fs
  .readdirSync(path.join(LOCALES, 'en'))
  .filter(name => name.endsWith('.json'));

describe('locale parity between en and pt-BR', () => {
  it('finds the namespaces to compare', () => {
    // Guards the walk itself: an empty list would make every case below pass
    // by never running.
    expect(namespaces.length).toBeGreaterThan(10);
  });

  it.each(namespaces)('%s carries no new untranslated keys', file => {
    const missing = flatten(read('en', file)).filter(
      key => !flatten(read('pt-BR', file)).includes(key),
    );

    expect(missing.length).toBeLessThanOrEqual(KNOWN_GAPS[file] ?? 0);
  });

  it.each(namespaces)('%s keeps its interpolation placeholders', file => {
    const en = read('en', file);
    const pt = read('pt-BR', file);
    const at = (node: unknown, key: string): unknown =>
      key
        .split('.')
        .reduce<unknown>(
          (n, part) =>
            n && typeof n === 'object'
              ? (n as Record<string, unknown>)[part]
              : undefined,
          node,
        );

    const placeholders = (value: unknown) =>
      String(value ?? '')
        .match(/{{[^}]+}}/g)
        ?.sort()
        .join(',') ?? '';

    flatten(en).forEach(key => {
      const translated = at(pt, key);
      // Only where a translation exists: a missing key is the case above.
      if (translated === undefined) return;
      if (PLACEHOLDER_GAPS.has(`${file}::${key}`)) return;
      expect(placeholders(translated)).toBe(placeholders(at(en, key)));
    });
  });
});
