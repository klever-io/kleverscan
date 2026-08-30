import {
  DEPLOYER_COUNT_STALE_TIME,
  deployerContractCountCall,
  deployerCountQueryKey,
} from '@/services/requests/smartContracts/deployerCount';
import { useQuery } from '@tanstack/react-query';

/**
 * How many contracts this row's deployer has deployed, or undefined while it
 * is unknown.
 *
 * Its own query rather than part of the row request, for the same reason
 * `useContractName` is: the table already waits on one round trip before it
 * can paint, and this number is an extra affordance on a cell that reads fine
 * without it. Rows render, the count lands after.
 */
export const useDeployerCount = (
  deployer: string,
  enabled: boolean,
): number | undefined => {
  const { data } = useQuery({
    queryKey: deployerCountQueryKey(deployer),
    queryFn: () => deployerContractCountCall(deployer),
    enabled: Boolean(enabled && deployer),
    staleTime: DEPLOYER_COUNT_STALE_TIME,
    retry: false,
    // A failed lookup must not re-arm on every remount: the shared Table
    // rebuilds each cell on re-render, and `staleTime` does not cover an
    // errored query where `retryOnMount` does.
    retryOnMount: false,
  });

  return data ?? undefined;
};
