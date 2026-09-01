import {
  fetchHeartbeatStatus,
  HeartbeatEntry,
  HeartbeatStatus,
} from '@/services/requests/heartbeat';
import {
  fetchAllValidators,
  IAllValidators,
} from '@/services/requests/validators';
import { IValidator } from '@/types/index';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export interface IValidatorSources {
  validators: IValidator[];
  totalRecords: number;
  versionMap: Record<string, string>;
  entries: HeartbeatEntry[];
  heartbeatAvailable: boolean;
  validatorsAvailable: boolean;
}

const EMPTY: IValidatorSources = {
  validators: [],
  totalRecords: 0,
  versionMap: {},
  entries: [],
  heartbeatAvailable: false,
  validatorsAvailable: false,
};

export const VALIDATOR_SOURCES_KEY = ['validatorSources'];

/** Ten tries, five minutes, then stop. `parseHeartbeatPayload` returns
 *  undefined for a failed request AND for a node that reports no usable
 *  entries, and the second of those may never clear: without a cap an
 *  unhealthy node would be polled for the life of the tab. Only a full reload
 *  starts the count again: the counter lives on the Query, and gcTime keeps
 *  that alive across a route change, so stepping away and back spends an
 *  attempt rather than restoring the budget (measured). */
const RECOVERY_ATTEMPTS = 10;

/** Both halves answered. The degraded case is a successful query carrying
 *  fallbacks, so it has to be recognised by these flags rather than by an
 *  error. */
const complete = (sources?: IValidatorSources): boolean =>
  Boolean(sources?.heartbeatAvailable && sources?.validatorsAvailable);

/**
 * The validator list and the node heartbeat, fetched once and shared through
 * react-query. Five minutes because both sources move slowly: the set changes
 * per epoch and a node's version only changes on a redeploy.
 */
export const useValidatorSources = (
  /** Drive the recovery poll from here. One reader should own it: an observer
   *  carries its own timer, so every extra reader is another refetch cycle. */
  poll = false,
): {
  data: IValidatorSources;
  isLoading: boolean;
  /** When this query last settled. A consumer that has to re-run on the JOIN
   *  needs this and not a shape derived from one half: keys built on the
   *  validator list and on the version map each left the other half's recovery
   *  invisible, in turn. */
  dataUpdatedAt: number;
} => {
  const queryClient = useQueryClient();

  const { data, isLoading, dataUpdatedAt } = useQuery({
    queryKey: VALIDATOR_SOURCES_KEY,
    queryFn: async (): Promise<IValidatorSources> => {
      const previous = queryClient.getQueryData<IValidatorSources>(
        VALIDATOR_SOURCES_KEY,
      );

      /* Only while recovering: a heartbeat outage used to re-issue all three
         `validator/list` pages every 30s to retry one `/api/heartbeat` call,
         27 requests against a testnet rate limit CI shares. A complete
         previous answer refetches both halves, or the data would freeze. */
      const recovering = previous !== undefined && !complete(previous);
      const keepList = recovering && previous.validatorsAvailable;
      const keepHeartbeat = recovering && previous.heartbeatAvailable;

      // Settled, not `all`: the heartbeat failing must not cost the list, and
      // the list failing must not cost the heartbeat. Either half missing
      // degrades one figure instead of emptying the card.
      const [listResult, heartbeatResult] = await Promise.allSettled([
        keepList
          ? Promise.resolve(undefined)
          : (fetchAllValidators() as Promise<IAllValidators | undefined>),
        keepHeartbeat ? Promise.resolve(undefined) : fetchHeartbeatStatus(),
      ]);

      const list =
        listResult.status === 'fulfilled' ? listResult.value : undefined;
      const heartbeat =
        heartbeatResult.status === 'fulfilled'
          ? heartbeatResult.value
          : undefined;

      return {
        validators: keepList ? previous.validators : (list?.validators ?? []),
        totalRecords: keepList
          ? previous.totalRecords
          : (list?.totalRecords ?? 0),
        versionMap: keepHeartbeat
          ? previous.versionMap
          : ((heartbeat as HeartbeatStatus | undefined)?.versionMap ?? {}),
        entries: keepHeartbeat
          ? previous.entries
          : ((heartbeat as HeartbeatStatus | undefined)?.entries ?? []),
        heartbeatAvailable: keepHeartbeat || !!heartbeat,
        validatorsAvailable: keepList || !!list,
      };
    },
    // A function, not a constant: a half-failed answer caches as a successful
    // one, and a constant would hold that degraded card for the full window.
    staleTime: query => {
      const cached = query.state.data as IValidatorSources | undefined;
      return complete(cached) ? 5 * 60_000 : 0;
    },

    // Stale is not a trigger by itself. This query cannot reject (both halves
    // are settled, not raced), so react-query's own retry never fires, the app
    // turns off refetchOnWindowFocus, and all three observers mount in the same
    // commit. Without an interval a transient failure holds until the reader
    // navigates away and back. Off once both halves have answered.
    //
    // Only the caller that asks for it: an observer carries its own timer, and
    // with three readers of this hook the degraded case fired three separate
    // refetches per cycle, measured.
    refetchInterval: query =>
      poll &&
      !complete(query.state.data as IValidatorSources | undefined) &&
      query.state.dataUpdateCount < RECOVERY_ATTEMPTS
        ? 30_000
        : false,
    gcTime: 5 * 60_000,
  });

  return { data: data ?? EMPTY, isLoading, dataUpdatedAt };
};
