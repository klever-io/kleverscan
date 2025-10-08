import api from '@/services/api';
import {
  HotContracts,
  SmartContractsList,
  SmartContractTransactionData,
} from '@/types/smart-contract';
import { NextParsedUrlQuery } from 'next/dist/server/request-meta';

const smartContractsListCall = async (): Promise<
  { smartContracts: SmartContractsList[] } | undefined
> => {
  try {
    const smartContractsRes = await api.get({
      route: 'sc/list',
    });

    if (!smartContractsRes.error || smartContractsRes.error === '') {
      return { smartContracts: smartContractsRes.data.sc };
    }
  } catch (error) {
    console.error(error);
  }
};

const smartContractsTableRequest = async (
  page: number,
  limit: number,
  query: NextParsedUrlQuery,
) => {
  try {
    const parsedQuery = {
      deployer: query?.deployer || undefined,
      sortBy: query?.sortBy || 'totalTransactions',
      orderBy: query?.orderBy || 'desc',
      page,
      limit,
    };

    !query?.deployer && delete parsedQuery.deployer;

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

const smartContractsTotalContractsCall = async () => {
  try {
    const res = await api.get({
      route: 'sc/list',
    });

    if (!res.error || res.error === '') {
      return res.pagination.totalRecords;
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
      },
    });

    if (!res.error || res.error === '') {
      return res.pagination.totalRecords;
    }
  } catch (error) {
    console.error(error);
  }
};

const scInvokesTotalRecordsCall = async (address: string) => {
  try {
    const res = await api.get({
      route: `sc/invokes/${address}`,
    });

    if (!res.error || res.error === '') {
      return res.pagination.totalRecords;
    }
  } catch (error) {
    console.error(error);
  }
};

const smartContractsBeforeYesterdayTransactionsCall = async (): Promise<
  { newTransactions: number; beforeYesterdayTxs: number } | undefined
> => {
  try {
    const res = await api.get({
      route: 'transaction/list/count/2',
      query: {
        type: 63, // Smart Contract Transactions
      },
    });

    if (!res.error || res.error === '') {
      const data = {
        newTransactions: 0,
        beforeYesterdayTxs: res.data?.number_by_day[1]?.doc_count || 0,
      };
      if (res.data?.number_by_day?.length > 0) {
        data.newTransactions = res.data?.number_by_day[0]?.doc_count || 0;
      }
      return data;
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
        startDate: '-24h',
      },
    });

    if (!res.error || res.error === '') {
      const data = {
        newTransactions: 0,
        beforeYesterdayTxs: res.data?.number_by_day[1]?.doc_count || 0,
      };
      if (res.data?.number_by_day?.length > 0) {
        data.newTransactions = res.data?.number_by_day[0]?.doc_count || 0;
      }
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
      route: `transaction/${txHash}?withResults=true`,
    });

    if (!res.error || res.error === '') {
      return { transaction: res.data.transaction };
    }
  } catch (error) {
    console.error(error);
  }
};

export {
  scInvokesTotalRecordsCall,
  smartContractBeforeYesterdayTransactionsCall,
  smartContractsBeforeYesterdayTransactionsCall,
  smartContractsListCall,
  smartContractsStatisticCall,
  smartContractsTableRequest,
  smartContractsTotalContractsCall,
  smartContractTotalTransactionsListCall,
  smartContractTransactionDetailsCall,
};
