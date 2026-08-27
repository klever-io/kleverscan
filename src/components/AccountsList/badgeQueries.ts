import {
  genesisTimestampCall,
  validatorOwnersCall,
  type ValidatorOwners,
} from '@/services/requests/accounts';

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
 */
export const genesisTimestampQuery = {
  queryKey: ['genesisTimestamp'],
  queryFn: async (): Promise<number | null> =>
    (await genesisTimestampCall()) ?? null,
  // Block 0 is immutable.
  staleTime: Infinity,
};

export const validatorOwnersQuery = {
  queryKey: ['validatorOwners'],
  queryFn: async (): Promise<ValidatorOwners | null> =>
    (await validatorOwnersCall()) ?? null,
  staleTime: 10 * 60 * 1000,
};
