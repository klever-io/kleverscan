import {
  accountsCall,
  genesisAccountsCall,
} from '@/services/requests/accounts';
import { accountBadges } from '../badges';
import { genesisTimestampQuery, validatorOwnersQuery } from '../badgeQueries';
import { accountsFilteredCall } from '../filteredList';

jest.mock('@/services/requests/accounts', () => ({
  accountsCall: jest.fn(),
  genesisAccountsCall: jest.fn(),
  genesisTimestampCall: jest.fn(),
  validatorOwnersCall: jest.fn(),
}));

/**
 * Stands in for the shared query cache. `fetchQuery` is the only method this
 * module uses, and what matters is which of the two sources it is asked for,
 * so the fake dispatches on the key rather than replaying react-query.
 */
const sources: { genesisTimestamp: unknown; owners: unknown } = {
  genesisTimestamp: undefined,
  owners: undefined,
};
/**
 * Dispatches on the key, and runs the real `queryFn` for the genesis window so
 * the module's own call still goes through `genesisAccountsCall`. The two
 * badge sources are answered from `sources` because their options come from
 * `badgeQueries`, which this file does not exercise.
 */
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

/** 40 genesis stand-ins, every third running a node. Half carry the timestamp
 *  in seconds, which is the mix mainnet returns. */
const genesisAccounts = Array.from({ length: 40 }, (_, index) => ({
  address: `klv1genesis${index}`,
  balance: (40 - index) * 1_000_000,
  timestamp: index % 2 === 0 ? GENESIS_MS : GENESIS_MS / 1000,
}));

/** Inside the window but not on the instant. Without it every fixture row is a
 *  foundation account, and a filter hardcoded to `true` would pass this file. */
const nearGenesisAccount = {
  address: 'klv1nearGenesis',
  balance: 1,
  timestamp: GENESIS_MS + 500,
};

const windowAccounts = [...genesisAccounts, nearGenesisAccount];

