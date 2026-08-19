import api from '@/services/api';
import { ITransaction, ITransactionsResponse } from '@/types';
import { getParsedTransactionPrecision } from '@/utils/precisionFunctions';

type RouterQuery = Record<string, string | string[] | undefined>;

/**
 * The only params forwarded to the API, written by the filter bar above this
 * table: TransactionsFilters writes asset, status, type and buyType, DateFilter
 * writes startdate and enddate.
 *
 * An allowlist rather than a denylist because `buildUrlQuery` interpolates
 * values into the query string unescaped, so anything reaching it from the URL
 * can inject further params. A repeated param (?status=a&status=b) arrives as
 * an array and is skipped for the same reason.
 */
const FILTER_PARAMS = [
  'asset',
  'status',
  'type',
  'buyType',
  'startdate',
  'enddate',
];

/**
 * Transactions of a single block, with each asset's precision resolved.
 *
 * The filters rendered above this table write to `router.query`, so the query
 * is forwarded rather than rebuilt from the block number alone; otherwise the
 * filter bar changes the URL and refetches without ever filtering anything.
 */
export const blockTransactionsCall = async (
  blockNum: number,
  page: number,
  limit: number,
  routerQuery: RouterQuery = {},
): Promise<ITransactionsResponse> => {
  const query: Record<string, unknown> = {};

  FILTER_PARAMS.forEach(key => {
    const value = routerQuery[key];
    if (typeof value === 'string' && value !== '') {
      query[key] = encodeURIComponent(value);
    }
  });

  // The block being viewed and the table's own paging are set last so they
  // cannot be overridden by a filter of the same name.
  query.blockNum = blockNum;
  query.page = page;
  query.limit = limit;

  const transactionsResponse = await api.get({
    route: 'transaction/list',
    query,
  });

  // The list endpoint omits each asset's precision, so it is resolved here and
  // attached to every transaction. Without it the row sections fall back to
  // the KLV default of 6 and misreport every asset with another precision.
  let parsedTransactions: ITransaction[] | undefined;
  try {
    parsedTransactions =
      await getParsedTransactionPrecision(transactionsResponse);
  } catch (error) {
    // The precision lookup throws on its own failures. Keep the rows that the
    // list request already returned rather than reporting a block with
    // transactions as empty, which is indistinguishable from one without.
    console.error(error);
  }

  return {
    ...transactionsResponse,
    data: {
      transactions:
        parsedTransactions ?? transactionsResponse.data?.transactions ?? [],
    },
  };
};
