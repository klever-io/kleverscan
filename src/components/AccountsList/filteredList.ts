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

// A function, not a shared constant: one object handed out by identity means a
// caller that sorts or splices `data.accounts` changes what the next one gets.
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
  // Only reached when a source did not answer; no-match filters use paginate.
  error,
  code: 'internal_error',
});

/** What the shared Table falls back to, so a rejected size matches it. */
const DEFAULT_LIMIT = 10;

const paginate = (accounts: IAccount[], page: number, limit: number) => {
  // Defense in depth behind the Table's `normalizePageParam` clamp, for direct
  // callers: a negative start makes slice count from the end, and `0 * Infinity`
  // is NaN, which slices to nothing while the pager still reports the full set.
  const size = Number.isFinite(limit)
    ? Math.max(1, Math.floor(limit))
    : DEFAULT_LIMIT;
  const current = Number.isFinite(page) ? Math.max(1, Math.floor(page)) : 1;
  const start = (current - 1) * size;
  return {
    data: { accounts: accounts.slice(start, start + size) },
    pagination: {
      // The clamped page: `self: -1` beside page one's rows describes no page.
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

// Both filters are subsets of the genesis accounts, which arrive in a single
// request, so filtered paging happens here rather than at the API.
// The badge sources are awaited rather than passed in: handed in they are
// undefined for the first second, which resolved a successful empty page and
// showed "Apparently no data here" before anything had been asked. Awaiting
// keeps the request in flight, so the table stays on its skeleton.
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

  // The expensive source; the foundation filter must not wait on it.
  const owners =
    filter === 'genesisValidator'
      ? await queryClient.fetchQuery(validatorOwnersQuery)
      : undefined;
  if (filter === 'genesisValidator' && !owners) {
    return emptyPage('validator set unavailable');
  }

  // Keyed on the instant it was fetched for; the set is as immutable as block
  // 0, so paging inside a filter reuses the first page's fetch.
  const genesis = await queryClient.fetchQuery({
    queryKey: ['genesisAccounts', genesisTimestamp],
    queryFn: async () => (await genesisAccountsCall(genesisTimestamp)) ?? null,
    staleTime: query => (query.state.data == null ? 0 : Infinity),
  });
  if (!genesis) return emptyPage('genesis accounts unavailable');

  // Through accountBadges, so filter and badge cannot disagree; they did once,
  // and a Foundation-filtered row showed only "Genesis validator".
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
