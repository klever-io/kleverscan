import { ArrowRight } from '@/assets/icons';
import { getStatusIcon } from '@/assets/status';
import Copy from '@/components/Copy';
import Table, { ITable } from '@/components/Table';
import { Status } from '@/components/Table/styles';
import {
  Contract,
  IContract,
  IInnerTableProps,
  IRowSection,
  ITransaction,
  ITransferContract,
} from '@/types/index';
import { capitalizeString, formatAmount, parseAddress } from '@/utils/index';
import { CenteredRow } from '@/views/accounts/detail';
import { useMobile } from 'contexts/mobile';
import { format, fromUnixTime } from 'date-fns';
import Link from 'next/link';
import React from 'react';

interface ITransactionsProps {
  transactions: ITransaction[];
  precision?: number;
  transactionsTableProps: IInnerTableProps;
}

const Transactions: React.FC<ITransactionsProps> = props => {
  const getContractType = (contracts: IContract[]) =>
    contracts.length > 1
      ? 'Multi contract'
      : Object.values(Contract)[contracts[0].type];
  const precision = props.precision || 6;

  const { isMobile } = useMobile();

  const rowSections = (props: ITransaction): IRowSection[] => {
    const { hash, blockNum, timestamp, sender, contract, status } = props;

    const StatusIcon = getStatusIcon(status);
    let toAddress = '--';
    let amount = '--';
    let assetId = '--';

    const contractType = getContractType(contract);

    if (contractType === Contract.Transfer) {
      const parameter = contract[0].parameter as ITransferContract;

      toAddress = parameter.toAddress;
      amount = formatAmount(parameter.amount / 10 ** precision);
      if (parameter.assetId) {
        assetId = parameter.assetId;
      }
    }
    const sections = [
      {
        element: (
          <CenteredRow className="bucketIdCopy" key={hash}>
            <Link href={`/transaction/${hash}`}>{parseAddress(hash, 24)}</Link>
            <Copy info="TXHash" data={hash} />
          </CenteredRow>
        ),
        span: 2,
      },
      {
        element: (
          <Link href={`/block/${blockNum}`} key={blockNum}>
            <a className="address">{blockNum || 0}</a>
          </Link>
        ),
        span: 1,
      },
      {
        element: (
          <small key={timestamp}>
            {format(fromUnixTime(timestamp / 1000), 'MM/dd/yyyy HH:mm')}
          </small>
        ),
        span: 1,
      },
      {
        element: (
          <Link href={`/account/${sender}`} key={sender}>
            <a className="address">{parseAddress(sender, 16)}</a>
          </Link>
        ),
        span: 1,
      },
      { element: !isMobile ? <ArrowRight /> : <></>, span: -1 },
      {
        element: (
          <Link href={`/account/${toAddress}`} key={toAddress}>
            <a className="address">{parseAddress(toAddress, 16)}</a>
          </Link>
        ),
        span: 1,
      },
      {
        element: (
          <Status status={status} key={status}>
            <StatusIcon />
            <span>{capitalizeString(status)}</span>
          </Status>
        ),
        span: 1,
      },
      { element: <strong key={contractType}>{contractType}</strong> },
      { element: <strong key={amount}>{amount}</strong> },
      { element: <strong key={assetId}>{assetId}</strong> },
    ];
    return sections;
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
    'Asset Id',
  ];

  const transactionTableProps = props.transactionsTableProps;

  const tableProps: ITable = {
    ...transactionTableProps,
    rowSections: rowSections,
    data: Object.values(props.transactions) as any[],
    header,
    type: 'transactions',
  };

  return <Table {...tableProps} />;
};

export default Transactions;
