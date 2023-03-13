import Chart, { ChartType } from '@/components/Chart';
import { useHomeData } from '@/contexts/mainPage';
import api from '@/services/api';
import {
  ContainerTimeFilter,
  HomeLoaderContainer,
  ItemTimeFilter,
  ListItemTimeFilter,
  Section,
  TransactionChart,
  TransactionChartContent,
  TransactionContainer,
  TransactionContent,
  TransactionEmpty,
} from '@/views/home';
import { format } from 'date-fns';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';
import { IDailyTransaction } from '../../types';
import { HomeLoader } from '../Loader/styles';
import TransactionItem from '../TransactionItem';

const HomeTransactions: React.FC = () => {
  const filterDays = [1, 7, 15, 30];
  const { t } = useTranslation('transactions');
  const { transactions } = useHomeData();
  const { t: commonT } = useTranslation('common');
  const [transactionsList, setTransactionsList] = useState<IDailyTransaction[]>(
    [],
  );
  const [timeFilter, setTimeFilter] = useState(16);
  const [loadingDailyTxs, setLoadingDailyTxs] = useState(false);

  useEffect(() => {
    const fetchTotalDays = async () => {
      setLoadingDailyTxs(true);
      try {
        const res = await api.get({
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
            dateString.slice(0, 2) +
            ' ' +
            commonT(`Date.Months.${dateString.slice(3)}`),
          value: transaction.doc_count,
        };
      }
    });
  }, [transactionsList]);

  return (
    <Section>
      <Link href={'/transactions'}>
        <a>
          <h1>{t('Transactions')}</h1>
        </a>
      </Link>

      <TransactionContainer>
        <TransactionContent>
          {transactions.length === 0 && (
            <TransactionEmpty>
              <span>{commonT('EmptyData')}</span>
            </TransactionEmpty>
          )}

          {transactions.map((transaction, index) => (
            <TransactionItem key={String(index)} {...transaction} />
          ))}
        </TransactionContent>
        <TransactionChart>
          <ContainerTimeFilter>
            <span>{t('Daily Transactions')}</span>
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
              <Chart type={ChartType.Linear} data={getTransactionChartData()} />
            </TransactionChartContent>
          )}
        </TransactionChart>
      </TransactionContainer>
    </Section>
  );
};

export default HomeTransactions;
