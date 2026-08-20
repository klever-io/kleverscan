import api from '@/services/api';
import { ITransaction, ITransactionsResponse } from '@/types';
import {
  PRECISION_TOAST_ID,
  getParsedTransactionPrecision,
} from '@/utils/precisionFunctions';
import { toast } from 'react-toastify';

type RouterQuery = Record<string, string | string[] | undefined>;

/**
 * The only params forwarded to the API, written by the filter bar above this
 * table: TransactionsFilters writes asset, status, type and buyType, DateFilter
 * writes startdate and enddate.
 *
 * An allowlist rather than a denylist so the request carries filters only. This
 * page keeps its tab and card state in the URL as well, and forwarding those
 * would hand the API this table's view state as if it were a filter. A repeated
 * param (?status=a&status=b) arrives as an array, which the filter bar never
 * writes, so it is skipped rather than joined into a single value.
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
      query[key] = value;
    }
  });

  // A spoofed blockNum, page or limit in the URL is already dropped by the
  // allowlist above, never having entered `query`. These three come from the
  // function arguments instead; writing them last is defence in depth only.
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
    //
    // Those rows then render at the KLV default of 6, so say so: without a
    // signal the amounts look authoritative while being wrong for any asset
    // with another precision.
    //
    // Shares its id with the lookup's own toast, which already fires on the
    // common path. That keeps it to one message either way: this one only
    // becomes visible on the paths that stay quiet, such as a corrupt
    // localStorage cache.
    console.error(error);
    toast.error('Amounts may be inaccurate: asset precisions failed to load', {
      toastId: PRECISION_TOAST_ID,
    });
  }

  return {
    ...transactionsResponse,
    data: {
      transactions:
        parsedTransactions ?? transactionsResponse.data?.transactions ?? [],
    },
  };
};
