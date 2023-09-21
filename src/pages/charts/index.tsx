import { Assets as Icon } from '@/assets/title-icons';
import Chart, { ChartType } from '@/components/Chart';
import Title from '@/components/Layout/Title';
import { Loader, LoaderWrapper } from '@/components/Loader/styles';
import api from '@/services/api';
import { Container, Header } from '@/styles/common';
import { Section } from '@/views/charts';
import {
  ChartsContainer,
  ContainerTimeFilter,
  DailyTxChartContent,
  ErrorContainer,
  FixedTxChart,
  ItemTimeFilter,
  ListItemTimeFilter,
  RetryContainer,
  TransactionChartContent,
} from '@/views/home';
import { format } from 'date-fns';
import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';
import { IoReloadSharp } from 'react-icons/io5';
import { useQuery } from 'react-query';
import { IDailyTransaction } from '../../types';

export interface ITooltipContent {
  label?: string;
  active?: boolean;
  payload?: any;
}

export interface ITooltipTxsData extends ITooltipContent {
  payload?: {
    payload: {
      date: number;
      value: number;
    };
    value: number;
  }[];
}

export interface IDoubleChart {
  dateNow: string;
  datePast: string;
  valueNow: number;
  valuePast: number;
}

export interface ITooltipDoubleTxsData extends ITooltipContent {
  payload?: {
    payload: IDoubleChart;
  }[];
}

export interface ITooltipPriceData extends ITooltipContent {
  payload?: {
    value: number;
    name: string;
  }[];
}

export interface IChartData {
  date?: number;
  value: number;
}

interface IBlockStatsResponse {
  date: number;
  totalBlocks: number;
  totalBurned: number;
  totalMinted: number;
  totalBlockRewards: number;
  totalTxRewards: number;
  totalStakingRewards: number;
  totalKappsFees: number;
}

interface IBlockStats {
  date: string;
  burned: number;
  minted: number;
  blocks: number;
  transactions: number;
  KLV: number;
  KFI: number;
}
interface ICharts {
  dailyTransactions: IDailyTransaction[];
  statistics: IBlockStats[];
}

const loadInitialData = async () => {
  try {
    const res = await api.get({
      route: 'block/statistics-by-day/15',
    });

    if (!res.error || res.error === '') {
      const formattedStatistics = res?.data?.block_stats_by_day
        ?.reverse()
        .map((stats: IBlockStatsResponse) => {
          return {
            date: format(stats.date, 'dd MMM'),
            burned: stats.totalBurned / 1000000,
            minted: stats.totalMinted / 1000000,
            blocks: stats.totalBlockRewards / 1000000,
            transactions: stats.totalTxRewards / 1000000,
            KFI: stats.totalKappsFees / 1000000,
            KLV: stats.totalStakingRewards / 1000000,
          };
        });
      return formattedStatistics;
    }
    return Promise.reject(new Error(res?.error));
  } catch (error) {
    console.error(error);
  }
};
const fetchTransactionList = async (timeFilter: number) => {
  try {
    const res = await api.get({
      route: `transaction/list/count/${timeFilter}`,
    });
    if (!res.error || res.error === '') {
      return res.data.number_by_day;
    }
    return Promise.reject(new Error(res.error));
  } catch (error) {
    console.error(error);
  }
};

const onErrorHandler = () => {
  return {
    onError: (err: unknown): void => {
      console.error(err);
    },
    retry: 3,
  };
};

