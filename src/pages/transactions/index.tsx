import { getStatusIcon } from '@/assets/status';
import { Transactions as Icon } from '@/assets/title-icons';
import Copy from '@/components/Copy';
import DateFilter, {
  IDateFilter,
  ISelectedDays,
} from '@/components/DateFilter';
import Title from '@/components/Layout/Title';
import { MultiContractToolTip } from '@/components/MultiContractToolTip';
import Table, { ITable } from '@/components/TableV2';
import TransactionsFilters from '@/components/TransactionsFilters';
import api from '@/services/api';
import { CenteredRow, Container, DoubleRow, Header } from '@/styles/common';
import { setQueryAndRouter } from '@/utils';
import { capitalizeString } from '@/utils/convertString';
import { formatAmount, formatDate } from '@/utils/formatFunctions';
import { KLV_PRECISION } from '@/utils/globalVariables';
import { parseAddress } from '@/utils/parseValues';
import { getPrecision } from '@/utils/precisionFunctions';
import { FilterByDate } from '@/views/transactions';
import Link from 'next/link';
import { NextRouter, useRouter } from 'next/router';
import React, { useCallback } from 'react';
import {
  IAssetTransactionResponse,
  IReceipt,
  IRowSection,
  ITransaction,
} from '../../types';
import {
  Contract,
  ContractsName,
  IContract,
  ITransferContract,
} from '../../types/contracts';
import {
  contractTypes,
  filteredSections,
  getHeaderForTable,
  initialsTableHeaders,
} from '../../utils/contracts';

interface IRequestTxQuery {
  asset?: string;
}

export const toAddressSectionElement = (toAddress: string): JSX.Element => {
  if (toAddress === '--') {
    return (
      <span data-testid="toAddressEmpty" style={{ cursor: 'default' }}>
        {toAddress}
      </span>
    );
  }
  return (
    <Link href={`/account/${toAddress}`} key={toAddress}>
      <a className="address">{parseAddress(toAddress, 16)}</a>
    </Link>
  );
};

export const requestTransactionsDefault = async (
  page: number,
  limit: number,
  router: NextRouter,
  query?: IRequestTxQuery,
): Promise<IAssetTransactionResponse> => {
  while (!router.isReady) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  const localQuery = { ...router.query, page, limit };
  const transactionsResponse = await api.get({
    route: `transaction/list`,
    query: query ?? localQuery,
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

  const parsedTransactions = transactionsResponse.data?.transactions?.map(
    (transaction: ITransaction) => {
      if (transaction.contract && transaction.contract.length) {
        transaction.contract.forEach(contract => {
          if (contract.parameter === undefined) return;

          if ('assetId' in contract.parameter && contract.parameter.assetId) {
            transaction.precision = assetPrecisions[contract.parameter.assetId];
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

const Transactions: React.FC = () => {
  const router = useRouter();

  const defaultHeader = [...initialsTableHeaders];
  const queryHeader = getHeaderForTable(router, defaultHeader);
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
      receipts,
      contract,
      kAppFee,
      bandwidthFee,
      status,
      precision,
    } = props;

    const StatusIcon = getStatusIcon(status);
    let toAddress = '- -';
    const contractType = getContractType(contract);

    if (contractType === Contract.Transfer) {
      const parameter = contract[0].parameter as ITransferContract;

      toAddress = parameter.toAddress;
    }

    const sections = [
      {
        element: (
          <DoubleRow key={hash}>
            <CenteredRow className="bucketIdCopy">
              <Link href={`/transaction/${hash}`}>
                {parseAddress(hash, 24)}
              </Link>
              <Copy info="TXHash" data={hash} />
            </CenteredRow>
            <CenteredRow>
              <div>{formatDate(timestamp)}</div>
              <div>{capitalizeString(status)}</div>
            </CenteredRow>
          </DoubleRow>
        ),
        span: 2,
      },
      {
        element: (
          <DoubleRow key={blockNum}>
            <Link href={`/block/${blockNum || 0}`}>
              <a className="address">{blockNum || 0}</a>
            </Link>

            <strong>
              {formatAmount((kAppFee + bandwidthFee) / 10 ** KLV_PRECISION)} KLV
            </strong>
          </DoubleRow>
        ),
        span: 1,
      },
      {
        element: (
          <DoubleRow key={sender}>
            <Link href={`/account/${sender}`}>
              <a className="address">{parseAddress(sender, 16)}</a>
            </Link>
            {toAddressSectionElement(toAddress)}
          </DoubleRow>
        ),
        span: 1,
      },
      {
        element:
          contractType === 'Multi contract' ? (
            <DoubleRow>
              <MultiContractToolTip
                contract={contract}
                contractType={contractType}
              />
              <CenteredRow>- -</CenteredRow>
            </DoubleRow>
          ) : (
            <DoubleRow>
              <CenteredRow key={contractType}>
                {ContractsName[contractType]}
              </CenteredRow>
              <CenteredRow>amount</CenteredRow>
            </DoubleRow>
          ),
        span: 1,
      },
      {
        element: contractType ? (
          <DoubleRow>
            <strong>misc 1</strong>
            <strong>misc 2</strong>
          </DoubleRow>
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

  const resetDate = () => {
    const updatedQuery = { ...router.query };
    delete updatedQuery.startdate;
    delete updatedQuery.enddate;
    setQueryAndRouter(updatedQuery, router);
  };
  const filterDate = (selectedDays: ISelectedDays) => {
    setQueryAndRouter(
      {
        ...router.query,
        startdate: selectedDays.start.getTime().toString(),
        enddate: selectedDays.end
          ? (selectedDays.end.getTime() + 24 * 60 * 60 * 1000).toString()
          : (selectedDays.start.getTime() + 24 * 60 * 60 * 1000).toString(),
      },
      router,
    );
  };
  const dateFilterProps: IDateFilter = {
    resetDate,
    filterDate,
  };

  const transactionsFiltersProps = {
    setQuery: setQueryAndRouter,
  };

  const Filters = () => {
    return (
      <>
        <TransactionsFilters
          {...transactionsFiltersProps}
        ></TransactionsFilters>
        <FilterByDate>
          <DateFilter {...dateFilterProps} />
        </FilterByDate>
      </>
    );
  };

  const tableProps: ITable = {
    type: 'transactions',
    header: queryHeader,
    rowSections,
    dataName: 'transactions',
    scrollUp: true,
    request: (page, limit) => requestTransactionsDefault(page, limit, router),
    Filters,
  };

  return (
    <Container>
      <Header>
        <Title title="Transactions" Icon={Icon} />
      </Header>

      <Table {...tableProps} />
    </Container>
  );
};

export default Transactions;
