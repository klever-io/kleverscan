import api from '@/services/api';
import {
  IPaginatedResponse,
  ITransaction,
  ITransactionsResponse,
} from '@/types';
import { IBlock } from '@/types/blocks';
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

/* ------------------------------ blocks list ------------------------------ */

export interface IBlocksListResponse extends IPaginatedResponse {
  data: {
    blocks: IBlock[];
  };
}

export interface IBlockDayStats {
  date: number;
  totalBlocks: number;
  totalMinted: number;
  totalBurned: number;
  totalBlockRewards: number;
  totalStakingRewards: number;
  totalTxFees: number;
  totalKappsFees: number;
  totalTxRewards: number;
}

export interface IBlockTotalStats {
  totalBlocks: number;
  totalBurned: number;
  totalBlockRewards: number;
}

/** Of the five params `block/list` documents, the date range is the only one
 *  the URL may contribute; the rest arrive as arguments or are fixed below. */
const LIST_FILTER_PARAMS = ['startdate', 'enddate'];

/**
 * A bad date is dropped, not forwarded: the endpoint answers 500 with an
 * Elasticsearch stack trace rather than an empty list. Digits only, because
 * `Number()` accepts shapes the endpoint crashes on: `1e12` and `" 123 "` both
 * parse here and both 500 there. The ceiling is one the endpoint accepts (it
 * parses to int64) and the last this side compares without losing digits.
 */
const isEpochMillis = (value: string): boolean =>
  /^\d+$/.test(value) && Number(value) <= Number.MAX_SAFE_INTEGER;

/** The tiles dereference these without their own guards, so a well-formed
 *  answer missing one would crash the page render or print "NaN KLV". */
const hasFiniteFields = (value: unknown, fields: string[]): boolean =>
  typeof value === 'object' &&
  value !== null &&
  fields.every(field =>
    Number.isFinite((value as Record<string, unknown>)[field]),
  );

/**
 * One page of the block list.
 *
 * No `minify=true` here, though it would cut the response from 57 859 bytes to
 * 7 034. It does not only drop fields: it zeroes `size`, `sizeTxs`,
 * `virtualBlockSize` and `slot`, and `size` is one of the eleven fields a row
 * reads. Checked field by field across 40 blocks; `size` is the only one of the
 * eleven affected.
 */
export const blockListCall = async (
  page: number,
  limit: number,
  routerQuery: RouterQuery = {},
): Promise<IBlocksListResponse> => {
  const query: Record<string, unknown> = {};

  LIST_FILTER_PARAMS.forEach(key => {
    const value = routerQuery[key];
    if (typeof value === 'string' && isEpochMillis(value)) {
      query[key] = value;
    }
  });

  // After the allowlist, so a page or limit in the URL cannot override the
  // arguments, which `normalizePageParam` has already clamped.
  query.page = page;
  query.limit = limit;

  return api.get({ route: 'block/list', query });
};

/**
 * Yesterday as a closed calendar day, or undefined on failure.
 *
 * Entry `[1]`, not `[0]`: `[0]` counts from midnight UTC, so at 01:00 it holds
 * one hour of blocks under a label saying 24. Measured on mainnet, it grew by
 * the same 23 blocks as the cumulative counter over 93 seconds.
 */
export const blockYesterdayStatsCall = async (): Promise<
  IBlockDayStats | undefined
> => {
  const response = await api.get({ route: 'block/statistics-by-day/1' });
  if (response?.error) return undefined;

  const days = response?.data?.block_stats_by_day;
  if (!Array.isArray(days)) return undefined;

  const yesterday = days[1];
  // Only the fields the tiles render bare; feeSplit hardens the fee fields
  // itself, one by one.
  if (!hasFiniteFields(yesterday, ['totalBlocks', 'totalBurned'])) {
    return undefined;
  }
  return yesterday;
};

/**
 * Midnight UTC that opened yesterday, the key its bucket carries.
 *
 * Milliseconds, matching the route: measured 2026-09-03 the keys came back as
 * 1788393600000 and 1788307200000, 13 digits, which is 2026-09-03 and
 * 2026-09-02 at 00:00 UTC. They come from an Elasticsearch date_histogram,
 * whose bucket key is epoch milliseconds by definition rather than by the
 * proxy's choice. Worth pinning because `genesisTimestampCall` below has to
 * normalise a seconds value, so both units occur in this API.
 */
const yesterdayKeyMs = (now: number = Date.now()): number => {
  const midnight = new Date(now);
  midnight.setUTCHours(0, 0, 0, 0);
  return midnight.getTime() - 24 * 60 * 60 * 1000;
};

/**
 * Transactions over yesterday as a closed calendar day, matching the window
 * the other tiles on this page report.
 *
 * Matched on the bucket's own key rather than read at position 1: the route
 * omits a day that carried no data, which would slide an older day into that
 * position and report it as yesterday.
 */
export const blockYesterdayTransactionsCall = async (): Promise<
  number | undefined
> => {
  const response = await api.get({
    route: 'transaction/list/histogram/2',
  });
  if (response?.error) return undefined;

  const days = response?.data?.number_by_day;
  if (!Array.isArray(days)) return undefined;

  const wanted = yesterdayKeyMs();
  const bucket = days.find(day => day?.key === wanted);
  return Number.isFinite(bucket?.doc_count) ? bucket.doc_count : undefined;
};

/** Cumulative since genesis, or undefined on failure. */
export const blockTotalStatsCall = async (): Promise<
  IBlockTotalStats | undefined
> => {
  const response = await api.get({ route: 'block/statistics-total/0' });
  if (response?.error) return undefined;

  const total = response?.data?.block_stats_total;
  if (!hasFiniteFields(total, ['totalBlocks', 'totalBurned'])) {
    return undefined;
  }
  return total;
};
