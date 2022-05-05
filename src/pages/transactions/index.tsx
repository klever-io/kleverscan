import React, { useState, useRef } from 'react';

import { GetServerSideProps } from 'next';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import { format, fromUnixTime } from 'date-fns';

import {
  CenteredRow,
  Tooltip,
  Container,
  FilterContainer,
  Header,
  Title,
  TooltipText,
} from '@/views/transactions';

import Filter, { IFilter, IFilterItem } from '@/components/Filter';
import Table, { ITable } from '@/components/Table';
import { Row, Status } from '@/components/Table/styles';

import { contracts, status } from '@/configs/transactions';
import api from '@/services/api';
import {
  ITransaction,
  IResponse,
  IPagination,
  ITransferContract,
  Contract,
  IContract,
  ICreateAssetContract,
  ICreateValidatorContract,
  IFreezeContract,
  IUnfreezeContract,
  IAsset,
  IClaimContract,
  IUnjailContract,
  IValidatorConfig,
  IUndelegateContract,
  IWithdrawContract,
  IAssetTriggerContract,
  ISetAccountNameContract,
  IProposalContract,
  IVoteContract,
  IConfigICOContract,
  ISetICOPricesContract,
  IBuyContract,
  ISellContract,
  ICancelMarketOrderContract,
  ICreateMarketplaceContract,
  IConfigMarketplaceContract,
  IValidatorConfigContract,
} from '../../types';

import { formatAmount, parseAddress, capitalizeString } from '../../utils';

import { ArrowRight, ArrowLeft } from '@/assets/icons';
import { Transactions as Icon } from '@/assets/title-icons';

