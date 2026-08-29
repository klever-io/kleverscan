import api from '@/services/api';
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
      return {
        totalContracts: smartContractsRes.pagination?.totalRecords || 0,
      };
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

const smartContractTotalTransactionsListCall = async () => {
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
      return res.pagination.totalRecords;
    }
  } catch (error) {
    console.error(error);
  }
};

/**
 * Contract transactions in the last 24 hours and the 24 hours before that.
 *
 * The endpoint's buckets are rolling windows anchored at the request, not
 * calendar days: `countDaysQuery` in the proxy builds ranges of `now-1d..now`
 * and `now-2d..now-1d`. Both windows are therefore complete, which is what
 * makes comparing them fair at any time of day. The old name of this call
 * said "before yesterday", which the endpoint never measured.
 */
const contractTransactions24hCall = async (): Promise<
  { last24h: number; previous24h: number } | undefined
> => {
  try {
    const res = await api.get({
      route: 'transaction/list/count/2',
      query: {
        type: 63, // Smart Contract Transactions
      },
    });

    if (!res.error || res.error === '') {
      return {
        last24h: res.data?.number_by_day?.[0]?.doc_count || 0,
        previous24h: res.data?.number_by_day?.[1]?.doc_count || 0,
      };
    }
  } catch (error) {
    console.error(error);
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
  smartContractBeforeYesterdayTransactionsCall,
  contractTransactions24hCall,
  smartContractsListCall,
  smartContractsStatisticCall,
  smartContractsTableRequest,
  smartContractTotalTransactionsListCall,
  smartContractTransactionDetailsCall,
};
