import {
  defaultAggregateData,
  homeAccountsCall,
  homeActiveProposalsCall,
  homeBeforeYesterdayTransactionsCall,
  homeGetAggregateCall,
  homeGetBlocksCall,
  homeLastApprovedProposalCall,
  homeMostTransactedNFTs,
  homeMostTransactedTokens,
  homeNodes,
  homeProposalsCall,
  homeTotalActiveValidators,
  homeTotalValidators,
  homeTransactionsCall,
  homeYesterdayAccountsCall,
} from '@/services/requests/home';
import { IEpochInfo, ITransaction, Node } from '@/types';
import { IBlock } from '@/types/blocks';
import { IProposal, MostTransferedToken } from '@/types/proposals';
import { createContext, useContext } from 'react';
import { useQueries } from 'react-query';

export interface IDaysCoins {
  [coinName: string]: string | number;
}
export interface IHomeData {
  actualTPS: number;
  blocks?: IBlock[];
  metrics: IEpochInfo;
  newTransactions: number;
  beforeYesterdayTransactions?: number;
  newAccounts?: number;
  totalAccounts?: number;
  transactions: ITransaction[];
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
  mostTransactedTokens: MostTransferedToken[];
  mostTransactedNFTs: MostTransferedToken[];
}

export const HomeData = createContext({} as IHomeData);

export const HomeDataProvider: React.FC = ({ children }) => {
  const watcherTimeout = 4 * 1000; // 4 secs

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
  ]);

  const values: IHomeData = {
    actualTPS:
      aggregateResult.data?.actualTPS || defaultAggregateData.actualTPS,
    blocks: aggregateResult.data?.blocks,
    metrics: aggregateResult.data?.metrics || defaultAggregateData.metrics,
    newTransactions:
      beforeYesterdayTransactionsResult.data?.newTransactions || 0,
    beforeYesterdayTransactions:
      beforeYesterdayTransactionsResult.data?.beforeYesterdayTxs,
    newAccounts: yesterdayAccountResult.data?.newAccounts,
    totalAccounts: accountResult.data?.totalAccounts,
    transactions: aggregateResult.data?.transactions || [],
    totalTransactions: transactionsResult.data?.totalTransactions,
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
  };

  return <HomeData.Provider value={values}>{children}</HomeData.Provider>;
};

export const useHomeData = (): IHomeData => useContext(HomeData);