import { KLV } from '@/assets/coins';
import { getStatusIcon } from '@/assets/status';
import Pagination from '@/components/Pagination';
import { PaginationContainer } from '@/components/Pagination/styles';
import DateFilter, {
  IDateFilter,
  ISelectedDays,
} from '@/components/DateFilter';
import { useDidUpdateEffect } from '@/utils/hooks';

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
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(pagination.totalPages);
  const [dateFilter, setDateFilter] = useState({
    start: '',
    end: '',
  });

  const [transactionType, setTransactionType] = useState(defaultFilter);
  const [statusType, setStatusType] = useState(defaultFilter);
  const [coinType, setCoinType] = useState(defaultFilter);

  const formatFilterQuery = (type: string): IFilterItem | undefined => {
    switch (type) {
      case 'COIN':
        if (!router.query.asset) return undefined;
        return { name: String(router.query.asset), value: router.query.asset };
      case 'TYPE':
        if (!router.query.type) return undefined;
        return contracts.find(({ value }) => value === router.query.type);
      case 'STATUS':
        if (!router.query.status) return undefined;
        return status.find(({ value }) => value === router.query.status);
      default:
        break;
    }
  };
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
    if (page !== 0) setPage(0);
    else fetchData();
  }, [transactionType, statusType, coinType, dateFilter]);

  useDidUpdateEffect(() => {
    fetchData();
  }, [page]);

  const getContractType = (contracts: IContract[]) => {
    if (!contracts) {
      return 'Unkown';
    }

    return contracts.length > 1
      ? 'Multi contract'
      : Object.values(Contract)[contracts[0].type];
  };

  const Transfer: React.FC<IContract> = ({ parameter: par }) => {
    const parameter = par as ITransferContract;
    const tooltipRef = useRef<any>(null);

    const handleMouseOver = (e: any) => {
      const positionY = e.currentTarget.offsetTop;
      const positionX = e.currentTarget.offsetLeft;

      tooltipRef.current.style.top = positionY - 30 + 'px';
      tooltipRef.current.style.left = positionX + 'px';
    };
    return (
      <>
        <CenteredRow>
          <div>
            {parameter.assetId ? (
              <Tooltip onMouseOver={(e: any) => handleMouseOver(e)}>
                <Link href={`/asset/${parameter.assetId}`}>
                  {parameter.assetId}
                </Link>
                <TooltipText ref={tooltipRef}>{parameter.assetId}</TooltipText>
              </Tooltip>
            ) : (
              <>
                <Link href={`/asset/KLV`}>
                  <KLV />
                </Link>
                <Link href={`/asset/KLV`}>KLV</Link>
              </>
            )}
          </div>
        </CenteredRow>
        <span>
          <strong>{formatAmount(parameter.amount / 10 ** precision)}</strong>
        </span>
      </>
    );
  };

  const CreateAsset: React.FC<IContract> = ({ parameter: par }) => {
    const parameter = par as ICreateAssetContract;

    return (
      <>
        <span>{parameter.name}</span>
        <span>
          <small>{parameter.ticker}</small>
        </span>
      </>
    );
  };

  const CreateValidator: React.FC<IContract> = ({ parameter: par }) => {
    const parameter = par as ICreateValidatorContract;

    return (
      <>
        <span>
          <Link href={`/account/${parameter.config.rewardAddress}`}>
            {parameter.config.rewardAddress}
          </Link>
        </span>
        <span>
          <strong>{parameter.config.canDelegate ? 'True' : 'False'}</strong>
        </span>
      </>
    );
  };

  const ValidatorConfig: React.FC<IContract> = ({ parameter: par }) => {
    const parameter = par as IValidatorConfigContract;

    return (
      <>
        <span>
          <small>{parameter.config.blsPublicKey}</small>
        </span>
      </>
    );
  };

  const Freeze: React.FC<IContract> = ({ parameter: par }) => {
    const parameter = par as IFreezeContract;

    return (
      <span>
        <strong>{formatAmount(parameter.amount / 10 ** precision)} KLV</strong>
      </span>
    );
  };

  const Unfreeze: React.FC<IContract> = ({ parameter: par }) => {
    const parameter = par as IUnfreezeContract;

    return (
      <span>
        <small>{parameter.bucketID}</small>
      </span>
    );
  };

  const Delegate: React.FC<IContract> = ({ parameter: par }) => {
    const parameter = par as IUnfreezeContract;

    return (
      <>
        <span>
          <small>{parameter.bucketID}</small>
        </span>
      </>
    );
  };

  const Undelegate: React.FC<IContract> = ({ parameter: par }) => {
    const parameter = par as IUndelegateContract;

    return (
      <span>
        <small>{parameter.bucketID}</small>
      </span>
    );
  };

  const Withdraw: React.FC<IContract> = ({ parameter: par }) => {
    const parameter = par as IWithdrawContract;
    return (
      <>
        <span>{parameter.assetId}</span>
      </>
    );
  };

  const Claim: React.FC<IContract> = ({ parameter: par }) => {
    const parameter = par as IClaimContract;

    return (
      <span>
        <small>{parameter.claimType}</small>
      </span>
    );
  };

  const Unjail: React.FC<IContract> = ({ parameter: par }) => {
    const parameter = par as IUnjailContract;

    return <></>;
  };

  const AssetTrigger: React.FC<IContract> = ({ parameter: par }) => {
    const parameter = par as IAssetTriggerContract;

    return (
      <span>
        <small>{parameter.triggerType}</small>
      </span>
    );
  };

  const SetAccountName: React.FC<IContract> = ({ parameter: par }) => {
    const parameter = par as ISetAccountNameContract;

    return (
      <span>
        <small>{parameter.name}</small>
      </span>
    );
  };

  const Proposal: React.FC<IContract> = ({ parameter: par }) => {
    const parameter = par as IProposalContract;

    return (
      <>
        <span>{parameter.parameter}</span>
      </>
    );
  };

  const Vote: React.FC<IContract> = ({ parameter: par }) => {
    const parameter = par as IVoteContract;

    return (
      <>
        <span>{parameter.proposalId}</span>

        <span>
          <small>{parameter.amount}</small>
        </span>
      </>
    );
  };

  const ConfigICO: React.FC<IContract> = ({ parameter: par }) => {
    const parameter = par as IConfigICOContract;

    return (
      <>
        <span>{parameter.assetId}</span>
      </>
    );
  };

  const SetICOPrices: React.FC<IContract> = ({ parameter: par }) => {
    const parameter = par as ISetICOPricesContract;

    return (
      <>
        <span>{parameter.assetId}</span>
      </>
    );
  };

  const Buy: React.FC<IContract> = ({ parameter: par }) => {
    const parameter = par as IBuyContract;

    return (
      <>
        <span>{parameter.buyType}</span>

        <span>
          <small>{parameter.amount}</small>
        </span>
      </>
    );
  };

  const Sell: React.FC<IContract> = ({ parameter: par }) => {
    const parameter = par as ISellContract;

    return (
      <>
        <span>
          <small>{parameter.assetId}</small>
        </span>
      </>
    );
  };

  const CancelMarketOrder: React.FC<IContract> = ({ parameter: par }) => {
    const parameter = par as ICancelMarketOrderContract;

    return (
      <>
        <span>{parameter.orderId}</span>
      </>
    );
  };

  const CreateMarketplace: React.FC<IContract> = ({ parameter: par }) => {
    const parameter = par as ICreateMarketplaceContract;

    return (
      <>
        <span>{parameter.name}</span>
      </>
    );
  };

  const ConfigMarketplace: React.FC<IContract> = ({ parameter: par }) => {
    const parameter = par as IConfigMarketplaceContract;

    return <></>;
  };

  const FilteredComponent: React.FC<ITransaction> = ({ contract }) => {
    const contractType = getContractType(contract);

    const getComponent: React.FC<any> = (Component: React.FC<IContract>) =>
      contractType === transactionType.name ? (
        <Component {...contract[0]} />
      ) : (
        <div />
      );

    switch (transactionType.name) {
      case Contract.Transfer:
        return getComponent(Transfer);
      case Contract.CreateAsset:
        return getComponent(CreateAsset);
      case Contract.CreateValidator:
        return getComponent(CreateValidator);
      case Contract.ValidatorConfig:
        return getComponent(ValidatorConfig);
      case Contract.Freeze:
        return getComponent(Freeze);
      case Contract.Unfreeze:
        return getComponent(Unfreeze);
      case Contract.Delegate:
        return getComponent(Delegate);
      case Contract.Undelegate:
        return getComponent(Undelegate);
      case Contract.Withdraw:
        return getComponent(Withdraw);
      case Contract.Claim:
        return getComponent(Claim);
      case Contract.Unjail:
        return getComponent(Unjail);
      case Contract.AssetTrigger:
        return getComponent(AssetTrigger);
      case Contract.SetAccountName:
        return getComponent(SetAccountName);
      case Contract.Proposal:
        return getComponent(Proposal);
      case Contract.Vote:
        return getComponent(Vote);
      case Contract.ConfigICO:
        return getComponent(ConfigICO);
      case Contract.SetICOPrices:
        return getComponent(SetICOPrices);
      case Contract.Buy:
        return getComponent(Buy);
      case Contract.Sell:
        return getComponent(Sell);
      case Contract.CancelMarketOrder:
        return getComponent(CancelMarketOrder);
      case Contract.CreateMarketplace:
        return getComponent(CreateMarketplace);
      case Contract.ConfigMarketplace:
        return getComponent(ConfigMarketplace);
      default:
        return <div />;
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
        newHeaders = ['Parameter'];
        break;
      case Contract.Vote:
        newHeaders = ['Proposal Id', 'Amount'];
        break;
      case Contract.ConfigICO:
        newHeaders = ['Asset Id'];
        break;
      case Contract.SetICOPrices:
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

  const TableBody: React.FC<ITransaction> = props => {
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

    return (
      <Row type="transactions" filter={transactionType}>
        <span>
          <Link href={`/transaction/${hash}`}>{hash}</Link>
        </span>
        <Link href={`/block/${blockNum || 0}`}>
          <a className="address">{blockNum || 0}</a>
        </Link>
        <span>
          <small>
            {format(fromUnixTime(timestamp / 1000), 'MM/dd/yyyy HH:mm')}
          </small>
        </span>
        <Link href={`/account/${sender}`}>
          <a className="address">{parseAddress(sender, 16)}</a>
        </Link>
        <span>
          <ArrowRight />
        </span>
        <Link href={`/account/${toAddress}`}>
          <a className="address">{parseAddress(toAddress, 16)}</a>
        </Link>
        <Status status={status}>
          <StatusIcon />
          <span>{capitalizeString(status)}</span>
        </Status>
        <span>
          <strong>{contractType}</strong>
        </span>
        {transactionType.value === 'all' && (
          <>
            <span>
              <strong>{formatAmount(kAppFee / 10 ** precision)}</strong>
            </span>
            <span>
              <strong>{formatAmount(bandwidthFee / 10 ** precision)}</strong>
            </span>
          </>
        )}

        <FilteredComponent {...props} />
      </Row>
    );
  };

  const tableProps: ITable = {
    type: 'transactions',
    header: getHeader(),
    data: transactions as any[],
    body: TableBody,
    filter: transactionType,
    loading,
  };

  const resetDate = () => {
    setPage(0);
    setDateFilter({
      start: '',
      end: '',
    });
  };
  const filterDate = (selectedDays: ISelectedDays) => {
    setPage(0);
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
      <Title>
        <div onClick={() => router.push('/')}>
          <ArrowLeft />
        </div>
        <h1>Transactions</h1>
        <Icon />
      </Title>

      <Header>
        <FilterContainer>
          {filters.map((filter, index) => (
            <Filter key={String(index)} {...filter} />
          ))}
        </FilterContainer>
        <DateFilter {...dateFilterProps} />
      </Header>

      <Table {...tableProps} />
      <PaginationContainer>
        <Pagination
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

export const getServerSideProps: GetServerSideProps<ITransactions> =
  async context => {
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
      props.transactions = transactions.data.transactions;
      props.pagination = transactions.pagination;
    }

    const assets: IAssetResponse = await api.get({
      route: 'assets/kassets',
    });
    if (!assets.error) {
      props.assets = assets.data.assets;
    }

    return { props };
  };

export default Transactions;
