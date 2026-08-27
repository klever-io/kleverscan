import api from '@/services/api';
import { toMilliseconds } from '@/utils/timeFunctions';
import {
  IAccount,
  IPaginatedResponse,
  IYesterdayResponse,
} from '@/types/index';

type RouterQuery = Record<string, string | string[] | undefined>;

export interface IAccountsResponse extends IPaginatedResponse {
  data: {
    accounts: IAccount[];
  };
}

/**
 * The only params forwarded to the API, out of everything that can end up in
 * the URL. `/v1.0/address/list` documents exactly five parameters in its
 * swagger spec: limit, page, startdate, enddate and foundation. `limit` and
 * `page` arrive as arguments instead, and `foundation` is not offered by any
 * control on this page, which leaves the date range.
 *
 * An allowlist rather than a denylist, for the same reason the block request
 * uses one: anything else the page keeps in the URL is view state, not a
 * filter, and forwarding it would hand the API this table's state as though it
 * narrowed the list. A repeated param arrives as an array, which no control
 * here writes, so it is skipped rather than joined into one value.
 */
const FILTER_PARAMS = ['startdate', 'enddate'];

/**
 * One page of the account list.
 *
 * Nothing here depends on the ordering or on the depth the API allows, so both
 * are context rather than contract. Measured against mainnet on 2026-08-26: the
 * list came back ordered by balance descending, and the result window stopped
 * at 10 000 records, with page 1001 at limit 10 answering 400 "result window is
 * too large". `pagination.totalPages` reported that cap rather than the full
 * record count, which is why the table's pagination already stops in the right
 * place and needs no clamp of its own.
 */
export const accountsCall = async (
  page: number,
  limit: number,
  routerQuery: RouterQuery = {},
): Promise<IAccountsResponse> => {
  const query: Record<string, unknown> = {};

  FILTER_PARAMS.forEach(key => {
    const value = routerQuery[key];
    if (typeof value === 'string' && value !== '') {
      query[key] = value;
    }
  });

  // Written after the allowlist, so a `page` or `limit` sitting in the URL
  // cannot reach the API through it. Worth being precise about what that does
  // and does not buy: the caller is the shared Table, which derives these two
  // from `router.query` itself and coerces them with `Number(...) || default`.
  // So the values still originate in the URL; what cannot travel is anything
  // that is not a number, and no extra parameter can ride along beside them.
  query.page = page;
  query.limit = limit;

  return api.get({ route: 'address/list', query });
};

/**
 * Total number of accounts on chain, or undefined if the request failed.
 *
 * The undefined matters, and it has to be produced here. `api.get` never
 * rejects: on any failure it resolves to `{ data: null, error, code:
 * 'internal_error', pagination }` where `pagination` is a module-level default
 * carrying `totalRecords: 0` (`services/api.ts:49-56`). A caller that only
 * reads `pagination.totalRecords` therefore cannot tell a degraded API from a
 * chain with no accounts, and would print the zero as fact. Checking `error`
 * here is the same guard `services/requests/transactions/summary.ts` applies
 * for the same reason.
 *
 * `limit=1` because only the count is read. Without it the endpoint answers
 * with ten full account objects, permission arrays included, for a single
 * number: 6KB against 1KB, measured against mainnet.
 */
export const accountsTotalCall = async (): Promise<number | undefined> => {
  const response: IPaginatedResponse = await api.get({
    route: 'address/list',
    query: { limit: 1 },
  });
  if (response?.error) return undefined;
  const total = response?.pagination?.totalRecords;
  // A null in the payload survives an `!== undefined` check and would then
  // throw on toLocaleString in the middle of a render.
  return Number.isFinite(total) ? total : undefined;
};

/**
 * New accounts per day over the last `days` days, newest entry first.
 *
 * Callers read entry 0 as the running 24 hours and entry 1 as the day before,
 * which is the whole of what this endpoint's shape has to hold for them.
 *
 * Why the page asks for a week rather than a day: measured against mainnet on
 * 2026-08-26, `count/7` opened with the same entry `count/1` returned (10 in
 * both), so one request covers the day figure, the day-on-day change and the
 * week total where the page used to spend a request on the day alone. If that
 * ever stops holding, the summary shows a wrong 24-hour figure rather than
 * failing, so it is worth re-checking before leaning on it further.
 */
export const accountsCreatedCall = async (
  days: number,
): Promise<(number | undefined)[] | undefined> => {
  const response: IYesterdayResponse = await api.get({
    // Escaped even though the only caller passes a module constant, because a
    // route segment goes into the URL raw: `getHost` concatenates it without
    // touching it, so unlike a query value it never reaches `buildUrlQuery`'s
    // encoding. That is the convention #685 set for route segments, and it is
    // what stops a later caller from handing this a value off the URL.
    route: `address/list/count/${encodeURIComponent(String(days))}`,
  });
  // Same reason as the call above: a failure resolves rather than rejects, and
  // an empty series is a different statement from a failed request.
  if (response?.error) return undefined;
  return (response?.data?.number_by_day ?? []).map(day =>
    // A day that carries no usable count becomes a hole, not a missing entry.
    // Filtering it out instead would slide every later day forward, and the
    // caller reads position 1 as yesterday: given [10, undefined, 4] it would
    // report the day before yesterday as yesterday's figure, and call two
    // non-adjacent days a two-day span. A hole keeps the positions honest and
    // still keeps the value out of any sum.
    Number.isFinite(day?.doc_count) ? day.doc_count : undefined,
  );
};

