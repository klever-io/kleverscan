import { useTranslation } from 'next-i18next';

export interface IColumnHeading {
  /** English literal, and the fallback the heading is translated against. */
  header: string;
  i18nKey: string;
}

/**
 * Column headings for a data-list table, translated against the English
 * literal in the page's own column list. The namespace is read off the keys
 * themselves rather than passed in: a caller-supplied name that missed the
 * bundle's spelling fell back to English silently.
 *
 * Only safe where the table passes no `sortableColumns`: there a heading
 * doubles as a sort key, which is what issue #678 blocks the holders table on.
 */
export const useColumnHeaders = (
  columns: readonly IColumnHeading[],
): string[] => {
  // Every namespace the keys carry, not just the first column's: a key on an
  // unloaded namespace falls back to English silently.
  const namespaces = Array.from(
    new Set(columns.map(column => column.i18nKey.split(':')[0])),
  );
  const { t } = useTranslation(namespaces.length ? namespaces : ['common']);
  return columns.map(column =>
    t(column.i18nKey, { defaultValue: column.header }),
  );
};