/**
 * Every third account runs a genesis node, and one more runs a node it
 * registered later. Without that last one "validator" and "genesis validator"
 * are the same set here, and swapping one for the other in the filter passes
 * every test in this file.
 */
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
    // All 40, including the ones that also run a node: they are genesis
    // accounts too, and they carry both badges.
    expect(response.pagination?.totalRecords).toBe(40);
    expect(response.pagination?.totalPages).toBe(4);
  });

  it('keeps the filters and the badges saying the same thing', async () => {
    // Against `accountBadges` itself, not against the other filter: two filters
    // agreeing with each other proves nothing about what the row renders.
    // Limit past the whole set, so this compares sets rather than first pages.
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

    // The near-genesis row proves the assertions above are observable: the
    // request returns it, the badge says no, so the filter must drop it.
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
    // Every third of 40 is 14. The fixture also holds one owner that
    // registered later, and it must not be counted here.
    expect(response.pagination?.totalRecords).toBe(14);
    expect(response.pagination?.totalPages).toBe(2);
  });

  it('keeps a later-registered validator out of the genesis filter', async () => {
    // Every owner in the fixture used to be a genesis one, which made the two
    // indistinguishable: swapping `badges.genesisValidator` for
    // `badges.validator` passed this whole file. This account is a genesis
    // account that registered its node afterwards, so it earns the plain
    // Validator badge and neither filter may treat it as a genesis one.
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
    // 14 rows at 10 a page: the second page holds 4, and rounding down would
    // lose them.
    const response = await call({ filter: 'genesisValidator', page: 2 });

    expect(response.data.accounts).toHaveLength(4);
  });

  it('answers an empty page past the end instead of wrapping around', async () => {
    const response = await call({ filter: 'genesisValidator', page: 9 });

    expect(response.data.accounts).toHaveLength(0);
  });

  it('never asks for the validator set under the foundation filter', async () => {
    // It used to wait on it, and that was the worst bug here: "no data" for
    // three `validator/list` pages it reads nothing from, permanently if they
    // failed. Asserted on the request, not just the rows, because rows can be
    // right while the page still pays for a fetch it discards.
    const response = await call({ filter: 'foundation', owners: undefined });

    expect(response.data.accounts).toHaveLength(10);
    expect(response.pagination?.totalRecords).toBe(40);
    // Asserted as an absence, because the window itself is fetched through the
    // cache too now: what must not appear is the validator set.
    expect(
      fetchQuery.mock.calls.map(([options]) => options.queryKey[0]),
    ).not.toContain('validatorOwners');
  });

  it('clamps a hand-edited limit instead of losing rows off the page', async () => {
    // `?limit=-5` reaches this the same way `?page=-1` does, and unclamped it
    // returned 35 of the 40 rows on a page the pager called complete, leaving
    // five unreachable.
    const response = await call({ filter: 'foundation', limit: -5 });

    expect(response.data.accounts).toHaveLength(1);
    expect(response.pagination?.totalPages).toBe(40);
    expect(response.pagination?.totalRecords).toBe(40);
  });

  it('rounds a fractional limit down, so the pager matches the rows', async () => {
    // The page size gets the same treatment as the page number: `?limit=3.5`
    // arrives intact through `Number(...) || 10`. `slice` truncates its own
    // arguments, so the rows survive either way and the damage lands in the
    // count: 40 rows at 3.5 reports 12 pages while serving them 3 at a time,
    // which is a pager pointing at pages that do not exist.
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
    // The recurring 0-versus-falsy question, at the boundary where this module
    // decides whether it has a usable window at all. No chain starts at the
    // epoch, but the two readings differ nowhere else, so this is where the
    // distinction is pinned.
    const response = await call({
      filter: 'foundation',
      genesisTimestamp: 0,
      owners,
    });

    expect(mockedGenesis).toHaveBeenCalledWith(0);
    expect(response.error).toBeFalsy();
  });

  it('falls back to a usable page size for a non-finite limit', async () => {
    // `?limit=Infinity` passes the shared Table's `Number(...) || 10` intact,
    // and `(1 - 1) * Infinity` is NaN, which sliced to nothing while the pager
    // still reported the full 40 records.
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
    // The shared Table derives `page` as `Number(router.query.page) || 1`, so a
    // hand-edited `?page=-1` arrives intact. An unclamped `start` makes `slice`
    // count from the end, which served four real rows under an impossible page
    // number while the pager said there were two pages.
    const response = await call({ filter: 'genesisValidator', page: -1 });

    expect(response.data.accounts.map(a => a.address)).toEqual(
      (await call({ filter: 'genesisValidator', page: 1 })).data.accounts.map(
        a => a.address,
      ),
    );
  });

  it('rounds a fractional page down instead of slicing between rows', async () => {
    // Found by mutation: dropping the `Math.floor` survived every test here,
    // because the negative-page test only exercises the clamp. `?page=1.5`
    // reaches this as 1.5, and an unfloored start of 5 serves rows 6 to 15,
    // a window that belongs to no page in the pager.
    const half = await call({ filter: 'genesisValidator', page: 1.5 });
    const first = await call({ filter: 'genesisValidator', page: 1 });

    expect(half.data.accounts.map(a => a.address)).toEqual(
      first.data.accounts.map(a => a.address),
    );
  });

  it('reports a failed validator set rather than the unnarrowed 40', async () => {
    // Serving the whole genesis window here until the set arrives would show
    // foundation accounts under a validator filter. It carries an error string
    // rather than a clean empty page so the state is not "there are none".
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
    // It used to return one module-level object by identity. Nothing mutates
    // the rows today, but a consumer that ever sorts them in place would be
    // editing what the next caller receives.
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
    // Scoped to this layer. The shared Table collapses the two into the same
    // empty state (`Table/index.tsx:151-159`), so this is not a claim about
    // what the page shows, only that surfacing it needs no change here.
    mockedGenesis.mockResolvedValue(undefined);

    const response = await call({ filter: 'foundation' });

    expect(response.error).toBeTruthy();
    expect(response.data.accounts).toHaveLength(0);
  });

  it('fetches its sources through the same options the badges use', () => {
    // The module's docblock claims this reuses whatever the row badges already
    // loaded, and that claim rests entirely on the two sharing an options
    // object. Asserted by identity, because a locally rebuilt object with the
    // same key would satisfy every other test in this file while quietly
    // dropping the staleTime that keeps a failed source from sticking.
    return call({ filter: 'genesisValidator' }).then(() => {
      const used = fetchQuery.mock.calls.map(([options]) => options);
      expect(used).toContain(genesisTimestampQuery);
      expect(used).toContain(validatorOwnersQuery);
      // The window goes through the cache too, keyed on the instant it was
      // fetched for. Without this the direct call would satisfy every other
      // assertion here, because the fake falls through to the queryFn.
      expect(used.map(o => o.queryKey)).toContainEqual([
        'genesisAccounts',
        GENESIS_MS,
      ]);
    });
  });
});
