import { mapTransactionError } from '../index';

// Every raw string here was returned by node.testnet.klever.org, except the
// two permission errors, which are the substrings the caller matched before.
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
    const raw =
      'validation error: insufficient funds, for address: klv1yluzr8yxpmunf4rx4lhuklwfky0fya0xa6ewxlelz8gygvhzvrlscu5uc2, kda: FPT-23O4, wanted 251, have 0';

    it('states the shortfall in tokens, not chain units', () => {
      expect(mapTransactionError(raw, 6)).toBe(
        'Not enough FPT-23O4, need 0.000251',
      );
    });

    it('never leaks the sender address', () => {
      expect(mapTransactionError(raw, 6)).not.toContain('klv1');
    });

    // The inverse of the branch above: without a precision the amount would be
    // wrong by orders of magnitude, so the asset is named without one.
    it('drops the amount when the precision is unknown', () => {
      expect(mapTransactionError(raw)).toBe(
        'Not enough FPT-23O4 to pay the fee',
      );
    });

    it('drops the amount when the precision is not finite', () => {
      expect(mapTransactionError(raw, NaN)).toBe(
        'Not enough FPT-23O4 to pay the fee',
      );
    });

    it('reads a precision of zero as a real precision, not as missing', () => {
      expect(mapTransactionError(raw, 0)).toBe('Not enough FPT-23O4, need 251');
    });
  });

  describe('errors it does not know', () => {
    it('keeps an unmapped message, without the developer prefix', () => {
      expect(mapTransactionError('validation error: brand new failure')).toBe(
        'Brand new failure',
      );
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

    it('survives a non-string, non-Error value', () => {
      expect(mapTransactionError(404)).toBe('404');
    });
  });
});
