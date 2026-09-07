import {
  buildVersionStats,
  latestVersionAmongValidators,
  VersionStat,
} from '@/services/requests/heartbeat';
import { useMemo } from 'react';
import { useValidatorSources } from './useValidatorSources';

/**
 * The version buckets, computed once per settle of the shared query.
 *
 * The page and the filter bar both need them, and both used to rebuild them on
 * every render: 209 validators bucketed and sorted through a regex comparator,
 * twice, for a Stake/Nodes toggle that changes neither. The page also handed
 * `VersionDistribution` a fresh array identity each time, which silently
 * disabled the two `useMemo`s that component keeps for exactly this.
 */
export const useVersionStats = (): {
  latestVersion?: string;
  stats: VersionStat[];
} => {
  const { data } = useValidatorSources();
  const { validators, versionMap, validatorsAvailable } = data;

  const latestVersion = useMemo(
    () => latestVersionAmongValidators(validators, versionMap) || undefined,
    [validators, versionMap],
  );

  const stats = useMemo(
    () =>
      validatorsAvailable
        ? buildVersionStats(validators, versionMap, latestVersion ?? '')
        : [],
    [validators, versionMap, validatorsAvailable, latestVersion],
  );

  return { latestVersion, stats };
};
