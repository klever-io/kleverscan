import { ArrowRight } from '@/assets/icons';
import { getStatusIcon } from '@/assets/status';
import { Transactions as Icon } from '@/assets/title-icons';
import DateFilter, {
  IDateFilter,
  ISelectedDays,
} from '@/components/DateFilter';
import Filter, { IFilter, IFilterItem } from '@/components/Filter';
import Title from '@/components/Layout/Title';
import Pagination from '@/components/Pagination';
import { PaginationContainer } from '@/components/Pagination/styles';
import Table, { ITable } from '@/components/Table';
import { Status } from '@/components/Table/styles';
import { contracts, status } from '@/configs/transactions';
import api from '@/services/api';
import { useDidUpdateEffect } from '@/utils/hooks';
import {
  AssetTriggerSections,
  BuySections,
  CancelMarketOrderSections,
  ClaimSections,
  ConfigITOSections,
  ConfigMarketplaceSections,
  CreateAssetSections,
  CreateMarketplaceSections,
  CreateValidatorSections,
  DelegateSections,
  FreezeSections,
  ProposalSections,
  SellSections,
  SetAccountNameSections,
  SetITOPricesSections,
  TransferSections,
  UndelegateSections,
  UnfreezeSections,
  UnjailSections,
  ValidatorConfigSections,
  VoteSections,
  WithdrawSections,
} from '@/utils/transactionListSections';
import {
  Container,
  FilterByDate,
  FilterContainer,
  Header,
} from '@/views/transactions';
import { Input } from '@/views/transactions/detail';
import { useWidth } from 'contexts/width';
import { format, fromUnixTime } from 'date-fns';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';
import {
  Contract,
  IAsset,
  IContract,
  IPagination,
  IResponse,
  ITransaction,
  ITransferContract,
} from '../../types';
import { capitalizeString, formatAmount, parseAddress } from '../../utils';

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

interface IRouterQuery {
  type?: string;
  status?: string;
  asset?: string;
  page?: number;
  startdate?: string;
  enddate?: string;
}

