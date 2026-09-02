import {
  fetchHeartbeatStatus,
  HeartbeatEntry,
} from '@/services/requests/heartbeat';
import { fetchAllValidators } from '@/services/requests/validators';
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
      const state = queryClient.getQueryState<IValidatorSources>(
        VALIDATOR_SOURCES_KEY,
      );
      const previous = state?.data;

      /* Only while recovering, and only while the kept half is younger than
         the freshness this query promises: a heartbeat outage used to re-issue
         all three `validator/list` pages every 30s to retry one
         `/api/heartbeat` call, 27 requests against a testnet rate limit CI
         shares. The age bound cannot fire inside the poll window (every
         settle resets `dataUpdatedAt`), so within the ten-try budget the kept
         half rides the whole outage; the bound is for the reader who arrives
         after that budget, whose refetch re-asks BOTH halves. */
      const fresh =
        state !== undefined && Date.now() - state.dataUpdatedAt < 5 * 60_000;
      const recovering = fresh && previous !== undefined && !complete(previous);
      const keepList = recovering && previous.validatorsAvailable;
      const keepHeartbeat = recovering && previous.heartbeatAvailable;

      // Settled, not `all`: the heartbeat failing must not cost the list, and
      // the list failing must not cost the heartbeat. Either half missing
      // degrades one figure instead of emptying the card.
      const [listResult, heartbeatResult] = await Promise.allSettled([
        keepList ? undefined : fetchAllValidators(),
        keepHeartbeat ? undefined : fetchHeartbeatStatus(),
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
          : (heartbeat?.versionMap ?? {}),
        entries: keepHeartbeat ? previous.entries : (heartbeat?.entries ?? []),
        heartbeatAvailable: keepHeartbeat || !!heartbeat,
        validatorsAvailable: keepList || !!list,
      };
    },
    // A function, not a constant: a half-failed answer caches as a successful
    // one, and a constant would hold that degraded card for the full window.
    staleTime: query => {
      return complete(query.state.data) ? 5 * 60_000 : 0;
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
      !complete(query.state.data) &&
      query.state.dataUpdateCount < RECOVERY_ATTEMPTS
        ? 30_000
        : false,
    gcTime: 5 * 60_000,
  });

  return { data: data ?? EMPTY, isLoading, dataUpdatedAt };
};
