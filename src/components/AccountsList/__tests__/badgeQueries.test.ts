import {
  genesisTimestampCall,
  validatorOwnersCall,
} from '@/services/requests/accounts';
import { QueryClient } from '@tanstack/react-query';
import { genesisTimestampQuery, validatorOwnersQuery } from '../badgeQueries';

jest.mock('@/services/requests/accounts', () => ({
  genesisTimestampCall: jest.fn(),
  validatorOwnersCall: jest.fn(),
}));

const mockedTimestamp = genesisTimestampCall as jest.Mock;
const mockedOwners = validatorOwnersCall as jest.Mock;

/**
 * The whole reason this file exists: react-query 5 throws on an undefined
 * result rather than storing it, which drops the query into its error state
 * and spends three retries on a call that already answered. Both request
 * functions answer `undefined` on failure, so the mapping is load-bearing.
 */
describe('badge query options', () => {
  beforeEach(() => jest.clearAllMocks());

  it('turns an unavailable genesis moment into null, never undefined', async () => {
    mockedTimestamp.mockResolvedValue(undefined);

    await expect(genesisTimestampQuery.queryFn()).resolves.toBeNull();
  });

  it('turns an unavailable validator set into null, never undefined', async () => {
    mockedOwners.mockResolvedValue(undefined);

    await expect(validatorOwnersQuery.queryFn()).resolves.toBeNull();
  });

  it('passes a real answer through untouched', async () => {
    mockedTimestamp.mockResolvedValue(1656680400000);
    mockedOwners.mockResolvedValue({ a: { isGenesis: true, list: 'elected' } });

    await expect(genesisTimestampQuery.queryFn()).resolves.toBe(1656680400000);
    await expect(validatorOwnersQuery.queryFn()).resolves.toEqual({
      a: { isGenesis: true, list: 'elected' },
    });
  });

  it('keeps a zero timestamp rather than mapping it to null', async () => {
    // `??`, not `||`: the two differ only at 0, and this is the same
    // zero-versus-absent boundary the filter and the badge both pin.
    mockedTimestamp.mockResolvedValue(0);

    await expect(genesisTimestampQuery.queryFn()).resolves.toBe(0);
  });

  it('keys both on names the filtered list can reuse from cache', async () => {
    // The filtered request fetches through these same keys, which is what
    // makes it reuse whatever the row badges already loaded.
    expect(genesisTimestampQuery.queryKey).toEqual(['genesisTimestamp']);
    expect(validatorOwnersQuery.queryKey).toEqual(['validatorOwners']);
    // A function, not a constant: a real answer is good for the session, a
    // failed one must go stale immediately so the next mount asks again.
    const stale = genesisTimestampQuery.staleTime as (q: unknown) => number;
    expect(stale({ state: { data: 1656680400000 } })).toBe(Infinity);
    expect(stale({ state: { data: null } })).toBe(0);
    const ownersStale = validatorOwnersQuery.staleTime as (
      q: unknown,
    ) => number;
    expect(ownersStale({ state: { data: {} } })).toBe(10 * 60 * 1000);
    expect(ownersStale({ state: { data: null } })).toBe(0);
  });

  it('asks again after a failure instead of caching it for the session', () => {
    // The property the staleTime function exists for, through a real cache
    // rather than by reading the option back. `?? null` turns a failure into
    // something react-query files as a success, so without this one bad
    // request would leave every Foundation badge off the page and both filters
    // on the empty state until a full reload.
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    mockedTimestamp.mockResolvedValueOnce(undefined);
    return client
      .fetchQuery(genesisTimestampQuery)
      .then(first => {
        expect(first).toBeNull();
        mockedTimestamp.mockResolvedValueOnce(1656680400000);
        return client.fetchQuery(genesisTimestampQuery);
      })
      .then(second => {
        expect(second).toBe(1656680400000);
        expect(mockedTimestamp).toHaveBeenCalledTimes(2);
      });
  });

  it('serves a good answer from cache rather than asking twice', () => {
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    mockedTimestamp.mockResolvedValue(1656680400000);
    return client
      .fetchQuery(genesisTimestampQuery)
      .then(() => client.fetchQuery(genesisTimestampQuery))
      .then(() => {
        expect(mockedTimestamp).toHaveBeenCalledTimes(1);
      });
  });
});
