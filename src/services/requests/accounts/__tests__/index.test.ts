import api from '@/services/api';
import {
  accountsCall,
  accountsCreatedCall,
  accountsCreatedInWindow,
  accountsTotalCall,
  genesisAccountsCall,
  genesisTimestampCall,
  isAccountFilter,
  validatorOwnersCall,
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
      // View state the page keeps in the URL plus a parameter the API ignores; neither belongs in the request.
      tab: 'Overview',
      address: 'klv1spoofed',
      foundation: 'true',
      sortBy: 'frozen',
    });

    expect(queryOf()).toEqual({ page: 1, limit: 10 });
  });

  it('takes paging from the query object it was passed, not the URL copy', async () => {
    // No clamping here: the shared Table already clamps both through `normalizePageParam` before passing them in.
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

/** What `api.get` resolves to on failure: it never rejects, and substitutes a
 *  default pagination whose `totalRecords` is 0 (`services/api.ts:49-56`). */
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

  it('reports a genuine zero as zero, not as a failure', async () => {
    // Mirror of the test above: a successful 0 is a chain with no accounts, and a truthiness test collapses the two.
    mockedGet.mockResolvedValue({
      ...listResponse,
      pagination: { totalRecords: 0 },
    });

    await expect(accountsTotalCall()).resolves.toBe(0);
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
  const DAY_MS = 24 * 60 * 60 * 1000;

  beforeEach(() => {
    jest.clearAllMocks();
    mockedGet.mockResolvedValue({
      pagination: { totalRecords: 10 },
      error: '',
      code: 'successful',
    });
  });

  it('counts an explicit range on address/list, not a day bucket', async () => {
    await accountsCreatedCall();

    const { route, query } = argsOf();
    expect(route).toBe('address/list');
    expect(query.enddate - query.startdate).toBe(DAY_MS);
  });

  it('sends milliseconds, the unit the route reads', async () => {
    // Seconds are not rejected: the route answers the all-time total instead,
    // so a unit slip reads as a plausible figure rather than an error.
    await accountsCreatedCall();

    expect(argsOf().query.startdate).toBeGreaterThan(1e12);
  });

  it('asks for the window before it as well, without a gap', async () => {
    await accountsCreatedCall();

    const calls = mockedGet.mock.calls.map(([args]) => args.query);
    const [current, previous] = calls.sort(
      (a, b) => b.enddate - a.enddate,
    );
    expect(previous.enddate).toBe(current.startdate);
  });

  it('answers undefined on a failure, which a zero does not mean', async () => {
    mockedGet.mockResolvedValue(apiFailure);

    await expect(accountsCreatedCall()).resolves.toBeUndefined();
  });

  it('keeps a zero as zero, because no new accounts is a real answer', async () => {
    mockedGet.mockResolvedValue({
      pagination: { totalRecords: 0 },
      error: '',
      code: 'successful',
    });

    await expect(accountsCreatedCall()).resolves.toEqual([0, 0]);
  });

  it('treats a non-numeric total as absent rather than passing it on', async () => {
    // A null survives an `!== undefined` check and would throw on
    // toLocaleString mid-render, so it must not reach the tile.
    mockedGet.mockResolvedValue({
      pagination: { totalRecords: null },
      error: '',
      code: 'successful',
    });

    // Both windows absent is nothing to show, which is the same answer a
    // failure gives: the card leaves the tile out rather than printing a zero.
    await expect(accountsCreatedCall()).resolves.toBeUndefined();
  });

  it('still answers when only the older window is missing', async () => {
    const DAY = 24 * 60 * 60 * 1000;
    mockedGet.mockImplementation(({ query }) =>
      Promise.resolve(
        Date.now() - query.enddate > DAY / 2
          ? { error: 'boom' }
          : { pagination: { totalRecords: 9 }, error: '' },
      ),
    );

    await expect(accountsCreatedCall()).resolves.toEqual([9, undefined]);
  });
});

describe('accountsCreatedInWindow', () => {
  const DAY_MS = 24 * 60 * 60 * 1000;

  beforeEach(() => {
    jest.clearAllMocks();
    mockedGet.mockResolvedValue({
      pagination: { totalRecords: 184 },
      error: '',
      code: 'successful',
    });
  });

  it('spans the number of windows asked for, as one range', async () => {
    await accountsCreatedInWindow(7);

    const { query } = argsOf();
    expect(query.enddate - query.startdate).toBe(7 * DAY_MS);
  });

  it('spans a single day when asked for one', async () => {
    await accountsCreatedInWindow(1);

    const { query } = argsOf();
    expect(query.enddate - query.startdate).toBe(DAY_MS);
  });

  it('answers undefined on a failure', async () => {
    mockedGet.mockResolvedValue(apiFailure);

    await expect(accountsCreatedInWindow(7)).resolves.toBeUndefined();
  });

  it('drops a non-numeric total rather than passing it on', async () => {
    // A null survives an `!== undefined` check and would throw on
    // toLocaleString in the middle of a render.
    mockedGet.mockResolvedValue({
      pagination: { totalRecords: null },
      error: '',
    });

    await expect(accountsCreatedInWindow(7)).resolves.toBeUndefined();
  });

  it('never asks for an empty range, whatever it is handed', async () => {
    // Zero would make startdate equal enddate, and the count of an empty
    // range is 0, which the tile would print as a fact.
    await accountsCreatedInWindow(0);

    const { query } = argsOf();
    expect(query.enddate - query.startdate).toBe(DAY_MS);
  });
});

/** A page with no pagination block at all, which is what a degraded or
 *  changed endpoint can answer beside a perfectly good 200. */
const noCountPage = (count: number, offset = 0) => ({
  data: {
    validators: Array.from({ length: count }, (_, i) => ({
      ownerAddress: `owner${offset + i}`,
      registerNonce: 5,
      list: 'eligible',
    })),
  },
  error: '',
  code: 'successful',
});

const validatorPage = (
  owners: { address: string; nonce?: number; list?: string }[],
  totalRecords: number,
) => ({
  data: {
    validators: owners.map(o => ({
      ownerAddress: o.address,
      registerNonce: o.nonce ?? 5,
      list: o.list ?? 'eligible',
    })),
  },
  pagination: { totalRecords },
  error: '',
  code: 'successful',
});

describe('validatorOwnersCall', () => {
  beforeEach(() => jest.clearAllMocks());

  it('keeps paging until it has as many owners as totalRecords claims', async () => {
    // `validator/list` silently caps a page at 100 whatever `limit` asks; stopping after one page reports 2 genesis validators where there are 21.
    mockedGet
      .mockResolvedValueOnce(validatorPage([{ address: 'a' }], 3))
      .mockResolvedValueOnce(validatorPage([{ address: 'b' }], 3))
      .mockResolvedValueOnce(validatorPage([{ address: 'c' }], 3));

    const owners = await validatorOwnersCall();

    expect(mockedGet).toHaveBeenCalledTimes(3);
    expect(Object.keys(owners ?? {})).toEqual(['a', 'b', 'c']);
  });

  it('stops as soon as the count is reached, without asking for more', async () => {
    mockedGet.mockResolvedValue(
      validatorPage([{ address: 'a' }, { address: 'b' }], 2),
    );

    await validatorOwnersCall();

    expect(mockedGet).toHaveBeenCalledTimes(1);
  });

  it('gives up entirely when a later page fails, not a partial set', async () => {
    // Only a page-1 failure was exercised before. Mainnet needs three pages, so a
    // 500 on page 2 is ordinary, and a partial set un-badges everyone past the break.
    mockedGet
      .mockResolvedValueOnce(validatorPage([{ address: 'a' }], 300))
      .mockResolvedValueOnce(apiFailure);

    await expect(validatorOwnersCall()).resolves.toBeUndefined();
    expect(mockedGet).toHaveBeenCalledTimes(2);
  });

  it('stops at the page cap when the count never becomes reachable', async () => {
    // The cap is the only thing between an unsatisfiable count and forever.
    mockedGet.mockResolvedValue(
      validatorPage(
        Array.from({ length: 100 }, (_, i) => ({ address: `owner${i}` })),
        1_000_000,
      ),
    );

    await expect(validatorOwnersCall()).resolves.toBeUndefined();
    expect(mockedGet).toHaveBeenCalledTimes(50);
  });

  it('keeps paging a full page that carries no count at all', async () => {
    // The count is the only thing that ends the loop early, so a body without
    // one used to break and hand back page 1 as the whole set: 100 owners
    // where mainnet has 208, and every validator past the break un-badged.
    mockedGet
      .mockResolvedValueOnce(noCountPage(100))
      .mockResolvedValueOnce(noCountPage(100, 100))
      .mockResolvedValueOnce(noCountPage(8, 200));

    const owners = await validatorOwnersCall();

    expect(mockedGet).toHaveBeenCalledTimes(3);
    expect(Object.keys(owners ?? {})).toHaveLength(208);
  });

  it('takes a short page without a count as the whole set', async () => {
    // The other side of the same rule: a page the endpoint could not fill is
    // the end of the data, so it must not cost a second request.
    mockedGet.mockResolvedValueOnce(noCountPage(7));

    const owners = await validatorOwnersCall();

    expect(mockedGet).toHaveBeenCalledTimes(1);
    expect(Object.keys(owners ?? {})).toHaveLength(7);
  });

  it('rejects a count that arrives as something other than a number', async () => {
    // `totalRecords: null` and `"208"` both fail the `typeof` test, and a full
    // page under either has to keep going rather than settle.
    mockedGet
      .mockResolvedValueOnce({
        ...noCountPage(100),
        pagination: { totalRecords: '208' },
      })
      .mockResolvedValueOnce({
        ...noCountPage(4, 100),
        pagination: { totalRecords: null },
      });

    const owners = await validatorOwnersCall();

    expect(mockedGet).toHaveBeenCalledTimes(2);
    expect(Object.keys(owners ?? {})).toHaveLength(104);
  });

  it('stops on an empty page even when the count disagrees', async () => {
    // A totalRecords that never arrives would otherwise loop to the page cap.
    mockedGet
      .mockResolvedValueOnce(validatorPage([{ address: 'a' }], 999))
      .mockResolvedValueOnce(validatorPage([], 999));

    const owners = await validatorOwnersCall();

    expect(mockedGet).toHaveBeenCalledTimes(2);
    expect(Object.keys(owners ?? {})).toEqual(['a']);
  });

  it('marks register nonce zero as genesis and anything else as not', async () => {
    mockedGet.mockResolvedValue(
      validatorPage(
        [
          { address: 'genesis', nonce: 0, list: 'elected' },
          { address: 'later', nonce: 298503, list: 'jailed' },
        ],
        2,
      ),
    );

    const owners = await validatorOwnersCall();

    expect(owners?.genesis).toEqual({ isGenesis: true, list: 'elected' });
    expect(owners?.later).toEqual({ isGenesis: false, list: 'jailed' });
  });

  it('does not read a missing register nonce as genesis', async () => {
    // Nothing reached the `=== 0` before: the page helper defaults the nonce.
    // Genesis validator is the strongest claim here; a missing field must not earn it.
    mockedGet.mockResolvedValue({
      data: { validators: [{ ownerAddress: 'unknown' }] },
      pagination: { totalRecords: 1 },
      error: '',
      code: 'successful',
    });

    const owners = await validatorOwnersCall();

    expect(owners?.unknown).toEqual({ isGenesis: false, list: '' });
  });

  it('treats a body with no validators array as an empty page', async () => {
    // The `?? []` fallback: a misshapen 200 has to stop the loop, not throw mid-map.
    mockedGet.mockResolvedValue({
      data: {},
      pagination: { totalRecords: 5 },
      error: '',
      code: 'successful',
    });

    await expect(validatorOwnersCall()).resolves.toEqual({});
    expect(mockedGet).toHaveBeenCalledTimes(1);
  });

  it('answers undefined on a failure, so no row is un-badged by a half set', async () => {
    mockedGet.mockResolvedValue(apiFailure);

    await expect(validatorOwnersCall()).resolves.toBeUndefined();
  });

  it('skips an entry with no owner address rather than keying on undefined', async () => {
    mockedGet.mockResolvedValue({
      data: { validators: [{ registerNonce: 0 }, { ownerAddress: 'a' }] },
      pagination: { totalRecords: 2 },
      error: '',
      code: 'successful',
    });

    const owners = await validatorOwnersCall();

    expect(Object.keys(owners ?? {})).toEqual(['a']);
  });
});

describe('isAccountFilter', () => {
  it('accepts the values the filter writes', () => {
    expect(isAccountFilter('foundation')).toBe(true);
    expect(isAccountFilter('genesisValidator')).toBe(true);
  });

  it('rejects anything a hand-edited URL might carry', () => {
    // The page falls back to the unfiltered list on a no; this stops `?type=validator` quietly returning an empty table.
    expect(isAccountFilter('validator')).toBe(false);
    expect(isAccountFilter('')).toBe(false);
    expect(isAccountFilter(undefined)).toBe(false);
    // Next hands back an array when a parameter repeats.
    expect(isAccountFilter(['foundation'])).toBe(false);
  });
});

describe('genesisAccountsCall', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGet.mockResolvedValue({
      data: { accounts: [{ address: 'a' }, { address: 'b' }] },
      pagination: { totalRecords: 2 },
      error: '',
      code: 'successful',
    });
  });

  it('asks for a one-second window opening at the genesis instant', async () => {
    await genesisAccountsCall(1656680400000);

    expect(argsOf().route).toBe('address/list');
    expect(queryOf()).toEqual({
      startdate: 1656680400000,
      enddate: 1656680401000,
      // Genesis is 40 on mainnet and 22 on testnet, so page one holds the whole set; still paged, because a capped first page looks complete.
      page: 1,
      limit: 100,
    });
  });

  it('returns the accounts the window answered with', async () => {
    await expect(genesisAccountsCall(1656680400000)).resolves.toHaveLength(2);
  });

  it('keeps reading while the count says there is more', async () => {
    // Same trap as `validatorOwnersCall`: one page of a capped endpoint is indistinguishable from a complete answer.
    const page = (n: number, total: number) => ({
      data: {
        accounts: Array.from({ length: n }, (_, i) => ({ address: `a${i}` })),
      },
      pagination: { totalRecords: total },
      error: '',
      code: 'successful',
    });
    mockedGet
      .mockResolvedValueOnce(page(100, 140))
      .mockResolvedValueOnce(page(40, 140));

    await expect(genesisAccountsCall(1656680400000)).resolves.toHaveLength(140);
    expect(mockedGet).toHaveBeenCalledTimes(2);
    expect(queryOf(1).page).toBe(2);
  });

  it('gives up at the page cap rather than returning the pages it did get', async () => {
    // Without the cap this runs forever, and stopping at it used to hand back
    // 2000 accounts against a claimed million as though that were the window.
    mockedGet.mockResolvedValue({
      data: {
        accounts: Array.from({ length: 100 }, (_, i) => ({ address: `a${i}` })),
      },
      pagination: { totalRecords: 1_000_000 },
      error: '',
      code: 'successful',
    });

    await expect(genesisAccountsCall(1656680400000)).resolves.toBeUndefined();
    expect(mockedGet).toHaveBeenCalledTimes(20);
  });

  it('keeps paging a full window page that carries no count', async () => {
    const page = (count: number, offset: number) => ({
      data: {
        accounts: Array.from({ length: count }, (_, i) => ({
          address: `a${offset + i}`,
        })),
      },
      error: '',
      code: 'successful',
    });
    mockedGet
      .mockResolvedValueOnce(page(100, 0))
      .mockResolvedValueOnce(page(12, 100));

    await expect(genesisAccountsCall(1656680400000)).resolves.toHaveLength(112);
    expect(mockedGet).toHaveBeenCalledTimes(2);
  });

  it('takes a short window page without a count as the whole window', async () => {
    mockedGet.mockResolvedValueOnce({
      data: {
        accounts: Array.from({ length: 40 }, (_, i) => ({ address: `a${i}` })),
      },
      error: '',
      code: 'successful',
    });

    await expect(genesisAccountsCall(1656680400000)).resolves.toHaveLength(40);
    expect(mockedGet).toHaveBeenCalledTimes(1);
  });

  it('gives up entirely when a later page fails, not a short window', async () => {
    // A truncated window would under-report both filters while the unfiltered rows kept badging the dropped accounts.
    mockedGet
      .mockResolvedValueOnce({
        data: {
          accounts: Array.from({ length: 100 }, (_, i) => ({
            address: `a${i}`,
          })),
        },
        pagination: { totalRecords: 140 },
        error: '',
        code: 'successful',
      })
      .mockResolvedValueOnce(apiFailure);

    await expect(genesisAccountsCall(1656680400000)).resolves.toBeUndefined();
    expect(mockedGet).toHaveBeenCalledTimes(2);
  });

  it('stops on a page that answers with nothing', async () => {
    // A count that never becomes reachable would otherwise spin to the cap.
    mockedGet.mockResolvedValue({
      data: { accounts: [] },
      pagination: { totalRecords: 999 },
      error: '',
      code: 'successful',
    });

    await expect(genesisAccountsCall(1656680400000)).resolves.toEqual([]);
    expect(mockedGet).toHaveBeenCalledTimes(1);
  });

  it('answers undefined on a failure, which an empty genesis is not', async () => {
    mockedGet.mockResolvedValue(apiFailure);

    await expect(genesisAccountsCall(1656680400000)).resolves.toBeUndefined();
  });

  it('answers an empty list when the body carries no accounts array', async () => {
    mockedGet.mockResolvedValue({ data: {}, error: '', code: 'successful' });

    await expect(genesisAccountsCall(1656680400000)).resolves.toEqual([]);
  });
});

