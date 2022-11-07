import { ArrowRight } from '@/assets/icons';
import { getStatusIcon } from '@/assets/status';
import Copy from '@/components/Copy';
import Table, { ITable } from '@/components/Table';
import { Status } from '@/components/Table/styles';
import { useMobile } from '@/contexts/mobile';
import {
  Contract,
  IContract,
  IInnerTableProps,
  IRowSection,
  ITransaction,
  ITransferContract,
} from '@/types/index';
import {
  capitalizeString,
  contractTypes,
  filteredSections,
  formatAmount,
  getHeader,
  initialsTableHeaders,
  parseAddress,
} from '@/utils/index';
import { CenteredRow } from '@/views/accounts/detail';
import { format, fromUnixTime } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';

interface ITransactionsProps {
  transactions: ITransaction[];
  precision?: number;
  transactionsTableProps: IInnerTableProps;
}

const Transactions: React.FC<ITransactionsProps> = props => {
  const precision = props.precision || 6;
  const router = useRouter();

  const getContractType = useCallback(contractTypes, []);

  const getFilteredSections = (contract: IContract[]): IRowSection[] => {
    const contractType = getContractType(contract);
    return filteredSections(contract, contractType);
  };

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
      if (!parameter.assetId) assetId = 'KLV';
    }

    const assetIdSection = () => {
      if (contractType === Contract.Transfer) {
        return (
          <Link href={`/asset/${assetId}`} key={assetId}>
            <a>
              <strong>{assetId}</strong>
            </a>
          </Link>
        );
      }

      return <strong>{assetId}</strong>;
    };
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
      { element: <strong key={contractType}>{contractType}</strong>, span: 1 },
      { element: <strong key={amount}>{amount}</strong>, span: 1 },
      {
        element: assetIdSection(),
        span: 1,
      },
    ];

    const filteredContract = getFilteredSections(contract);

    if (router.query.type) {
      sections.pop();
      sections.pop();
      sections.push(...filteredContract);
    }

    return sections;
  };

  const header = [...initialsTableHeaders, 'Amount', 'Asset Id'];

  const transactionTableProps = props.transactionsTableProps;

  const tableProps: ITable = {
    ...transactionTableProps,
    rowSections: rowSections,
    data: Object.values(props.transactions) as any[],
    header: getHeader(router, header),
    type: 'transactions',
  };

  return <Table {...tableProps} />;
};

export default Transactions;
