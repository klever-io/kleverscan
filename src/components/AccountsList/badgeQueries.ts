import {
  genesisTimestampCall,
  validatorOwnersCall,
} from '@/services/requests/accounts';
import { queryOptions } from '@tanstack/react-query';

// Read by the row badges (hook) and the filtered list (fetchQuery); sharing
// the key is what makes the second reuse the first's cache.
// `?? null`: react-query 5 refuses an undefined queryFn result outright and
// spends its retries on a call that already answered. That is also why
// staleTime is a function: a failure resolved as null is filed as a success,
// and a flat value would pin one bad request for the rest of the session.
export const genesisTimestampQuery = queryOptions({
  queryKey: ['genesisTimestamp'],
  queryFn: async () => (await genesisTimestampCall()) ?? null,
  // Block 0 is immutable, so a real answer is good for the whole session.
  staleTime: query => (query.state.data == null ? 0 : Infinity),
});

export const validatorOwnersQuery = queryOptions({
  queryKey: ['validatorOwners'],
  queryFn: async () => (await validatorOwnersCall()) ?? null,
  // The set moves when someone registers or unregisters a node, which is rare.
  staleTime: query => (query.state.data == null ? 0 : 10 * 60 * 1000),
});
