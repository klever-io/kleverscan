import { ParsedUrlQuery } from 'querystring';

/**
 * The column layout of the shared transactions table, in one place.
 *
 * It used to be in two: `transactionTableHeaders` gave the headings, and
 * `transactionRowSections` built the cells and spliced an extra one in at
 * index 3 when the list was scoped to an account. Only one of the four call
 * sites widened its heading list to match, so `/transactions?account=…`,
 * `/asset/<id>?account=…` and `/asset/<id>/<nonce>?account=…` rendered five
 * headings above six cells and every column from the fourth onwards sat under
 * the wrong one.
 *
 * Both now come from `getTransactionColumns`, so they cannot disagree: a
 * column is one entry, carrying its key and its heading together.
 */

export type TransactionColumnKey =
  | 'hash'
  | 'blockFees'
  | 'fromTo'
  | 'inOut'
  | 'type'
  | 'misc';

export interface ITransactionColumn {
  key: TransactionColumnKey;
  /** Heading text. Not translated here: see the note below. */
  header: string;
}

/**
 * Headings are still the English literals they have always been. They are
 * safe to translate, unlike the filter values, because no route passes
 * `sortableColumns` for this table and so no heading doubles as a sort key
 * (issue #678 blocks the holders table for exactly that reason). Doing it
 * belongs with the work that moves the cells themselves, not here, where the
 * point is that the two lists stop drifting apart.
 *
 * A cell's `span` is not repeated here. It lives on the `IRowSection` the row
 * builder returns, which is the only place `Table` reads it from; a copy here
 * would be a second source of truth that nothing checks.
 */
const BASE_COLUMNS: ITransactionColumn[] = [
  { key: 'hash', header: 'Transaction Hash' },
  { key: 'blockFees', header: 'Block/Fees' },
  { key: 'fromTo', header: 'From/To' },
  { key: 'type', header: 'Type' },
  { key: 'misc', header: 'Misc' },
];

const IN_OUT_COLUMN: ITransactionColumn = {
  key: 'inOut',
  header: 'In/Out',
};

/** Position of the In/Out column, directly after From/To. */
const IN_OUT_INDEX = 3;

/**
 * The routes whose request layer actually narrows the list to one account.
 * Only `requestTransactionsDefault` renames `account` to `address`, and
 * `address` is the parameter the API honours: measured against the live API,
 * `?account=<addr>` leaves the total record count untouched while
 * `?address=<addr>` cuts it from 58.5M to about 12k.
 *
 * That distinction is the whole reason this is not simply "is there an account
 * in the URL". On `/asset/<id>?account=<addr>` the account rides along, is
 * ignored by the API, and the list still holds everyone's transactions. A
 * direction column there would compare each row's sender against an account
 * the list was never filtered by, and read "In" for essentially every row.
 */
const ACCOUNT_SCOPED_PATHNAMES = new Set([
  '/transactions',
  '/account/[account]',
]);

export interface ITransactionColumnsContext {
  /**
   * True when the list is narrowed to one account, which is the only case
   * where a transaction has a direction worth showing.
   */
  showInOut: boolean;
}

export const getTransactionColumns = ({
  showInOut,
}: ITransactionColumnsContext): ITransactionColumn[] => {
  const columns = [...BASE_COLUMNS];
  if (showInOut) columns.splice(IN_OUT_INDEX, 0, IN_OUT_COLUMN);
  return columns;
};

export const getTransactionHeaders = (
  context: ITransactionColumnsContext,
): string[] => getTransactionColumns(context).map(column => column.header);

/**
 * Whether this list carries a direction. Both the headings and the cells ask
 * this, so they agree about the column's existence by construction.
 */
export const showsInOut = (router: {
  pathname?: string;
  query?: ParsedUrlQuery;
}): boolean => {
  if (!ACCOUNT_SCOPED_PATHNAMES.has(router?.pathname ?? '')) return false;

  const account = router?.query?.account;
  // Next hands back an array when a parameter repeats. The direction is
  // decided by comparing a sender against one account, which an array can
  // never equal, so the column would read "In" for every row.
  return typeof account === 'string' && account !== '';
};
