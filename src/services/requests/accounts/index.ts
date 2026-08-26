import api from '@/services/api';
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

  // Written after the allowlist, so a page or limit in the URL cannot reach
  // the API through this path: these two come from the arguments, which is
  // what the table controls.
  query.page = page;
  query.limit = limit;

  return api.get({ route: 'address/list', query });
};

/**
 * Total number of accounts on chain.
 *
 * `limit=1` because only `pagination.totalRecords` is read. Without it the
 * endpoint answers with ten full account objects, permission arrays included,
 * for a single number: 6KB against 1KB, measured against mainnet.
 */
export const accountsTotalCall = async (): Promise<IPaginatedResponse> =>
  api.get({ route: 'address/list', query: { limit: 1 } });

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
): Promise<IYesterdayResponse> =>
  api.get({ route: `address/list/count/${days}` });
