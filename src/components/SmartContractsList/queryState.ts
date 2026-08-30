import { ParsedUrlQuery } from 'querystring';

/**
 * What the URL means for this list: which parameters reach the API, what the
 * list is actually sorted by, and where the deployer links point.
 *
 * One module because these three have to agree. The filter bar shows the
 * active sort, the request builds the call, and the deployer link rebuilds the
 * URL; three separate readings of the same query string would drift, and the
 * one that drifts is the one the reader is looking at.
 */

/**
 * A parameter as the request layer sees it. `smartContractsTableRequest`
 * forwards a value only when it is a non-empty string, so a repeated parameter
 * (`?sortBy=a&sortBy=b`, which Next hands back as an array) never reaches the
 * API and counts as absent here too.
 */
export const singleParam = (
  value: string | string[] | undefined,
): string | undefined =>
  typeof value === 'string' && value ? value : undefined;

export type ContractSort = 'totalTransactions' | 'timestamp';
export type ContractOrder = 'desc' | 'asc';

export const SORT_VALUES: ContractSort[] = ['totalTransactions', 'timestamp'];
export const ORDER_VALUES: ContractOrder[] = ['desc', 'asc'];

/**
 * What the list is really sorted by, which is not always what the URL says.
 *
 * Two coercions stack. `smartContractsTableRequest` defaults an absent value
 * to `totalTransactions`, and the server (baseSmartContractGroup.go) maps
 * anything that is not exactly `totalTransactions` onto timestamp without
 * returning an error. So `?sortBy=nonsense` silently sorts by timestamp, and
 * the bar has to say timestamp rather than echo the nonsense back.
 */
export const activeSort = (query: ParsedUrlQuery | undefined): ContractSort => {
  const raw = singleParam(query?.sortBy);
  if (raw === undefined) return 'totalTransactions';
  return raw === 'totalTransactions' ? 'totalTransactions' : 'timestamp';
};

/** Same stacking: absent defaults to `desc`, and the server reads anything
 *  that is not exactly `asc` as `desc`. */
export const activeOrder = (
  query: ParsedUrlQuery | undefined,
): ContractOrder => (singleParam(query?.orderBy) === 'asc' ? 'asc' : 'desc');

export const readDeployerFilter = (
  query: ParsedUrlQuery | undefined,
): string | undefined => singleParam(query?.deployer);

/**
 * Rebuilds this page's URL. Carries the sort and the page size over (both are
 * view state the reader chose) and drops everything else, `page` included:
 * page 12 of the unfiltered list does not exist in the two pages one deployer
 * has.
 */
const build = (
  query: ParsedUrlQuery | undefined,
  overrides: { deployer?: string; sortBy?: string; orderBy?: string } = {},
): string => {
  const params = new URLSearchParams();
  const deployer =
    overrides.deployer !== undefined
      ? overrides.deployer
      : readDeployerFilter(query);
  if (deployer) params.set('deployer', deployer);

  // The resolved values, not the raw ones: a link built from `?sortBy=nonsense`
  // would carry that nonsense forward while the bar beside it says timestamp.
  params.set('sortBy', overrides.sortBy ?? activeSort(query));
  params.set('orderBy', overrides.orderBy ?? activeOrder(query));

  const limit = singleParam(query?.limit);
  if (limit) params.set('limit', limit);

  return `/smart-contracts?${params.toString()}`;
};

/** Narrows the list to one deployer, back at page one. */
export const deployerFilterHref = (
  query: ParsedUrlQuery | undefined,
  deployer: string,
): string => build(query, { deployer });

/** The way back out, keeping the sort the reader chose. */
export const clearDeployerHref = (query: ParsedUrlQuery | undefined): string =>
  build(query, { deployer: '' });
