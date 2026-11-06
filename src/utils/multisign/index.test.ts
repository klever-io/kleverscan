import { canBroadcastMultisign, normalizeMultisignTx, signedWeight } from '.';

describe('normalizeMultisignTx', () => {
  it('reads the lowercase key the fixed API sends', () => {
    expect(normalizeMultisignTx({ hash: 'a', threshold: 1 })).toEqual({
      hash: 'a',
      Threshold: 1,
    });
  });

  it('still reads the capitalised key the old API sent', () => {
    expect(normalizeMultisignTx({ hash: 'a', Threshold: 3 })).toEqual({
      hash: 'a',
      Threshold: 3,
    });
  });

  it('prefers the lowercase key when both are present', () => {
    expect(normalizeMultisignTx({ threshold: 2, Threshold: 0 }).Threshold).toBe(
      2,
    );
  });

  it('falls back to 0 when the threshold is missing or not a number', () => {
    expect(normalizeMultisignTx({}).Threshold).toBe(0);
    expect(normalizeMultisignTx({ threshold: 'x' }).Threshold).toBe(0);
  });
});

describe('signedWeight', () => {
  it('sums the weights of the signers that signed', () => {
    expect(
      signedWeight([
        { weight: 2, signed: true },
        { weight: 5, signed: false },
        { weight: 3, signed: true },
      ]),
    ).toBe(5);
  });

  it('is 0 with no signers', () => {
    expect(signedWeight(undefined)).toBe(0);
    expect(signedWeight([])).toBe(0);
  });

  it('ignores a weight that is not a number', () => {
    expect(
      signedWeight([
        { weight: 'x', signed: true },
        { weight: '4', signed: true },
      ]),
    ).toBe(4);
  });
});

describe('canBroadcastMultisign', () => {
  const signers = [
    { weight: 1, signed: true },
    { weight: 1, signed: false },
  ];

  it('allows broadcast once the signed weight reaches the threshold', () => {
    expect(canBroadcastMultisign({ signers, Threshold: 1 })).toBe(true);
  });

  it('refuses while the signed weight is below the threshold', () => {
    expect(canBroadcastMultisign({ signers, Threshold: 2 })).toBe(false);
  });

  it('refuses when the threshold is 0 or unknown, as the API does', () => {
    expect(canBroadcastMultisign({ signers, Threshold: 0 })).toBe(false);
    expect(canBroadcastMultisign({ signers })).toBe(false);
    expect(canBroadcastMultisign(undefined)).toBe(false);
  });

  it('leaves a transaction imported from JSON to the chain', () => {
    expect(
      canBroadcastMultisign({ signers: [], Threshold: 0, fromJSON: true }),
    ).toBe(true);
  });
});
