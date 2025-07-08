import {
  smartContractsListCall,
  smartContractsStatisticCall,
  smartContractsTotalContractsCall,
  smartContractTotalTransactionsListCall,
  smartContractsBeforeYesterdayTransactionsCall,
} from '@/services/requests/smartContracts';
import { HotContracts, SmartContractsList } from '@/types/smart-contract';
import { createContext, PropsWithChildren, useContext } from 'react';
import { useQueries } from 'react-query';

const isDev = process.env.NODE_ENV === 'development';

export interface ISmartContractData {
  smartContractsStatistic?: HotContracts[];
  smartContractsList?: SmartContractsList[];
  smartContractTotalContracts?: number;
  smartContractsTotalTransactions?: number;
  beforeYesterdayTransactions?: number;
}

export const SmartContractData = createContext({} as ISmartContractData);

export const SmartContractDataProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const watcherTimeout = isDev ? 100000 : 4 * 1000;

  const [
    smartContractsStatisticResult,
    smartContractsListResult,
    smartContractTotalContractsResult,
    smartContractTotalTransactionsResult,
    smartContractsBeforeYesterdayTransactionsResult,
  ] = useQueries([
    {
      queryKey: ['smartContractsStatistic'],
      queryFn: smartContractsStatisticCall,
      refetchInterval: watcherTimeout,
    },
    {
      queryKey: ['smartContractsList'],
      queryFn: smartContractsListCall,
      refetchInterval: watcherTimeout,
    },
    {
      queryKey: ['smartContractsTotalContracts'],
      queryFn: smartContractsTotalContractsCall,
      refetchInterval: watcherTimeout,
    },
    {
      queryKey: ['smartContractsTotalTransactions'],
      queryFn: smartContractTotalTransactionsListCall,
      refetchInterval: watcherTimeout,
    },
    {
      queryKey: ['smartContractsBeforeYesterdayTransactionsResult'],
      queryFn: smartContractsBeforeYesterdayTransactionsCall,
      refetchInterval: watcherTimeout,
    },
  ]);

  const smartContractData: ISmartContractData = {
    smartContractsStatistic:
      smartContractsStatisticResult.data?.statistics || [],
    smartContractsList: smartContractsListResult.data?.smartContracts || [],
    smartContractTotalContracts: smartContractTotalContractsResult.data || 0,
    beforeYesterdayTransactions:
      smartContractsBeforeYesterdayTransactionsResult.data
        ?.beforeYesterdayTxs || 0,
    smartContractsTotalTransactions:
      smartContractTotalTransactionsResult.data || 0,
  };

  return (
    <SmartContractData.Provider value={smartContractData}>
      {children}
    </SmartContractData.Provider>
  );
};

export const useSmartContractData = (): ISmartContractData => {
  return useContext(SmartContractData);
};
