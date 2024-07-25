import { PropsWithChildren } from 'react';
import Table, { ITable } from '@/components/Table';
import TransactionsFilters from '@/components/TransactionsFilters';
import { transactionRowSections } from '@/pages/transactions';
import { IInnerTableProps } from '@/types/index';
import { transactionTableHeaders } from '@/utils/contracts';
import React from 'react';

interface ITransactionsProps {
  transactionsTableProps: IInnerTableProps;
}

const Transactions: React.FC<PropsWithChildren<ITransactionsProps>> = props => {
  const transactionTableProps = props.transactionsTableProps;

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
