import api from '@/services/api';
import {
  accountsCall,
  accountsCreatedCall,
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

  it('reports a genuine zero as zero, not as a failure', async () => {
    // The mirror of the test above it. `api.get` substitutes `totalRecords: 0`
    // on failure, which is why `error` is checked first; a successful response
    // carrying 0 is a chain with no accounts and must survive as 0. A
    // truthiness test here collapses the two back together.
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

  it('leaves a hole for a day with no count, keeping the later days in place', async () => {
    mockedGet.mockResolvedValue({
      data: { number_by_day: [{ doc_count: 5 }, { key: 2 }, { doc_count: 4 }] },
      error: '',
      code: 'successful',
    });

    // Not [5, 4]. Compacting slides day two into position one, and the caller
    // reads position one as yesterday, so it would report the day before
    // yesterday as yesterday's figure.
    await expect(accountsCreatedCall(7)).resolves.toEqual([5, undefined, 4]);
  });

  it('keeps a zero count as zero, because no new accounts is a real answer', async () => {
    // Found by mutation: `Number.isFinite(doc_count)` swapped for a truthiness
    // test survived every test here. It differs only at 0, and 0 is ordinary
    // data. Turning it into a hole would drop the day out of the week total and
    // let the caller read the next day as this one.
    mockedGet.mockResolvedValue({
      data: { number_by_day: [{ doc_count: 0 }, { doc_count: 4 }] },
      error: '',
      code: 'successful',
    });

    await expect(accountsCreatedCall(7)).resolves.toEqual([0, 4]);
  });

  it('treats a non-numeric count as a hole rather than passing it on', async () => {
    mockedGet.mockResolvedValue({
      data: {
        number_by_day: [
          { doc_count: 5 },
          { doc_count: null },
          { doc_count: 4 },
        ],
      },
      error: '',
      code: 'successful',
    });

    await expect(accountsCreatedCall(7)).resolves.toEqual([5, undefined, 4]);
  });

  it('treats a body with no day series as an empty series', async () => {
    // The `?? []` fallback again: empty is a different answer from failed, and
    // the caller distinguishes them.
    mockedGet.mockResolvedValue({ data: {}, error: '', code: 'successful' });

    await expect(accountsCreatedCall(7)).resolves.toEqual([]);
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
    // The trap this guards: `validator/list` silently caps a page at 100 no
    // matter what `limit` asks for, and answers with a totalRecords beside it.
    // Stopping after one page reports 2 genesis validators where there are 21.
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
    // The contract the comment above the guard claims, and the one no test
    // reached: only a page-1 failure was exercised. Mainnet needs three pages,
    // so a 500 on page 2 is ordinary, and returning what page 1 held would
    // silently un-badge every validator past the break.
    mockedGet
      .mockResolvedValueOnce(validatorPage([{ address: 'a' }], 300))
      .mockResolvedValueOnce(apiFailure);

    await expect(validatorOwnersCall()).resolves.toBeUndefined();
    expect(mockedGet).toHaveBeenCalledTimes(2);
  });

  it('stops at the page cap when the count never becomes reachable', async () => {
    // Same bound as the genesis loop, different constant. A count no number of
    // pages can satisfy is the only thing standing between this and forever.
    mockedGet.mockResolvedValue(
      validatorPage(
        Array.from({ length: 100 }, (_, i) => ({ address: `owner${i}` })),
        1_000_000,
      ),
    );

    await validatorOwnersCall();

    expect(mockedGet).toHaveBeenCalledTimes(50);
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
    // `=== 0` rather than a falsy check, and nothing reached it: the page
    // helper defaults the nonce, so no fixture could produce an absent one.
    // Genesis validator is the strongest claim this page makes about an
    // address, and a missing field must not earn it.
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
    // The `?? []` fallback. A 200 whose shape is not what was expected has to
    // stop the loop, not throw halfway through building the map.
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
    // The page falls back to the unfiltered list on a no, so this guard is
    // what stops `?type=validator` from quietly returning an empty table.
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
      // Genesis is 40 on mainnet and 22 on testnet, so the first page holds the
      // whole set on both. It is still asked for by page, because a capped
      // endpoint's first page looks exactly like a complete answer.
      page: 1,
      limit: 100,
    });
  });

  it('returns the accounts the window answered with', async () => {
    await expect(genesisAccountsCall(1656680400000)).resolves.toHaveLength(2);
  });

  it('keeps reading while the count says there is more', async () => {
    // The same trap `validatorOwnersCall` was written for: one page of a capped
    // endpoint is indistinguishable from a complete answer. Truncating here
    // would shrink both filters while the unfiltered rows kept badging the
    // accounts the filter had dropped.
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

  it('stops at the page cap when the count never becomes reachable', async () => {
    // A count the pages can never satisfy. Without the cap this runs forever;
    // the exact bound matters because an off-by-one there is invisible until a
    // chain is large enough to reach it.
    mockedGet.mockResolvedValue({
      data: {
        accounts: Array.from({ length: 100 }, (_, i) => ({ address: `a${i}` })),
      },
      pagination: { totalRecords: 1_000_000 },
      error: '',
      code: 'successful',
    });

    await expect(genesisAccountsCall(1656680400000)).resolves.toHaveLength(
      2000,
    );
    expect(mockedGet).toHaveBeenCalledTimes(20);
  });

  it('gives up entirely when a later page fails, not a short window', async () => {
    // Same gap as in the validator loop. A truncated genesis window would make
    // both filters under-report while the unfiltered rows kept badging the
    // accounts the filter had dropped.
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
    // Mainnet answers in milliseconds today, so this branch is about the two
    // readers rather than the chain: the badge comparison normalises both
    // sides, but the genesis window is handed to the API raw and a seconds
    // value there returns zero accounts. Normalising at the source is what
    // stops the badges being right while both filters are silently empty.
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
    // Same 0-versus-falsy boundary as in the filter. `Number.isFinite` is what
    // separates "the block said zero" from "the block said nothing".
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
