import { accountBadges, isFoundationAccount } from '../badges';

/** Block 0 on mainnet, in the two units `address/list` uses for it. */
const GENESIS_MS = 1656680400000;
const GENESIS_S = 1656680400;

describe('isFoundationAccount', () => {
  it('matches an account created at the genesis instant', () => {
    expect(isFoundationAccount(GENESIS_MS, GENESIS_MS)).toBe(true);
  });

  it('matches across the unit mismatch the endpoint actually returns', () => {
    // Measured on mainnet: the 21 genesis validators carry seconds while the
    // other 19 genesis accounts carry milliseconds, in the same field of the
    // same response. Comparing raw finds one group and misses the other.
    expect(isFoundationAccount(GENESIS_S, GENESIS_MS)).toBe(true);
    expect(isFoundationAccount(GENESIS_MS, GENESIS_S)).toBe(true);
  });

  it('does not match an account created a second later', () => {
    expect(isFoundationAccount(GENESIS_MS + 1000, GENESIS_MS)).toBe(false);
  });

  it('badges nothing while the genesis moment is still unknown', () => {
    // Block 0 has not answered yet. A wrong badge is worse than a late one.
    expect(isFoundationAccount(GENESIS_MS, undefined)).toBe(false);
  });

  it('badges nothing for an account with no usable timestamp', () => {
    expect(isFoundationAccount(undefined, GENESIS_MS)).toBe(false);
    expect(isFoundationAccount(NaN, GENESIS_MS)).toBe(false);
  });

  it('treats zero as a number, not as absent', () => {
    // Found by mutation: `Number.isFinite` swapped for a truthiness test
    // survived, and the two differ only at 0. Zero is the one value where
    // "missing" and "a real timestamp" look alike to a falsy check, and the
    // same distinction already drifted once in this feature's refresh key.
    expect(isFoundationAccount(0, 0)).toBe(true);
    expect(isFoundationAccount(0, GENESIS_MS)).toBe(false);
  });
});

describe('accountBadges', () => {
  const owners = {
    genesisNode: { isGenesis: true, list: 'elected' },
    laterNode: { isGenesis: false, list: 'jailed' },
  };

  it('badges an ordinary account with nothing at all', () => {
    const badges = accountBadges('plain', 1700000000000, GENESIS_MS, owners);

    expect(badges).toEqual({
      foundation: false,
      validator: false,
      genesisValidator: false,
      validatorList: '',
    });
  });

  it('badges a genesis account that runs no node as foundation', () => {
    const badges = accountBadges('treasury', GENESIS_MS, GENESIS_MS, owners);

    expect(badges.foundation).toBe(true);
    expect(badges.validator).toBe(false);
  });

  it('badges a validator, carrying its list state for the tooltip', () => {
    const badges = accountBadges(
      'laterNode',
      1700000000000,
      GENESIS_MS,
      owners,
    );

    expect(badges.validator).toBe(true);
    expect(badges.genesisValidator).toBe(false);
    expect(badges.validatorList).toBe('jailed');
  });

  it('badges a genesis validator as both, because it is both', () => {
    // All 21 genesis validators were created in block 0, so they are genesis
    // accounts as well. The row states both facts rather than picking one.
    const badges = accountBadges('genesisNode', GENESIS_S, GENESIS_MS, owners);

    expect(badges.foundation).toBe(true);
    expect(badges.genesisValidator).toBe(true);
  });

  it('treats an unloaded validator set as unknown, never as "not a validator"', () => {
    // The set arrives after the rows on purpose. Until it does, the row shows
    // no role badge rather than asserting the account has no node.
    const badges = accountBadges(
      'genesisNode',
      GENESIS_S,
      GENESIS_MS,
      undefined,
    );

    expect(badges.validator).toBe(false);
    expect(badges.genesisValidator).toBe(false);
    // The foundation badge does not wait on it, which is why it is the one
    // that shows on the first page without a delay.
    expect(badges.foundation).toBe(true);
  });
});
