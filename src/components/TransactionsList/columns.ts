import { ROW_LAYOUT_MIN_WIDTH } from '@/components/DataList/layout';
import { ParsedUrlQuery } from 'querystring';

/**
 * The column layout of the shared transactions table, in one place: headings
 * and cells used to come from two lists, and only one of the four call sites
 * widened its heading list when the account scope spliced a cell in, so three
 * routes rendered five headings above six cells. Two-line benchmark for the
 * single-line layout: tag benchmark/two-line-rows.
 */

/** The account-scoped list carries an In/Out column the others do not, so it
 *  needs more than the shared row width: measured 1269px against 1204 for the
 *  nine-column list. */
export const ROW_LAYOUT_MIN_WIDTH_WITH_IN_OUT = 1310;

export type TransactionColumnKey =
  | 'hash'
  | 'type'
  | 'block'
  | 'age'
  | 'from'
  | 'direction'
  | 'to'
  | 'inOut'
  | 'amount'
  | 'fee';

export interface ITransactionColumn {
  key: TransactionColumnKey;
  /** Heading text. Not translated here: see the note below. */
  header: string;
}

/**
 * Headings here are the canonical English literals; display goes through
 * `t()` in `useTransactionHeaders`, with these as the fallback, so this
 * module stays free of i18n plumbing and usable outside React.
 *
 * A cell's `span` is not repeated here. It lives on the `IRowSection` the row
 * builder returns, which is the only place `Table` reads it from; a copy here
 * would be a second source of truth that nothing checks.
 */
const BASE_COLUMNS: ITransactionColumn[] = [
  { key: 'hash', header: 'Transaction Hash' },
  { key: 'type', header: 'Type' },
  { key: 'block', header: 'Block' },
  { key: 'age', header: 'Age' },
  { key: 'from', header: 'From' },
  // The circled status arrow between the addresses; deliberately unheaded,
  // like the reference explorers.
  { key: 'direction', header: '' },
  { key: 'to', header: 'To' },
  { key: 'amount', header: 'Amount' },
  { key: 'fee', header: 'Fee' },
];

const IN_OUT_COLUMN: ITransactionColumn = {
  key: 'inOut',
  header: 'In/Out',
};

/** Position of the In/Out column, directly after To. */
const IN_OUT_INDEX = 7;

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
  /** Narrowed to one account, the only case where a direction means anything. */
  showInOut: boolean;
}

export const getTransactionColumns = ({
  showInOut,
}: ITransactionColumnsContext): ITransactionColumn[] => {
  const columns = [...BASE_COLUMNS];
  if (showInOut) columns.splice(IN_OUT_INDEX, 0, IN_OUT_COLUMN);
  return columns;
};

/** The width this list's row needs, which depends on whether it carries the
 *  In/Out column. */
export const rowLayoutMinWidth = (showInOut: boolean): number =>
  showInOut ? ROW_LAYOUT_MIN_WIDTH_WITH_IN_OUT : ROW_LAYOUT_MIN_WIDTH;

/** Both the headings and the cells ask this, so they agree about the
 *  column's existence by construction. */
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

/** The parameters that narrow this list, named rather than inferred. */
const FILTER_KEYS = new Set([
  'type',
  'status',
  'asset',
  'buyType',
  'account',
  'startdate',
  'enddate',
]);

/**
 * Whether this list still holds the whole chain.
 *
 * Asked by the summary above it, whose figures are chain-wide. A filter
 * narrows the rows underneath while leaving those figures alone, so the card
 * would read as a summary of a table it does not describe.
 *
 * Named filters rather than "anything that is not paging": that inverted form
 * also hid the card for `?utm_source=`, so every shared campaign link lost it.
 * A filter added later has to be added here too.
 */
/** Next hands back an array for a repeated parameter, so `?type=&type=`
 * arrives as `['', '']` and a comparison against `''` would call it a filter. */
const narrows = (value: string | string[] | undefined): boolean =>
  Array.isArray(value) ? value.some(Boolean) : Boolean(value);

export const listsWholeChain = (router: { query?: ParsedUrlQuery }): boolean =>
  !Object.entries(router?.query ?? {}).some(
    ([key, value]) => FILTER_KEYS.has(key) && narrows(value),
  );
