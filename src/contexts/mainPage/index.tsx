import {
  defaultAggregateData,
  homeAccountsCall,
  homeGetAggregateCall,
  homeHotContracts,
  homeMostTransactedAggregate,
  homeNodes,
  homeNewAccountsCall,
  homeNewTransactionsCall,
} from '@/services/requests/home';
import { IEpochInfo, ITransaction, Node } from '@/types';
import { IBlock } from '@/types/blocks';
import { IProposal, MostTransferredToken } from '@/types/proposals';
import { isKVMAvailable } from '@/utils/kvm';
import { getNetwork } from '@/utils/networkFunctions';
import { createContext, PropsWithChildren, useContext, useRef } from 'react';
import { useQueries } from '@tanstack/react-query';

export interface IDaysCoins {
  [coinName: string]: 1 | 30 | 180;
}
export interface IHomeData {
  livePeakTPS: string;
  blocks?: IBlock[];
  metrics: IEpochInfo;
  newTransactions: number;
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

export const homeDefaultInterval = 10 * 1000; // 10 secs - Base/Real-time data
const accountsInterval = 15 * 1000; // 15 secs - Account data (moderate changes)
const statisticsInterval = 30 * 1000; // 30 secs - Statistics/analytics (slow changes)
const nodesInterval = 60 * 1000; // 60 secs - Node locations (rare changes)

export const HomeData = createContext({} as IHomeData);

export const HomeDataProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const network = getNetwork();

  // Positional: the order here must match the `queries` array below.
  const [
    aggregateResult,
    accountResult,
    newAccountsResult,
    newTransactionsResult,
    nodes,
    mostTransactedAggregate,
    hotContracts,
  ] = useQueries({
    queries: [
      {
        queryKey: ['aggregateData'],
        queryFn: homeGetAggregateCall,
        refetchInterval: homeDefaultInterval,
      },
      {
        queryKey: ['accountsData'],
        queryFn: homeAccountsCall,
        refetchInterval: accountsInterval,
      },
      {
        queryKey: ['newAccountsData'],
        queryFn: homeNewAccountsCall,
        refetchInterval: accountsInterval,
      },
      {
        // Its own query rather than a field of node/aggregate, whose counts
        // are whole UTC days: the card labels this figure "/24h".
        queryKey: ['newTransactionsData'],
        queryFn: homeNewTransactionsCall,
        refetchInterval: accountsInterval,
      },
      {
        queryKey: ['nodesData'],
        queryFn: homeNodes,
        refetchInterval: nodesInterval,
      },
      {
        queryKey: ['mostTransactedAggregate'],
        queryFn: homeMostTransactedAggregate,
        refetchInterval: statisticsInterval,
      },
      {
        queryKey: ['hotContracts'],
        queryFn: homeHotContracts,
        refetchInterval: statisticsInterval,
        enabled: isKVMAvailable(network),
      },
    ],
  });

  const prevValuesRef = useRef({
    totalAccounts: 0,
    totalTransactions: 0,
    metrics: defaultAggregateData.metrics,
  });

  // One rolling window, not two UTC-day buckets added together: the card
  // labels this figure "/24h", and the sum ran 46 percent high (measured
  // 2026-09-03, 11,475 against 7,840).
  const newTransactions = newTransactionsResult.data?.newTransactions ?? 0;

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
    newTransactions,
    newAccounts: newAccountsResult.data?.newAccounts,
    totalAccounts:
      (accountResult.data?.totalAccounts || 0) >
      prevValuesRef.current.totalAccounts
        ? accountResult.data?.totalAccounts
        : prevValuesRef.current.totalAccounts,
    transactions: aggregateResult.data?.transactions || [],
    loadingTransactions: aggregateResult.isLoading,
    totalTransactions:
      (aggregateResult.data?.totalTransactions || 0) >
      prevValuesRef.current.totalTransactions
        ? aggregateResult.data?.totalTransactions
        : prevValuesRef.current.totalTransactions,
    loadingCards: accountResult.isLoading,
    loadingBlocks: aggregateResult.isLoading,
    totalProposals: aggregateResult.data?.proposalStatistics?.total,
    activeProposalsCount: aggregateResult.data?.proposalStatistics?.active,
    activeProposals: aggregateResult.data?.proposalStatistics?.activeProposals,
    totalValidators: aggregateResult.data?.validatorStatistics?.total,
    activeValidators: aggregateResult.data?.validatorStatistics?.active,
    lastApprovedProposal: aggregateResult.data?.proposalStatistics.lastProposal,
    nodes: nodes.data?.nodes,
    mostTransactedTokens: mostTransactedAggregate.data?.tokens || [],
    mostTransactedNFTs: mostTransactedAggregate.data?.nfts || [],
    mostTransactedKDAFee: mostTransactedAggregate.data?.kdaFee || [],
    epoch: aggregateResult.data?.overview?.epochNumber,
    hotContracts: isKVMAvailable(network)
      ? hotContracts.data?.hotContracts || []
      : [],
    loadingMostTransacted:
      mostTransactedAggregate.isLoading ||
      (isKVMAvailable(network) ? hotContracts.isLoading : false),
  };

  prevValuesRef.current = {
    totalAccounts: values.totalAccounts || 0,
    totalTransactions: values.totalTransactions || 0,
    metrics: values.metrics,
  };

  return <HomeData.Provider value={values}>{children}</HomeData.Provider>;
};

export const useHomeData = (): IHomeData => useContext(HomeData);
