import api from '@/services/api';
import { rollingWindow } from '@/services/requests/rollingWindow';
import { toMilliseconds } from '@/utils/timeFunctions';
import { IAccount, IPaginatedResponse } from '@/types/index';

type RouterQuery = Record<string, string | string[] | undefined>;

export interface IAccountsResponse extends IPaginatedResponse {
  data: {
    accounts: IAccount[];
  };
}

/**
 * Of `/v1.0/address/list`'s five swagger params (limit, page, startdate,
 * enddate, foundation), `limit`/`page` arrive as arguments and `foundation`
 * has no control on this page, leaving the date range. Allowlisted so the
 * page's URL view state never reaches the API; arrays are skipped, not joined.
 */
const FILTER_PARAMS = ['startdate', 'enddate'];

/**
 * One page of the account list. Mainnet 2026-08-26: ordered by balance
 * descending; the window caps at 10 000, page 1001 at limit 10 answering 400
 * "result window is too large"; `totalPages` reports the cap, no clamp needed.
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

  // Assigned after the allowlist, so a `page` or `limit` in the URL cannot
  // override the arguments, already clamped by `normalizePageParam`.
  query.page = page;
  query.limit = limit;

  return api.get({ route: 'address/list', query });
};

/**
 * Total accounts, or undefined on failure. `api.get` never rejects: failures
 * resolve with default `totalRecords: 0` (`services/api.ts:49-56`), printing
 * zero as fact without the `error` check. `limit=1`: 6KB vs 1KB, measured.
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
 * Accounts created in one rolling window, counted over an explicit date
 * range. `address/list/count/<days>` is not used: its buckets are whole UTC
 * days, so entry 0 is today since midnight and read 4 where the rolling day
 * held 9 (measured 2026-09-03).
 *
 * `windows` counts 24-hour windows back from now and must be at least 1;
 * clamped rather than trusted, because 0 would ask for an empty range and
 * report "no new accounts" as a fact.
 */
export const accountsCreatedInWindow = async (
  windows: number,
): Promise<number | undefined> => {
  const { startdate } = rollingWindow(Math.max(1, windows) - 1);
  const { enddate } = rollingWindow(0);
  const response = await api.get({
    route: 'address/list',
    query: { limit: 1, minify: true, startdate, enddate },
  });
  if (response?.error) return undefined;
  const total = response?.pagination?.totalRecords;
  return Number.isFinite(total) ? total : undefined;
};

/** The window ending now and the one before it, for the change line. */
export const accountsCreatedCall = async (): Promise<
  (number | undefined)[] | undefined
> => {
  const [today, yesterday] = await Promise.all([
    accountsCreatedInWindow(1),
    windowCountCall(1),
  ]);
  if (today === undefined && yesterday === undefined) return undefined;
  return [today, yesterday];
};

/** One window, offset back by whole windows. */
const windowCountCall = async (
  offsetWindows: number,
): Promise<number | undefined> => {
  const response = await api.get({
    route: 'address/list',
    query: { limit: 1, minify: true, ...rollingWindow(offsetWindows) },
  });
  if (response?.error) return undefined;
  const total = response?.pagination?.totalRecords;
  return Number.isFinite(total) ? total : undefined;
};

/* ----------------------------- badge sources ----------------------------- */

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
 * Every validator owner address, with the badge flags. Paged on item count:
 * `validator/list` silently caps a page at 100 whatever `limit` asks, and
 * one page beside `totalRecords: 208` reads as 2 genesis validators, not 21.
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
    if (validators.length === 0) return owners;

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
    // Without a usable count, a page the endpoint could not fill is the end of
    // the set; a full one is not, because complete and truncated look the same
    // from here, so it keeps asking until a short or empty page proves it.
    const complete =
      typeof total === 'number'
        ? collected >= total
        : validators.length < VALIDATOR_PAGE_SIZE;
    if (complete) return owners;
  }

  // The cap ran out with the set still unfinished: returning what was collected
  // would present a truncated map as the whole validator set.
  return undefined;
};

/** The moment the chain started. Fetched, not hardcoded: mainnet opened
 *  2022-07-01 and testnet 2025-02-07, so a baked-in value badges nothing. */
export const genesisTimestampCall = async (): Promise<number | undefined> => {
  const response = await api.get({ route: 'block/by-nonce/0' });
  if (response?.error) return undefined;
  const timestamp = response?.data?.block?.timestamp;
  // Normalised to ms here: the genesis window below goes to the API raw, and
  // a seconds value there returns nothing.
  return Number.isFinite(timestamp) ? toMilliseconds(timestamp) : undefined;
};

/* -------------------------------- filters -------------------------------- */

/** The values the type filter writes into the URL. */
export const ACCOUNT_FILTERS = ['foundation', 'genesisValidator'] as const;
export type AccountFilter = (typeof ACCOUNT_FILTERS)[number];

export const isAccountFilter = (value: unknown): value is AccountFilter =>
  typeof value === 'string' &&
  (ACCOUNT_FILTERS as readonly string[]).includes(value);

/** The next account lands minutes after genesis; a second costs nothing. */
const GENESIS_WINDOW_MS = 1000;
const GENESIS_PAGE_SIZE = 100;
const GENESIS_PAGE_CAP = 20;

/**
 * Every account created in the genesis block: 40 on mainnet, 22 on testnet.
 * The window is milliseconds only (in seconds it returns nothing), yet
 * matches the 21 rows serialising seconds: the API filters on stored values.
 */
export const genesisAccountsCall = async (
  genesisTimestamp: number,
): Promise<IAccount[] | undefined> => {
  const accounts: IAccount[] = [];
  let total: number | undefined;

  // Paged for the same reason as validator/list: one page of a capped
  // endpoint looks exactly like a complete answer.
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
    if (batch.length === 0) return accounts;
    accounts.push(...batch);

    total = response?.pagination?.totalRecords;
    // Same rule as the validator set above: a short page ends it, a full one
    // without a count does not.
    const complete =
      typeof total === 'number'
        ? accounts.length >= total
        : batch.length < GENESIS_PAGE_SIZE;
    if (complete) return accounts;
  }

  return undefined;
};
