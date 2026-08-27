import {
  genesisTimestampCall,
  validatorOwnersCall,
} from '@/services/requests/accounts';
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
    expect(genesisTimestampQuery.staleTime).toBe(Infinity);
  });
});
