import { ArrowRight } from '@/assets/icons';
import { getStatusIcon } from '@/assets/status';
import Copy from '@/components/Copy';
import Table, { ITable } from '@/components/Table';
import { Status } from '@/components/Table/styles';
import {
  Contract,
  IContract,
  IInnerTableProps,
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

  const rowSections = (props: ITransaction): JSX.Element[] => {
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
      <CenteredRow className="bucketIdCopy" key={hash}>
        <Link href={`/transaction/${hash}`}>{parseAddress(hash, 24)}</Link>
        <Copy info="TXHash" data={hash} />
      </CenteredRow>,
      <Link href={`/block/${blockNum}`} key={blockNum}>
        <a className="address">{blockNum || 0}</a>
      </Link>,
      <small key={timestamp}>
        {format(fromUnixTime(timestamp / 1000), 'MM/dd/yyyy HH:mm')}
      </small>,
      <Link href={`/account/${sender}`} key={sender}>
        <a className="address">{parseAddress(sender, 16)}</a>
      </Link>,
      !isMobile ? <ArrowRight /> : <></>,
      <Link href={`/account/${toAddress}`} key={toAddress}>
        <a className="address">{parseAddress(toAddress, 16)}</a>
      </Link>,
      <Status status={status} key={status}>
        <StatusIcon />
        <span>{capitalizeString(status)}</span>
      </Status>,
      <strong key={contractType}>{contractType}</strong>,
      <strong key={amount}>{amount}</strong>,
      <strong key={assetId}>{assetId}</strong>,
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
    columnSpans: [2, 1, 1, 1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  };

  return <Table {...tableProps} />;
};

export default Transactions;
