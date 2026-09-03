import api from '@/services/api';
import { getParsedTransactionPrecision } from '@/utils/precisionFunctions';
import { toast } from 'react-toastify';
import {
  blockListCall,
  blockTotalStatsCall,
  blockTransactionsCall,
  blockYesterdayStatsCall,
  blockYesterdayTransactionsCall,
} from '../index';

jest.mock('react-toastify', () => ({
  toast: { error: jest.fn() },
}));

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
  PRECISION_TOAST_ID: 'assets-precisions',
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

  it('passes a filter value on unchanged, leaving the escaping to the sink', async () => {
    // This module used to percent-encode here because `buildUrlQuery` did not.
    // It does now, so encoding twice would put the escaped form on the wire.
    // That the injection and the fragment are neutralised is asserted against
    // the built URL instead, in the api spec.
    await blockTransactionsCall(42, 1, 10, {
      status: '&blockNum=999',
      asset: 'KLV#',
    });

    expect(queryOf().status).toBe('&blockNum=999');
    expect(queryOf().asset).toBe('KLV#');
  });

  it('ignores a repeated param, which arrives as an array', async () => {
    await blockTransactionsCall(42, 1, 10, { status: ['Success', 'Fail'] });

    expect(queryOf()).not.toHaveProperty('status');
  });

  it('takes the block and paging from its arguments, not from the URL', async () => {
    // A spoofed blockNum/page/limit never enters the query at all: the
    // allowlist drops them before these three are set from the arguments.
    await blockTransactionsCall(42, 3, 50, {
      blockNum: '999',
      page: '1',
      limit: '10',
    });

    expect(queryOf()).toEqual({ blockNum: 42, page: 3, limit: 50 });
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

  it('warns that the kept rows may be inaccurate', async () => {
    // Those rows render at the KLV default precision, so the failure must not
    // be silent: a wrong amount otherwise looks like a correct one.
    mockedParse.mockRejectedValue(new Error('Fetch timeout'));

    await blockTransactionsCall(42, 1, 10);

    expect(toast.error).toHaveBeenCalledWith(
      expect.stringContaining('inaccurate'),
      // Shared with the lookup's own toast so the two cannot stack.
      { toastId: 'assets-precisions' },
    );
  });

  it('does not warn when the precision lookup succeeds', async () => {
    await blockTransactionsCall(42, 1, 10);

    expect(toast.error).not.toHaveBeenCalled();
  });

  it('passes an error response through, so the table shows its error branch', async () => {
    mockedGet.mockResolvedValue({ data: null, error: 'boom', pagination: {} });
    mockedParse.mockResolvedValue(undefined);

    const result = await blockTransactionsCall(42, 1, 10);

    expect(result.error).toBe('boom');
    expect(result.data.transactions).toEqual([]);
  });
});

const argOf = (call = 0) => mockedGet.mock.calls[call][0];

describe('blockListCall', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGet.mockResolvedValue({
      data: { blocks: [] },
      pagination: {},
      error: '',
    });
  });

  it('sends page and limit, and asks for the full payload', async () => {
    await blockListCall(2, 25);

    // No `minify`: it zeroes `size`, which the Size column reads.
    expect(argOf()).toEqual({
      route: 'block/list',
      query: { page: 2, limit: 25 },
    });
  });

  it('forwards a date range the filter bar wrote', async () => {
    await blockListCall(1, 10, {
      startdate: '1787788800000',
      enddate: '1787875200000',
    });

    expect(argOf().query).toEqual({
      startdate: '1787788800000',
      enddate: '1787875200000',
      page: 1,
      limit: 10,
    });
  });

  // Each of these answers 500 with an Elasticsearch stack trace when it reaches
  // the endpoint, verified against mainnet; `Number()` alone accepts the first
  // four of them.
  it.each([
    ['exponent notation', '1e12'],
    ['a value past int64', '10000000000000000000'],
    ['padding whitespace', ' 1787788800000 '],
    ['hex', '0x1A'],
    ['NaN', 'NaN'],
    ['Infinity', 'Infinity'],
    ['a negative', '-1787788800000'],
    ['a fraction', '1787788800000.7'],
    ['a bare word', 'notadate'],
    ['an ISO date', '2026-08-20T00:00:00Z'],
    ['the empty string', ''],
    ['one past MAX_SAFE_INTEGER', '9007199254740992'],
  ])('drops %s rather than forwarding it', async (_label, value) => {
    await blockListCall(1, 10, { startdate: value });

    expect(argOf().query).not.toHaveProperty('startdate');
  });

  it('keeps MAX_SAFE_INTEGER itself, the last value it can compare', async () => {
    await blockListCall(1, 10, { startdate: '9007199254740991' });

    expect(argOf().query.startdate).toBe('9007199254740991');
  });

  it('drops a repeated param, which arrives as an array the filter bar never writes', async () => {
    await blockListCall(1, 10, {
      startdate: ['1787788800000', '1787875200000'] as unknown as string,
    });

    expect(argOf().query).not.toHaveProperty('startdate');
  });

  it('ignores a page or limit in the URL in favour of the clamped arguments', async () => {
    await blockListCall(3, 10, { page: '999', limit: '5000' });

    expect(argOf().query.page).toBe(3);
    expect(argOf().query.limit).toBe(10);
  });
});

