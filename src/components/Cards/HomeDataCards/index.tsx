import { Accounts, Epoch, TPS, Transactions } from '@/assets/cards';
import CoinCard from '@/components/Cards/CoinCard';
import api from '@/services/api';
import { Service } from '@/types/index';
import { getEpochInfo } from '@/utils/index';
import {
  DataCard,
  DataCardLatest,
  DataCardsContainer,
  DataCardsContent,
  DataCardsWrapper,
  DataCardValue,
  IconContainer,
  ProgressContainerSpan,
} from '@/views/home';
import {
  ProgressContainer,
  ProgressContent,
  ProgressIndicator,
} from '@/views/validators';
import { useTheme } from 'contexts/theme';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import {
  IAccountResponse,
  ICard,
  IDataCards,
  IEpochCard,
  IStatisticsResponse,
  ITransactionResponse,
  IYesterdayResponse,
} from '../../../types';

const HomeDataCards: React.FC<IDataCards> = ({
  totalAccounts: defaultTotalAccounts,
  totalTransactions: defaultTotalTransactions,
  epochInfo: defaultEpochInfo,
  block,
  tps,
  coinsData,
  yesterdayTransactions,
  yesterdayAccounts,
  assetsData,
}) => {
  const statisticsWatcherTimeout = 4000;
  const cardWatcherInterval = 4 * 1000; // 4 secs

  const [actualTPS, setActualTPS] = useState<string>(tps);
  const [metrics, setMetrics] = useState(defaultEpochInfo);

  const [totalAccounts, setTotalAccounts] = useState(defaultTotalAccounts);
  const [totalTransactions, setTotalTransactions] = useState(
    defaultTotalTransactions,
  );
  const [newAccounts, setNewAccounts] = useState(yesterdayAccounts);
  const [newTransactions, setNewTransactions] = useState(yesterdayTransactions);

  const { t } = useTranslation('common', { keyPrefix: 'Cards' });

  const dataCards: ICard[] = [
    {
      Icon: Accounts,
      title: t('Total Accounts'),
      value: totalAccounts,
      variation: `+ ${
        newAccounts === totalAccounts ? '0%' : newAccounts.toLocaleString()
      }`,
    },
    {
      Icon: Transactions,
      title: t('Total Transactions'),
      value: totalTransactions,
      variation: `+ ${newTransactions.toLocaleString()}`,
    },
  ];

  const epochCards: IEpochCard[] = [
    {
      Icon: TPS,
      title: t('Live/Peak TPS'),
      value: actualTPS,
    },
    {
      Icon: Epoch,
      title: `${t('Epoch')} #${block.epoch} ${t('Remaining Time')}`,
      value: metrics.remainingTime,
      progress: metrics.epochLoadPercent,
    },
  ];

  useEffect(() => {
    const statisticsWatcher = setInterval(async () => {
      const statistics: IStatisticsResponse = await api.get({
        route: 'node/statistics',
        service: Service.PROXY,
      });

      if (!statistics.error) {
        const chainStatistics = statistics.data.statistics.chainStatistics;

        setActualTPS(`${chainStatistics.liveTPS} / ${chainStatistics.peakTPS}`);
      }
    }, statisticsWatcherTimeout);

    const metricswatcher = setInterval(async () => {
      const metrics: any = await api.get({
        route: 'node/overview',
        service: Service.PROXY,
      });

      if (!metrics.error) {
        setMetrics(getEpochInfo(metrics?.data?.overview));
      }
    }, statisticsWatcherTimeout);

    const cardWatcher = setInterval(async () => {
      const accountsCall = new Promise<IAccountResponse>(
        async (resolve, reject) => {
          const res = await api.getCached({
            route: 'address/list',
          });

          if (!res.error || res.error === '') {
            resolve(res);
          }

          reject(res.error);
        },
      );

      const yesterdayAccountsCall = new Promise<IYesterdayResponse>(
        async (resolve, reject) => {
          const res = await api.getCached({
            route: 'address/list/count/1',
          });

          if (!res.error || res.error === '') {
            resolve(res);
          }

          reject(res.error);
        },
      );

      const transactionsCall = new Promise<ITransactionResponse>(
        async (resolve, reject) => {
          const res = await api.getCached({
            route: 'transaction/list',
          });

          if (!res.error || res.error === '') {
            resolve(res);
          }

          reject(res.error);
        },
      );

      const yesterdayTransactionsCall = new Promise<IYesterdayResponse>(
        async (resolve, reject) => {
          const res = await api.getCached({
            route: 'transaction/list/count/1',
          });

          if (!res.error || res.error === '') {
            resolve(res);
          }

          reject(res.error);
        },
      );

      const promises = [
        accountsCall,
        yesterdayAccountsCall,
        transactionsCall,
        yesterdayTransactionsCall,
      ];

      await Promise.allSettled(promises).then(responses => {
        responses.forEach((res, index) => {
          if (res.status !== 'rejected') {
            const { value }: any = res;
            switch (index) {
              case 0:
                setTotalAccounts(value.pagination.totalRecords);
                break;

              case 1:
                setNewAccounts(value.data.number_by_day[0].doc_count);
                break;

              case 2:
                setTotalTransactions(value.pagination.totalRecords);
                break;

              case 3:
                setNewTransactions(value.data.number_by_day[0].doc_count);
                break;

              default:
                break;
            }
          }
        });
      });
    }, cardWatcherInterval);

    return () => {
      clearInterval(statisticsWatcher);
      clearInterval(cardWatcher);
      clearInterval(metricswatcher);
    };
  }, []);

  const Progress: React.FC<{ percent: number }> = ({ percent }) => {
    const { theme } = useTheme();
    return (
      <ProgressContainer textColor={theme.card.white}>
        <ProgressContent>
          <ProgressIndicator percent={percent} />
        </ProgressContent>
        <span>{percent?.toFixed(2)}%</span>
      </ProgressContainer>
    );
  };

  return (
    <DataCardsContainer>
      <DataCardsWrapper>
        <DataCardsContent>
          {dataCards.map(({ Icon, title, value, variation }, index) => (
            <DataCard key={String(index)}>
              <IconContainer>
                <Icon viewBox="0 0 70 70" />
              </IconContainer>
              <DataCardValue>
                <span>{title}</span>
                <p>{value.toLocaleString()}</p>
              </DataCardValue>
              {!variation.includes('%') && (
                <DataCardLatest positive={variation.includes('+')}>
                  <span>{t('Last 24h')}</span>
                  <p>{variation}</p>
                </DataCardLatest>
              )}
            </DataCard>
          ))}
        </DataCardsContent>
        <DataCardsContent>
          {epochCards.map(({ Icon, title, value, progress }, index) => (
            <DataCard key={String(index)}>
              <IconContainer>
                <Icon viewBox="0 0 70 70" />
              </IconContainer>
              <DataCardValue>
                <span>{title}</span>
                <p>{value?.toLocaleString()}</p>
              </DataCardValue>
              {progress >= 0 && (
                <ProgressContainerSpan>
                  <strong>
                    <Progress percent={metrics.epochLoadPercent} />
                  </strong>
                </ProgressContainerSpan>
              )}
            </DataCard>
          ))}
        </DataCardsContent>
      </DataCardsWrapper>

      <CoinCard
        coins={coinsData}
        actualTPS={actualTPS}
        assetsData={assetsData}
      />
    </DataCardsContainer>
  );
};
export default HomeDataCards;
