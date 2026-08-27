import {
  genesisTimestampCall,
  validatorOwnersCall,
} from '@/services/requests/accounts';
import { queryOptions } from '@tanstack/react-query';

/**
 * The two badge sources as react-query options, defined once.
 *
 * Both the row badges (through a hook) and the filtered list (through
 * `fetchQuery`) read them, so sharing the key is what makes the second reuse
 * the first's cache instead of fetching again.
 *
 * `?? null` matters: react-query 5 refuses an undefined result outright
 * ("data is undefined"), which drops the query into its error state and spends
 * the default three retries on a call that already answered.
 *
 * That mapping is also why `staleTime` is a function and not a constant. A
 * failure resolves as null, which react-query files as a success, so a flat
 * value would pin one bad request for the rest of the session: no retry, no
 * refetch on remount, every Foundation badge gone from the rows, and both
 * filters stuck on the empty state until a full reload. Keeping a null answer
 * stale is what makes the next mount ask again. The shared `Table` does the
 * same thing for the same reason.
 */
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
