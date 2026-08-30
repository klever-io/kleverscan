import { useTranslation } from 'next-i18next';
import { CONTRACT_COLUMNS } from './columns';

/**
 * Column headings, translated against the English literal in `columns.ts`.
 *
 * Safe to translate here because this page passes no `sortableColumns`, so no
 * heading doubles as a sort key; issue #678 blocks the holders table for
 * exactly that reason. Sorting on this page runs through the filter bar.
 */
export const useContractHeaders = (): string[] => {
  const { t } = useTranslation(['smartContracts']);
  return CONTRACT_COLUMNS.map(column =>
    t(column.i18nKey, { defaultValue: column.header }),
  );
};
