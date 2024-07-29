import { PropsWithChildren } from 'react';
import Table, { ITable } from '@/components/Table';
import TransactionsFilters from '@/components/TransactionsFilters';
import { transactionRowSections } from '@/pages/transactions';
import { IInnerTableProps } from '@/types/index';
import { transactionTableHeaders } from '@/utils/contracts';
import React from 'react';
import { useRouter } from 'next/router';

interface ITransactionsProps {
  transactionsTableProps: IInnerTableProps;
}

const Transactions: React.FC<PropsWithChildren<ITransactionsProps>> = props => {
  const transactionTableProps = props.transactionsTableProps;
  const router = useRouter();

  if (router?.query?.account && !transactionTableHeaders.includes('In/Out')) {
    transactionTableHeaders.splice(3, 0, 'In/Out');
  }
  const tableProps: ITable = {
    ...transactionTableProps,
    rowSections: transactionRowSections,
    header: transactionTableHeaders,
    type: 'transactions',
    Filters: TransactionsFilters,
  };

  return <Table {...tableProps} />;
};

export default Transactions;
