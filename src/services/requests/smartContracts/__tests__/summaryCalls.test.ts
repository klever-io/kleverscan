import api from '@/services/api';
import {
  contractActivitySharesCall,
  contractTransactions24hCall,
  smartContractsListCall,
  smartContractTotalTransactionsListCall,
} from '../index';

jest.mock('@/services/api', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

const mockedGet = api.get as jest.Mock;

/**
 * One response per route, so a test states exactly what each endpoint said.
 * A dated request is keyed `transaction/list?window`, because the 24h count
 * and the all-time total now share a route and differ only by their range.
 */
const respond = (byRoute: Record<string, unknown>) => {
  mockedGet.mockImplementation(
    ({
      route,
      query,
    }: {
      route: string;
      query?: { startdate?: number; enddate?: number };
    }) => {
      const key =
        query?.startdate !== undefined ? `${route}?window` : route;
      return Promise.resolve(
        byRoute[key] ?? { error: `unmocked route ${key}`, data: {} },
      );
    },
  );
};

describe('contractActivitySharesCall', () => {
  it('rejects when sc/statistics failed, so react-query can retry', () => {
    // Resolving undefined instead registered a success, cached "no
    // statistics" for the full staleTime and rendered the empty note as fact.
    respond({
      'sc/statistics': { error: 'boom' },
      'transaction/list': { error: '', pagination: { totalRecords: 5 } },
    });
    return expect(contractActivitySharesCall()).rejects.toThrow();
  });

  it('resolves without the denominator when only that part failed', async () => {
    respond({
      'sc/statistics': { error: '', data: [] },
      'transaction/list': { error: 'boom' },
    });
    await expect(contractActivitySharesCall()).resolves.toEqual({
      statistics: [],
      allSuccessful: undefined,
    });
  });

  it('drops a null denominator instead of passing it along', async () => {
    // The same null-on-200 payload the total call guards against; shareModel
    // must see undefined, not null wearing a number type.
    respond({
      'sc/statistics': { error: '', data: [] },
      'transaction/list': { error: '', pagination: { totalRecords: null } },
    });
    await expect(contractActivitySharesCall()).resolves.toEqual({
      statistics: [],
      allSuccessful: undefined,
    });
  });
});

describe('finite guards on totals', () => {
  it('turns a null transactions total into undefined, not a crash-in-waiting', async () => {
    // null passes an `!== undefined` gate and throws on toLocaleString
    // mid-render; the same payload is documented on this route in
    // transactions/summary.ts.
    respond({
      'transaction/list': { error: '', pagination: { totalRecords: null } },
    });
    await expect(
      smartContractTotalTransactionsListCall(),
    ).resolves.toBeUndefined();
  });

  it('passes a real transactions total through', async () => {
    respond({
      'transaction/list': { error: '', pagination: { totalRecords: 473655 } },
    });
    await expect(smartContractTotalTransactionsListCall()).resolves.toBe(
      473655,
    );
  });

  it('leaves the contracts tile out on a malformed count', async () => {
    respond({ 'sc/list': { error: '', pagination: {} } });
    await expect(smartContractsListCall()).resolves.toBeUndefined();
  });

  it('keeps a real zero window, drops a malformed count', async () => {
    respond({
      'transaction/list?window': {
        error: '',
        pagination: { totalRecords: 0 },
      },
    });
    await expect(contractTransactions24hCall()).resolves.toEqual({
      last24h: 0,
    });

    respond({ 'transaction/list?window': { error: '', pagination: {} } });
    await expect(contractTransactions24hCall()).resolves.toBeUndefined();
  });

  it('counts a rolling day, not the UTC day the bucket route answers', async () => {
    // The bucket route read 1342 where the rolling day held 3059 on
    // 2026-09-03, so the window has to be an explicit range in milliseconds.
    respond({
      'transaction/list?window': {
        error: '',
        pagination: { totalRecords: 3059 },
      },
    });

    mockedGet.mockClear();
    await contractTransactions24hCall();

    expect(mockedGet).toHaveBeenCalledTimes(1);
    const { route, query } = mockedGet.mock.calls[0][0];
    expect(route).toBe('transaction/list');
    expect(query.type).toBe(63);
    expect(query.enddate - query.startdate).toBe(24 * 60 * 60 * 1000);
    expect(query.startdate).toBeGreaterThan(1e12);
  });
});
