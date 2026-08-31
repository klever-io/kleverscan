import { PropsWithChildren } from 'react';
import Table, { ITable } from '@/components/Table';
import TransactionsFilters from '@/components/TransactionsFilters';
import TransactionsMobileCard from '@/components/TransactionsList/MobileCard';
import { TransactionsTableWrapper } from '@/components/TransactionsList/styles';
import { useTransactionHeaders } from '@/components/TransactionsList/useTransactionHeaders';
import { useTransactionRowSections } from '@/pages/transactions';
import { IInnerTableProps } from '@/types/index';
import React from 'react';

interface ITransactionsProps {
  transactionsTableProps: IInnerTableProps;
}

const Transactions: React.FC<PropsWithChildren<ITransactionsProps>> = props => {
  const transactionTableProps = props.transactionsTableProps;
  // This wrapper used to widen the heading list itself, by copying the base
  // list and splicing "In/Out" in at index 3 whenever the URL named an
  // account. It was the only one of the four call sites that did, which is
  // why the other three rendered a heading short.
  const header = useTransactionHeaders();
  const rowSections = useTransactionRowSections();

  const tableProps: ITable = {
    ...transactionTableProps,
    rowSections,
    header,
    type: 'transactions',
    Filters: TransactionsFilters,
    MobileCard: TransactionsMobileCard,
    singleLineSkeleton: true,
  };

  return (
    <TransactionsTableWrapper>
      <Table {...tableProps} />
    </TransactionsTableWrapper>
  );
};

export default Transactions;
