import {
  buildVersionStats,
  compareSemver,
  fetchHeartbeatStatus,
  latestVersionAmongValidators,
  normalizeVersion,
  resolveValidatorVersion,
  UNKNOWN_VERSION,
} from '../heartbeat';

describe('normalizeVersion', () => {
  it('strips path segments after the first slash', () => {
    expect(
      normalizeVersion('v1.7.20-0-g0b70b0f/go1.25.12/linux-amd64/9244d1f056'),
    ).toBe('v1.7.20');
  });

  it('strips git describe suffix -N-gHASH', () => {
    expect(normalizeVersion('v1.7.20-0-g0b70b0f')).toBe('v1.7.20');
  });

  it('keeps pre-release tags like -rc1', () => {
    expect(
      normalizeVersion('v1.7.21-rc1/go1.25.12/linux-amd64/2d0659e5b3'),
    ).toBe('v1.7.21-rc1');
  });

  it('keeps custom suffixes that are not git describe', () => {
    expect(normalizeVersion('v1.7.20-sync-peertype-fix')).toBe(
      'v1.7.20-sync-peertype-fix',
    );
  });
});

describe('compareSemver', () => {
  it('orders major.minor.patch', () => {
    expect(compareSemver('v1.7.21', 'v1.7.20')).toBeGreaterThan(0);
    expect(compareSemver('v1.6.0', 'v1.7.0')).toBeLessThan(0);
    expect(compareSemver('v1.7.20', 'v1.7.20')).toBe(0);
  });

  it('treats release as newer than pre-release of the same base', () => {
    expect(compareSemver('v1.7.21', 'v1.7.21-rc1')).toBeGreaterThan(0);
    expect(compareSemver('v1.7.21-rc1', 'v1.7.21')).toBeLessThan(0);
  });

  it('compares pre-release suffixes lexicographically when bases match', () => {
    expect(compareSemver('v1.7.21-rc2', 'v1.7.21-rc1')).toBeGreaterThan(0);
  });

  /* The comparator has to stay total. A node reporting a build tag rather than
     a version normalises to a non-numeric string, and `Number` turned every
     comparison against it into NaN. */
  it('never answers NaN for a version that is not a number', () => {
    ['dev', 'unknown', '', 'v1.x.0'].forEach(odd => {
      expect(Number.isNaN(compareSemver('v1.7.21', odd))).toBe(false);
      expect(Number.isNaN(compareSemver(odd, 'v1.7.21'))).toBe(false);
    });
  });

  /* And the consequence that made it matter: `NaN > 0` is false, so a
     non-numeric value reaching `latestVersion` first could never be displaced
     and every node then rendered as out of date. */
  it('sorts a non-numeric version below a real one', () => {
    expect(compareSemver('v1.7.21', 'dev')).toBeGreaterThan(0);
    expect(compareSemver('dev', 'v1.7.21')).toBeLessThan(0);
  });

  // Build metadata carries no precedence; left in place it corrupted the
  // number beside it and sorted the release below its predecessor.
  it('ignores build metadata', () => {
    expect(compareSemver('v1.7.21+build.1', 'v1.7.20')).toBeGreaterThan(0);
    expect(compareSemver('v1.7.21+build.1', 'v1.7.21')).toBe(0);
  });

  it('compares numeric prerelease identifiers numerically', () => {
    expect(compareSemver('v1.0.0-rc.10', 'v1.0.0-rc.2')).toBeGreaterThan(0);
    expect(compareSemver('v1.0.0-rc.2', 'v1.0.0-rc.10')).toBeLessThan(0);
    expect(compareSemver('v1.0.0-rc.2', 'v1.0.0-rc.2')).toBe(0);
  });
});

describe('resolveValidatorVersion', () => {
  const map = { abc: 'v1.7.20' };

  it('returns mapped version when bls is present', () => {
    expect(resolveValidatorVersion('abc', map)).toBe('v1.7.20');
  });

  it('matches public keys case-insensitively', () => {
    expect(resolveValidatorVersion('AbC', map)).toBe('v1.7.20');
  });

  it('returns Unknown when bls is missing from map', () => {
    expect(resolveValidatorVersion('missing', map)).toBe(UNKNOWN_VERSION);
  });

  it('returns Unknown when bls is undefined', () => {
    expect(resolveValidatorVersion(undefined, map)).toBe(UNKNOWN_VERSION);
  });
});

describe('latestVersionAmongValidators', () => {
  it('returns empty string when no validators match heartbeat', () => {
    expect(
      latestVersionAmongValidators([{ blsPublicKey: 'x' }], {
        other: 'v1.7.20',
      }),
    ).toBe('');
  });

  it('ignores peers that are not in the validator list', () => {
    const latest = latestVersionAmongValidators(
      [{ blsPublicKey: 'bls-a' }, { blsPublicKey: 'bls-b' }],
      {
        'bls-a': 'v1.7.20',
        'bls-b': 'v1.7.15',
        'observer-only': 'v1.9.0',
      },
    );
    expect(latest).toBe('v1.7.20');
  });
});

