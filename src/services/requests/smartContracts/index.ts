import api from '@/services/api';
import { rollingWindow } from '@/services/requests/rollingWindow';
import {
  HotContracts,
  SmartContractTransactionData,
} from '@/types/smart-contract';
import { NextParsedUrlQuery } from 'next/dist/server/request-meta';

const smartContractsListCall = async (): Promise<
  { totalContracts: number } | undefined
> => {
  try {
    const smartContractsRes = await api.get({
      route: 'sc/list',
      // Only the record count is used downstream; the rows were fetched and
      // thrown away on every one of these calls.
      query: { limit: 1 },
    });

    if (!smartContractsRes.error || smartContractsRes.error === '') {
      const total = smartContractsRes.pagination?.totalRecords;
      // A null or absent count on a 200 must not render as "0 contracts
      // deployed"; undefined leaves the tile out instead.
      return Number.isFinite(total) ? { totalContracts: total } : undefined;
    }
  } catch (error) {
    console.error(error);
  }
};

/**
 * What narrows this list, named rather than inherited. An allowlist so the
 * request carries filters only: the page keeps other state in the URL, and
 * forwarding that would hand the API this table's view state as if it were a
 * filter. A repeated param (?sortBy=a&sortBy=b) arrives as an array, which the
 * filter bar never writes, so it is skipped rather than joined.
 *
 * The server coerces two of these anyway (baseSmartContractGroup.go): anything
 * but `totalTransactions` sorts by timestamp, anything but `asc` orders
 * descending, and neither returns an error. Sending only what the bar writes
 * keeps that silent fallback from being reached in the first place.
 */
const FILTER_PARAMS = ['deployer', 'sortBy', 'orderBy'];

const smartContractsTableRequest = async (
  page: number,
  limit: number,
  query: NextParsedUrlQuery,
) => {
  try {
    const parsedQuery: Record<string, unknown> = {
      sortBy: 'totalTransactions',
      orderBy: 'desc',
    };

    FILTER_PARAMS.forEach(key => {
      const value = query?.[key];
      if (typeof value === 'string' && value !== '') {
        parsedQuery[key] = value;
      }
    });

    // Last, so a spoofed page or limit in the URL cannot reach the API through
    // the allowlist above; they come from the caller's arguments instead.
    parsedQuery.page = page;
    parsedQuery.limit = limit;

    const smartContractsListRes = await api.get({
      route: 'sc/list',
      query: parsedQuery,
    });
    if (!smartContractsListRes.error) {
      return smartContractsListRes;
    } else {
      throw new Error(smartContractsListRes.error);
    }
  } catch (error) {
    console.error('Error fetching smart contracts list:', error);
    throw error;
  }
};

/**
 * Every successful contract transaction ever, which is the denominator the
 * share figures divide by. The same basis as the numerators: `sc/statistics`
 * counts successful type-63 transactions only, and the two bases partition
 * cleanly on mainnet (466.863 success + 3.311 fail = 470.174 total, measured).
 */
const successfulContractTransactionsCall = async (): Promise<
  number | undefined
> => {
  try {
    const res = await api.get({
      route: 'transaction/list',
      query: {
        type: 63, // Smart Contract Transactions
        status: 'success',
        // Only `totalRecords` is read.
        limit: 1,
      },
    });

    if (!res.error || res.error === '') {
      const total = res.pagination?.totalRecords;
      // Same null-on-200 payload as the sibling call below; undefined lets
      // shareModel refuse the denominator instead of it failing silently.
      return Number.isFinite(total) ? total : undefined;
    }
  } catch (error) {
    console.error(error);
  }
};

/**
 * The most-used figures as one bundle: the top-ten aggregation and the
 * all-time denominator its shares divide by. One call because the summary bar
 * and the podium cards both need both, under one query key, so the two
 * surfaces can never show a share computed against different bases.
 */
const contractActivitySharesCall = async (): Promise<{
  statistics: HotContracts[];
  allSuccessful?: number;
}> => {
  const [statistics, allSuccessful] = await Promise.all([
    smartContractsStatisticCall(),
    successfulContractTransactionsCall(),
  ]);
  // Reject rather than resolve undefined: a resolved bundle is a success to
  // react-query, which then caches "no statistics" for the full staleTime and
  // never retries, and the podium renders that failure as the fact "no
  // contract activity has been recorded yet". A rejection keeps retry and
  // isError available. The denominator may still be absent; the share labels
  // are simply left out then.
  if (statistics === undefined) {
    throw new Error('sc/statistics gave no statistics');
  }
  return { statistics: statistics.statistics, allSuccessful };
};

