export const UNKNOWN_VERSION = 'Unknown';

export interface HeartbeatEntry {
  publicKey: string;
  versionNumber: string;
  isActive: boolean;
  timestamp: string;
}

export interface HeartbeatStatus {
  versionMap: Record<string, string>;
  latestVersion: string;
}

export interface VersionStat {
  version: string;
  count: number;
  percent: number;
  isLatest: boolean;
  isUnknown: boolean;
  stake: number;
  stakePercent: number;
}

export const compareSemver = (a: string, b: string): number => {
  const parse = (v: string) => {
    const clean = v.replace(/^v/, '');
    const [main, pre] = clean.split('-');
    return { parts: main.split('.').map(Number), pre: pre ?? '' };
  };
  const va = parse(a);
  const vb = parse(b);
  for (let i = 0; i < Math.max(va.parts.length, vb.parts.length); i++) {
    const diff = (va.parts[i] ?? 0) - (vb.parts[i] ?? 0);
    if (diff !== 0) return diff;
  }
  if (!va.pre && vb.pre) return 1;
  if (va.pre && !vb.pre) return -1;
  return va.pre > vb.pre ? 1 : va.pre < vb.pre ? -1 : 0;
};

/** Strip build path and git describe suffix from a full node version string. */
export const normalizeVersion = (versionNumber: string): string =>
  versionNumber.split('/')[0].replace(/-\d+-g[0-9a-f]+$/, '');

/** Normalize BLS / peer public keys for map lookup. */
export const normalizePublicKey = (key: string): string => key.toLowerCase();

export const resolveValidatorVersion = (
  blsPublicKey: string | undefined,
  versionMap: Record<string, string>,
): string => {
  if (!blsPublicKey) return UNKNOWN_VERSION;
  return versionMap[normalizePublicKey(blsPublicKey)] || UNKNOWN_VERSION;
};

/**
 * Newest software version among validators that have a heartbeat match.
 * Ignores observers/peers that are not in the validator list.
 */
export const latestVersionAmongValidators = (
  validators: Array<{ blsPublicKey?: string }>,
  versionMap: Record<string, string>,
): string => {
  let latest = '';
  for (const validator of validators) {
    if (!validator.blsPublicKey) continue;
    const version = versionMap[normalizePublicKey(validator.blsPublicKey)];
    if (!version) continue;
    if (!latest || compareSemver(version, latest) > 0) {
      latest = version;
    }
  }
  return latest;
};

/**
 * Aggregate validator list + heartbeat version map into ranked version stats
 * (node counts and stake). Unknown (no heartbeat match) is always last.
 */
export const buildVersionStats = (
  validators: Array<{ blsPublicKey?: string; staked?: number }>,
  versionMap: Record<string, string>,
  latestVersion: string,
): VersionStat[] => {
  if (!validators.length) return [];

  const buckets = new Map<string, { count: number; stake: number }>();

  for (const validator of validators) {
    const version = resolveValidatorVersion(validator.blsPublicKey, versionMap);
    const current = buckets.get(version) ?? { count: 0, stake: 0 };
    current.count += 1;
    current.stake += validator.staked ?? 0;
    buckets.set(version, current);
  }

  const totalCount = validators.length;
  const totalStake = Array.from(buckets.values()).reduce(
    (sum, b) => sum + b.stake,
    0,
  );

  const stats: VersionStat[] = Array.from(buckets.entries()).map(
    ([version, { count, stake }]) => {
      const isUnknown = version === UNKNOWN_VERSION;
      return {
        version,
        count,
        percent: totalCount > 0 ? (count / totalCount) * 100 : 0,
        isLatest: !isUnknown && version === latestVersion,
        isUnknown,
        stake,
        stakePercent: totalStake > 0 ? (stake / totalStake) * 100 : 0,
      };
    },
  );

  stats.sort((a, b) => {
    if (a.isUnknown) return 1;
    if (b.isUnknown) return -1;
    return compareSemver(b.version, a.version);
  });

  return stats;
};

const parseHeartbeatPayload = (data: any): HeartbeatStatus | undefined => {
  const heartbeats = data?.data?.heartbeats;
  if (!heartbeats || heartbeats.length === 0) {
    return undefined;
  }

  const versionMap: Record<string, string> = {};
  let latestVersion = '';

  for (const hb of heartbeats as HeartbeatEntry[]) {
    if (!hb.publicKey || !hb.versionNumber) continue;
    const shortVersion = normalizeVersion(hb.versionNumber);
    versionMap[normalizePublicKey(hb.publicKey)] = shortVersion;

    if (!latestVersion || compareSemver(shortVersion, latestVersion) > 0) {
      latestVersion = shortVersion;
    }
  }

  if (!Object.keys(versionMap).length) {
    return undefined;
  }

  return { versionMap, latestVersion };
};

/**
 * Fetch node heartbeat via same-origin API proxy (reliable on mainnet).
 * Falls back to direct node host if the proxy is unavailable.
 */
export const fetchHeartbeatStatus = async (): Promise<
  HeartbeatStatus | undefined
> => {
  try {
    const proxyRes = await fetch('/api/heartbeat', {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (proxyRes.ok) {
      const data = await proxyRes.json();
      const parsed = parseHeartbeatPayload(data);
      if (parsed) return parsed;
    }
  } catch {
    // Fall through to direct node request.
  }

  // Fallback: direct node (same as historical path).
  try {
    const nodeHost = (
      process.env.DEFAULT_NODE_HOST || 'https://node.testnet.klever.org'
    ).replace(/\/$/, '');

    const directRes = await fetch(`${nodeHost}/node/heartbeatstatus`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      mode: 'cors',
    });

    if (!directRes.ok) return undefined;
    const data = await directRes.json();
    return parseHeartbeatPayload(data);
  } catch {
    return undefined;
  }
};