describe('buildVersionStats', () => {
  const versionMap = {
    bls1: 'v1.7.21-rc1',
    bls2: 'v1.7.21-rc1',
    bls3: 'v1.7.20',
    bls4: 'v1.7.20',
    bls5: 'v1.7.20',
  };

  const validators = [
    { blsPublicKey: 'bls1', staked: 100 },
    { blsPublicKey: 'bls2', staked: 100 },
    { blsPublicKey: 'bls3', staked: 300 },
    { blsPublicKey: 'bls4', staked: 200 },
    { blsPublicKey: 'bls5', staked: 100 },
    { blsPublicKey: 'no-hb', staked: 200 },
    { staked: 50 },
  ];

  it('returns empty array for empty validators', () => {
    expect(buildVersionStats([], versionMap, 'v1.7.21-rc1')).toEqual([]);
  });

  it('aggregates counts, percents, stake and flags Unknown last', () => {
    const stats = buildVersionStats(validators, versionMap, 'v1.7.21-rc1');

    expect(stats.map(s => s.version)).toEqual([
      'v1.7.21-rc1',
      'v1.7.20',
      UNKNOWN_VERSION,
    ]);

    const latest = stats[0];
    expect(latest.count).toBe(2);
    expect(latest.percent).toBeCloseTo((2 / 7) * 100);
    expect(latest.stake).toBe(200);
    expect(latest.stakePercent).toBeCloseTo((200 / 1050) * 100);
    expect(latest.isLatest).toBe(true);
    expect(latest.isUnknown).toBe(false);

    const mid = stats[1];
    expect(mid.count).toBe(3);
    expect(mid.stake).toBe(600);
    expect(mid.isLatest).toBe(false);

    const unknown = stats[2];
    expect(unknown.count).toBe(2);
    expect(unknown.stake).toBe(250);
    expect(unknown.isLatest).toBe(false);
    expect(unknown.isUnknown).toBe(true);
  });

  it('marks only the provided latestVersion as isLatest', () => {
    const stats = buildVersionStats(
      [
        { blsPublicKey: 'bls1', staked: 1 },
        { blsPublicKey: 'bls3', staked: 1 },
      ],
      versionMap,
      'v1.7.20',
    );
    expect(stats.find(s => s.version === 'v1.7.20')?.isLatest).toBe(true);
    expect(stats.find(s => s.version === 'v1.7.21-rc1')?.isLatest).toBe(false);
  });

  it('sorts known versions newest-first via semver', () => {
    const stats = buildVersionStats(
      [
        { blsPublicKey: 'a', staked: 1 },
        { blsPublicKey: 'b', staked: 1 },
      ],
      { a: 'v1.7.15', b: 'v1.7.20' },
      'v1.7.20',
    );
    expect(stats.map(s => s.version)).toEqual(['v1.7.20', 'v1.7.15']);
  });
});

describe('fetchHeartbeatStatus', () => {
  const originalFetch = global.fetch;
  const originalNodeHost = process.env.DEFAULT_NODE_HOST;

  beforeEach(() => {
    process.env.DEFAULT_NODE_HOST = 'https://node.test.example';
    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    process.env.DEFAULT_NODE_HOST = originalNodeHost;
    jest.restoreAllMocks();
  });

  const okJson = (body: unknown) =>
    Promise.resolve({
      ok: true,
      json: async () => body,
    } as Response);

  const failRes = (status = 500) =>
    Promise.resolve({
      ok: false,
      status,
      json: async () => ({}),
    } as Response);

  it('returns version map from the same-origin proxy when available', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      okJson({
        data: {
          heartbeats: [
            {
              publicKey: 'ABC',
              versionNumber: 'v1.7.20-0-gdeadbeef/go1.22',
            },
            {
              publicKey: 'def',
              versionNumber: 'v1.7.21-rc1/go1.22',
            },
          ],
        },
      }),
    );

    const result = await fetchHeartbeatStatus();
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/heartbeat',
      expect.objectContaining({ method: 'GET' }),
    );
    expect(result?.versionMap).toEqual({
      abc: 'v1.7.20',
      def: 'v1.7.21-rc1',
    });
    expect(result?.latestVersion).toBe('v1.7.21-rc1');
  });

  it('returns undefined when proxy is not ok (no client-side node fallback)', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() => failRes(502));

    await expect(fetchHeartbeatStatus()).resolves.toBeUndefined();
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/heartbeat',
      expect.any(Object),
    );
  });

  it('returns undefined when proxy throws', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error('network')),
    );

    await expect(fetchHeartbeatStatus()).resolves.toBeUndefined();
  });

  it('returns undefined when heartbeats are empty', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      okJson({ data: { heartbeats: [] } }),
    );

    await expect(fetchHeartbeatStatus()).resolves.toBeUndefined();
  });

  it('skips entries missing publicKey or versionNumber', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      okJson({
        data: {
          heartbeats: [
            { publicKey: '', versionNumber: 'v1.0.0' },
            { publicKey: 'only-pk' },
            { publicKey: 'good', versionNumber: 'v2.0.0' },
          ],
        },
      }),
    );

    const result = await fetchHeartbeatStatus();
    expect(result?.versionMap).toEqual({ good: 'v2.0.0' });
  });
});
