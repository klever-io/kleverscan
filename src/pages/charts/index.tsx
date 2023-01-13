import { Assets as Icon } from '@/assets/title-icons';
import Chart, { ChartType } from '@/components/Chart';
import Title from '@/components/Layout/Title';
import { HomeLoader } from '@/components/Loader/styles';
import api from '@/services/api';
import { Container, Header, Input, Section } from '@/views/charts';
import {
  ChartsContainer,
  ContainerTimeFilter,
  HomeLoaderContainer,
  ItemTimeFilter,
  ListItemTimeFilter,
  TransactionChart,
  TransactionChartContent,
} from '@/views/home';
import { format } from 'date-fns';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { IDailyTransaction, IResponse } from '../../types';

export interface ITooltipContent {
  payload?: {
    value: number;
    name: string;
  }[];
  label?: string;
  active?: boolean;
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

interface IStatisticsResponse extends IResponse {
  data: {
    block_stats_by_day: IBlockStatsResponse[];
  };
}

const Charts: React.FC<ICharts> = ({ statistics, dailyTransactions }) => {
  const router = useRouter();
  const { t: commonT } = useTranslation('common');
  const filterDays = [1, 7, 15, 30];
  const [timeFilter, setTimeFilter] = useState(16);
  const [loadingDailyTxs, setLoadingDailyTxs] = useState(false);
  const [transactionsList, setTransactionsList] = useState(dailyTransactions);

  const getTransactionChartData = useCallback(() => {
    const sortedTransactionsList = transactionsList.sort(
      (a, b) => a.key - b.key,
    );
    return sortedTransactionsList.map(transaction => {
      if (transaction.key) {
        // Create date object
        const date = new Date(transaction.key);
        // Set timezone to UTC
        date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
        const dateString = format(date, 'dd MMM');
        return {
          date:
            dateString.slice(0, 2) + ' ' + commonT(`${dateString.slice(3)}`),
          value: transaction.doc_count,
        };
      }
    });
  }, [transactionsList]);

  useEffect(() => {
    const fetchTotalDays = async () => {
      setLoadingDailyTxs(true);
      try {
        const res = await api.getCached({
          route: `transaction/list/count/${timeFilter}`,
        });
        if (!res.error || res.error === '') {
          setTransactionsList(res.data.number_by_day);
        }
      } catch (error) {
        console.error(error);
      }
      setLoadingDailyTxs(false);
    };

    fetchTotalDays();
  }, [timeFilter]);
  return (
    <Container>
      <Header>
        <Title title="Charts" Icon={Icon} />

        <Input />
      </Header>

      <Section>
        <ChartsContainer>
          <TransactionChart>
            <span>Total KLV Burned vs Minted</span>
            <TransactionChartContent>
              <Chart
                type={ChartType.DoubleLinear}
                data={statistics}
                value="burned"
                value2="minted"
              />
            </TransactionChartContent>
          </TransactionChart>

          <TransactionChart>
            <span>Blocks Rewards vs Transactions Rewards</span>
            <TransactionChartContent>
              <Chart
                type={ChartType.DoubleLinear}
                data={statistics}
                value="blocks"
                value2="transactions"
              />
            </TransactionChartContent>
          </TransactionChart>
          <TransactionChart>
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
            {loadingDailyTxs && (
              <HomeLoaderContainer>
                <HomeLoader />
              </HomeLoaderContainer>
            )}
            {!loadingDailyTxs && (
              <TransactionChartContent>
                <Chart
                  type={ChartType.Linear}
                  data={getTransactionChartData()}
                />
              </TransactionChartContent>
            )}
          </TransactionChart>
          <TransactionChart>
            <span>KLV Rewards Pool vs KFI Rewards Pool</span>
            <TransactionChartContent>
              <Chart
                type={ChartType.DoubleLinear}
                data={statistics}
                value="KFI"
                value2="KLV"
              />
            </TransactionChartContent>
          </TransactionChart>
        </ChartsContainer>
      </Section>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps<ICharts> = async () => {
  const props: ICharts = {
    statistics: [] as IBlockStats[],
    dailyTransactions: [] as IDailyTransaction[],
  };

  const statistics: IStatisticsResponse = await api.get({
    route: 'block/statistics-by-day/15',
  });

  const dailyTransactions = await api.getCached({
    route: 'transaction/list/count/15',
  });
  if (!statistics.error && !dailyTransactions.error) {
    props.statistics = statistics.data.block_stats_by_day
      .reverse()
      .map(stats => {
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

    const { number_by_day } = dailyTransactions.data;
    props.dailyTransactions = number_by_day;
  }
  return { props };
};

export default Charts;
