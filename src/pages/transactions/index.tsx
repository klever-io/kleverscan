import { ArrowRight } from '@/assets/icons';
import { getStatusIcon } from '@/assets/status';
import { Transactions as Icon } from '@/assets/title-icons';
import Copy from '@/components/Copy';
import DateFilter, {
  IDateFilter,
  ISelectedDays,
} from '@/components/DateFilter';
import Title from '@/components/Layout/Title';
import { MultiContractToolTip } from '@/components/MultiContractToolTip';
import Table, { ITable } from '@/components/Table';
import { Status } from '@/components/Table/styles';
import TransactionsFilters from '@/components/TransactionsFilters';
import { useMobile } from '@/contexts/mobile';
import api from '@/services/api';
import { KLV_PRECISION } from '@/utils/globalVariables';
import { CenteredRow } from '@/views/accounts/detail';
import { Container, FilterByDate, Header } from '@/views/transactions';
import { Input } from '@/views/transactions/detail';
import { NextParsedUrlQuery } from 'next/dist/server/request-meta';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { IReceipt, IRowSection, ITransaction } from '../../types';
import { Contract, IContract, ITransferContract } from '../../types/contracts';
import {
  capitalizeString,
  formatAmount,
  formatDate,
  getPrecision,
  parseAddress,
} from '../../utils';
import {
  contractTypes,
  filteredSections,
  getHeaderForTable,
  initialsTableHeaders,
} from '../../utils/contracts';

const Transactions: React.FC = () => {
  const router = useRouter();
  const { isMobile, isTablet } = useMobile();

  const setQueryAndRouter = (newQuery: NextParsedUrlQuery) => {
    router.push({ pathname: router.pathname, query: newQuery }, undefined, {
      shallow: true,
    });
  };

  const getContractType = useCallback(contractTypes, []);

  const requestTransactions = async (page: number, limit: number) => {
    while (!router.isReady) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const localQuery = { ...router.query, page, limit };
    const transactionsResponse = await api.get({
      route: `transaction/list`,
      query: localQuery,
    });

    const assets: string[] = [];

    transactionsResponse?.data?.transactions.forEach(
      (transaction: ITransaction) => {
        if (transaction.contract && transaction.contract.length) {
          transaction.contract.forEach(contract => {
            if (contract.parameter === undefined) return;

            if ('assetId' in contract.parameter && contract.parameter.assetId) {
              assets.push(contract.parameter.assetId);
            }
            if (
              'currencyID' in contract.parameter &&
              contract.parameter.currencyID
            ) {
              assets.push(contract.parameter.currencyID);
            }
          });
        }
      },
    );

    const assetPrecisions = await getPrecision(assets);

    const parsedTransactions = transactionsResponse.data.transactions.map(
      (transaction: ITransaction) => {
        if (transaction.contract && transaction.contract.length) {
          transaction.contract.forEach(contract => {
            if (contract.parameter === undefined) return;

            if ('assetId' in contract.parameter && contract.parameter.assetId) {
              transaction.precision =
                assetPrecisions[contract.parameter.assetId];
            }
            if (
              'currencyID' in contract.parameter &&
              contract.parameter.currencyID
            ) {
              transaction.precision =
                assetPrecisions[contract.parameter.currencyID];
            }
          });
        }
        return transaction;
      },
    );

    return {
      ...transactionsResponse,
      data: {
        transactions: parsedTransactions,
      },
    };
  };

  const getFilteredSections = (
    contract: IContract[],
    receipts: IReceipt[],
    precision?: number,
  ): IRowSection[] => {
    const contractType = getContractType(contract);
    return filteredSections(contract, contractType, receipts, precision);
  };

  const rowSections = (props: ITransaction): IRowSection[] => {
    const {
      hash,
      blockNum,
      timestamp,
      sender,
      receipts,
      contract,
      kAppFee,
      bandwidthFee,
      status,
      precision,
    } = props;

    const StatusIcon = getStatusIcon(status);
    let toAddress = '--';
    const contractType = getContractType(contract);

    if (contractType === Contract.Transfer) {
      const parameter = contract[0].parameter as ITransferContract;

      toAddress = parameter.toAddress;
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
          <Link href={`/block/${blockNum || 0}`} key={blockNum}>
            <a className="address">{blockNum || 0}</a>
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
      {
        element:
          contractType === 'Multi contract' ? (
            <MultiContractToolTip
              contract={contract}
              contractType={contractType}
            />
          ) : (
            <strong key={contractType}>{contractType}</strong>
          ),
        span: 1,
      },
      {
        element: contractType ? (
          <strong>{formatAmount(kAppFee / 10 ** KLV_PRECISION)}</strong>
        ) : (
          <></>
        ),
        span: 1,
      },
      {
        element: !router.query.type ? (
          <strong>{formatAmount(bandwidthFee / 10 ** KLV_PRECISION)}</strong>
        ) : (
          <></>
        ),
        span: 1,
      },
    ];
    const filteredContract = getFilteredSections(contract, receipts, precision);

    if (router.query.type) {
      sections.pop();
      sections.pop();
      sections.push(...filteredContract);
    }

    return sections;
  };

  const header = [...initialsTableHeaders, 'kApp Fee', 'Bandwidth Fee'];

  const tableProps: ITable = {
    type: 'transactions',
    header: getHeaderForTable(router, header),
    rowSections,
    dataName: 'transactions',
    scrollUp: true,
    request: (page, limit) => requestTransactions(page, limit),
  };

  const resetDate = () => {
    const updatedQuery = { ...router.query };
    delete updatedQuery.startdate;
    delete updatedQuery.enddate;
    setQueryAndRouter(updatedQuery);
  };
  const filterDate = (selectedDays: ISelectedDays) => {
    setQueryAndRouter({
      ...router.query,
      startdate: selectedDays.start.getTime().toString(),
      enddate: selectedDays.end
        ? (selectedDays.end.getTime() + 24 * 60 * 60 * 1000).toString()
        : (selectedDays.start.getTime() + 24 * 60 * 60 * 1000).toString(),
    });
  };
  const dateFilterProps: IDateFilter = {
    resetDate,
    filterDate,
  };

  const transactionsFiltersProps = {
    setQuery: setQueryAndRouter,
  };

  return (
    <Container>
      <Title title="Transactions" Icon={Icon} />

      <Header>
        <div>
          <TransactionsFilters
            {...transactionsFiltersProps}
          ></TransactionsFilters>
          <FilterByDate>
            <DateFilter {...dateFilterProps} />
          </FilterByDate>
        </div>
        <div>
          <Input />
        </div>
      </Header>
      <Table {...tableProps} />
    </Container>
  );
};

export default Transactions;
