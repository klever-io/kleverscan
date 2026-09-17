import {
  accountsCall,
  genesisAccountsCall,
  genesisTimestampCall,
} from '@/services/requests/accounts';
import { QueryClient } from '@tanstack/react-query';
import { accountBadges } from '../badges';
import { genesisTimestampQuery, validatorOwnersQuery } from '../badgeQueries';
import { accountsFilteredCall } from '../filteredList';

jest.mock('@/services/requests/accounts', () => ({
  accountsCall: jest.fn(),
  genesisAccountsCall: jest.fn(),
  genesisTimestampCall: jest.fn(),
  validatorOwnersCall: jest.fn(),
}));

const sources: { genesisTimestamp: unknown; owners: unknown } = {
  genesisTimestamp: undefined,
  owners: undefined,
};
// Fake query cache: dispatches on the key, answering the two badge sources
// from `sources` and running the real queryFn for the genesis window.
const fetchQuery = jest.fn(
  async (options: { queryKey: unknown[]; queryFn: () => Promise<unknown> }) => {
    if (options.queryKey[0] === 'genesisTimestamp')
      return sources.genesisTimestamp;
    if (options.queryKey[0] === 'validatorOwners') return sources.owners;
    return options.queryFn();
  },
);

const mockedList = accountsCall as jest.Mock;
const mockedGenesis = genesisAccountsCall as jest.Mock;

const GENESIS_MS = 1656680400000;

/** 40 stand-ins, every third running a node; half carry seconds, the mix mainnet returns. */
const genesisAccounts = Array.from({ length: 40 }, (_, index) => ({
  address: `klv1genesis${index}`,
  balance: (40 - index) * 1_000_000,
  timestamp: index % 2 === 0 ? GENESIS_MS : GENESIS_MS / 1000,
}));

/** Inside the window but off the instant; without it a filter hardcoded to `true` passes this file. */
const nearGenesisAccount = {
  address: 'klv1nearGenesis',
  balance: 1,
  timestamp: GENESIS_MS + 500,
};

const windowAccounts = [...genesisAccounts, nearGenesisAccount];

/** Every third account runs a genesis node; one more registered later, keeping "validator" and "genesis validator" distinct sets. */
const owners = {
  ...Object.fromEntries(
    genesisAccounts
      .filter((_, index) => index % 3 === 0)
      .map(account => [account.address, { isGenesis: true, list: 'elected' }]),
  ),
  [genesisAccounts[1].address]: { isGenesis: false, list: 'eligible' },
};

const call = (overrides: Record<string, unknown> = {}) => {
  const {
    genesisTimestamp,
    owners: ownerOverride,
    ...rest
  } = {
    genesisTimestamp: GENESIS_MS,
    owners,
    ...overrides,
  } as Record<string, unknown>;
  sources.genesisTimestamp = genesisTimestamp;
  sources.owners = ownerOverride;
  return accountsFilteredCall({
    page: 1,
    limit: 10,
    filter: undefined,
    routerQuery: {},
    queryClient: { fetchQuery } as never,
    ...rest,
  } as Parameters<typeof accountsFilteredCall>[0]);
};

