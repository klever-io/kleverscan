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

const Transactions: React.FC<ITransaction[]> = props => {
  const getContractType = (contracts: IContract[]) =>
    contracts.length > 1
      ? 'Multi contract'
      : Object.values(Contract)[contracts[0].type];

  const TableBody: React.FC<ITransaction> = props => {
    const { hash, blockNum, timestamp, sender, contract, status } = props;

    const StatusIcon = getStatusIcon(status);
    let toAddress = '--';
    const contractType = getContractType(contract);

    if (contractType === Contract.Transfer) {
      const parameter = contract[0].parameter as ITransferContract;

      toAddress = parameter.ownerAddress;
    }

    return (
      <Row type="transactions">
        <span>
          <Link href={`/transactions/${hash}`}>{hash}</Link>
        </span>
        <span>{blockNum}</span>
        <span>
          <small>
            {format(fromUnixTime(timestamp / 1000), 'MM/dd/yyyy HH:mm')}
          </small>
        </span>
        <span>{sender}</span>
        <span>
          <ArrowRight />
        </span>
        <span>{toAddress}</span>
        <Status status={status}>
          <StatusIcon />
          <span>{status}</span>
        </Status>
        <span>
          <strong>{contractType}</strong>
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
  ];

  const tableProps: ITable = {
    body: TableBody,
    data: Object.values(props) as any[],
    loading: false,
    header,
    type: 'transactions',
  };

  return <Table {...tableProps} />;
};

export default Transactions;
