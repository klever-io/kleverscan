import api from '@/services/api';
import { NextRouter } from 'next/router';
import { requestAllAssetsPools, requestAssetsPoolsQuery } from '../assetsPools';

jest.mock('@/services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

const apiGet = api.get as jest.Mock;

const router = { isReady: true, query: {} } as unknown as NextRouter;

const pool = (kda: string) => ({
  kda,
  klvReserve: 1_000_000,
  kdaReserve: 2_000_000,
  ratio: 0.5,
  ownerAddress: `klv1owner${kda}`,
  adminAddress: `klv1owner${kda}`,
});

const poolPage = (count: number, page = 1, totalPages = 1) => ({
  data: { pools: Array.from({ length: count }, (_, i) => pool(`KDA${i}`)) },
  pagination: { self: page, totalPages },
  error: '',
});

beforeEach(() => {
  apiGet.mockReset();
});

describe('requestAssetsPoolsQuery', () => {
  it('joins each pool with its KDA precision through one batched lookup', async () => {
    apiGet
      .mockResolvedValueOnce({
        data: { pools: [pool('AAA-1111'), pool('BBB-2222')] },
        pagination: { self: 1, totalPages: 1 },
        error: '',
      })
      .mockResolvedValueOnce({
        data: {
          assets: [
            { assetId: 'AAA-1111', precision: 8, name: 'Alpha', ticker: 'AAA' },
            { assetId: 'BBB-2222', precision: 2, name: 'Beta', ticker: 'BBB' },
          ],
        },
        error: '',
      });

    const result = await requestAssetsPoolsQuery(1, 10, router);

    expect(apiGet).toHaveBeenCalledTimes(2);
    // One lookup for both ids, not one request per pool.
    expect(apiGet.mock.calls[1][0].query.asset).toBe('AAA-1111,BBB-2222');
    expect(result.data.pools.map(p => p.precision)).toEqual([8, 2]);
    expect(result.data.pools[0].name).toBe('Alpha');
  });

  // Reading a KDA amount without its precision is what produced the wrong
  // balances this join replaced, so the absence has to stay visible.
  it('leaves precision undefined when the asset lookup fails', async () => {
    apiGet
      .mockResolvedValueOnce({
        data: { pools: [pool('AAA-1111')] },
        pagination: { self: 1, totalPages: 1 },
        error: '',
      })
      .mockResolvedValueOnce({ data: null, error: 'upstream down' });

    const result = await requestAssetsPoolsQuery(1, 10, router);

    expect(result.data.pools).toHaveLength(1);
    expect(result.data.pools[0].precision).toBeUndefined();
  });

  it('skips the lookup when the page holds no pools', async () => {
    apiGet.mockResolvedValueOnce({
      data: { pools: [] },
      pagination: { self: 1, totalPages: 1 },
      error: '',
    });

    const result = await requestAssetsPoolsQuery(1, 10, router);

    expect(apiGet).toHaveBeenCalledTimes(1);
    expect(result.data.pools).toEqual([]);
  });

  // React Query rejects an undefined result, and a caller reading data.pools
  // without checking error would hit null, so the shape has to survive.
  it('keeps the response shape on an error', async () => {
    apiGet.mockResolvedValueOnce({ data: null, error: 'boom' });

    const result = await requestAssetsPoolsQuery(1, 10, router);

    expect(result.data.pools).toEqual([]);
    expect(result.error).toBe('boom');
  });
});

describe('requestAllAssetsPools', () => {
  it('follows the pagination across pages', async () => {
    apiGet
      .mockResolvedValueOnce(poolPage(100, 1, 3))
      .mockResolvedValueOnce(poolPage(100, 2, 3))
      .mockResolvedValueOnce(poolPage(40, 3, 3));

    const pools = await requestAllAssetsPools();

    expect(apiGet).toHaveBeenCalledTimes(3);
    expect(pools).toHaveLength(240);
  });

  // Trust the payload over the metadata: a short page means the end.
  it('stops on a short page even when totalPages claims more', async () => {
    apiGet.mockResolvedValueOnce(poolPage(12, 1, 99));

    const pools = await requestAllAssetsPools();

    expect(apiGet).toHaveBeenCalledTimes(1);
    expect(pools).toHaveLength(12);
  });

  // The bound exists so a wrong totalPages cannot stall the tab: a full page
  // every time would otherwise loop for as long as the API keeps answering.
  it('stops at the page bound when every page comes back full', async () => {
    apiGet.mockResolvedValue(poolPage(100, 1, 1_000));

    const pools = await requestAllAssetsPools();

    expect(apiGet).toHaveBeenCalledTimes(10);
    expect(pools).toHaveLength(1_000);
  });

  it('throws when a page errors instead of returning a partial set', async () => {
    apiGet
      .mockResolvedValueOnce(poolPage(100, 1, 3))
      .mockResolvedValueOnce({ data: null, error: 'upstream down' });

    await expect(requestAllAssetsPools()).rejects.toThrow('upstream down');
  });
});
