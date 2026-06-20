import api from '@/services/api';
import { Service } from '@/types';

export interface HeartbeatEntry {
  publicKey: string;
  versionNumber: string;
  isActive: boolean;
  timestamp: string;
}

const compareSemver = (a: string, b: string): number => {
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

export const fetchHeartbeatStatus = async (): Promise<
  { versionMap: Record<string, string>; latestVersion: string } | undefined
> => {
  try {
    const data = await api.get({
      route: 'node/heartbeatstatus',
      service: Service.NODE,
    });

    if (!data?.data?.heartbeats || data.data.heartbeats.length === 0) {
      return undefined;
    }

    const versionMap: Record<string, string> = {};
    let latestVersion = '';

    for (const hb of data.data.heartbeats as HeartbeatEntry[]) {
      if (!hb.publicKey || !hb.versionNumber) continue;
      const shortVersion = hb.versionNumber.split('/')[0];
      versionMap[hb.publicKey] = shortVersion;

      if (!latestVersion || compareSemver(shortVersion, latestVersion) > 0) {
        latestVersion = shortVersion;
      }
    }

    return { versionMap, latestVersion };
  } catch (error) {
    return undefined;
  }
};
