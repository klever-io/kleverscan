import { Accounts, Epoch, TPS, Transactions } from '@/assets/cards';
import CoinCard from '@/components/Cards/CoinCard';
import Tooltip from '@/components/Tooltip';
import { useTheme } from '@/contexts/theme';
import api from '@/services/api';
import { Service } from '@/types/index';
import { getEpochInfo, getVariation } from '@/utils/index';
import {
  DataCard,
  DataCardLatest,
  DataCardsContainer,
  DataCardsContent,
  DataCardsWrapper,
  DataCardValue,
  IconContainer,
  Percentage,
  ProgressContainerSpan,
} from '@/views/home';
import {
  ProgressContainer,
  ProgressContent,
  ProgressIndicator,
  ProgressPercentage,
} from '@/views/validators';
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
import { ValueDetail } from '../CoinCard/styles';

const HomeDataCards: React.FC<IDataCards> = ({
  totalAccounts: defaultTotalAccounts,
  totalTransactions: defaultTotalTransactions,
  epochInfo: defaultEpochInfo,
  block,
  tps,
  coinsData,
  yesterdayTransactions,
  beforeYesterdayTransactions,
  yesterdayAccounts,
  assetsData,
}) => {
  const statisticsWatcherTimeout = 4000;
  const cardWatcherInterval = 4 * 1000; // 4 secs

  const [actualTPS, setActualTPS] = useState<string>(tps);
  const [metrics, setMetrics] = useState(defaultEpochInfo);
  const [counterEpoch, setCounterEpoch] = useState(0);
  const [lastPercentage, setLastPercentage] = useState<number | null>(null);
  const [totalAccounts, setTotalAccounts] = useState(defaultTotalAccounts);
  const [totalTransactions, setTotalTransactions] = useState(
    defaultTotalTransactions,
  );
  const [newAccounts, setNewAccounts] = useState(yesterdayAccounts);
  const [newTransactions, setNewTransactions] = useState(yesterdayTransactions);

  const { t } = useTranslation('common', { keyPrefix: 'Cards' });

  useEffect(() => {
    if (metrics.epochLoadPercent === 0 && lastPercentage !== null) {
      setCounterEpoch(counterEpoch + 1);
    }
    setLastPercentage(metrics.epochLoadPercent);
  }, [metrics.epochLoadPercent]);

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
      percentage: (newTransactions * 100) / (beforeYesterdayTransactions * 100),
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
      title:
        `${t('Epoch')}` +
        (block?.epoch ? ` #${block.epoch + counterEpoch} ` : ' ') +
        `${t('Remaining Time')}`,
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

      //TODO: Uncomment this when the API is fixed
      // const yesterdayTransactionsCall = new Promise<IYesterdayResponse>(
      //   async (resolve, reject) => {
      //     const res = await api.getCached({
      //       route: 'transaction/list/count/1',
      //     });

      //     if (!res.error || res.error === '') {
      //       resolve(res);
      //     }

      //     reject(res.error);
      //   },
      // );

      //TODO: Remove this when the API is fixed
      const yesterdayTransactionsCall = new Promise<IAccountResponse>(
        async (resolve, reject) => {
          const res = await api.getCached({
            route: `transaction/list?startdate=${
              new Date().getTime() - 86400000
            }&enddate=${new Date().getTime()}`,
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
                //TODO: Uncomment this when the API is fixed
                // setNewTransactions(value.data.number_by_day[0].doc_count);
                //TODO: Remove this when the API is fixed
                setNewTransactions(value.pagination.totalRecords);
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
      <ProgressContainer>
        <ProgressContent>
          <ProgressIndicator percent={percent} />
        </ProgressContent>
        <ProgressPercentage textColor={theme.card.white}></ProgressPercentage>
      </ProgressContainer>
    );
  };

  const PercentageComponent: React.FC<{
    progress: any;
    value: string | number;
  }> = ({ progress, value }) => {
    const [show, setShow] = useState(false);
    if (progress) {
      return (
        <Percentage>
          <p>{value?.toLocaleString()}</p>
          {progress >= 0 && (
            <div>
              <ProgressContainerSpan>
                <strong>
                  <Progress percent={metrics.epochLoadPercent} />
                </strong>
                <span>
                  {metrics.epochLoadPercent.toFixed(2)}% to next epoch
                </span>
              </ProgressContainerSpan>
            </div>
          )}
        </Percentage>
      );
    }
    return <p>{value?.toLocaleString()}</p>;
  };

  return (
    <DataCardsContainer>
      <DataCardsWrapper>
        <DataCardsContent>
          {dataCards.map(
            ({ Icon, title, value, variation, percentage }, index) => (
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
                    {percentage && (
                      <ValueDetail positive={true}>
                        <p>{getVariation(+percentage)}</p>
                      </ValueDetail>
                    )}
                  </DataCardLatest>
                )}
              </DataCard>
            ),
          )}
        </DataCardsContent>
        <DataCardsContent>
          {epochCards.map(({ Icon, title, value, progress }, index) => (
            <DataCard key={String(index)}>
              <IconContainer>
                <Icon viewBox="0 0 70 70" />
              </IconContainer>
              <DataCardValue>
                <div>
                  <span>{title}</span>
                  {index === 0 && (
                    <span style={{ marginTop: '-0.25rem' }}>
                      <Tooltip msg="Transactions per second" />
                    </span>
                  )}
                </div>
                {<PercentageComponent progress={progress} value={value} />}
              </DataCardValue>
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
