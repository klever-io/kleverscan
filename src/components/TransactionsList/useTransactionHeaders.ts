import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import {
  getTransactionColumns,
  showsInOut,
  TransactionColumnKey,
} from './columns';

const HEADER_I18N_KEY: Record<TransactionColumnKey, string> = {
  hash: 'transactions:Table.TransactionHash',
  type: 'transactions:Table.Type',
  block: 'transactions:Table.Block',
  age: 'transactions:Table.Age',
  from: 'transactions:From',
  direction: '',
  to: 'transactions:To',
  inOut: 'transactions:Table.InOut',
  amount: 'transactions:Table.Amount',
  fee: 'transactions:Table.Fee',
};

/**
 * Column headings for the shared transactions table.
 *
 * A hook rather than a constant because whether the In/Out column exists
 * depends on the URL, and it has to be decided from the same place
 * `transactionRowSections` decides it. Four call sites each answered that
 * question themselves, three of them by not asking it at all.
 *
 * Headings pass through `t()` with the column's English literal as the
 * fallback. Translating them is safe for this table because no route passes
 * `sortableColumns`, so no heading doubles as a sort key (issue #678 blocks
 * the holders table for exactly that reason).
 */
export const useTransactionHeaders = (): string[] => {
  const router = useRouter();
  const { t } = useTranslation(['transactions']);

  return getTransactionColumns({ showInOut: showsInOut(router) }).map(column =>
    // A deliberately unheaded column stays empty: i18next would render the
    // key itself when handed an empty defaultValue.
    HEADER_I18N_KEY[column.key] === ''
      ? column.header
      : t(HEADER_I18N_KEY[column.key], { defaultValue: column.header }),
  );
};