/** Block 0 on mainnet, in the two units the chain uses for it. */
const GENESIS_MS = 1656680400000;
const GENESIS_S = 1656680400;

describe('genesisTimestampCall', () => {
  beforeEach(() => jest.clearAllMocks());

  it('normalises a seconds timestamp, so one unit travels downstream', async () => {
    // The genesis window is handed to the API raw, and a seconds value there
    // returns zero accounts: badges right, both filters silently empty.
    mockedGet.mockResolvedValue({
      data: { block: { nonce: 0, timestamp: GENESIS_S } },
      error: '',
      code: 'successful',
    });

    await expect(genesisTimestampCall()).resolves.toBe(GENESIS_MS);
  });

  it('reads the timestamp off block zero', async () => {
    mockedGet.mockResolvedValue({
      data: { block: { nonce: 0, timestamp: 1656680400000 } },
      error: '',
      code: 'successful',
    });

    await expect(genesisTimestampCall()).resolves.toBe(1656680400000);
    expect(argsOf().route).toBe('block/by-nonce/0');
  });

  it('answers undefined on a failure rather than a zero', async () => {
    mockedGet.mockResolvedValue(apiFailure);

    await expect(genesisTimestampCall()).resolves.toBeUndefined();
  });

  it('passes a zero timestamp through rather than calling it missing', async () => {
    // `Number.isFinite` separates "the block said zero" from "the block said nothing".
    mockedGet.mockResolvedValue({
      data: { block: { nonce: 0, timestamp: 0 } },
      error: '',
      code: 'successful',
    });

    await expect(genesisTimestampCall()).resolves.toBe(0);
  });

  it('answers undefined when the block carries no usable timestamp', async () => {
    mockedGet.mockResolvedValue({
      data: { block: { nonce: 0, timestamp: null } },
      error: '',
      code: 'successful',
    });

    await expect(genesisTimestampCall()).resolves.toBeUndefined();
  });
});
