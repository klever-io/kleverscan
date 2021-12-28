import {
  IDataCards,
  ICard,
  IAccountResponse,
  IStatisticsResponse,
} from '../../../types';

import { useEffect, useState } from 'react';
import CoinCard from '@/components/Cards/CoinCard';
import {
  DataCard,
  DataCardLatest,
  DataCardsContainer,
  DataCardsContent,
  DataCardValue,
  IconContainer,
} from '@/views/home';

import { Accounts, Transactions } from '@/assets/cards';
import api, { Service } from '@/services/api';

const HomeDataCards: React.FC<IDataCards> = ({
  totalAccounts: defaultTotalAccounts,
  totalTransactions,
  tps,
  coinsData,
  yeasterdayTransactions,
}) => {
  const statisticsWatcherTimeout = 4000;
  const cardWatcherInterval = 4 * 1000; // 4 secs

  const [actualTPS, setActualTPS] = useState<string>(tps);

  const [totalAccounts, setTotalAccounts] = useState(defaultTotalAccounts);

  const dataCards: ICard[] = [
    {
      Icon: Accounts,
      title: 'Total accounts',
      value: totalAccounts,
      variation: '+ 0.00%',
    },
    {
      Icon: Transactions,
      title: 'Total transactions',
      value: totalTransactions,
      variation: `+ ${yeasterdayTransactions.toLocaleString()}`,
    },
  ];
  useEffect(() => {
    const statisticsWatcher = setInterval(async () => {
      const statistics: IStatisticsResponse = await api.get({
        route: 'node/statistics',
        service: Service.NODE,
      });

      if (!statistics.error) {
        const chainStatistics = statistics.data.statistics.chainStatistics;

        setActualTPS(`${chainStatistics.liveTPS}/${chainStatistics.peakTPS}`);
      }
    }, statisticsWatcherTimeout);

    const cardWatcher = setInterval(async () => {
      const accounts: IAccountResponse = await api.get({
        route: 'address/list',
      });

      if (!accounts.error) {
        setTotalAccounts(accounts.pagination.totalRecords);
      }
    }, cardWatcherInterval);

    return () => {
      clearInterval(statisticsWatcher);
      clearInterval(cardWatcher);
    };
  }, []);
  return (
    <DataCardsContainer>
      <DataCardsContent>
        {dataCards.map(({ Icon, title, value, variation }, index) => (
          <DataCard key={String(index)}>
            <IconContainer>
              <Icon />
            </IconContainer>
            <DataCardValue>
              <span>{title}</span>
              <p>{value.toLocaleString()}</p>
            </DataCardValue>
            {!variation.includes('%') && (
              <DataCardLatest positive={variation.includes('+')}>
                <span>Last 24h</span>
                <p>{variation}</p>
              </DataCardLatest>
            )}
          </DataCard>
        ))}
      </DataCardsContent>

      <CoinCard coins={coinsData} actualTPS={actualTPS} />
    </DataCardsContainer>
  );
};
export default HomeDataCards;
