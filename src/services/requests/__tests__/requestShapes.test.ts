/**
 * Pins the request shape of every call site that moved from a hand-built route
 * string to a `route` plus `query` pair, and of every route segment that is now
 * escaped.
 *
 * Without this the conversions are unguarded: none of these modules had a test
 * reading the outgoing request, so a renamed key, a dropped parameter or a
 * segment that quietly stopped being escaped would ship green.
 */
const mockGet = jest.fn();

jest.mock('@/services/api', () => ({
  __esModule: true,
  default: { get: (...args: unknown[]) => mockGet(...args) },
}));

// Both pull in an ESM chain Jest cannot transform in this repo, and neither is
// under test here: only the request that goes out is.
jest.mock('@/utils/parseValues', () => ({
  __esModule: true,
  parseAllProposals: (x: unknown) => x,
  parseProposal: (x: unknown) => x,
  parseHardCodedInfo: (x: unknown) => x,
  parseITOs: (x: unknown) => x,
}));
jest.mock('@/utils/precisionFunctions', () => ({
  __esModule: true,
  getPrecision: jest.fn(),
}));

import {
  KFIAllowancePromise,
  KLVAllowancePromise,
  assetsRequest,
} from '@/services/requests/account';
import {
  getAsset,
  getAssetByPartialSymbol,
  transactionCall,
} from '@/services/requests/asset';
import { requestAssets, requestAssetsQuery } from '@/services/requests/assets';
import { requestAssetsPoolsQuery } from '@/services/requests/assetsPools';
import getTransaction from '@/services/requests/transaction';
import { collectionListCall } from '@/services/requests/collection';
import { requestAssetsList } from '@/services/requests/ito';
import { getMarketplace } from '@/services/requests/marketplace';
import { getSomeAssetsPool } from '@/services/requests/pool';
import {
  dataProposalCall,
  requestProposals,
} from '@/services/requests/proposals';
import { smartContractTransactionDetailsCall } from '@/services/requests/smartContracts';
import { NextRouter } from 'next/router';

const routerWith = (query: Record<string, unknown>): NextRouter =>
  ({ query, isReady: true }) as unknown as NextRouter;

const callArg = (call = 0) => mockGet.mock.calls[call][0];

beforeEach(() => {
  jest.clearAllMocks();
  mockGet.mockResolvedValue({ error: '', code: 'successful', data: {} });
});

describe('converted query shapes', () => {
  it('getSomeAssetsPool keeps the asset list, page and limit', async () => {
    await getSomeAssetsPool('KLV,KFI', 3, 15);

    expect(callArg()).toEqual({
      route: 'assets/pool/list',
      query: { asset: 'KLV,KFI', page: 3, limit: 15 },
    });
  });

  it('requestAssets sends the asset list as a query value', async () => {
    mockGet.mockResolvedValue({ error: '', data: { assets: [] } });

    await requestAssets('KLV,KFI');

    expect(callArg()).toEqual({
      route: 'assets/list',
      query: { asset: 'KLV,KFI' },
    });
  });

  it('requestProposals sends status, page and limit', async () => {
    await requestProposals(2, 20, routerWith({ status: 'ActiveProposal' }));

    expect(callArg()).toEqual({
      route: 'proposals/list',
      query: { status: 'ActiveProposal', page: 2, limit: 20 },
    });
  });

  it('requestProposals keeps sending an empty status when the URL has none', async () => {
    await requestProposals(1, 10, routerWith({}));

    expect(callArg().query.status).toBe('');
  });

  it('getMarketplace sends the page as a query value', async () => {
    await getMarketplace('abcdef0123456789', 4);

    expect(callArg()).toEqual({
      route: 'marketplaces/abcdef0123456789',
      query: { page: 4 },
    });
  });

  it('collectionListCall sends the page as a query value', async () => {
    mockGet.mockResolvedValue({ error: '', data: { collection: [] } });

    await collectionListCall(
      routerWith({ contractDetails: '{"collection":"CYB-3CAO"}' }),
      'klv1owner',
      '2',
    );

    expect(callArg()).toEqual({
      route: 'address/klv1owner/collection/CYB-3CAO',
      query: { page: 2 },
    });
  });
});

