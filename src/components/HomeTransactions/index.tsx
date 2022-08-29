import Chart, { ChartType } from '@/components/Chart';
import api from '@/services/api';
import { addPrecisionTransactions } from '@/utils/index';
import {
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
import {
  IAssetResponse,
  IHomeTransactions,
  ITransactionResponse,
} from '../../types';
import TransactionItem from '../TransactionItem';

const HomeTransactions: React.FC<IHomeTransactions> = ({
  setTotalTransactions,
  transactionsList,
  transactions: defaultTransactions,
  precision,
}) => {
  const { t } = useTranslation('transactions');
  const { t: commonT } = useTranslation('common');
  const [transactions, setTransactions] = useState(defaultTransactions);

  const transactionsWatcherInterval = 4 * 1000;

  useEffect(() => {
    const transactionsWatcher = setInterval(async () => {
      const transactions: ITransactionResponse = await api.get({
        route: 'transaction/list',
      });
      const assets: IAssetResponse = await api.get({ route: 'assets/kassets' });
      if (!transactions.error && !assets.error) {
        transactions.data.transactions = addPrecisionTransactions(
          transactions.data.transactions,
        );
        setTransactions(transactions.data.transactions);
        setTotalTransactions(transactions.pagination.totalRecords);
      }
    }, transactionsWatcherInterval);

    return () => {
      clearInterval(transactionsWatcher);
    };
  }, []);

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
            <TransactionItem
              key={String(index)}
              {...transaction}
              precision={precision}
            />
          ))}
        </TransactionContent>
        <TransactionChart>
          <span>{t('Daily Transactions')}</span>
          <p>
            ({transactionsList.length} {commonT('Date.Day').toLocaleLowerCase()}
            {transactionsList.length > 1 ? 's' : ''})
          </p>
          <TransactionChartContent>
            <Chart type={ChartType.Linear} data={getTransactionChartData()} />
          </TransactionChartContent>
        </TransactionChart>
      </TransactionContainer>
    </Section>
  );
};

export default HomeTransactions;
