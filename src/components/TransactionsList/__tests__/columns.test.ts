import { getTransactionColumns, listsWholeChain, showsInOut } from '../columns';

const BASE_KEYS = [
  'hash',
  'type',
  'block',
  'age',
  'from',
  'direction',
  'to',
  'amount',
  'fee',
];

describe('transaction table columns', () => {
  it('lists the nine single-line base columns in order', () => {
    expect(getTransactionColumns({ showInOut: false }).map(c => c.key)).toEqual(
      BASE_KEYS,
    );
  });

  it('puts In/Out directly after To when the list is scoped to an account', () => {
    expect(getTransactionColumns({ showInOut: true }).map(c => c.key)).toEqual([
      'hash',
      'type',
      'block',
      'age',
      'from',
      'direction',
      'to',
      'inOut',
      'amount',
      'fee',
    ]);
  });

  it('gives every column a non-empty heading, except the unheaded arrow', () => {
    // Only that much. What the headings and the cells actually agreeing is
    // worth is enforced end to end, in cypress/e2e/pages/transactions.cy.ts,
    // since Jest cannot import the module the cells live in.
    for (const showInOut of [false, true]) {
      const columns = getTransactionColumns({ showInOut });
      const headers = columns.map(column => column.header);

      columns.forEach((column, index) => {
        if (column.key === 'direction') {
          // The circled status arrow is deliberately unheaded, like the
          // reference explorers.
          expect(headers[index]).toBe('');
        } else {
          expect(headers[index].length).toBeGreaterThan(0);
        }
      });
    }
  });

  it.each([false, true])(
    'hands out a fresh array, so a caller cannot reorder it for everyone (showInOut: %s)',
    showInOut => {
      // Reversing the branch under test is the point: an earlier version of
      // this test reversed the copying branch and asserted on the other one,
      // so it passed while the base list really was shared by reference.
      getTransactionColumns({ showInOut }).reverse();

      expect(
        getTransactionColumns({ showInOut: false }).map(c => c.key),
      ).toEqual(BASE_KEYS);
    },
  );

  describe('showsInOut', () => {
    // The direction only means something where the request layer narrows the
    // list to that account, which is where `account` is renamed to `address`.
    // Measured against the live API: `?account=` leaves the record count
    // untouched, `?address=` cuts it by four orders of magnitude.
    it.each([['/transactions'], ['/account/[account]']])(
      'is true on %s, which scopes by account',
      pathname => {
        expect(showsInOut({ pathname, query: { account: 'klv1abc' } })).toBe(
          true,
        );
      },
    );

    it.each([
      ['/asset/[asset]'],
      ['/asset/[asset]/[nonce]'],
      ['/block/[block]'],
    ])('is false on %s, where the account is ignored by the API', pathname => {
      expect(showsInOut({ pathname, query: { account: 'klv1abc' } })).toBe(
        false,
      );
    });

    it.each([
      ['absent', undefined],
      ['empty', ''],
      // Next gives an array when a parameter appears twice. The direction is
      // decided by comparing a sender against one account, which an array can
      // never equal, so every row would read "In".
      ['repeated', ['klv1abc', 'klv1def']],
    ])('is false when the account is %s', (_label, account) => {
      expect(
        showsInOut({ pathname: '/transactions', query: { account } }),
      ).toBe(false);
    });

    it('is false when there is no router information at all', () => {
      expect(showsInOut({})).toBe(false);
    });
  });

  describe('listsWholeChain', () => {
    it('is true for a bare list and while paging through it', () => {
      expect(listsWholeChain({ query: {} })).toBe(true);
      expect(listsWholeChain({ query: { page: '3', limit: '50' } })).toBe(true);
      expect(listsWholeChain({})).toBe(true);
    });

    it.each([
      ['a campaign parameter', { utm_source: 'twitter' }],
      ['a click id', { fbclid: 'abc123' }],
      ['a filter left empty by the UI', { type: '' }],
      // Next hands back an array for a repeated parameter, and `?type=&type=`
      // is what an empty filter submitted twice looks like.
      ['the same empty filter twice', { type: ['', ''] }],
      ['a filter with no values at all', { type: [] }],
    ])('is true with %s, which narrows nothing', (_label, query) => {
      // These reach the page on shared links. Reading anything unrecognised
      // as a filter hid the card on every one of them.
      expect(listsWholeChain({ query })).toBe(true);
    });

    it.each([
      ['an account', { account: 'klv1abc' }],
      ['a contract type', { type: '63' }],
      ['a status', { status: 'Success' }],
      ['an asset', { asset: 'KLV' }],
      ['a date range', { startdate: '1787491255', enddate: '1787577655' }],
      ['a filter alongside paging', { page: '2', type: '63' }],
      ['a filter repeated with real values', { type: ['63', '0'] }],
      ['a filter repeated with one real value', { type: ['', '63'] }],
    ])('is false once the list is narrowed by %s', (_label, query) => {
      // The summary above the list is chain-wide, so any narrowing at all
      // makes it describe something other than the rows underneath it.
      expect(listsWholeChain({ query })).toBe(false);
    });
  });
});
