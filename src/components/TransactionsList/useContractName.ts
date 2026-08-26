import {
  CONTRACT_NAME_STALE_TIME,
  contractNameQueryKey,
  smartContractNameCall,
} from '@/services/requests/smartContracts/names';
import { useQuery } from '@tanstack/react-query';

/**
 * The name of the contract a row points at, or undefined while it is unknown.
 *
 * Deliberately its own query rather than part of the row request: the table
 * already waits on one round trip before it can paint, and a name is
 * decoration on a link that reads fine without it. Rows render with the
 * address and pick the name up when it lands.
 *
 * React Query deduplicates by address, so a page where forty rows call the
 * same contract still asks once, and the hour-long staleTime means paging
 * through a list asks not at all.
 */
export const useContractName = (
  address: string,
  enabled: boolean,
): string | undefined => {
  const { data } = useQuery({
    queryKey: contractNameQueryKey(address),
    queryFn: () => smartContractNameCall(address),
    // An address the row could not resolve asks for nothing, so the query
    // never runs and its key is never read.
    enabled: Boolean(enabled && address),
    staleTime: CONTRACT_NAME_STALE_TIME,
    // A contract without a name is a settled answer, not a failure to retry.
    retry: false,
  });

  return data ?? undefined;
};
