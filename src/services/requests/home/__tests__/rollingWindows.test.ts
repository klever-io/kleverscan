/**
 * `home/index.ts` reaches `precisionFunctions` -> `pages/transactions` ->
 * react-syntax-highlighter, an ESM chain Jest cannot transform. A factory mock
 * never loads the real module, which is what makes these two calls testable.
 */
jest.mock('@/pages/transactions', () => ({}));
jest.mock('@/utils/precisionFunctions', () => ({
  getParsedTransactionPrecision: jest.fn(),
  setPrecision: jest.fn(),
}));

import api from '@/services/api';
import {
  homeNewAccountsCall,
  homeNewTransactionsCall,
} from '@/services/requests/home';

jest.mock('@/services/api', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

const mockedGet = api.get as jest.Mock;
const DAY_MS = 24 * 60 * 60 * 1000;

describe.each([
  ['homeNewTransactionsCall', homeNewTransactionsCall, 'transaction/list', 'newTransactions'],
  ['homeNewAccountsCall', homeNewAccountsCall, 'address/list', 'newAccounts'],
] as const)('%s', (_name, call, route, field) => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGet.mockResolvedValue({
      error: '',
      pagination: { totalRecords: 7840 },
    });
  });

  it('counts one rolling day, not a UTC-day bucket', async () => {
    await call();

    const args = mockedGet.mock.calls[0][0];
    expect(args.route).toBe(route);
    expect(args.query.enddate - args.query.startdate).toBe(DAY_MS);
  });

  it('sends milliseconds, the unit the route reads', async () => {
    // Seconds are not rejected: the route answers the all-time total instead,
    // so a unit slip reads as a plausible figure rather than an error.
    await call();

    expect(mockedGet.mock.calls[0][0].query.startdate).toBeGreaterThan(1e12);
  });

  it('reports the window total', async () => {
    await expect(call()).resolves.toEqual({ [field]: 7840 });
  });

  it('keeps a genuine zero, which a quiet day really is', async () => {
    mockedGet.mockResolvedValue({ error: '', pagination: { totalRecords: 0 } });

    await expect(call()).resolves.toEqual({ [field]: 0 });
  });

  it('answers undefined on a failure rather than a zero', async () => {
    mockedGet.mockResolvedValue({ error: 'boom' });

    await expect(call()).resolves.toBeUndefined();
  });

  it('drops a non-numeric total instead of passing it on', async () => {
    // A null survives an `!== undefined` check and would throw on
    // toLocaleString in the middle of a render.
    mockedGet.mockResolvedValue({ error: '', pagination: { totalRecords: null } });

    await expect(call()).resolves.toBeUndefined();
  });
});
