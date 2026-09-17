import { contractActivitySharesCall } from '@/services/requests/smartContracts';

/**
 * The one query both share-drawing surfaces (the summary bar and the podium)
 * spread into useQuery. One module so the key, the call and the cache windows
 * cannot drift apart: two copies observing different staleness under one key
 * would let a card and the bar divide one contract by two different bases.
 */
export const CONTRACT_SHARES_QUERY = {
  queryKey: ['contractActivityShares'],
  queryFn: contractActivitySharesCall,
  staleTime: 15 * 60_000,
  gcTime: 15 * 60_000,
} as const;
