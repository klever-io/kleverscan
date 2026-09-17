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
  const withFetchText = async (
    body: string,
    props: Parameters<typeof api.get>[0],
  ) => {
    const original = global.fetch;
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => body,
    }) as never;
    try {
      return await api.get(props);
    } finally {
      global.fetch = original;
    }
  };

  it('returns both the rounded number and the exact twin when asked', async () => {
    const result = await withFetchText(
      '{"data":{"asset":{"assetId":"EMT-NO9T","circulatingSupply":100000000000000001}},"error":"","code":"successful"}',
      { route: 'assets/EMT-NO9T', preserveBigAmounts: true },
    );

    expect(result.data.asset.circulatingSupply).toBe(100000000000000000);
    expect(result.data.asset.circulatingSupplyString).toBe(
      '100000000000000001',
    );
  });

  it('rejects on a malformed body in a single attempt, as response.json() did', async () => {
    // The parse runs in a returned, unawaited promise on purpose: rejection
    // must bypass the request's catch (which resolves error shapes) and must
    // not pay the retry loop. A proxy 504 HTML page is the realistic body.
    const original = global.fetch;
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => '<html>504 Gateway Time-out</html>',
    });
    global.fetch = fetchMock as never;

    try {
      await expect(api.get({ route: 'assets/list' })).rejects.toThrow();
      expect(fetchMock).toHaveBeenCalledTimes(1);
    } finally {
      global.fetch = original;
    }
  });

  it('leaves a response verbatim without the opt-in, so raw views stay honest', async () => {
    // A CreateAsset transaction carries the same field names inside its
    // contract parameter; the Raw Tx card renders this object as-is.
    const result = await withFetchText(
      '{"data":{"transaction":{"contract":[{"parameter":{"initialSupply":2100000000000000000,"maxSupply":2100000000000000000}}]}},"error":"","code":"successful"}',
      { route: 'transaction/abc' },
    );

    const parameter = result.data.transaction.contract[0].parameter;
    expect(parameter.initialSupplyString).toBeUndefined();
    expect(parameter.maxSupplyString).toBeUndefined();
    expect(Object.keys(parameter)).toEqual(['initialSupply', 'maxSupply']);
  });
});