const Transactions: React.FC<ITransactions> = ({
  transactions: defaultTransactions,
  pagination,
  assets,
}) => {
  const router = useRouter();
  const defaultFilter: IFilterItem = { name: 'All', value: 'all' };
  const precision = 6; // default KLV precision

  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState(defaultTransactions);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(pagination.totalPages);
  const [dateFilter, setDateFilter] = useState({
    start: '',
    end: '',
  });

  const [transactionType, setTransactionType] = useState(defaultFilter);
  const [statusType, setStatusType] = useState(defaultFilter);
  const [coinType, setCoinType] = useState(defaultFilter);

  const baseColumnSpans = [
    2, 1, 1, 1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  ];
  const [columnSpans, setColumnSpans] = useState(baseColumnSpans);

  const formatFilterQuery = useCallback(
    (type: string): IFilterItem | undefined => {
      switch (type) {
        case 'COIN':
          if (!router.query.asset) return undefined;
          return {
            name: String(router.query.asset),
            value: router.query.asset,
          };
        case 'TYPE':
          if (!router.query.type) return undefined;
          return contracts.find(({ value }) => value === router.query.type);
        case 'STATUS':
          if (!router.query.status) return undefined;
          return status.find(({ value }) => value === router.query.status);
        default:
          break;
      }
    },
    [router.query.asset, router.query.type, router.query.status],
  );

  const filters: IFilter[] = [
    {
      title: 'Coin',
      data: assets.map(asset => ({
        name: asset.assetId,
        value: asset.assetId,
      })),
      filterQuery: formatFilterQuery('COIN'),
      onClick: selected => {
        if (coinType.value !== selected.value) {
          setCoinType(selected);
        }
      },
    },
    {
      title: 'Status',
      data: status,
      filterQuery: formatFilterQuery('STATUS'),
      onClick: selected => {
        if (statusType.value !== selected.value) {
          setStatusType(selected);
        }
      },
    },
    {
      title: 'Contract',
      data: contracts,
      filterQuery: formatFilterQuery('TYPE'),
      onClick: selected => {
        if (transactionType.value !== selected.value) {
          setTransactionType(selected);
        }
      },
    },
  ];

  const header = [
    'Hash',
    'Block',
    'Created',
    'From',
    '',
    'To',
    'Status',
    'Contract',
    'kApp Fee',
    'Bandwidth Fee',
  ];

  const fetchData = async () => {
    setLoading(true);

    const filters = [
      { ref: transactionType, key: 'type' },
      { ref: statusType, key: 'status' },
      { ref: coinType, key: 'asset' },
    ];
    let routerQuery: IRouterQuery = {};
    filters.forEach(filter => {
      if (filter.ref.value !== 'all') {
        routerQuery = { ...routerQuery, [filter.key]: filter.ref.value };
      }
    });
    routerQuery = dateFilter.start
      ? {
          ...routerQuery,
          page: page,
          startdate: dateFilter.start ? dateFilter.start : undefined,
          enddate: dateFilter.end ? dateFilter.end : undefined,
        }
      : {
          ...routerQuery,
          page: page,
        };

    const response: ITransactionResponse = await api.get({
      route: `transaction/list`,
      query: routerQuery,
    });
    if (!response.error) {
      setTransactions(response.data.transactions);
      setCount(response.pagination.totalPages);
    }

    const query = { ...routerQuery };
    delete query.page;
    await Router.push({ pathname: router.pathname, query });
    setLoading(false);
  };

  useDidUpdateEffect(() => {
    if (page !== 1) setPage(1);
    else fetchData();
  }, [transactionType, statusType, coinType, dateFilter]);

  useDidUpdateEffect(() => {
    fetchData();
  }, [page]);

  const getContractType = useCallback((contracts: IContract[]) => {
    if (!contracts) {
      return 'Unkown';
    }

    return contracts.length > 1
      ? 'Multi contract'
      : Object.values(Contract)[contracts[0].type];
  }, []);

  const getFilteredSections = (contract: IContract[]): JSX.Element[] => {
    const contractType = getContractType(contract);

    switch (contractType) {
      case Contract.Transfer:
        return TransferSections(contract[0].parameter);
      case Contract.CreateAsset:
        return CreateAssetSections(contract[0].parameter);
      case Contract.CreateValidator:
        return CreateValidatorSections(contract[0].parameter);
      case Contract.ValidatorConfig:
        return ValidatorConfigSections(contract[0].parameter);
      case Contract.Freeze:
        return FreezeSections(contract[0].parameter);
      case Contract.Unfreeze:
        return UnfreezeSections(contract[0].parameter);
      case Contract.Delegate:
        return DelegateSections(contract[0].parameter);
      case Contract.Undelegate:
        return UndelegateSections(contract[0].parameter);
      case Contract.Withdraw:
        return WithdrawSections(contract[0].parameter);
      case Contract.Claim:
        return ClaimSections(contract[0].parameter);
      case Contract.Unjail:
        return UnjailSections(contract[0].parameter);
      case Contract.AssetTrigger:
        return AssetTriggerSections(contract[0].parameter);
      case Contract.SetAccountName:
        return SetAccountNameSections(contract[0].parameter);
      case Contract.Proposal:
        return ProposalSections(contract[0].parameter);
      case Contract.Vote:
        return VoteSections(contract[0].parameter);
      case Contract.ConfigITO:
        return ConfigITOSections(contract[0].parameter);
      case Contract.SetITOPrices:
        return SetITOPricesSections(contract[0].parameter);
      case Contract.Buy:
        return BuySections(contract[0].parameter);
      case Contract.Sell:
        return SellSections(contract[0].parameter);
      case Contract.CancelMarketOrder:
        return CancelMarketOrderSections(contract[0].parameter);
      case Contract.CreateMarketplace:
        return CreateMarketplaceSections(contract[0].parameter);
      case Contract.ConfigMarketplace:
        return ConfigMarketplaceSections(contract[0].parameter);
      default:
        return [<></>];
    }
  };

  const getHeader = () => {
    let newHeaders: string[] = [];

    switch (transactionType.name) {
      case Contract.Transfer:
        newHeaders = ['Coin', 'Amount'];
        break;
      case Contract.CreateAsset:
        newHeaders = ['Name', 'Ticker'];
        break;
      case Contract.CreateValidator:
        newHeaders = ['Reward Address', 'Can Delegate'];
        break;
      case Contract.ValidatorConfig:
        newHeaders = ['Public Key'];
        break;
      case Contract.Freeze:
        newHeaders = ['Amount'];
        break;
      case Contract.Unfreeze:
        newHeaders = ['Bucket Id'];
        break;
      case Contract.Delegate:
        newHeaders = ['Bucket Id'];
        break;
      case Contract.Undelegate:
        newHeaders = ['Bucket Id'];
        break;
      case Contract.Withdraw:
        newHeaders = ['Asset Id'];
        break;
      case Contract.Claim:
        newHeaders = ['Claim Type'];
        break;
      case Contract.Unjail:
      case Contract.AssetTrigger:
        newHeaders = ['Trigger Type'];
        break;
      case Contract.SetAccountName:
        newHeaders = ['Name'];
        break;
      case Contract.Proposal:
        newHeaders = ['Description'];
        break;
      case Contract.Vote:
        newHeaders = ['Proposal Id', 'Amount'];
        break;
      case Contract.ConfigITO:
        newHeaders = ['Asset Id'];
        break;
      case Contract.SetITOPrices:
        newHeaders = ['Asset Id'];
        break;
      case Contract.Buy:
        newHeaders = ['Buy Type', 'Amount'];
        break;
      case Contract.Sell:
        newHeaders = ['Asset Id'];
        break;
      case Contract.CancelMarketOrder:
        newHeaders = ['Order Id'];
        break;
      case Contract.CreateMarketplace:
        newHeaders = ['Name'];
        break;
      case Contract.ConfigMarketplace:
    }

    if (transactionType.value !== 'all') {
      return header.splice(0, header.length - 2).concat(newHeaders);
    }

    return header;
  };

  const { isMobile } = useWidth();

  const rowSections = (props: ITransaction): JSX.Element[] => {
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

    const StatusIcon = getStatusIcon(status);
    let toAddress = '--';
    const contractType = getContractType(contract);

    if (contractType === Contract.Transfer) {
      const parameter = contract[0].parameter as ITransferContract;

      toAddress = parameter.toAddress;
    }

    const sections = [
      <Link href={`/transaction/${hash}`} key={hash}>
        {parseAddress(hash, 28)}
      </Link>,
      <Link href={`/block/${blockNum || 0}`} key={blockNum}>
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
      transactionType.value === 'all' ? (
        <strong>{formatAmount(kAppFee / 10 ** precision)}</strong>
      ) : (
        <></>
      ),
      transactionType.value === 'all' ? (
        <strong>{formatAmount(bandwidthFee / 10 ** precision)}</strong>
      ) : (
        <></>
      ),
    ];

    const filteredContract = getFilteredSections(contract);

    if (transactionType.value !== 'all') {
      sections.pop();
      sections.pop();
      sections.push(...filteredContract);
    }

    return sections;
  };

  const tableProps: ITable = {
    type: 'transactions',
    header: getHeader(),
    data: transactions as any[],
    rowSections,
    columnSpans,
    filter: transactionType,
    loading,
  };

  const resetDate = () => {
    setPage(1);
    setDateFilter({
      start: '',
      end: '',
    });
  };
  const filterDate = (selectedDays: ISelectedDays) => {
    setPage(1);
    setDateFilter({
      start: selectedDays.start.getTime().toString(),
      end: selectedDays.end
        ? (selectedDays.end.getTime() + 24 * 60 * 60 * 1000).toString()
        : (selectedDays.start.getTime() + 24 * 60 * 60 * 1000).toString(),
    });
  };
  const dateFilterProps: IDateFilter = {
    resetDate,
    filterDate,
    empty: transactions.length === 0,
  };

  return (
    <Container>
      <Title title="Transactions" Icon={Icon} />

      <Header>
        <FilterContainer>
          {filters.map((filter, index) => (
            <Filter key={String(index)} {...filter} />
          ))}
        </FilterContainer>

        <FilterByDate>
          <DateFilter {...dateFilterProps} />
        </FilterByDate>
        <Input />
      </Header>
      <Table {...tableProps} />
      <PaginationContainer>
        <Pagination
          scrollUp={true}
          count={count}
          page={page}
          onPaginate={page => {
            setPage(page);
          }}
        />
      </PaginationContainer>
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
