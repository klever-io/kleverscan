import { ArrowRight } from '@/assets/icons';
import { getStatusIcon } from '@/assets/status';
import { Transactions as Icon } from '@/assets/title-icons';
import Copy from '@/components/Copy';
import DateFilter, {
  IDateFilter,
  ISelectedDays,
} from '@/components/DateFilter';
import Title from '@/components/Layout/Title';
import Table, { ITable } from '@/components/Table';
import { Status } from '@/components/Table/styles';
import Tooltip from '@/components/Tooltip';
import TransactionsFilters from '@/components/TransactionsFilters';
import { useMobile } from '@/contexts/mobile';
import api from '@/services/api';
import { CenteredRow } from '@/views/accounts/detail';
import {
  Container,
  FilterByDate,
  Header,
  MultiContractContainer,
  MultiContractCounter,
} from '@/views/transactions';
import { Input } from '@/views/transactions/detail';
import { format, fromUnixTime } from 'date-fns';
import { GetServerSideProps } from 'next';
import { NextParsedUrlQuery } from 'next/dist/server/request-meta';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import {
  Contract,
  ContractsIndex,
  IAsset,
  IContract,
  IPagination,
  IResponse,
  IRowSection,
  ITransaction,
  ITransferContract,
  ReducedContract,
} from '../../types';
import {
  capitalizeString,
  contractTypes,
  filteredSections,
  formatAmount,
  getHeader,
  initialsTableHeaders,
  parseAddress,
} from '../../utils';

interface ITransactions {
  transactions: ITransaction[];
  pagination: IPagination;
  assets: IAsset[];
}

interface ITransactionResponse extends IResponse {
  data: {
    transactions: ITransaction[];
  };
  pagination: IPagination;
}

interface IAssetResponse extends IResponse {
  data: {
    assets: IAsset[];
  };
}

const Transactions: React.FC<ITransactions> = ({
  transactions: defaultTransactions,
  pagination,
  assets,
}) => {
  const router = useRouter();
  const precision = 6; // default KLV precision
  const { isMobile, isTablet } = useMobile();

  const setQueryAndRouter = (newQuery: NextParsedUrlQuery) => {
    router.push({ pathname: router.pathname, query: newQuery }, undefined, {
      shallow: true,
    });
  };

  const getContractType = useCallback(contractTypes, []);

  const requestTransactions = async (page: number, limit?: number) =>
    api.get({
      route: `transaction/list`,
      query: { page, limit, ...router.query },
    });

  const getFilteredSections = (contract: IContract[]): IRowSection[] => {
    const contractType = getContractType(contract);
    return filteredSections(contract, contractType);
  };

  const rowSections = (props: ITransaction): IRowSection[] => {
    const {
      hash,
      blockNum,
      timestamp,
      sender,
      contract,
      kAppFee,
      bandwidthFee,
      status,
    } = props;

    const reduceContracts = (): ReducedContract => {
      const reducedContract: ReducedContract = {};
      contract.forEach(contrct => {
        if (!reducedContract[contrct.type]) {
          reducedContract[contrct.type] = 1;
        } else {
          reducedContract[contrct.type] += 1;
        }
      });
      return reducedContract;
    };

    const renderContracts = () => {
      let msg = '';
      Object.entries(reduceContracts()).forEach(([contrct, number]) => {
        msg += `${ContractsIndex[contrct]}: ${number}x\n`;
      });

      const getViewport = () => {
        const styles = { offset: { right: 54, top: 5, bottom: 0 } };
        if (isMobile) {
          styles.offset.right = 0;
          styles.offset.top = 0;
          styles.offset.bottom = 10;
        } else if (isTablet) {
          styles.offset.right = 54;
          styles.offset.bottom = 10;
        }
        return styles;
      };
      const customStyles = getViewport();

      return (
        <aside style={{ width: 'fit-content' }}>
          <Tooltip
            msg={msg}
            customStyles={customStyles}
            Component={() => (
              <MultiContractContainer>
                {contractType}
                <MultiContractCounter>{contract.length}</MultiContractCounter>
              </MultiContractContainer>
            )}
          ></Tooltip>
        </aside>
      );
    };

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
      {
        element:
          contractType === 'Multi contract' ? (
            renderContracts()
          ) : (
            <strong key={contractType}>{contractType}</strong>
          ),
        span: 1,
      },
      {
        element: contractType ? (
          <strong>{formatAmount(kAppFee / 10 ** precision)}</strong>
        ) : (
          <></>
        ),
        span: 1,
      },
      {
        element: !router.query.type ? (
          <strong>{formatAmount(bandwidthFee / 10 ** precision)}</strong>
        ) : (
          <></>
        ),
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

  const header = [...initialsTableHeaders, 'kApp Fee', 'Bandwidth Fee'];

  const tableProps: ITable = {
    type: 'transactions',
    header: getHeader(router, header),
    data: defaultTransactions as any[],
    rowSections,
    dataName: 'transactions',
    scrollUp: true,
    totalPages: pagination?.totalPages || 1,
    request: (page, limit) => requestTransactions(page, limit),
    query: router.query,
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
    empty: defaultTransactions.length === 0,
  };

  const transactionsFiltersProps = {
    query: router.query,
    setQuery: setQueryAndRouter,
    assets,
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

export const getServerSideProps: GetServerSideProps<
  ITransactions
> = async context => {
  const props: ITransactions = {
    transactions: [],
    pagination: {} as IPagination,
    assets: [],
  };

  const transactions: ITransactionResponse = await api.get({
    route: 'transaction/list',
    query: context.query,
  });

  if (!transactions.error) {
    props.transactions = transactions?.data?.transactions || [];
    props.pagination = transactions?.pagination || {};
  }

  const assets: IAssetResponse = await api.get({
    route: 'assets/kassets',
  });
  if (!assets.error) {
    props.assets = assets?.data?.assets || [];
  }

  return { props };
};

export default Transactions;
