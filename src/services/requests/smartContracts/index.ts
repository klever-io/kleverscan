import api from '@/services/api';
import { HotContracts, SmartContractsList } from '@/types/smart-contract';

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

export {
  smartContractsListCall,
  smartContractsStatisticCall,
  smartContractsTotalContractsCall,
  smartContractTotalTransactionsListCall,
  scInvokesTotalRecordsCall,
  smartContractsBeforeYesterdayTransactionsCall,
};
