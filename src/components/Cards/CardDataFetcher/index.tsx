import api from '@/services/api';
import {
  IAccountResponse,
  IEpochInfo,
  IStatisticsResponse,
  ITransactionResponse,
  IYesterdayResponse,
} from '@/types';
import { IBlock } from '@/types/blocks';
import { IDataMetrics, ITransactionListResponse, Service } from '@/types/index';
import { getEpochInfo } from '@/utils/index';
import { useEffect, useState } from 'react';
import HomeDataCards from './HomeDataCards';
import HomeDataCardsSkeleton from './HomeDataCardsSkeleton';

const CardDataFetcher: React.FC<{ block: IBlock }> = ({ block }) => {
  const statisticsWatcherTimeout = 4000;
  const cardWatcherInterval = 4 * 1000; // 4 secs

  const [actualTPS, setActualTPS] = useState<string>('');
  const [metrics, setMetrics] = useState<IEpochInfo>({
    currentSlot: 0,
    epochFinishSlot: 0,
    remainingTime: '',
    epochLoadPercent: 0,
  });
  const [counterEpoch, setCounterEpoch] = useState(0);
  const [lastPercentage, setLastPercentage] = useState<number | null>(null);
  const [totalAccounts, setTotalAccounts] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [newAccounts, setNewAccounts] = useState(0);
  const [newTransactions, setNewTransactions] = useState(0);
  const [beforeYesterdayTransactions, setBeforeYesterdayTransactions] =
    useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStatistics = async () => {
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

      const statisticsCall = new Promise<IAccountResponse>(
        async (resolve, reject) => {
          const res = await api.getCached({
            route: 'node/statistics',
            service: Service.PROXY,
          });

          if (!res.error || res.error === '') {
            resolve(res);
          }

          reject(res.error);
        },
      );

      const metricsCall = new Promise<IDataMetrics>(async (resolve, reject) => {
        const res = await api.get({
          route: 'node/overview',
          service: Service.PROXY,
        });

        if (!res.error || res.error === '') {
          resolve(res);
        }

        reject(res.error);
      });

      const yesterdayTransactionsCall = new Promise<IAccountResponse>(
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

      const beforeYesterdayTransactionsCall =
        new Promise<ITransactionListResponse>(async (resolve, reject) => {
          const res = await api.getCached({
            route: 'transaction/list/count/2',
          });

          if (!res.error || res.error === '') {
            resolve(res);
          }

          reject(res.error);
        });

      const yesterdayAccountsCall = new Promise<ITransactionListResponse>(
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

      const promises = [
        transactionsCall,
        accountsCall,
        statisticsCall,
        metricsCall,
        yesterdayTransactionsCall,
        beforeYesterdayTransactionsCall,
        yesterdayAccountsCall,
      ];

      const responses = await Promise.allSettled(promises);

      responses.forEach(
        (response: PromiseSettledResult<any>, index: number) => {
          if (response.status !== 'rejected') {
            const { value }: any = response;

            switch (index) {
              case 0:
                setTotalTransactions(value.pagination.totalRecords);
                break;

              case 1:
                setTotalAccounts(value.pagination.totalRecords);
                break;

              case 2:
                const chainStatistics = value.data.statistics.chainStatistics;
                setActualTPS(
                  `${chainStatistics.liveTPS} / ${chainStatistics.peakTPS}`,
                );
                break;

              case 3:
                if (value) {
                  setMetrics(getEpochInfo(value.data.overview));
                }

                break;

              case 4:
                if (value.data?.number_by_day?.length > 0)
                  setNewTransactions(value.data?.number_by_day[0]?.doc_count);

                break;

              case 5:
                if (responses[4].status !== 'rejected')
                  setBeforeYesterdayTransactions(
                    value.data?.number_by_day[0]?.doc_count -
                      (responses[4].value as ITransactionListResponse).data
                        ?.number_by_day[0]?.doc_count,
                  );

                break;

              case 6:
                setNewAccounts(value.data?.number_by_day[0]?.doc_count);
                break;

              default:
                break;
            }
          }
        },
      );

      setLoading(false);
    };
    getStatistics();
  }, []);

  useEffect(() => {
    if (metrics.epochLoadPercent === 0 && lastPercentage !== null) {
      setCounterEpoch(counterEpoch + 1);
    }
    setLastPercentage(metrics.epochLoadPercent);
  }, [metrics.epochLoadPercent]);

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
      // case 0:
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
      // case 1:
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
      // case 2:
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

      //case 3:
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
                const newTotalTransactions = value.pagination.totalRecords;
                if (
                  totalTransactions &&
                  totalTransactions < newTotalTransactions
                )
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

  return !loading ? (
    <HomeDataCards
      totalAccounts={totalAccounts}
      totalTransactions={totalTransactions}
      newAccounts={newAccounts}
      newTransactions={newTransactions}
      actualTPS={actualTPS}
      metrics={metrics}
      beforeYesterdayTransactions={beforeYesterdayTransactions}
      block={block}
      counterEpoch={counterEpoch}
    />
  ) : (
    <HomeDataCardsSkeleton />
  );
};

export default CardDataFetcher;