describe('accountsFilteredCall', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sources.genesisTimestamp = GENESIS_MS;
    sources.owners = owners;
    mockedGenesis.mockResolvedValue(windowAccounts);
    mockedList.mockResolvedValue({ data: { accounts: [] }, error: '' });
  });

  it('goes straight to the endpoint when nothing is filtered', async () => {
    await call({ page: 3, limit: 20, routerQuery: { startdate: '1' } });

    expect(mockedList).toHaveBeenCalledWith(3, 20, { startdate: '1' });
    expect(mockedGenesis).not.toHaveBeenCalled();
  });

  it('serves the whole genesis window for the foundation filter', async () => {
    const response = await call({ filter: 'foundation' });

    expect(mockedGenesis).toHaveBeenCalledWith(GENESIS_MS);
    // All 40: node-runners are genesis accounts too and carry both badges.
    expect(response.pagination?.totalRecords).toBe(40);
    expect(response.pagination?.totalPages).toBe(4);
  });

  it('keeps the filters and the badges saying the same thing', async () => {
    // Against `accountBadges` itself: two filters agreeing proves nothing about
    // the row. Limit past the whole set, so this compares sets, not first pages.
    const foundation = await call({ filter: 'foundation', limit: 100 });
    const validators = await call({ filter: 'genesisValidator', limit: 100 });

    foundation.data.accounts.forEach(account => {
      const badges = accountBadges(
        account.address,
        account.timestamp,
        GENESIS_MS,
        owners,
      );
      expect(badges.foundation).toBe(true);
    });
    validators.data.accounts.forEach(account => {
      const badges = accountBadges(
        account.address,
        account.timestamp,
        GENESIS_MS,
        owners,
      );
      expect(badges.genesisValidator).toBe(true);
    });

    // The near-genesis row keeps the assertions above observable: the badge says no, so the filter must drop it.
    const returned = new Set(
      foundation.data.accounts.map(account => account.address),
    );
    expect(returned.has(nearGenesisAccount.address)).toBe(false);
    expect(foundation.pagination?.totalRecords).toBe(40);

    // And the validators are a strict subset, not the whole set.
    expect(validators.pagination?.totalRecords).toBeLessThan(
      foundation.pagination?.totalRecords ?? 0,
    );
  });

  it('narrows the same window to validators, without asking again', async () => {
    const response = await call({ filter: 'genesisValidator' });

    expect(mockedGenesis).toHaveBeenCalledTimes(1);
    // Every third of 40 is 14; the later-registered owner must not count here.
    expect(response.pagination?.totalRecords).toBe(14);
    expect(response.pagination?.totalPages).toBe(2);
  });

  it('keeps a later-registered validator out of the genesis filter', async () => {
    // Swapping `badges.genesisValidator` for `badges.validator` once passed
    // this whole file; this later-registered node earns only the plain badge.
    const response = await call({ filter: 'genesisValidator', limit: 100 });
    const addresses = response.data.accounts.map(a => a.address);

    expect(addresses).not.toContain(genesisAccounts[1].address);
    // It is still a foundation account, so the other filter does return it.
    const foundation = await call({ filter: 'foundation', limit: 100 });
    expect(foundation.data.accounts.map(a => a.address)).toContain(
      genesisAccounts[1].address,
    );
  });

  it('gives the remainder its own page rather than dropping it', async () => {
    // 14 rows at 10 a page: the second page holds 4, and rounding down loses them.
    const response = await call({ filter: 'genesisValidator', page: 2 });

    expect(response.data.accounts).toHaveLength(4);
  });

  it('answers an empty page past the end instead of wrapping around', async () => {
    const response = await call({ filter: 'genesisValidator', page: 9 });

    expect(response.data.accounts).toHaveLength(0);
  });

  it('never asks for the validator set under the foundation filter', async () => {
    // It used to wait on three `validator/list` pages it read nothing from, "no data" permanently if they failed.
    // Asserted on the request: rows can be right while the page still pays for a discarded fetch.
    const response = await call({ filter: 'foundation', owners: undefined });

    expect(response.data.accounts).toHaveLength(10);
    expect(response.pagination?.totalRecords).toBe(40);
    // Asserted as an absence: the window is fetched through the cache too now; what must not appear is the validator set.
    expect(
      fetchQuery.mock.calls.map(([options]) => options.queryKey[0]),
    ).not.toContain('validatorOwners');
  });

  it('clamps a hand-edited limit instead of losing rows off the page', async () => {
    // Unclamped, `?limit=-5` returned 35 of the 40 rows on a page the pager called complete, five unreachable.
    const response = await call({ filter: 'foundation', limit: -5 });

    expect(response.data.accounts).toHaveLength(1);
    expect(response.pagination?.totalPages).toBe(40);
    expect(response.pagination?.totalRecords).toBe(40);
  });

  it('rounds a fractional limit down, so the pager matches the rows', async () => {
    // `slice` truncates its own arguments, so the damage lands in the count:
    // 40 rows at limit 3.5 reported 12 pages while serving them 3 at a time.
    const fractional = await call({
      filter: 'foundation',
      limit: 3.5,
      page: 2,
    });
    const floored = await call({ filter: 'foundation', limit: 3, page: 2 });

    expect(fractional.pagination?.totalPages).toBe(
      floored.pagination?.totalPages,
    );
    expect(fractional.data.accounts.map(a => a.address)).toEqual(
      floored.data.accounts.map(a => a.address),
    );
  });

  it('treats a genesis instant of zero as a window, not as absent', async () => {
    // The 0-versus-falsy boundary: no chain starts at the epoch, but the two readings differ nowhere else.
    const response = await call({
      filter: 'foundation',
      genesisTimestamp: 0,
      owners,
    });

    expect(mockedGenesis).toHaveBeenCalledWith(0);
    expect(response.error).toBeFalsy();
  });

  it('falls back to a usable page size for a non-finite limit', async () => {
    // Unguarded, `(1 - 1) * Infinity` is NaN: sliced to nothing while the pager still reported 40 records.
    const response = await call({ filter: 'foundation', limit: Infinity });

    expect(response.data.accounts).toHaveLength(10);
    expect(response.pagination?.totalRecords).toBe(40);
    expect(response.pagination?.totalPages).toBe(4);
  });

  it('falls back to the first page for a non-finite page', async () => {
    const response = await call({ filter: 'foundation', page: Infinity });

    expect(response.data.accounts).toHaveLength(10);
    expect(response.pagination?.self).toBe(1);
  });

  it('does not serve rows from the end for a negative page', async () => {
    // Unclamped, `slice` counts from the end: four real rows served under an impossible page number.
    const response = await call({ filter: 'genesisValidator', page: -1 });

    expect(response.data.accounts.map(a => a.address)).toEqual(
      (await call({ filter: 'genesisValidator', page: 1 })).data.accounts.map(
        a => a.address,
      ),
    );
  });

  it('rounds a fractional page down instead of slicing between rows', async () => {
    // Found by mutation: dropping the `Math.floor` survived every test here.
    // An unfloored start of 5 serves rows 6 to 15, a window in no pager page.
    const half = await call({ filter: 'genesisValidator', page: 1.5 });
    const first = await call({ filter: 'genesisValidator', page: 1 });

    expect(half.data.accounts.map(a => a.address)).toEqual(
      first.data.accounts.map(a => a.address),
    );
  });

  it('reports a failed validator set rather than the unnarrowed 40', async () => {
    // An error string rather than a clean empty page, so the state is not "there are none".
    const response = await call({
      filter: 'genesisValidator',
      owners: undefined,
    });

    expect(response.data.accounts).toHaveLength(0);
    expect(response.error).toBeTruthy();
    // And it stops before the window request, not after paying for it.
    expect(mockedGenesis).not.toHaveBeenCalled();
  });

  it('hands each caller its own empty page rather than a shared one', async () => {
    // Used to return one module-level object by identity; an in-place sort would edit the next caller's page.
    const first = await call({ filter: 'genesisValidator', owners: undefined });
    const second = await call({
      filter: 'genesisValidator',
      owners: undefined,
    });

    expect(first.data.accounts).not.toBe(second.data.accounts);
  });

  it('reports a failed block zero rather than an empty filter', async () => {
    const response = await call({
      filter: 'foundation',
      genesisTimestamp: undefined,
    });

    expect(mockedGenesis).not.toHaveBeenCalled();
    expect(response.data.accounts).toHaveLength(0);
    expect(response.error).toBeTruthy();
  });

  it('marks a failed window as an error, not as an empty result', async () => {
    // Scoped to this layer: the shared Table collapses both into the same
    // empty state (`tableRequest` in `Table/index.tsx`).
    mockedGenesis.mockResolvedValue(undefined);

    const response = await call({ filter: 'foundation' });

    expect(response.error).toBeTruthy();
    expect(response.data.accounts).toHaveLength(0);
  });

  it('fetches its sources through the same options the badges use', () => {
    // Asserted by identity: a locally rebuilt options object with the same key
    // passes every other test while dropping the staleTime that keeps a failed source from sticking.
    return call({ filter: 'genesisValidator' }).then(() => {
      const used = fetchQuery.mock.calls.map(([options]) => options);
      expect(used).toContain(genesisTimestampQuery);
      expect(used).toContain(validatorOwnersQuery);
      // Without this a direct window call satisfies every other assertion here, because the fake falls through to the queryFn.
      expect(used.map(o => o.queryKey)).toContainEqual([
        'genesisAccounts',
        GENESIS_MS,
      ]);
    });
  });

  it('retries the genesis window after a failure, and pins a real answer', async () => {
    // Through a real QueryClient, because the inline staleTime arrow is the policy
    // under test: a null result goes stale immediately, a populated set is pinned.
    (genesisTimestampCall as jest.Mock).mockResolvedValue(GENESIS_MS);
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const realCall = () =>
      accountsFilteredCall({
        page: 1,
        limit: 10,
        filter: 'foundation',
        routerQuery: {},
        queryClient: client,
      });

    mockedGenesis.mockResolvedValueOnce(undefined);
    const first = await realCall();
    expect(first.error).toBe('genesis accounts unavailable');
    expect(mockedGenesis).toHaveBeenCalledTimes(1);

    const second = await realCall();
    expect(second.error).toBeFalsy();
    expect(mockedGenesis).toHaveBeenCalledTimes(2);

    await realCall();
    expect(mockedGenesis).toHaveBeenCalledTimes(2);
  });
});
