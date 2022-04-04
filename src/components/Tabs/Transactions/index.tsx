import React from 'react';

import Link from 'next/link';
import { format, fromUnixTime } from 'date-fns';

import Table, { ITable } from '@/components/Table';
import { Row, Status } from '@/components/Table/styles';

import {
  Contract,
  IContract,
  ITransaction,
  ITransferContract,
} from '@/types/index';

import { ArrowRight } from '@/assets/icons';
import { getStatusIcon } from '@/assets/status';
import { capitalizeString, formatAmount, parseAddress } from '@/utils/index';

interface ITransactionsProps {
  transactions: ITransaction[];
  precision?: number;
  loading: boolean;
}

const Transactions: React.FC<ITransactionsProps> = props => {
  const getContractType = (contracts: IContract[]) =>
    contracts.length > 1
      ? 'Multi contract'
      : Object.values(Contract)[contracts[0].type];
  const precision = props.precision || 6;

  const TableBody: React.FC<ITransaction> = props => {
    const { hash, blockNum, timestamp, sender, contract, status } = props;

    const StatusIcon = getStatusIcon(status);
    let toAddress = '--';
    let amount = '--';

    const contractType = getContractType(contract);

    if (contractType === Contract.Transfer) {
      const parameter = contract[0].parameter as ITransferContract;

      toAddress = parameter.toAddress;
      amount = formatAmount(parameter.amount / 10 ** precision);
    }
    return (
      <Row type="transactions">
        <span>
          <Link href={`/transaction/${hash}`}>{hash}</Link>
        </span>
        <span>{blockNum || 0}</span>
        <span>
          <small>
            {format(fromUnixTime(timestamp / 1000), 'MM/dd/yyyy HH:mm')}
          </small>
        </span>
        <Link href={`/account/${sender}`}>
          <a className="address">{parseAddress(sender, 12)}</a>
        </Link>
        <span>
          <ArrowRight />
        </span>
        <Link href={`/account/${toAddress}`}>
          <a className="address">{parseAddress(toAddress, 12)}</a>
        </Link>
        <Status status={status}>
          <StatusIcon />
          <span>{capitalizeString(status)}</span>
        </Status>
        <span>
          <strong>{contractType}</strong>
        </span>
        <span>
          <strong>{amount}</strong>
        </span>
      </Row>
    );
  };

  const header = [
    'Hash',
    'Block',
    'Created',
    'From',
    '',
    'To',
    'Status',
    'Contract',
    'Amount',
  ];

  const tableProps: ITable = {
    body: TableBody,
    data: Object.values(props.transactions) as any[],
    loading: props.loading,
    header,
    type: 'transactions',
  };

  return <Table {...tableProps} />;
};

export default Transactions;
