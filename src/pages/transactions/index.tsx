import { ArrowRight } from '@/assets/icons';
import { getStatusIcon } from '@/assets/status';
import { Transactions as Icon } from '@/assets/title-icons';
import Copy from '@/components/Copy';
import DateFilter, {
  IDateFilter,
  ISelectedDays,
} from '@/components/DateFilter';
import Filter, { IFilter } from '@/components/Filter';
import Title from '@/components/Layout/Title';
import Table, { ITable } from '@/components/Table';
import { Status } from '@/components/Table/styles';
import { contracts, status } from '@/configs/transactions';
import api from '@/services/api';
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
import { CenteredRow } from '@/views/accounts/detail';
import {
  Container,
  FilterByDate,
  FilterContainer,
  Header,
} from '@/views/transactions';
import { Input } from '@/views/transactions/detail';
import { useMobile } from 'contexts/mobile';
import { format, fromUnixTime } from 'date-fns';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Contract,
  ContractsIndex,
  ContractsName,
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

const Transactions: React.FC<ITransactions> = ({
  transactions: defaultTransactions,
  pagination,
  assets,
}) => {
  const router = useRouter();
  const precision = 6; // default KLV precision
  const { isMobile } = useMobile();
  const columnSpans = [
    2, 1, 1, 1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  ];

  const getContractIndex = (contractName: string): string =>
    ContractsIndex[contractName];
  const getContractName = (): string => ContractsIndex[Number(query.type)];
  const [query, setQuery] = useState(router.query);

  const handleSelected = (selected: string, filterType: string): void => {
    if (selected === 'All') {
      const updatedQuery = { ...query };
      delete updatedQuery[filterType];
      setQuery(updatedQuery);
    } else if (filterType === 'type') {
      setQuery({ ...query, [filterType]: getContractIndex(selected) });
    } else if (selected !== query[filterType]) {
      setQuery({ ...query, [filterType]: selected });
    }
  };

  useEffect(() => {
    // this useEffect was built for the single purpose of solving the data difference between the router and the filter state when router.query isn't empty and user clicks again in the transactions page through the navbar button. It was the only solution that worked.
    if (
      Object.keys(router.query).length === 0 &&
      Object.keys(query).length > 0
    ) {
      router.push({ pathname: router.pathname, query }, undefined, {
        shallow: true,
      });
    }
  }, [router.query]);

  useEffect(() => {
    //TODO? cannot use this useEffect on table since some pages names are dynamic and router needs static names for push. Needs to check this further.
    router.push({ pathname: router.pathname, query }, undefined, {
      shallow: true,
    });
  }, [query]);

  const getContractType = useCallback((contracts: IContract[]) => {
    if (!contracts) {
      return 'Unkown';
    }

    return contracts.length > 1
      ? 'Multi contract'
      : Object.values(Contract)[contracts[0].type];
  }, []);

  const filters: IFilter[] = [
    {
      title: 'Coin',
      data: assets.map(asset => asset.assetId),
      onClick: selected => handleSelected(selected, 'asset'),
      current: query.asset as string | undefined,
    },
    {
      title: 'Status',
      data: status,
      onClick: selected => handleSelected(selected, 'status'),
      current: query.status as string | undefined,
    },
    {
      title: 'Contract',
      data: contracts,
      onClick: selected => handleSelected(selected, 'type'),
      current: getContractName(),
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

  const requestTransactions = async (page: number) =>
    api.get({
      route: `transaction/list`,
      query: { page, ...query },
    });

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
    switch (ContractsName[getContractName()]) {
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

    if (query.type) {
      return header.splice(0, header.length - 2).concat(newHeaders);
    }

    return header;
  };

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
      <CenteredRow className="bucketIdCopy" key={hash}>
        <Link href={`/transaction/${hash}`}>{parseAddress(hash, 24)}</Link>
        <Copy info="TXHash" data={hash} />
      </CenteredRow>,
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
      query.type ? (
        <strong>{formatAmount(kAppFee / 10 ** precision)}</strong>
      ) : (
        <></>
      ),
      !query.type ? (
        <strong>{formatAmount(bandwidthFee / 10 ** precision)}</strong>
      ) : (
        <></>
      ),
    ];

    const filteredContract = getFilteredSections(contract);

    if (query.type) {
      sections.pop();
      sections.pop();
      sections.push(...filteredContract);
    }

    return sections;
  };

  const tableProps: ITable = {
    type: 'transactions',
    header: getHeader(),
    data: defaultTransactions as any[],
    rowSections,
    columnSpans,
    dataName: 'transactions',
    scrollUp: true,
    totalPages: pagination.totalPages,
    request: page => requestTransactions(page),
    query,
  };

  const resetDate = () => {
    const updatedQuery = { ...query };
    delete updatedQuery.startdate;
    delete updatedQuery.enddate;
    setQuery(updatedQuery);
  };
  const filterDate = (selectedDays: ISelectedDays) => {
    setQuery({
      ...query,
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

  return (
    <Container>
      <Title title="Transactions" Icon={Icon} />

      <Header>
        <div>
          <FilterContainer>
            {filters.map((filter, index) => (
              <Filter key={String(index)} {...filter} />
            ))}
          </FilterContainer>

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
