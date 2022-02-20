import {
  IDataCards,
  ICard,
  IAccountResponse,
  IStatisticsResponse,
  IYesterdayResponse,
  ITransactionResponse,
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
  totalTransactions: defaultTotalTransactions,
  tps,
  coinsData,
  yesterdayTransactions,
  yesterdayAccounts,
}) => {
  const statisticsWatcherTimeout = 4000;
  const cardWatcherInterval = 4 * 1000; // 4 secs

  const [actualTPS, setActualTPS] = useState<string>(tps);

  const [totalAccounts, setTotalAccounts] = useState(defaultTotalAccounts);
  const [totalTransactions, setTotalTransactions] = useState(
    defaultTotalTransactions,
  );
  const [newAccounts, setNewAccounts] = useState(yesterdayAccounts);
  const [newTransactions, setNewTransactions] = useState(yesterdayTransactions);

  const dataCards: ICard[] = [
    {
      Icon: Accounts,
      title: 'Total accounts',
      value: totalAccounts,
      variation: `+ ${
        newAccounts === totalAccounts ? '0%' : newAccounts.toLocaleString()
      }`,
    },
    {
      Icon: Transactions,
      title: 'Total transactions',
      value: totalTransactions,
      variation: `+ ${newTransactions.toLocaleString()}`,
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
      const accountsCall = new Promise<IAccountResponse>(resolve =>
        resolve(
          api.get({
            route: 'address/list',
          }),
        ),
      );

      const yesterdayAccountsCall = new Promise<IYesterdayResponse>(resolve =>
        resolve(
          api.getCached({
            route: 'address/list/count/1',
          }),
        ),
      );

      const transactionsCall = new Promise<ITransactionResponse>(resolve =>
        resolve(
          api.getCached({
            route: 'transaction/list',
          }),
        ),
      );

      const yesterdayTransactionsCall = new Promise<IYesterdayResponse>(
        resolve =>
          resolve(
            api.getCached({
              route: 'transaction/list/count/1',
            }),
          ),
      );
      const [accounts, yesterdayAccounts, transactions, yesterdayTransactions] =
        await Promise.all([
          accountsCall,
          yesterdayAccountsCall,
          transactionsCall,
          yesterdayTransactionsCall,
        ]);

      if (!accounts.error) {
        setTotalAccounts(accounts.pagination.totalRecords);
      }
      if (!yesterdayAccounts.error) {
        setNewAccounts(yesterdayAccounts.data.number_by_day[0].doc_count);
      }
      if (!transactions.error) {
        setTotalTransactions(transactions.pagination.totalRecords);
      }
      if (!yesterdayTransactions.error) {
        setNewTransactions(
          yesterdayTransactions.data.number_by_day[0].doc_count,
        );
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
