import api from '@/services/api';
import { ITOCall, assetPoolCall } from '../asset';

jest.mock('@/services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

jest.mock('@/utils/parseValues', () => ({
  parseITOs: jest.fn(async () => undefined),
  parseHardCodedInfo: jest.fn(items => items),
}));

// The module under test imports these, and their import chain reaches
// components Jest cannot transform. Neither is reached by the two lookups.
jest.mock('@/utils/precisionFunctions', () => ({
  addPrecisionsToFPRDeposits: jest.fn(),
  getFPRDepositsPrecisions: jest.fn(),
}));

const apiGet = api.get as jest.Mock;

const NOT_FOUND = 'cannot find ito in database';

beforeEach(() => {
  apiGet.mockReset();
});

/**
 * The distinction these lock in: a missing record is a legitimate negative and
 * answers undefined, while a transient failure must reach React Query. Both
 * used to throw inside a try whose own catch swallowed it, so a 500 rendered
 * exactly like "this asset has no ITO".
 */
describe('ITOCall', () => {
  it('answers undefined when the asset genuinely has no ITO', async () => {
    apiGet.mockResolvedValueOnce({ error: NOT_FOUND, data: null });
    await expect(ITOCall('KLV')).resolves.toBeUndefined();
  });

  it('throws on a transient failure instead of reporting no ITO', async () => {
    apiGet.mockResolvedValueOnce({
      error: 'internal server error',
      data: null,
    });
    await expect(ITOCall('KLV')).rejects.toThrow('internal server error');
  });

  it('stringifies an Error response, which a network failure produces', async () => {
    apiGet.mockResolvedValueOnce({
      error: new Error('socket hang up'),
      data: null,
    });
    await expect(ITOCall('KLV')).rejects.toThrow('socket hang up');
  });

  // The success path had no test at all, while assetPoolCall (rewritten the
  // same way in the same commit) did. A regression in the window check would
  // render as "this asset has no ITO", which is the failure the rewrite was
  // written to prevent.
  it('returns an active ITO that is inside its window', async () => {
    const now = Date.now() / 1000;
    apiGet.mockResolvedValueOnce({
      error: '',
      data: {
        ito: { isActive: true, startTime: now - 60, endTime: now + 60 },
      },
    });
    await expect(ITOCall('KLV')).resolves.toEqual({
      isActive: true,
      startTime: now - 60,
      endTime: now + 60,
    });
  });

  it('answers undefined for an ITO whose window has closed', async () => {
    const now = Date.now() / 1000;
    apiGet.mockResolvedValueOnce({
      error: '',
      data: {
        ito: { isActive: true, startTime: now - 120, endTime: now - 60 },
      },
    });
    await expect(ITOCall('KLV')).resolves.toBeUndefined();
  });

  it('answers undefined for an ITO that has not started', async () => {
    const now = Date.now() / 1000;
    apiGet.mockResolvedValueOnce({
      error: '',
      data: {
        ito: { isActive: true, startTime: now + 60, endTime: now + 120 },
      },
    });
    await expect(ITOCall('KLV')).resolves.toBeUndefined();
  });

  it('answers undefined for an ITO that is not active', async () => {
    apiGet.mockResolvedValueOnce({
      error: '',
      data: { ito: { isActive: false } },
    });
    await expect(ITOCall('KLV')).resolves.toBeUndefined();
  });

  it('asks once, so a normal negative does not cost three calls', async () => {
    apiGet.mockResolvedValueOnce({ error: NOT_FOUND, data: null });
    await ITOCall('KLV');
    expect(apiGet).toHaveBeenCalledTimes(1);
    expect(apiGet.mock.calls[0][0].tries).toBe(1);
  });
});

describe('assetPoolCall', () => {
  it('answers undefined when the asset has no fee pool', async () => {
    apiGet.mockResolvedValueOnce({
      error: 'cannot find pool in database',
      data: null,
    });
    await expect(assetPoolCall('KLV')).resolves.toBeUndefined();
  });

  it('throws on a transient failure instead of dropping the pool tab', async () => {
    apiGet.mockResolvedValueOnce({
      error: 'internal server error',
      data: null,
    });
    await expect(assetPoolCall('KLV')).rejects.toThrow('internal server error');
  });

  it('returns the pool when there is one', async () => {
    apiGet.mockResolvedValueOnce({
      error: '',
      data: { pool: { kda: 'KLV', ratio: 1 } },
    });
    await expect(assetPoolCall('KLV')).resolves.toEqual({
      kda: 'KLV',
      ratio: 1,
    });
  });
});
