import {
  accountsCall,
  genesisAccountsCall,
  type AccountFilter,
  type IAccountsResponse,
} from '@/services/requests/accounts';
import type { IAccount } from '@/types/index';
import type { QueryClient } from '@tanstack/react-query';
import { accountBadges } from './badges';
import { genesisTimestampQuery, validatorOwnersQuery } from './badgeQueries';

export interface IFilteredListArgs {
  page: number;
  limit: number;
  filter: AccountFilter | undefined;
  routerQuery: Record<string, string | string[] | undefined>;
  queryClient: QueryClient;
}

// A function, not a shared constant: returning one object by identity to every
// caller means a consumer that ever sorts or splices `data.accounts` in place
// changes what the next caller receives.
const emptyPage = (error: string): IAccountsResponse => ({
  data: { accounts: [] },
  pagination: {
    self: 1,
    next: 1,
    previous: 1,
    perPage: 0,
    totalPages: 0,
    totalRecords: 0,
  },
  // Required, because every path that reaches this one is a source that did
  // not answer. A filter with genuinely no matches goes through `paginate`.
  error,
  code: 'internal_error',
});

/** What the shared Table falls back to, so a rejected size matches it. */
const DEFAULT_LIMIT = 10;

const paginate = (accounts: IAccount[], page: number, limit: number) => {
  // The shared Table derives these as `Number(query.page) || 1` and
  // `Number(query.limit) || 10`, so a hand-edited URL arrives intact,
  // `Infinity` included. Three ways it goes wrong unguarded: a negative start
  // makes slice count from the end, a negative size drops rows off a page that
  // claims to hold them, and `0 * Infinity` is NaN, which slices to nothing
  // while the pager still reports the full set.
  const size = Number.isFinite(limit)
    ? Math.max(1, Math.floor(limit))
    : DEFAULT_LIMIT;
  const current = Number.isFinite(page) ? Math.max(1, Math.floor(page)) : 1;
  const start = (current - 1) * size;
  return {
    data: { accounts: accounts.slice(start, start + size) },
    pagination: {
      // The clamped page, not the requested one: reporting `self: -1` beside
      // the rows of page one describes a page that does not exist.
      self: current,
      next: current + 1,
      previous: Math.max(1, current - 1),
      perPage: size,
      totalPages: Math.max(1, Math.ceil(accounts.length / size)),
      totalRecords: accounts.length,
    },
    error: '',
    code: 'successful',
  } as IAccountsResponse;
};

/**
 * One page of the account list, filtered or not.
 *
 * Both filters are subsets of the accounts created in the genesis block, which
 * arrive in a single request, so filtered paging happens here rather than at
 * the API: letting it page the window and then narrowing the page would give
 * ragged pages and a page count describing a different set than the rows.
 *
 * The badge sources are awaited here rather than passed in as values. Handed
 * in, they are undefined for the first second of the page and this resolved a
 * successful empty page, which the shared Table cannot tell from "there are
 * none": a filtered URL showed "Apparently no data here" before it had asked
 * for anything. Awaiting them keeps the request in flight, so the table stays
 * on its skeleton. They go through the shared query cache, so this reuses
 * whatever the row badges already fetched rather than asking twice.
 */
export const accountsFilteredCall = async ({
  page,
  limit,
  filter,
  routerQuery,
  queryClient,
}: IFilteredListArgs): Promise<IAccountsResponse> => {
  if (!filter) return accountsCall(page, limit, routerQuery);

  const genesisTimestamp = await queryClient.fetchQuery(genesisTimestampQuery);
  // `typeof` first so the rest of this function has a number rather than a
  // cast: `Number.isFinite` returns a boolean and narrows nothing.
  if (
    typeof genesisTimestamp !== 'number' ||
    !Number.isFinite(genesisTimestamp)
  ) {
    return emptyPage('genesis block unavailable');
  }

  // Only the validator filter reads the validator set, and it is the expensive
  // one, so the foundation filter must not wait on it.
  const owners =
    filter === 'genesisValidator'
      ? await queryClient.fetchQuery(validatorOwnersQuery)
      : undefined;
  if (filter === 'genesisValidator' && !owners) {
    return emptyPage('validator set unavailable');
  }

  // Through the cache too, keyed on the instant it was fetched for. The set is
  // as immutable as block 0 is, so paging inside a filter costs nothing after
  // the first page instead of re-fetching the whole window each time.
  const genesis = await queryClient.fetchQuery({
    queryKey: ['genesisAccounts', genesisTimestamp],
    queryFn: async () => (await genesisAccountsCall(genesisTimestamp)) ?? null,
    staleTime: query => (query.state.data == null ? 0 : Infinity),
  });
  if (!genesis) return emptyPage('genesis accounts unavailable');

  // Through accountBadges, so filter and badge cannot disagree. They did once:
  // the badge suppressed itself on genesis validators while the filter kept
  // them, so a Foundation-filtered row showed only "Genesis validator".
  const matching = genesis.filter(account => {
    const badges = accountBadges(
      account.address,
      account.timestamp,
      genesisTimestamp,
      owners ?? undefined,
    );
    return filter === 'foundation'
      ? badges.foundation
      : badges.genesisValidator;
  });

  return paginate(matching, page, limit);
};
