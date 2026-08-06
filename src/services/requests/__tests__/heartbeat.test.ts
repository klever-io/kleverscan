import {
  buildVersionStats,
  compareSemver,
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
      latestVersionAmongValidators(
        [{ blsPublicKey: 'x' }],
        { other: 'v1.7.20' },
      ),
    ).toBe('');
  });

  it('ignores peers that are not in the validator list', () => {
    const latest = latestVersionAmongValidators(
      [
        { blsPublicKey: 'bls-a' },
        { blsPublicKey: 'bls-b' },
      ],
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
