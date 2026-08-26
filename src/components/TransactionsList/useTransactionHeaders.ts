import { useRouter } from 'next/router';
import { getTransactionHeaders, showsInOut } from './columns';

/**
 * Column headings for the shared transactions table.
 *
 * A hook rather than a constant because whether the In/Out column exists
 * depends on the URL, and it has to be decided from the same place
 * `transactionRowSections` decides it. Four call sites each answered that
 * question themselves, three of them by not asking it at all.
 */
export const useTransactionHeaders = (): string[] => {
  const router = useRouter();

  return getTransactionHeaders({ showInOut: showsInOut(router) });
};
