import api from '@/services/api';
import {
  accountsCall,
  accountsCreatedCall,
  accountsTotalCall,
} from '../index';

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

  it('takes paging from its arguments, not from the URL', async () => {
    // A crafted link cannot widen the page size or jump the offset: both are
    // written after the allowlist, from what the table asked for.
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

describe('accountsTotalCall', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGet.mockResolvedValue(listResponse);
  });

  it('asks for a single row, because only the record count is read', async () => {
    await accountsTotalCall();

    expect(argsOf().route).toBe('address/list');
    expect(queryOf()).toEqual({ limit: 1 });
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

  it('puts the day count in the route', async () => {
    await accountsCreatedCall(7);

    expect(argsOf().route).toBe('address/list/count/7');
  });
});
