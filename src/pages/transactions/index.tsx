import React, { useState } from 'react';

import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { format, fromUnixTime } from 'date-fns';

import List, { IList } from '../../components/Layout/List';

import { Contract, IPagination, IResponse, ITransaction } from '../../types';

import api from '../../services/api';
import { navbarItems } from '../../configs/navbar';

interface ITransactionPage {
  transactions: ITransaction[];
  pagination: IPagination;
}

interface ITransactionResponse extends IResponse {
  data: {
    transactions: ITransaction[];
  };
  pagination: IPagination;
}

const Transactions: React.FC<ITransactionPage> = ({
  transactions: initialTransactions,
  pagination,
}) => {
  const title = 'Transactions';
  const Icon = navbarItems.find(item => item.name === 'Transactions')?.Icon;
  const maxItems = pagination.totalRecords;
  const headers = ['Hash', 'Block', 'Created', 'Address', 'Contract'];

  const [transactions, setTransactions] =
    useState<ITransaction[]>(initialTransactions);
  const [page, setPage] = useState(1);

  const loadMore = async () => {
    const newTransactions: ITransactionResponse = await api.get({
      route: 'transaction/list',
      query: { page },
    });
    if (!newTransactions.error) {
      setTransactions([...transactions, ...newTransactions.data.transactions]);

      const next = newTransactions.pagination.next;
      if (next !== 0) {
        setPage(next);
      }
    }
  };

  const listProps: IList = {
    title,
    Icon,
    maxItems,
    listSize: transactions.length,
    headers,
    loadMore,
  };

  const renderItems = () =>
    transactions.map((transaction, index) => {
      const created = format(
        fromUnixTime(transaction.timestamp),
        'MM/dd/yyyy HH:mm',
      );
      const contract = transaction.contract
        .map(contract => Object.values(Contract)[contract.type])
        .join(', ');

      return (
        <tr key={String(index)}>
          <td>
            <span>
              <Link href={`/transactions/${transaction.hash}`}>
                {transaction.hash}
              </Link>
            </span>
          </td>
          <td>
            <Link href={`/blocks/${transaction.blockNum}`}>
              <a>{transaction.blockNum}</a>
            </Link>
          </td>
          <td>{created}</td>
          <td>
            <span>
              <Link href={`/accounts/${transaction.sender}`}>
                {transaction.sender}
              </Link>
            </span>
          </td>
          <td>{contract}</td>
        </tr>
      );
    });

  return <List {...listProps}>{renderItems()}</List>;
};

export const getServerSideProps: GetServerSideProps<ITransactionPage> =
  async () => {
    const props: ITransactionPage = {
      transactions: [],
      pagination: {} as IPagination,
    };

    const transactions: ITransactionResponse = await api.get({
      route: 'transaction/list',
    });
    if (!transactions.error) {
      props.transactions = transactions.data.transactions;
      props.pagination = transactions.pagination;
    }

    return { props };
  };

export default Transactions;
