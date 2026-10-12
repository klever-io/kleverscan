export const CARD_OVERVIEW = 'Overview';
export const CARD_PERMISSION = 'Permission';

export const DIRECTION_ALL = 'All Transactions';
export const DIRECTION_OUT = 'Transactions Out';
export const DIRECTION_IN = 'Transactions In';

export type AccountCard = typeof CARD_OVERVIEW | typeof CARD_PERMISSION;

export interface AccountListHeaderInput {
  assets: string;
  proprietary: string | null;
  transactions: string;
  buckets: string | null;
  rewards: string | null;
  contracts: string;
}

export interface DirectionQuery {
  fromAddress?: string | string[];
  toAddress?: string | string[];
  /**
   * Legacy bookmark. The label does not read it. `withoutRole` drops it
   * so the request cannot keep filtering while the label says every
   * transaction.
   */
  role?: string | string[];
}

const one = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value;

/**
 * Card tab from the address bar. `urlRead` is false until the browser has
 * read `?card=`, so the first paint highlights nothing. Permission stays
 * selected while the account is still loading, otherwise a refresh on that
 * tab paints Overview and then jumps.
 */
export const visibleAccountCard = (
  raw: string | null,
  urlRead: boolean,
  permissionsKnown: boolean,
  hasPermissions: boolean,
): AccountCard | null => {
  if (!urlRead) return null;
  if (raw !== CARD_PERMISSION) return CARD_OVERVIEW;
  if (!permissionsKnown) return CARD_PERMISSION;
  return hasPermissions ? CARD_PERMISSION : CARD_OVERVIEW;
};

/**
 * Assets, then proprietary assets when the account owns any, then
 * transactions, then buckets and rewards when the account has buckets,
 * then smart contracts. Same order as the page built by splicing.
 */
export const accountListHeaders = (input: AccountListHeaderInput): string[] => {
  const headers = [input.assets];
  if (input.proprietary) headers.push(input.proprietary);
  headers.push(input.transactions);
  if (input.buckets && input.rewards) {
    headers.push(input.buckets, input.rewards);
  }
  headers.push(input.contracts);
  return headers;
};

/**
 * Highlight for the lists under the card. -1 until the URL is read, and
 * while a named tab is missing because the query that adds it has not
 * finished. An unknown tab falls back to the first header once that data
 * is in. A URL with no tab opens the first header.
 */
export const accountListTabIndex = (
  headers: string[],
  raw: string | null,
  urlRead: boolean,
  headersSettled: boolean,
): number => {
  if (!urlRead) return -1;
  if (raw == null || raw === '') return headers.length > 0 ? 0 : -1;
  const index = headers.indexOf(raw);
  if (index >= 0) return index;
  if (!headersSettled) return -1;
  return headers.length > 0 ? 0 : -1;
};

/**
 * In/Out label for this account. The page stores the choice as
 * fromAddress (out) or toAddress (in) of the account itself.
 */
export const transactionDirectionLabel = (
  query: DirectionQuery,
  address: string,
): string => {
  if (!address) return DIRECTION_ALL;
  if (one(query.fromAddress) === address) return DIRECTION_OUT;
  if (one(query.toAddress) === address) return DIRECTION_IN;
  return DIRECTION_ALL;
};

/**
 * True once the account query has finished, including a call that caught
 * an error and returned no account. While this is false, Permission stays
 * selected so a refresh does not paint Overview and then jump.
 */
export const accountPermissionsKnown = (isFetched: boolean): boolean =>
  isFetched;

/** The header the highlight already chose. The table and the filter use it. */
export const resolvedListTab = (
  headers: string[],
  tabIndex: number,
): string | null => (tabIndex >= 0 ? (headers[tabIndex] ?? null) : null);

/**
 * A copy of the query without the legacy `role` key. Null when the query
 * had no role, so the caller does not rewrite the address bar.
 */
export const withoutRole = <T extends { role?: unknown }>(
  query: T,
): Omit<T, 'role'> | null => {
  if (query.role == null) return null;
  const next = { ...query };
  delete next.role;
  return next;
};
