import api from '@/services/api';
import { accountsCall, accountsCreatedCall, accountsTotalCall } from '../index';

jest.mock('@/services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

const mockedGet = api.get as jest.Mock;

const argsOf = (call = 0) => mockedGet.mock.calls[call][0];
const queryOf = (call = 0) => argsOf(call).query;

const listResponse = {
  data: { accounts: [{ address: 'klv1abc' }] },
  pagination: { totalRecords: 176197, totalPages: 1000 },
  error: '',
  code: 'successful',
};

describe('accountsCall', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGet.mockResolvedValue(listResponse);
  });

  it('asks the address list endpoint with the paging it was given', async () => {
    await accountsCall(3, 20);

    expect(argsOf().route).toBe('address/list');
    expect(queryOf()).toEqual({ page: 3, limit: 20 });
  });

  it('forwards the two date filters the endpoint documents', async () => {
    await accountsCall(1, 10, {
      startdate: '1787000000000',
      enddate: '1787600000000',
    });

    expect(queryOf()).toEqual({
      startdate: '1787000000000',
      enddate: '1787600000000',
      page: 1,
      limit: 10,
    });
  });

  it('drops every parameter outside the allowlist', async () => {
    await accountsCall(1, 10, {
      // View state the page may keep in the URL, and a parameter the API
      // ignores. Neither narrows the list, so neither belongs in the request.
      tab: 'Overview',
      address: 'klv1spoofed',
      foundation: 'true',
      sortBy: 'frozen',
    });

    expect(queryOf()).toEqual({ page: 1, limit: 10 });
  });

  it('takes paging from the query object it was passed, not the URL copy', async () => {
    // Scoped to this function on purpose. It ignores `page`/`limit` sitting in
    // the query object; it does not clamp them, and the shared Table derives
    // both from `router.query` and passes them in as arguments, so a crafted
    // `?limit=10000` does still reach the API as a number. What cannot travel
    // is a non-number, or a parameter riding along beside them.
    await accountsCall(2, 10, { page: '999', limit: '10000' });

    expect(queryOf()).toEqual({ page: 2, limit: 10 });
  });

  it('ignores a repeated parameter, which arrives as an array', async () => {
    await accountsCall(1, 10, {
      startdate: ['1787000000000', '1'],
      enddate: '1787600000000',
    });

    expect(queryOf()).toEqual({
      enddate: '1787600000000',
      page: 1,
      limit: 10,
    });
  });

  it('ignores an empty filter value rather than sending a blank one', async () => {
    await accountsCall(1, 10, { startdate: '', enddate: '1787600000000' });

    expect(queryOf()).toEqual({
      enddate: '1787600000000',
      page: 1,
      limit: 10,
    });
  });

  it('returns the response untouched', async () => {
    await expect(accountsCall(1, 10)).resolves.toBe(listResponse);
  });
});

/**
 * What `api.get` actually resolves to when a request fails: it never rejects,
 * and it substitutes a module-level default pagination whose `totalRecords` is
 * 0 (`services/api.ts:49-56`). Mocking a rejection instead would model a shape
 * this layer cannot produce, and would let a caller that prints that 0 pass.
 */
const apiFailure = {
  data: null,
  error: 'internal error',
  code: 'internal_error',
  pagination: {
    self: 0,
    next: 0,
    previous: 0,
    perPage: 0,
    totalPages: 0,
    totalRecords: 0,
  },
};

describe('accountsTotalCall', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGet.mockResolvedValue(listResponse);
  });

  it('asks for a single row, because only the record count is read', async () => {
    await expect(accountsTotalCall()).resolves.toBe(176197);

    expect(argsOf().route).toBe('address/list');
    expect(queryOf()).toEqual({ limit: 1 });
  });

  it('answers undefined on a failure, not the zero the default carries', async () => {
    mockedGet.mockResolvedValue(apiFailure);

    await expect(accountsTotalCall()).resolves.toBeUndefined();
  });

  it('answers undefined when the count is null rather than a number', async () => {
    mockedGet.mockResolvedValue({
      ...listResponse,
      pagination: { totalRecords: null },
    });

    await expect(accountsTotalCall()).resolves.toBeUndefined();
  });
});

describe('accountsCreatedCall', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGet.mockResolvedValue({
      data: { number_by_day: [{ doc_count: 10, key: 1 }] },
      error: '',
      code: 'successful',
    });
  });

  it('puts the day count in the route and returns the counts', async () => {
    await expect(accountsCreatedCall(7)).resolves.toEqual([10]);

    expect(argsOf().route).toBe('address/list/count/7');
  });

  it('answers undefined on a failure, which an empty series does not mean', async () => {
    mockedGet.mockResolvedValue(apiFailure);

    await expect(accountsCreatedCall(7)).resolves.toBeUndefined();
  });

  it('drops a day that carries no count, rather than yielding NaN later', async () => {
    mockedGet.mockResolvedValue({
      data: { number_by_day: [{ doc_count: 5 }, { key: 2 }, { doc_count: 4 }] },
      error: '',
      code: 'successful',
    });

    await expect(accountsCreatedCall(7)).resolves.toEqual([5, 4]);
  });

  it('escapes the segment, so a caller cannot extend the path', async () => {
    // The signature says number and today's only caller passes a constant, so
    // this cast stands in for a future caller that hands it something off the
    // URL. A route segment never reaches buildUrlQuery's encoding: getHost
    // concatenates it as-is.
    await accountsCreatedCall('1/../../address/list' as unknown as number);

    expect(argsOf().route).toBe(
      'address/list/count/1%2F..%2F..%2Faddress%2Flist',
    );
  });
});
