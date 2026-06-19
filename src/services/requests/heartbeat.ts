import api from '@/services/api';
import { Service } from '@/types';

export interface HeartbeatEntry {
  publicKey: string;
  versionNumber: string;
  isActive: boolean;
  timestamp: string;
}

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
      const shortVersion = hb.versionNumber.split('/')[0];
      versionMap[hb.publicKey] = shortVersion;

      if (!latestVersion || shortVersion > latestVersion) {
        latestVersion = shortVersion;
      }
    }

    return { versionMap, latestVersion };
  } catch (error) {
    return undefined;
  }
};
