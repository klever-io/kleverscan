import { mapTransactionError } from '../index';

// Every raw string here was captured from a real node rejection, except the
// two permission errors, which are the substrings the caller matched before.
const ADDRESS =
  'klv1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq';

describe('mapTransactionError', () => {
  it('maps a fee below one chain unit', () => {
    expect(
      mapTransactionError('validation error: asset pool amount error'),
    ).toBe('Fee too small to pay with this KDA');
  });

  it('maps a KDA without a pool', () => {
    expect(mapTransactionError('validation error: asset pool not found')).toBe(
      'No fee pool for this KDA',
    );
  });

  it('maps a drained pool', () => {
    expect(
      mapTransactionError(
        'validation error: asset pool out of funds, fail to validate KDA fee',
      ),
    ).toBe('Fee pool is empty for this KDA');
  });

  it('maps both nonce directions to the same advice', () => {
    const low =
      'validation error: invalid transaction lowerNonceInTx: true, veryHighNonceInTx: false';
    const high =
      'validation error: invalid transaction lowerNonceInTx: false, veryHighNonceInTx: true';
    const expected = 'Transaction out of sync with the network, please retry';
    expect(mapTransactionError(low)).toBe(expected);
    expect(mapTransactionError(high)).toBe(expected);
  });

  it('maps the address and value errors', () => {
    expect(
      mapTransactionError('validation error: invalid receiver address'),
    ).toBe('Invalid receiver address');
    expect(
      mapTransactionError(
        'validation error: invalid address length for sender',
      ),
    ).toBe('Invalid sender address');
    expect(
      mapTransactionError('validation error: invalid value provided'),
    ).toBe('Invalid amount');
  });

  it('maps the permission errors', () => {
    expect(mapTransactionError('invalid signature threshold reached')).toBe(
      'Not enough signatures',
    );
    expect(mapTransactionError('no contract permission for this account')).toBe(
      'No permission for this contract',
    );
  });

  describe('insufficient funds', () => {
    const raw = `validation error: insufficient funds, for address: ${ADDRESS}, kda: FPT-23O4, wanted 251, have 0`;

    it('states the shortfall in tokens, not chain units', () => {
      expect(mapTransactionError(raw, 6)).toBe(
        'Not enough FPT-23O4, need 0.000251 more',
      );
    });

    // The node prints the full fee and the full balance, so a non-zero balance
    // makes the fee itself larger than the amount the user still has to find.
    it('subtracts the balance the node reports', () => {
      expect(
        mapTransactionError(
          `validation error: insufficient funds, for address: ${ADDRESS}, kda: FPT-23O4, wanted 251, have 200`,
          6,
        ),
      ).toBe('Not enough FPT-23O4, need 0.000051 more');
    });

    // int64 printed with %v, so a negative balance is a shape the regex has to
    // accept; dropping it would silently fall back to the whole fee.
    it('reads a negative balance rather than falling through', () => {
      expect(
        mapTransactionError(
          `validation error: insufficient funds, for address: ${ADDRESS}, kda: FPT-23O4, wanted 100, have -50`,
          6,
        ),
      ).toBe('Not enough FPT-23O4, need 0.000150 more');
    });

    // The inverse of the subtraction: a balance at or above the fee must never
    // print a negative shortfall.
    it('never prints a negative shortfall', () => {
      expect(
        mapTransactionError(
          `validation error: insufficient funds, for address: ${ADDRESS}, kda: FPT-23O4, wanted 100, have 500`,
          6,
        ),
      ).toBe('Not enough FPT-23O4, need 0.000000 more');
    });

    it('never leaks the sender address', () => {
      expect(mapTransactionError(raw, 6)).not.toContain('klv1');
    });

    // The inverse of the branch above: without a precision the amount would be
    // wrong by orders of magnitude, so the asset is named without one.
    it('drops the amount when the precision is unknown', () => {
      expect(mapTransactionError(raw)).toBe('Not enough FPT-23O4');
    });

    it('drops the amount when the precision is not finite', () => {
      expect(mapTransactionError(raw, NaN)).toBe('Not enough FPT-23O4');
    });

    // The parse is all-or-nothing, so a node format this regex does not know
    // used to fall through with the address still in it.
    it.each([
      ['no comma after the asset id', 'kda: FPT-23O4 wanted 251, have 0'],
      ['no asset segment', 'wanted 251, have 0'],
      ['an underscore in the asset id', 'kda: FPT_23O4, wanted 251, have 0'],
      ['no balance segment', 'kda: FPT-23O4, wanted 251'],
    ])('hides the address when the funds error has %s', (_shape, tail) => {
      const out = mapTransactionError(
        `validation error: insufficient funds, for address: ${ADDRESS}, ${tail}`,
        6,
      );
      expect(out).not.toContain('klv1');
    });

    // toFixed throws outside 0-100, and this runs inside a catch block, so the
    // throw would escape and leave the user with no toast at all.
    it.each([400, -3, 1e21])(
      'names the asset without an amount for an out-of-range precision %p',
      precision => {
        expect(mapTransactionError(raw, precision)).toBe('Not enough FPT-23O4');
      },
    );

    // The precision belongs to the fee asset; the node names the short asset.
    // Scaling one by the other's precision prints a confident wrong number.
    it('drops the amount when the precision belongs to another asset', () => {
      expect(mapTransactionError(raw, 6, 'KLV')).toBe('Not enough FPT-23O4');
    });

    it('keeps the amount when the precision belongs to the named asset', () => {
      expect(mapTransactionError(raw, 6, 'FPT-23O4')).toBe(
        'Not enough FPT-23O4, need 0.000251 more',
      );
    });

    it('reads a precision of zero as a real precision, not as missing', () => {
      expect(mapTransactionError(raw, 0)).toBe(
        'Not enough FPT-23O4, need 251 more',
      );
    });
  });

  describe('errors it does not know', () => {
    it('keeps an unmapped message, without the developer prefix', () => {
      expect(mapTransactionError('validation error: brand new failure')).toBe(
        'Brand new failure',
      );
    });

    // The wallet SDK re-throws a build failure as "Failed to build
    // transaction: <node message>", which is what six call sites receive.
    it('strips the wallet wrapper as well as the node prefix', () => {
      expect(
        mapTransactionError(
          new Error(
            'Failed to build transaction: validation error: brand new failure',
          ),
        ),
      ).toBe('Brand new failure');
    });

    it('still maps a known error through the wallet wrapper', () => {
      expect(
        mapTransactionError(
          new Error(
            'Failed to build transaction: validation error: asset pool not found',
          ),
        ),
      ).toBe('No fee pool for this KDA');
    });

    it('keeps a message that has no prefix at all', () => {
      expect(mapTransactionError('something broke')).toBe('Something broke');
    });

    // capitalizeError exists because an Error object reaches these callers on a
    // transport failure; JSON.stringify would render it as "{}".
    it('reads an Error object rather than stringifying it', () => {
      expect(mapTransactionError(new Error('network request failed'))).toBe(
        'Network request failed',
      );
    });

    // Stripping the prefix off a message that is only the prefix would leave an
    // empty toast, which is the blank-toast failure this module exists to end.
    it('falls back to a real message when stripping would leave nothing', () => {
      expect(mapTransactionError('validation error: ')).toBe(
        'Transaction failed, please try again',
      );
    });

    // String(value) renders these as "[object Object]" and "", which are the
    // blank and useless toasts this module exists to remove.
    it.each([
      ['a thrown plain object', { code: 500 }],
      ['an Error with no message', new Error('')],
      ['null', null],
      ['undefined', undefined],
      // The inverse of reading `message` off an object: a present but unusable
      // one must reach the fallback instead of printing "null" or "undefined".
      ['an object whose message is null', { message: null }],
      ['an object whose message is undefined', { message: undefined }],
      ['an object whose message is blank', { message: '   ' }],
      ['an object whose message is not a string', { message: { nested: 1 } }],
    ])('gives a real message for %s', (_label, thrown) => {
      expect(mapTransactionError(thrown)).toBe(
        'Transaction failed, please try again',
      );
    });

    it('reads the message of a thrown object that carries one', () => {
      expect(mapTransactionError({ message: 'node unreachable' })).toBe(
        'Node unreachable',
      );
    });

    it('survives a non-string, non-Error value', () => {
      expect(mapTransactionError(404)).toBe('404');
    });

    // The frontend itself builds an NFT kda as COLLECTION/nonce, so the node
    // echoes that form back and the parser has to accept it.
    it('parses an asset id that carries an NFT nonce', () => {
      expect(
        mapTransactionError(
          `validation error: insufficient funds, for address: ${ADDRESS}, kda: NFT-ABCD/5, wanted 1, have 0`,
          0,
          'NFT-ABCD/5',
        ),
      ).toBe('Not enough NFT-ABCD/5, need 1 more');
    });
  });
});
