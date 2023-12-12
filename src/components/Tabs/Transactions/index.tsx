import { ArrowRight } from '@/assets/icons';
import { getStatusIcon } from '@/assets/status';
import Copy from '@/components/Copy';
import { MultiContractToolTip } from '@/components/MultiContractToolTip';
import Table, { ITable } from '@/components/Table';
import { Status } from '@/components/Table/styles';
import { useMobile } from '@/contexts/mobile';
import { toAddressSectionElement } from '@/pages/transactions';
import { CenteredRow } from '@/styles/common';
import {
  Contract,
  ContractsName,
  IContract,
  ITransferContract,
} from '@/types/contracts';
import {
  IInnerTableProps,
  IReceipt,
  IRowSection,
  ITransaction,
} from '@/types/index';
import {
  contractTypes,
  filteredSections,
  getHeaderForTable,
  initialsTableHeaders,
} from '@/utils/contracts';
import { capitalizeString } from '@/utils/convertString';
import { formatAmount, formatDate } from '@/utils/formatFunctions';
import { KLV_PRECISION } from '@/utils/globalVariables';
import { parseAddress } from '@/utils/parseValues';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';

interface ITransactionsProps {
  transactionsTableProps: IInnerTableProps;
}

const Transactions: React.FC<ITransactionsProps> = props => {
  const { t } = useTranslation('table');
  const router = useRouter();
  const { isMobile } = useMobile();

  const defaultHeader = [
    ...initialsTableHeaders(t),
    t('Blocks.kApp Fees'),
    t('Transactions.Bandwidth Fee'),
  ];
  const queryHeader = getHeaderForTable(router, defaultHeader, t);
  const getContractType = useCallback(contractTypes, []);
  const getFilteredSections = (
    contract: IContract[],
    receipts: IReceipt[],
    precision?: number,
  ): IRowSection[] => {
    const contractType = getContractType(contract);
    const filteredSectionsResult = filteredSections(
      contract,
      contractType,
      receipts,
      precision,
    );
    if (contractType === 'Multi contract') {
      const extraHeadersLength =
        queryHeader.length - initialsTableHeaders.length;
      return Array(extraHeadersLength)
        .fill(extraHeadersLength)
        .map(_ => ({ element: <span>--</span>, span: 1 }));
    }
    return filteredSectionsResult;
  };

  const rowSections = (props: ITransaction): IRowSection[] => {
    const {
      hash,
      blockNum,
      timestamp,
      sender,
      contract,
      receipts,
      status,
      kAppFee,
      bandwidthFee,
      precision,
    } = props;

    const StatusIcon = getStatusIcon(status);
    let toAddress = '--';
    let assetId = '--';
    let amount = '--';

    const contractType = getContractType(contract);

    if (contractType === Contract.Transfer) {
      const parameter = contract[0].parameter as ITransferContract;

      toAddress = parameter.toAddress;
      if (precision) amount = formatAmount(parameter.amount / 10 ** precision);

      if (parameter.assetId) {
        assetId = parameter.assetId;
      }
      if (!parameter.assetId) assetId = 'KLV';
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
            <a className="address" data-testid="blockNum">
              {blockNum || 0}
            </a>
          </Link>
        ),
        span: 1,
      },
      {
        element: <small key={timestamp}>{formatDate(timestamp)}</small>,
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
        element: toAddressSectionElement(toAddress),
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
      {
        element:
          contractType === 'Multi contract' ? (
            <MultiContractToolTip
              contract={contract}
              contractType={contractType}
            />
          ) : (
            <strong key={contractType}>{ContractsName[contractType]}</strong>
          ),
        span: 1,
      },
      {
        element: <strong key={kAppFee}>{kAppFee / 10 ** KLV_PRECISION}</strong>,
        span: 1,
      },
      {
        element: (
          <strong key={kAppFee}>{bandwidthFee / 10 ** KLV_PRECISION}</strong>
        ),
        span: 1,
      },
    ];

    const filteredContract = getFilteredSections(contract, receipts, precision);
    if (router?.query?.type) {
      sections.pop();
      sections.pop();
      sections.push(...filteredContract);
    }

    return sections;
  };

  const transactionTableProps = props.transactionsTableProps;

  const tableProps: ITable = {
    ...transactionTableProps,
    rowSections,
    header: router?.query?.type ? queryHeader : defaultHeader,
    type: 'transactions',
  };

  return <Table {...tableProps} />;
};

export default Transactions;
