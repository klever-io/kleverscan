import api, { preserveBigDigits } from '../api';

describe('preserveBigDigits', () => {
  it('injects an exact string twin for a 16-plus digit amount field', () => {
    const parsed = JSON.parse(
      preserveBigDigits('{"circulatingSupply":100000000000000001}'),
    );

    // The number itself parses bit-identically to before: still the rounded
    // double. The twin carries what the wire actually said.
    expect(parsed.circulatingSupply).toBe(100000000000000000);
    expect(parsed.circulatingSupplyString).toBe('100000000000000001');
  });

  it('leaves 15-digit values alone: they fit a double exactly', () => {
    const parsed = JSON.parse(
      preserveBigDigits('{"maxSupply":999999999999999}'),
    );

    expect(parsed.maxSupply).toBe(999999999999999);
    expect(parsed.maxSupplyString).toBeUndefined();
  });

  it('processes every occurrence across array items', () => {
    const parsed = JSON.parse(
      preserveBigDigits(
        '{"assets":[{"maxSupply":10000000000000000},{"maxSupply":20000000000000000}]}',
      ),
    );

    expect(parsed.assets[0].maxSupplyString).toBe('10000000000000000');
    expect(parsed.assets[1].maxSupplyString).toBe('20000000000000000');
  });

  it('does not touch the same text inside a string value', () => {
    // In valid JSON a quote inside a string is always escaped, so the anchor
    // `[{,]"field"` cannot match there.
    const raw =
      '{"metadata":"{\\"maxSupply\\":10000000000000000}","maxSupply":5}';
    const parsed = JSON.parse(preserveBigDigits(raw));

    expect(parsed.metadata).toBe('{"maxSupply":10000000000000000}');
    expect(parsed.maxSupplyString).toBeUndefined();
  });

  it('does not touch fractions, exponents or fields outside the allowlist', () => {
    const raw =
      '{"ratio":1234567890123456.5,"volume":1234567890123456789,"klvBalance":1e17}';
    const parsed = JSON.parse(preserveBigDigits(raw));

    expect(parsed.ratioString).toBeUndefined();
    expect(parsed.volumeString).toBeUndefined();
    expect(parsed.klvBalanceString).toBeUndefined();
  });

  it('keeps whitespace-formatted JSON working', () => {
    const parsed = JSON.parse(
      preserveBigDigits('{ "totalStaked" : 90000000000000000 }'),
    );

    expect(parsed.totalStaked).toBe(90000000000000000);
    expect(parsed.totalStakedString).toBe('90000000000000000');
  });

  it('leaves broken JSON broken, so the parse still throws as before', () => {
    expect(() => JSON.parse(preserveBigDigits('{"maxSupply":'))).toThrow();
  });
});

describe('api.get carries the exact digits through the parse boundary', () => {
  it('returns both the rounded number and the exact twin', async () => {
    const original = global.fetch;
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () =>
        '{"data":{"asset":{"assetId":"EMT-NO9T","circulatingSupply":100000000000000001}},"error":"","code":"successful"}',
    }) as never;

    try {
      const result = await api.get({ route: 'assets/EMT-NO9T' });

      expect(result.data.asset.circulatingSupply).toBe(100000000000000000);
      expect(result.data.asset.circulatingSupplyString).toBe(
        '100000000000000001',
      );
    } finally {
      global.fetch = original;
    }
  });
});