const smartContractsStatisticCall = async (): Promise<
  { statistics: HotContracts[] } | undefined
> => {
  try {
    const statisticsRes = await api.get({
      route: 'sc/statistics',
    });

    if (!statisticsRes.error || statisticsRes.error === '') {
      return { statistics: statisticsRes.data };
    }
  } catch (error) {
    console.error(error);
  }
};

const smartContractTotalTransactionsListCall = async (): Promise<
  number | undefined
> => {
  try {
    const res = await api.get({
      route: 'transaction/list',
      query: {
        type: 63, // Smart Contract Transactions
        // Only `totalRecords` is read. Measured: the unlimited call ships
        // 30.801 bytes for that one number, `limit=1` ships 3.572.
        limit: 1,
      },
    });

    if (!res.error || res.error === '') {
      const total = res.pagination?.totalRecords;
      // A null here survives the `!== undefined` gate upstream and would then
      // throw on toLocaleString in the middle of a render (the same payload
      // is documented on this route in transactions/summary.ts).
      return Number.isFinite(total) ? total : undefined;
    }
  } catch (error) {
    console.error(error);
  }
};

/**
 * Contract transactions over the rolling 24 hours ending now.
 *
 * Counted over an explicit date range rather than off
 * `transaction/list/count/1`, whose bucket is a whole UTC day: measured
 * 2026-09-03 that bucket read 1342 where the rolling day held 3059.
 * `transaction/statistics/24h` is not the answer either, since it ignores
 * `type` and would report the chain-wide total instead.
 */
const contractTransactions24hCall = async (): Promise<
  { last24h: number } | undefined
> => {
  try {
    const res = await api.get({
      route: 'transaction/list',
      query: {
        limit: 1,
        minify: true,
        type: 63, // Smart Contract Transactions
        ...rollingWindow(),
      },
    });

    if (!res.error || res.error === '') {
      const count = res.pagination?.totalRecords;
      // A null survives an `!== undefined` check and would throw on
      // toLocaleString mid-render, so only a finite count travels on.
      return Number.isFinite(count) ? { last24h: count } : undefined;
    }
  } catch (error) {
    console.error(error);
  }
};

/**
 * Contracts that ran at least once in the rolling 24 hours, against the 211
 * ever deployed: 16 of them on 2026-09-03, which is what the tile is for.
 * Read off the same route the totals come from, so the figure and the window
 * cannot drift apart.
 */
const activeContracts24hCall = async (): Promise<number | undefined> => {
  try {
    // Caught like every sibling here: api.get resolves its own error object,
    // but an unreadable body rejects, and the card gathers these with
    // Promise.all, so one rejection would take the whole strip down.
    const res = await api.get({ route: 'sc/statistics/24h' });
    if (res?.error) return undefined;
    const active = res?.data?.activeContracts;
    return Number.isFinite(active) ? active : undefined;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

const smartContractBeforeYesterdayTransactionsCall = async (
  scAddress: string,
): Promise<
  { newTransactions: number; beforeYesterdayTxs: number } | undefined
> => {
  try {
    const res = await api.get({
      route: 'transaction/list/',
      query: {
        scAddress: scAddress,
        startdate: new Date(
          Number(Date.now()) - 24 * 60 * 60 * 1000,
        ).toISOString(), // Transactions from the last day
      },
    });

    if (!res.error || res.error === '') {
      const data = {
        newTransactions: 0,
        beforeYesterdayTxs: res.pagination?.totalRecords || 0,
      };
      return data;
    }
  } catch (error) {
    console.error(error);
  }
};

const smartContractTransactionDetailsCall = async (
  txHash: string,
): Promise<{ transaction: SmartContractTransactionData } | undefined> => {
  try {
    const res = await api.get({
      route: `transaction/${encodeURIComponent(txHash)}`,
      query: { withResults: true },
    });

    if (!res.error || res.error === '') {
      return { transaction: res.data.transaction };
    }
  } catch (error) {
    console.error(error);
  }
};

export {
  contractActivitySharesCall,
  smartContractBeforeYesterdayTransactionsCall,
  activeContracts24hCall,
  contractTransactions24hCall,
  smartContractsListCall,
  smartContractsStatisticCall,
  smartContractsTableRequest,
  smartContractTotalTransactionsListCall,
  smartContractTransactionDetailsCall,
};
