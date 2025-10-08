import {
  defaultAggregateData,
  homeAccountsCall,
  homeActiveProposalsCall,
  homeBeforeYesterdayTransactionsCall,
  homeGetAggregateCall,
  homeMostTransactedKDAFee,
  homeMostTransactedNFTs,
  homeMostTransactedTokens,
  homeNodes,
  homeProposalsCall,
  homeTransactionsCall,
  homeYesterdayAccountsCall,
  homeHotContracts,
} from '@/services/requests/home';
import { IEpochInfo, ITransaction, Node } from '@/types';
import { IBlock } from '@/types/blocks';
import { IProposal, MostTransferredToken } from '@/types/proposals';
import { createContext, PropsWithChildren, useContext, useRef } from 'react';
import { useQueries } from 'react-query';
import { getNetwork } from '@/utils/networkFunctions';

const isDev = process.env.NODE_ENV === 'development';

export interface IDaysCoins {
  [coinName: string]: string | number;
}
export interface IHomeData {
  livePeakTPS: string;
  blocks?: IBlock[];
  metrics: IEpochInfo;
  newTransactions: number;
  beforeYesterdayTransactions?: number;
  newAccounts?: number;
  totalAccounts?: number;
  transactions: ITransaction[];
  loadingTransactions?: boolean;
  totalTransactions?: number;
  loadingCards: boolean;
  loadingBlocks: boolean;
  totalProposals?: number;
  activeProposalsCount?: number;
  activeProposals?: IProposal[];
  totalValidators?: number;
  activeValidators?: number;
  lastApprovedProposal?: IProposal;
  nodes?: Node[];
  mostTransactedTokens: MostTransferredToken[];
  mostTransactedNFTs: MostTransferredToken[];
  mostTransactedKDAFee: MostTransferredToken[];
  hotContracts: MostTransferredToken[];
  epoch?: number;
  loadingMostTransacted?: boolean;
}

export const HomeData = createContext({} as IHomeData);

export const HomeDataProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const watcherTimeout = isDev ? 100000 : 4 * 1000; // 4 secs
  const network = getNetwork();

  const [
    aggregateResult,
    accountResult,
    yesterdayAccountResult,
    transactionsResult,
    beforeYesterdayTransactionsResult,
    proposalsResult,
    activeProposalsResult,
    nodes,
    mostTransactedTokens,
    mostTransactedNFTs,
    mostTransactedKDAFee,
    hotContracts,
  ] = useQueries([
    {
      queryKey: 'aggregateData',
      queryFn: homeGetAggregateCall,
      refetchInterval: watcherTimeout,
    },
    {
      queryKey: 'accountsData',
      queryFn: homeAccountsCall,
      refetchInterval: watcherTimeout,
    },
    {
      queryKey: 'yesterdayAccountsData',
      queryFn: homeYesterdayAccountsCall,
      refetchInterval: watcherTimeout,
    },
    {
      queryKey: 'transactionsData',
      queryFn: homeTransactionsCall,
      refetchInterval: watcherTimeout,
    },
    {
      queryKey: 'beforeYesterdayTransactionData',
      queryFn: homeBeforeYesterdayTransactionsCall,
      refetchInterval: watcherTimeout,
    },
    {
      queryKey: 'proposalsData',
      queryFn: homeProposalsCall,
      refetchInterval: watcherTimeout,
    },
    {
      queryKey: 'activeProposalsData',
      queryFn: homeActiveProposalsCall,
      refetchInterval: watcherTimeout,
    },
    {
      queryKey: 'nodesData',
      queryFn: homeNodes,
      refetchInterval: watcherTimeout,
    },
    {
      queryKey: 'mostTransactedTokens',
      queryFn: homeMostTransactedTokens,
      refetchInterval: watcherTimeout,
    },
    {
      queryKey: 'mostTransactedNFTs',
      queryFn: homeMostTransactedNFTs,
      refetchInterval: watcherTimeout,
    },
    {
      queryKey: 'mostTransactedKDAFee',
      queryFn: homeMostTransactedKDAFee,
      refetchInterval: watcherTimeout,
    },
    {
      queryKey: 'hotContracts',
      queryFn: homeHotContracts,
      refetchInterval: watcherTimeout,
      enabled: network !== 'Mainnet',
    },
  ]);

  const prevValuesRef = useRef({
    totalAccounts: 0,
    totalTransactions: 0,
    metrics: defaultAggregateData.metrics,
  });

  const values: IHomeData = {
    livePeakTPS:
      aggregateResult.data?.livePeakTPS || defaultAggregateData.livePeakTPS,
    blocks: aggregateResult.data?.blocks,
    metrics:
      aggregateResult.data?.metrics?.currentSlot &&
      aggregateResult.data?.metrics?.currentSlot !== 0 &&
      aggregateResult.data?.metrics?.epochFinishSlot >=
        prevValuesRef.current.metrics.epochFinishSlot
        ? aggregateResult.data.metrics
        : prevValuesRef.current.metrics,
    newTransactions:
      beforeYesterdayTransactionsResult.data?.newTransactions || 0,
    beforeYesterdayTransactions:
      beforeYesterdayTransactionsResult.data?.beforeYesterdayTxs,
    newAccounts: yesterdayAccountResult.data?.newAccounts,
    totalAccounts:
      (accountResult.data?.totalAccounts || 0) >
      prevValuesRef.current.totalAccounts
        ? accountResult.data?.totalAccounts
        : prevValuesRef.current.totalAccounts,
    transactions: aggregateResult.data?.transactions || [],
    loadingTransactions: transactionsResult.isLoading,
    totalTransactions:
      (transactionsResult.data?.totalTransactions || 0) >
      prevValuesRef.current.totalTransactions
        ? transactionsResult.data?.totalTransactions
        : prevValuesRef.current.totalTransactions,
    loadingCards: accountResult.isLoading,
    loadingBlocks: aggregateResult.isLoading,
    totalProposals: proposalsResult.data?.totalProposals,
    activeProposalsCount: activeProposalsResult.data?.totalActiveProposals,
    activeProposals: activeProposalsResult.data?.activeProposals,
    totalValidators: aggregateResult.data?.validatorStatistics.total,
    activeValidators: aggregateResult.data?.validatorStatistics.active,
    lastApprovedProposal: aggregateResult.data?.proposalStatistics.lastProposal,
    nodes: nodes.data?.nodes,
    mostTransactedTokens: mostTransactedTokens.data || [],
    mostTransactedNFTs: mostTransactedNFTs.data || [],
    mostTransactedKDAFee: mostTransactedKDAFee.data || [],
    epoch: aggregateResult.data?.overview?.epochNumber,
    hotContracts:
      network !== 'Mainnet' ? hotContracts.data?.hotContracts || [] : [],
    loadingMostTransacted:
      mostTransactedTokens.isLoading ||
      mostTransactedNFTs.isLoading ||
      mostTransactedKDAFee.isLoading ||
      (network !== 'Mainnet' ? hotContracts.isLoading : false),
  };

  prevValuesRef.current = {
    totalAccounts: values.totalAccounts || 0,
    totalTransactions: values.totalTransactions || 0,
    metrics: values.metrics,
  };

  return <HomeData.Provider value={values}>{children}</HomeData.Provider>;
};

export const useHomeData = (): IHomeData => useContext(HomeData);
