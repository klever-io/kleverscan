import {
  getTransactionColumns,
  getTransactionHeaders,
  showsInOut,
} from '../columns';

const BASE_KEYS = ['hash', 'blockFees', 'fromTo', 'type', 'misc'];

describe('transaction table columns', () => {
  it('lists the five base columns in order', () => {
    expect(getTransactionColumns({ showInOut: false }).map(c => c.key)).toEqual(
      BASE_KEYS,
    );
  });

  it('puts In/Out directly after From/To when the list is scoped to an account', () => {
    expect(getTransactionColumns({ showInOut: true }).map(c => c.key)).toEqual([
      'hash',
      'blockFees',
      'fromTo',
      'inOut',
      'type',
      'misc',
    ]);
  });

  it('gives every column a non-empty heading, in both shapes', () => {
    // Only that much. `getTransactionHeaders` is defined as this map, so
    // asserting the two match would restate the implementation. What the
    // headings and the cells actually agreeing is worth is enforced end to
    // end, in cypress/e2e/pages/transactions.cy.ts, since Jest cannot import
    // the module the cells live in.
    for (const showInOut of [false, true]) {
      const headers = getTransactionHeaders({ showInOut });

      expect(headers).toHaveLength(getTransactionColumns({ showInOut }).length);
      expect(headers.every(header => header.length > 0)).toBe(true);
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
});
