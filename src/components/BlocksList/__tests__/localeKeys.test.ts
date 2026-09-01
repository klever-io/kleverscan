import { bundleFor, present, readKeys } from '@/utils/localeKeys';

/**
 * Binds the keys the summary asks for to the shipped bundle. Every `t()` here
 * carries a `defaultValue`, so a key that never made it into the JSON renders
 * correctly and stays invisible: the page looks right while the namespace is
 * empty, and only a translator ever finds out.
 */
const sources = [
  ['src/components/BlocksList/Summary.tsx', 'blocks'],
  ['src/components/BlocksList/AutoUpdate.tsx', 'blocks'],
  ['src/components/BlocksList/columns.ts', 'blocks'],
  ['src/components/BlocksList/MobileCard.tsx', 'blocks'],
  ['src/components/BlocksList/LoadingCard.tsx', 'blocks'],
  // The page, not rows.tsx: the epoch label is translated there and handed
  // into the row builder, where t() cannot reach.
  ['src/pages/blocks/index.tsx', 'blocks'],
  ['src/components/BlocksList/UpdatedAgo.tsx', 'common'],
] as const;

describe('blocks list locale keys', () => {
  it.each(sources)(
    '%s asks for keys that exist in %s.json',
    (file, namespace) => {
      const { keys } = readKeys(file, namespace);
      // Guards the regex itself: a rename that stops it matching would make
      // every assertion below pass by never running.
      expect(keys.length).toBeGreaterThan(0);

      const bundle = bundleFor('en', namespace);
      expect(keys.filter(key => !present(bundle, key))).toEqual([]);
    },
  );
});