describe('blockYesterdayStatsCall', () => {
  const day = (totalBlocks: number) => ({
    date: 1,
    totalBlocks,
    totalBurned: 145531094085,
  });

  beforeEach(() => jest.clearAllMocks());

  it('returns the closed day, not the one still running', async () => {
    mockedGet.mockResolvedValue({
      data: { block_stats_by_day: [day(20661), day(21599)] },
      error: '',
    });

    // 20661 is the running day at the moment of the call; reading entry 0
    // would report a part-day under a label that says a whole one.
    await expect(blockYesterdayStatsCall()).resolves.toEqual(day(21599));
  });

  it('returns undefined when only the running day came back', async () => {
    mockedGet.mockResolvedValue({
      data: { block_stats_by_day: [day(20661)] },
      error: '',
    });

    await expect(blockYesterdayStatsCall()).resolves.toBeUndefined();
  });

  it('returns undefined on a failure, which api.get resolves rather than throws', async () => {
    mockedGet.mockResolvedValue({ data: null, error: 'boom' });

    await expect(blockYesterdayStatsCall()).resolves.toBeUndefined();
  });

  it('returns undefined when the series is not an array', async () => {
    mockedGet.mockResolvedValue({
      data: { block_stats_by_day: { totalBlocks: 1 } },
      error: '',
    });

    await expect(blockYesterdayStatsCall()).resolves.toBeUndefined();
  });

  // The tiles dereference these fields bare; an answer missing one used to
  // crash the page render instead of costing the card.
  it('rejects a closed day missing a field the tiles render', async () => {
    mockedGet.mockResolvedValue({
      data: {
        block_stats_by_day: [day(20661), { date: 2, totalBlocks: 21599 }],
      },
      error: '',
    });

    await expect(blockYesterdayStatsCall()).resolves.toBeUndefined();
  });

  it('rejects a closed day whose figure is not a number', async () => {
    mockedGet.mockResolvedValue({
      data: {
        block_stats_by_day: [
          day(20661),
          { date: 2, totalBlocks: '21599', totalBurned: 1 },
        ],
      },
      error: '',
    });

    await expect(blockYesterdayStatsCall()).resolves.toBeUndefined();
  });
});

describe('blockTotalStatsCall', () => {
  beforeEach(() => jest.clearAllMocks());

  it('reads the cumulative figures', async () => {
    const total = {
      totalBlocks: 32728348,
      totalBurned: 1,
      totalBlockRewards: 2,
    };
    mockedGet.mockResolvedValue({
      data: { block_stats_total: total },
      error: '',
    });

    await expect(blockTotalStatsCall()).resolves.toEqual(total);
    expect(argOf()).toEqual({ route: 'block/statistics-total/0' });
  });

  it('returns undefined on a failure', async () => {
    mockedGet.mockResolvedValue({ data: null, error: 'boom' });

    await expect(blockTotalStatsCall()).resolves.toBeUndefined();
  });

  it('returns undefined when a clean answer carries no totals', async () => {
    mockedGet.mockResolvedValue({ data: {}, error: '' });

    await expect(blockTotalStatsCall()).resolves.toBeUndefined();
  });

  it('rejects totals missing a field the tiles render', async () => {
    mockedGet.mockResolvedValue({
      data: { block_stats_total: { totalBlocks: 32728348 } },
      error: '',
    });

    await expect(blockTotalStatsCall()).resolves.toBeUndefined();
  });
});


describe('blockYesterdayTransactionsCall', () => {
  const DAY_MS = 24 * 60 * 60 * 1000;

  /** Midnight UTC that opened yesterday, the key the bucket carries. */
  const yesterdayKey = (): number => {
    const midnight = new Date();
    midnight.setUTCHours(0, 0, 0, 0);
    return midnight.getTime() - DAY_MS;
  };

  beforeEach(() => jest.clearAllMocks());

  it('reads the bucket whose key is yesterday', async () => {
    mockedGet.mockResolvedValue({
      error: '',
      data: {
        number_by_day: [
          { key: yesterdayKey() + DAY_MS, doc_count: 2934 },
          { key: yesterdayKey(), doc_count: 8275 },
        ],
      },
    });

    await expect(blockYesterdayTransactionsCall()).resolves.toBe(8275);
  });

  it('answers undefined when yesterday is the day that was omitted', async () => {
    // The route drops a day that carried no data. Read at position 1 the day
    // before would slide into place and be reported as yesterday.
    mockedGet.mockResolvedValue({
      error: '',
      data: {
        number_by_day: [
          { key: yesterdayKey() + DAY_MS, doc_count: 2934 },
          { key: yesterdayKey() - DAY_MS, doc_count: 7000 },
        ],
      },
    });

    await expect(blockYesterdayTransactionsCall()).resolves.toBeUndefined();
  });

  it('keeps a genuine zero, which a failure does not mean', async () => {
    mockedGet.mockResolvedValue({
      error: '',
      data: { number_by_day: [{ key: yesterdayKey(), doc_count: 0 }] },
    });

    await expect(blockYesterdayTransactionsCall()).resolves.toBe(0);
  });

  it('answers undefined on a failure and on a malformed body', async () => {
    mockedGet.mockResolvedValue({ error: 'boom' });
    await expect(blockYesterdayTransactionsCall()).resolves.toBeUndefined();

    mockedGet.mockResolvedValue({ error: '', data: {} });
    await expect(blockYesterdayTransactionsCall()).resolves.toBeUndefined();
  });
});
