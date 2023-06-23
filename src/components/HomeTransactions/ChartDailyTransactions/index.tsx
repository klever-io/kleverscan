import Chart, { ChartType } from '@/components/Chart';
import { HomeLoader } from '@/components/Loader/styles';
import api from '@/services/api';
import { IDailyTransaction } from '@/types';
import {
  ContainerTimeFilter,
  HomeLoaderContainer,
  ItemTimeFilter,
  ListItemTimeFilter,
  TransactionChart,
  TransactionChartContent,
} from '@/views/home';
import { format } from 'date-fns';
import { useTranslation } from 'next-i18next';
import { useCallback, useEffect, useState } from 'react';
import { Container } from './styles';

export const ChartDailyTransactions: React.FC = () => {
  const filterDays = [1, 7, 15, 30];
  const [transactionsList, setTransactionsList] = useState<IDailyTransaction[]>(
    [],
  );
  const [timeFilter, setTimeFilter] = useState(16);
  const [loadingDailyTxs, setLoadingDailyTxs] = useState(false);
  const { t: commonT } = useTranslation('common');
  const { t } = useTranslation('transactions');
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
    <Container>
      <h1>{t('Daily Transactions')}</h1>
      <TransactionChart>
        <ContainerTimeFilter>
          <span>{t('Transactions')}</span>
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
              hasTooltip={true}
              strokeWidth={1}
              yAxis={true}
              height={'100%'}
            />
          </TransactionChartContent>
        )}
      </TransactionChart>
    </Container>
  );
};