describe('escaped route segments', () => {
  it('dataProposalCall escapes a proposal number carrying query syntax', async () => {
    // Unescaped this produced proposals/28?voteType=1&?voteType=0, and the API
    // resolves a repeated parameter first-wins, so the injected copy decided
    // which voters came back.
    await dataProposalCall(routerWith({ number: '28?voteType=1&' }));

    expect(callArg().route).toBe('proposals/28%3FvoteType%3D1%26');
    expect(callArg().query).toEqual({ voteType: 0 });
  });

  it('dataProposalCall leaves an ordinary proposal number alone', async () => {
    await dataProposalCall(routerWith({ number: '28' }));

    expect(callArg().route).toBe('proposals/28');
  });

  it('getMarketplace escapes an id carrying query syntax', async () => {
    await getMarketplace('abc?page=999&', 1);

    expect(callArg().route).toBe('marketplaces/abc%3Fpage%3D999%26');
  });

  it('collectionListCall escapes both segments', async () => {
    mockGet.mockResolvedValue({ error: '', data: { collection: [] } });

    await collectionListCall(
      routerWith({ contractDetails: '{"collection":"CYB?page=9&"}' }),
      'klv1?x=1',
      '0',
    );

    expect(callArg().route).toBe(
      'address/klv1%3Fx%3D1/collection/CYB%3Fpage%3D9%26',
    );
  });

  it('the allowance calls escape the address and send the asset as a query value', async () => {
    await KLVAllowancePromise('klv1?x=1');
    await KFIAllowancePromise('klv1?x=1');

    expect(callArg(0).route).toBe('address/klv1%3Fx%3D1/allowance');
    expect(callArg(0).query).toEqual({ assetID: 'KLV' });
    expect(callArg(1).route).toBe('address/klv1%3Fx%3D1/allowance');
    expect(callArg(1).query).toEqual({ assetID: 'KFI' });
  });

  it('assetsRequest escapes the account address from the URL', async () => {
    mockGet.mockResolvedValue({
      error: '',
      data: { account: { assets: {} } },
      pagination: {},
    });

    await assetsRequest('klv1?page=999&')(1, 10);

    expect(callArg().route).toBe('address/klv1%3Fpage%3D999%26');
  });
});

describe('shapes that must not drift', () => {
  it('getAssetByPartialSymbol sends the typed text as a query value', async () => {
    mockGet.mockResolvedValue({ error: '', data: { assets: [{}] } });

    await getAssetByPartialSymbol('KL&x=1');

    expect(callArg()).toEqual({
      route: 'assets/list',
      query: { asset: 'KL&x=1' },
    });
  });

  it('transactionCall sends the asset and limit as query values', async () => {
    mockGet.mockResolvedValue({ error: '', pagination: {} });

    await transactionCall('KID-36W3');

    expect(callArg()).toEqual({
      route: 'transaction/list',
      query: { asset: 'KID-36W3', limit: 5 },
    });
  });

  it('smartContractTransactionDetailsCall escapes the hash and sends withResults', async () => {
    mockGet.mockResolvedValue({ error: '', data: { transaction: {} } });

    await smartContractTransactionDetailsCall('abc?x=1&');

    expect(callArg()).toEqual({
      route: 'transaction/abc%3Fx%3D1%26',
      query: { withResults: true },
    });
  });

  it('requestAssetsList still asks for the joined asset list', async () => {
    mockGet.mockResolvedValue({ error: '', data: { assets: [] } });

    await requestAssetsList({
      data: { itos: [{ assetId: 'KLV' }, { assetId: 'KFI' }] },
    } as never);

    expect(callArg()).toEqual({
      route: 'assets/list',
      query: { asset: 'KLV,KFI' },
    });
  });
});

describe('preserved big amounts stay opt-in per request', () => {
  it('the exact-display requests ask for the digit twins', async () => {
    mockGet.mockResolvedValue({
      error: '',
      data: { assets: [], pools: [] },
      pagination: { totalPages: 1 },
    });

    await requestAssetsQuery(1, 10, routerWith({}));
    await getAsset('KLV');
    await requestAssetsPoolsQuery(1, 10, routerWith({}));

    expect(callArg(0)).toMatchObject({ preserveBigAmounts: true });
    expect(callArg(1)).toMatchObject({ preserveBigAmounts: true });
    expect(callArg(2)).toMatchObject({ preserveBigAmounts: true });
  });

  it('a transaction request does not, so the raw view stays verbatim', async () => {
    await transactionCall('KLV');

    expect(callArg()).not.toHaveProperty('preserveBigAmounts');
  });

  it('nor does the by-hash request that feeds the Raw Tx card', async () => {
    await getTransaction('abc123');

    expect(callArg()).toEqual({ route: 'transaction/abc123' });
  });
});