const Charts: React.FC<ICharts> = () => {
  const { t: commonT } = useTranslation('common');
  const filterDays = [1, 7, 15, 30];
  const [timeFilter, setTimeFilter] = useState(15);

  const {
    isLoading: statisticsIsLoading,
    isError: statisticsIsError,
    data: statistics,
    refetch: refetchStatistics,
  } = useQuery('statistics', loadInitialData, onErrorHandler());

  const {
    isLoading: transactionListIsLoading,
    isError: transactionListIsError,
    data: transactionList,
    refetch: refetchTransactionList,
  } = useQuery(
    ['transactionList', timeFilter],
    () => fetchTransactionList(timeFilter),
    onErrorHandler(),
  );

  const getStatisticsErrorContainer = () => (
    <ErrorContainer>
      <div>Something went wrong.</div>
      <RetryContainer
        onClick={refetchStatistics as React.MouseEventHandler<HTMLDivElement>}
      >
        <button>Retry</button>
        <IoReloadSharp size={32} />
      </RetryContainer>
    </ErrorContainer>
  );

  const getTransactionListErrorContainer = () => (
    <ErrorContainer>
      <div>Something went wrong.</div>
      <RetryContainer
        onClick={
          refetchTransactionList as React.MouseEventHandler<HTMLDivElement>
        }
      >
        <button>Retry</button>
        <IoReloadSharp size={32} />
      </RetryContainer>
    </ErrorContainer>
  );

  const getTransactionChartData = (
    transactionList: null | IDailyTransaction[],
  ) => {
    if (transactionList && typeof transactionList === 'object') {
      const sortedTransactionsList = transactionList.sort(
        (a: IDailyTransaction, b: IDailyTransaction) => a.key - b.key,
      );
      return sortedTransactionsList.map((transaction: IDailyTransaction) => {
        if (transaction.key) {
          const date = new Date(transaction.key);
          date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
          const dateString = format(date, 'dd MMM');
          return {
            date:
              dateString.slice(0, 2) + ' ' + commonT(`${dateString.slice(3)}`),
            value: transaction.doc_count,
          };
        }
      });
    }
  };

  const renderWithLoading = (loadingState: boolean, component: JSX.Element) => {
    if (loadingState) {
      return (
        <LoaderWrapper>
          <Loader height={70} width={70} />
        </LoaderWrapper>
      );
    }
    return component;
  };

  return (
    <Container>
      <Header>
        <Title title="Charts" Icon={Icon} />
      </Header>
      <Section>
        <ChartsContainer>
          <FixedTxChart>
            <span>Total KLV Burned vs Minted</span>
            {statisticsIsError
              ? getStatisticsErrorContainer()
              : renderWithLoading(
                  statisticsIsLoading,
                  <TransactionChartContent>
                    <Chart
                      type={ChartType.DoubleLinear}
                      data={statistics}
                      value="burned"
                      value2="minted"
                    />
                  </TransactionChartContent>,
                )}
          </FixedTxChart>

          <FixedTxChart>
            <span>Blocks Rewards vs Transactions Rewards</span>
            {statisticsIsError
              ? getStatisticsErrorContainer()
              : renderWithLoading(
                  statisticsIsLoading,
                  <TransactionChartContent>
                    <Chart
                      type={ChartType.DoubleLinear}
                      data={statistics}
                      value="blocks"
                      value2="transactions"
                    />
                  </TransactionChartContent>,
                )}
          </FixedTxChart>

          <FixedTxChart>
            <ContainerTimeFilter>
              <span>Daily Transactions</span>
              <ListItemTimeFilter>
                {filterDays.map(item => (
                  <ItemTimeFilter
                    key={String(item)}
                    onClick={() => setTimeFilter(item + 1)}
                    selected={!!(timeFilter === item + 1)}
                  >
                    {item !== 30 ? `${String(item)}D` : '1M'}
                  </ItemTimeFilter>
                ))}
              </ListItemTimeFilter>
            </ContainerTimeFilter>
            {transactionListIsError
              ? getTransactionListErrorContainer()
              : renderWithLoading(
                  transactionListIsLoading,
                  <DailyTxChartContent>
                    <Chart
                      type={ChartType.Linear}
                      data={getTransactionChartData(transactionList)}
                    />
                  </DailyTxChartContent>,
                )}
          </FixedTxChart>

          <FixedTxChart>
            <span>KLV Rewards Pool vs KFI Rewards Pool</span>
            {statisticsIsError
              ? getStatisticsErrorContainer()
              : renderWithLoading(
                  statisticsIsLoading,
                  <TransactionChartContent>
                    <Chart
                      type={ChartType.DoubleLinear}
                      data={statistics}
                      value="KFI"
                      value2="KLV"
                    />
                  </TransactionChartContent>,
                )}
          </FixedTxChart>
        </ChartsContainer>
      </Section>
    </Container>
  );
};

export default Charts;
