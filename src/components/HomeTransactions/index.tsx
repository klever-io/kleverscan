import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { format } from 'date-fns';

import {
  Section,
  TransactionContainer,
  TransactionContent,
  TransactionChart,
  TransactionChartContent,
  TransactionEmpty,
} from '@/views/home';

import Chart, { ChartType } from '@/components/Chart';
import TransactionItem from '../TransactionItem';

import api from '@/services/api';

import { ITransactionResponse, IHomeTransactions } from '../../types';

const HomeTransactions: React.FC<IHomeTransactions> = ({
  setTotalTransactions,
  transactionsList,
  transactions: defaultTransactions,
  precision,
}) => {
  const router = useRouter();
  const [transactions, setTransactions] = useState(defaultTransactions);

  const transactionsWatcherInterval = 4 * 1000;

  useEffect(() => {
    const transactionsWatcher = setInterval(async () => {
      const transactions: ITransactionResponse = await api.get({
        route: 'transaction/list',
      });
      if (!transactions.error) {
        // Animation / Re-render bug START
        setTransactions(transactions.data.transactions);
        // Animation / Re-render bug END
        setTotalTransactions(transactions.pagination.totalRecords);
      }
    }, transactionsWatcherInterval);

    return () => {
      clearInterval(transactionsWatcher);
    };
  }, []);

  const getTransactionChartData = () => {
    const sortedTransactionsList = transactionsList.sort(
      (a, b) => a.key - b.key,
    );
    return sortedTransactionsList.map(transaction => {
      if (transaction.key) {
        // Create date object
        const date = new Date(transaction.key);
        // Set timezone to UTC
        date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
        return {
          date: format(date, 'dd MMM'),
          value: transaction.doc_count,
        };
      }
    });
  };

  return (
    <Section>
      <h1 onClick={() => router.push(`/transactions`)}>Transactions</h1>
      <TransactionContainer>
        <TransactionContent>
          {transactions.length === 0 && (
            <TransactionEmpty>
              <span>Oops! Apparently no data here.</span>
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
          <span>Daily Transactions</span>
          <p>
            ({transactionsList.length} day
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