/* ----------------------------- badge sources ----------------------------- */

/** What the chain says about an address, as far as the list badges care. */
export interface IValidatorFlags {
  /** Registered in the genesis block rather than by a later transaction. */
  isGenesis: boolean;
  /** `elected`, `eligible`, `jailed`. Not badged, but carried for the title. */
  list: string;
}

export type ValidatorOwners = Record<string, IValidatorFlags>;

const VALIDATOR_PAGE_SIZE = 100;
/** Bound on a malformed `totalRecords`. 208 validators at 100 a page is 3. */
const VALIDATOR_PAGE_CAP = 50;

/**
 * Every validator owner address, with the flags the badges read.
 *
 * Paged on the item count, not on a page size: `validator/list` silently caps a
 * page at 100 whatever `limit` asks, so one page of 100 beside a
 * `totalRecords: 208` is how you conclude the chain has 2 genesis validators
 * when it has 21.
 */
export const validatorOwnersCall = async (): Promise<
  ValidatorOwners | undefined
> => {
  const owners: ValidatorOwners = {};
  let collected = 0;
  let total: number | undefined;

  for (let page = 1; page <= VALIDATOR_PAGE_CAP; page++) {
    const response = await api.get({
      route: 'validator/list',
      query: { page, limit: VALIDATOR_PAGE_SIZE },
    });
    // A failure resolves rather than rejects, so a partial set would read as
    // the whole set and un-badge every validator past the break.
    if (response?.error) return undefined;

    const validators = response?.data?.validators ?? [];
    if (validators.length === 0) break;

    validators.forEach(
      (validator: {
        ownerAddress?: string;
        registerNonce?: number;
        list?: string;
      }) => {
        if (!validator?.ownerAddress) return;
        owners[validator.ownerAddress] = {
          isGenesis: validator.registerNonce === 0,
          list: validator.list ?? '',
        };
      },
    );

    collected += validators.length;
    total = response?.pagination?.totalRecords;
    if (typeof total !== 'number' || collected >= total) break;
  }

  return owners;
};

/**
 * The moment the chain started. Fetched, not hardcoded: mainnet opened
 * 2022-07-01 and testnet 2025-02-07, so a baked-in value badges nothing there.
 */
export const genesisTimestampCall = async (): Promise<number | undefined> => {
  const response = await api.get({ route: 'block/by-nonce/0' });
  if (response?.error) return undefined;
  const timestamp = response?.data?.block?.timestamp;
  // Normalised here so one unit travels downstream: the badge comparison
  // normalises both sides, but the window below goes to the API raw and a
  // seconds value there returns nothing.
  return Number.isFinite(timestamp) ? toMilliseconds(timestamp) : undefined;
};

/* -------------------------------- filters -------------------------------- */

/** The values the type filter writes into the URL. */
export const ACCOUNT_FILTERS = ['foundation', 'genesisValidator'] as const;
export type AccountFilter = (typeof ACCOUNT_FILTERS)[number];

export const isAccountFilter = (value: unknown): value is AccountFilter =>
  typeof value === 'string' &&
  (ACCOUNT_FILTERS as readonly string[]).includes(value);

/** Slack around the genesis instant; the next account on chain is minutes
 *  later, so a second costs nothing. */
const GENESIS_WINDOW_MS = 1000;
const GENESIS_PAGE_SIZE = 100;
const GENESIS_PAGE_CAP = 20;

/**
 * Every account created in the genesis block: 40 on mainnet, 22 on testnet.
 *
 * The window is milliseconds only; the same range in seconds returns nothing.
 * It still matches the rows whose `timestamp` comes back as seconds, because
 * the API filters on its stored value rather than on what it serialises.
 * Measured: this window answers 40, of which 21 serialise as seconds.
 */
export const genesisAccountsCall = async (
  genesisTimestamp: number,
): Promise<IAccount[] | undefined> => {
  const accounts: IAccount[] = [];
  let total: number | undefined;

  // Paged for the same reason as above: one page of a capped endpoint looks
  // exactly like a complete answer, and a truncated set here would under-report
  // both filters while the rows kept badging what the filter had dropped.
  for (let page = 1; page <= GENESIS_PAGE_CAP; page++) {
    const response = await api.get({
      route: 'address/list',
      query: {
        startdate: genesisTimestamp,
        enddate: genesisTimestamp + GENESIS_WINDOW_MS,
        page,
        limit: GENESIS_PAGE_SIZE,
      },
    });
    if (response?.error) return undefined;

    const batch = response?.data?.accounts ?? [];
    if (batch.length === 0) break;
    accounts.push(...batch);

    total = response?.pagination?.totalRecords;
    if (typeof total !== 'number' || accounts.length >= total) break;
  }

  return accounts;
};
