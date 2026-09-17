import api from '@/services/api';
import {
  FetchAllValidatorsError,
  fetchAllValidators,
  validatorsCall,
} from '../validators';

jest.mock('@/services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

jest.mock('@/utils/parseValues', () => ({
  parseValidators: (response: {
    data: {
      validators: Array<{
        blsPublicKey?: string;
        name?: string;
        list?: string;
      }>;
    };
    pagination: { self: number; perPage: number };
  }) =>
    response.data.validators.map((v, index) => ({
      ownerAddress: `owner-${index}`,
      parsedAddress: `owner-${index}`,
      name: v.name,
      rank:
        index +
        (response.pagination.self - 1) * response.pagination.perPage +
        1,
      cumulativeStaked: 0,
      staked: 0,
      rating: 0,
      canDelegate: true,
      selfStake: 0,
      status: v.list ?? 'elected',
      totalProduced: 0,
      totalMissed: 0,
      commission: 0,
      maxDelegation: 0,
      blsPublicKey: v.blsPublicKey,
    })),
}));

const mockGet = api.get as jest.Mock;

const makePage = (
  page: number,
  totalPages: number,
  totalRecords: number,
  items: Array<{ blsPublicKey: string; name: string; list?: string }>,
) => ({
  data: {
    validators: items,
    networkTotalStake: 10_000_000,
  },
  pagination: {
    self: page,
    next: Math.min(page + 1, totalPages),
    previous: Math.max(page - 1, 1),
    perPage: 100,
    totalPages,
    totalRecords,
  },
  error: '',
  code: 'successful',
});

describe('fetchAllValidators', () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  it('returns a single page when totalPages is 1', async () => {
    mockGet.mockResolvedValueOnce(
      makePage(1, 1, 2, [
        { blsPublicKey: 'bls1', name: 'A' },
        { blsPublicKey: 'bls2', name: 'B' },
      ]),
    );

    const result = await fetchAllValidators();
    expect(result.totalRecords).toBe(2);
    expect(result.validators).toHaveLength(2);
    expect(result.validators[0].blsPublicKey).toBe('bls1');
    expect(mockGet).toHaveBeenCalledTimes(1);
  });

  it('fetches remaining pages in parallel when totalPages > 1', async () => {
    mockGet
      .mockResolvedValueOnce(
        makePage(1, 2, 3, [{ blsPublicKey: 'bls1', name: 'A' }]),
      )
      .mockResolvedValueOnce(
        makePage(2, 2, 3, [
          { blsPublicKey: 'bls2', name: 'B' },
          { blsPublicKey: 'bls3', name: 'C' },
        ]),
      );

    const result = await fetchAllValidators();
    expect(result.totalRecords).toBe(3);
    expect(result.validators).toHaveLength(3);
    expect(mockGet).toHaveBeenCalledTimes(2);
    expect(mockGet).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        query: expect.objectContaining({ page: 2, limit: 100 }),
      }),
    );
  });

  it('throws FetchAllValidatorsError when first page fails', async () => {
    mockGet.mockResolvedValueOnce({
      data: null,
      error: 'upstream down',
      code: 'internal_error',
    });

    await expect(fetchAllValidators()).rejects.toEqual(
      expect.objectContaining({
        name: 'FetchAllValidatorsError',
        message: 'upstream down',
      }),
    );
  });

  it('throws when a subsequent page fails', async () => {
    mockGet
      .mockResolvedValueOnce(
        makePage(1, 2, 2, [{ blsPublicKey: 'bls1', name: 'A' }]),
      )
      .mockResolvedValueOnce({
        data: null,
        error: 'page 2 failed',
        code: 'internal_error',
      });

    await expect(fetchAllValidators()).rejects.toThrow(
      'Failed to load validator list page 2',
    );
  });

  it('throws a generic message when error is not a string', async () => {
    mockGet.mockResolvedValueOnce({
      data: { validators: undefined },
      error: { code: 500 },
      code: 'internal_error',
    });

    await expect(fetchAllValidators()).rejects.toThrow(
      'Failed to load validator list',
    );
  });

  // Was 'excludes jailed validators from the aggregated set'. Dropping them
  // here made this the second source of a number the table already had, and
  // the two disagreed: 180 against 209 on mainnet, with the visible figure
  // decided by whichever request answered first. The table lists jailed
  // validators, so this set has to contain them too.
  it('keeps jailed validators, so the count matches the rows', async () => {
    mockGet
      .mockResolvedValueOnce(
        makePage(1, 2, 3, [
          { blsPublicKey: 'bls1', name: 'A', list: 'elected' },
          { blsPublicKey: 'bls-jailed', name: 'Jailed', list: 'jailed' },
        ]),
      )
      .mockResolvedValueOnce(
        makePage(2, 2, 3, [
          { blsPublicKey: 'bls2', name: 'B', list: 'eligible' },
        ]),
      );

    const result = await fetchAllValidators();
    expect(result.validators.map(v => v.blsPublicKey)).toEqual([
      'bls1',
      'bls-jailed',
      'bls2',
    ]);
    expect(result.totalRecords).toBe(3);
    expect(result.validators.some(v => v.status === 'jailed')).toBe(true);
  });

  // The other half of the same guarantee: the number the summary prints is the
  // length of the set it was computed from, never the API's own header.
  it('reports a count equal to the rows it returns', async () => {
    mockGet.mockResolvedValueOnce(
      makePage(1, 1, 999, [
        { blsPublicKey: 'bls1', name: 'A', list: 'elected' },
        { blsPublicKey: 'bls2', name: 'B', list: 'jailed' },
      ]),
    );

    const result = await fetchAllValidators();
    expect(result.totalRecords).toBe(result.validators.length);
  });
});

describe('validatorsCall', () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  it('parses and filters jailed validators on success', async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        validators: [
          { blsPublicKey: 'a', name: 'A', list: 'elected' },
          { blsPublicKey: 'b', name: 'B', list: 'jailed' },
        ],
        networkTotalStake: 1,
      },
      pagination: {
        self: 1,
        next: 1,
        previous: 1,
        perPage: 10,
        totalPages: 1,
        totalRecords: 2,
      },
      error: '',
      code: 'successful',
    });

    const result = await validatorsCall(1, 'A');
    expect(result.data.validators).toHaveLength(1);
    expect(result.data.validators[0].blsPublicKey).toBe('a');
    expect(mockGet).toHaveBeenCalledWith(
      expect.objectContaining({
        query: { sort: 'elected', page: 1, name: 'A' },
      }),
    );
  });

  it('returns the error response when the API reports an error', async () => {
    const err = { data: null, error: 'nope', code: 'internal_error' };
    mockGet.mockResolvedValueOnce(err);
    await expect(validatorsCall()).resolves.toEqual(err);
  });
});
