import api from '@/services/api';
import { getParsedTransactionPrecision } from '@/utils/precisionFunctions';
import { blockTransactionsCall } from '../index';

jest.mock('@/services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

// The real module reaches @/pages/transactions, whose import chain Jest
// cannot transform, so it is replaced wholesale rather than spied on.
jest.mock('@/utils/precisionFunctions', () => ({
  __esModule: true,
  getParsedTransactionPrecision: jest.fn(),
}));

const mockedGet = api.get as jest.Mock;
const mockedParse = getParsedTransactionPrecision as jest.Mock;

const rawTransaction = { hash: 'abc', blockNum: 42 };

const response = {
  data: { transactions: [rawTransaction] },
  pagination: { totalPages: 3 },
  error: '',
  code: 'successful',
};

const queryOf = (call = 0) => mockedGet.mock.calls[call][0].query;

describe('blockTransactionsCall', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    mockedGet.mockResolvedValue(response);
    mockedParse.mockResolvedValue([{ ...rawTransaction, precision: 8 }]);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('sends the block number, page and limit', async () => {
    await blockTransactionsCall(42, 2, 20);

    expect(mockedGet).toHaveBeenCalledWith({
      route: 'transaction/list',
      query: { blockNum: 42, page: 2, limit: 20 },
    });
  });

  it('forwards the transaction filters that the filter bar writes to the URL', async () => {
    await blockTransactionsCall(42, 1, 10, {
      status: 'Fail',
      type: '0',
      asset: 'KID-36W3',
      buyType: 'ITOBuy',
      startdate: '1000',
      enddate: '2000',
    });

    expect(queryOf()).toMatchObject({
      status: 'Fail',
      type: '0',
      asset: 'KID-36W3',
      buyType: 'ITOBuy',
      startdate: '1000',
      enddate: '2000',
    });
  });

  it('drops params that are not filters, so a crafted URL cannot add its own', async () => {
    await blockTransactionsCall(42, 1, 10, {
      block: '42',
      tab: 'Transactions',
      card: 'Info',
      withResults: 'true',
      status: 'Success',
    });

    expect(queryOf()).toEqual({
      status: 'Success',
      blockNum: 42,
      page: 1,
      limit: 10,
    });
  });

  it('encodes a filter value so it cannot inject another parameter', async () => {
    await blockTransactionsCall(42, 1, 10, { status: '&blockNum=999' });

    expect(queryOf().status).toBe('%26blockNum%3D999');
  });

  it('encodes a filter value so it cannot truncate the query with a fragment', async () => {
    await blockTransactionsCall(42, 1, 10, { asset: 'KLV#' });

    expect(queryOf().asset).toBe('KLV%23');
  });

  it('ignores a repeated param, which arrives as an array', async () => {
    await blockTransactionsCall(42, 1, 10, { status: ['Success', 'Fail'] });

    expect(queryOf()).not.toHaveProperty('status');
  });

  it('keeps the requested block and paging even when the URL carries its own', async () => {
    await blockTransactionsCall(42, 3, 50, {
      blockNum: '999',
      page: '1',
      limit: '10',
    });

    expect(queryOf()).toMatchObject({ blockNum: 42, page: 3, limit: 50 });
  });

  it('resolves the precision of the transactions it just fetched', async () => {
    const result = await blockTransactionsCall(42, 1, 10);

    expect(mockedParse).toHaveBeenCalledWith(response);
    expect(result.data.transactions).toEqual([
      { hash: 'abc', blockNum: 42, precision: 8 },
    ]);
  });

  it('preserves pagination and error so the table can read them', async () => {
    const result = await blockTransactionsCall(42, 1, 10);

    expect(result.pagination).toEqual({ totalPages: 3 });
    expect(result.error).toBe('');
  });

  it('keeps the fetched rows when the precision lookup fails', async () => {
    mockedParse.mockRejectedValue(new Error('Fetch timeout'));

    const result = await blockTransactionsCall(42, 1, 10);

    expect(result.data.transactions).toEqual([rawTransaction]);
  });

  it('passes an error response through, so the table shows its error branch', async () => {
    mockedGet.mockResolvedValue({ data: null, error: 'boom', pagination: {} });
    mockedParse.mockResolvedValue(undefined);

    const result = await blockTransactionsCall(42, 1, 10);

    expect(result.error).toBe('boom');
    expect(result.data.transactions).toEqual([]);
  });
});
