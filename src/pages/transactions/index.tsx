import React, { useEffect, useState } from 'react';

import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { format, fromUnixTime } from 'date-fns';

import {
  CenteredRow,
  Container,
  FilterContainer,
  Header,
  Input,
  Title,
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
  IWithdrawContract,
  IAsset,
} from '../../types';

import { formatAmount } from '../../utils';

import { ArrowRight, ArrowLeft } from '@/assets/icons';
import { KLV } from '@/assets/coins';
import { getStatusIcon } from '@/assets/status';
import Pagination from '@/components/Pagination';
import { PaginationContainer } from '@/components/Pagination/styles';

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
  const defaultFilter: IFilterItem = { name: 'All', value: 'all' };

  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState(defaultTransactions);
  const [page, setPage] = useState(0);

  const [transactionType, setTransactionType] = useState(defaultFilter);
  const [statusType, setStatusType] = useState(defaultFilter);
  const [coinType, setCoinType] = useState(defaultFilter);

  const filters: IFilter[] = [
    {
      title: 'Coin',
      data: assets.map(asset => ({ name: asset.ticker, value: asset.address })),
      onClick: selected => {
        if (coinType.value !== selected.value) {
          setCoinType(selected);
        }
      },
    },
    {
      title: 'Status',
      data: status,
      onClick: selected => {
        if (statusType.value !== selected.value) {
          setStatusType(selected);
        }
      },
    },
    {
      title: 'Contract',
      data: contracts,
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
    'kAppFee',
    'Bandwidth Fee',
  ];

  const buildQuery = (data: any) => {
    const query = [];
    for (const key in data) {
      query.push(`${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`);
    }

    return query.join('&');
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const filters = [
        { ref: transactionType, key: 'type' },
        { ref: statusType, key: 'status' },
        { ref: coinType, key: 'asset' },
      ];
      let routerQuery = {};
      filters.forEach(filter => {
        if (filter.ref.value !== 'all') {
          routerQuery = { ...routerQuery, [filter.key]: filter.ref.value };
        }
      });

      console.log(`transaction/list?${buildQuery(routerQuery)}&page=${page}`);

      const response: ITransactionResponse = await api.get({
        route: `transaction/list?${buildQuery(routerQuery)}&page=${page}`,
      });
      if (!response.error) {
        setTransactions(response.data.transactions);
      }

      setLoading(false);
    };

    fetchData();
  }, [transactionType, statusType, coinType, page]);

  const getContractType = (contracts: IContract[]) =>
    contracts.length > 1
      ? 'Multi contract'
      : Object.values(Contract)[contracts[0].type];

  const Transfer: React.FC<IContract> = ({ parameter: par }) => {
    const parameter = par as ITransferContract;

    return (
      <>
        <CenteredRow>
          <div>
            <KLV />
            <p>KLV</p>
          </div>
        </CenteredRow>
        <span>
          <strong>{formatAmount(parameter.amount)}</strong>
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

  const Freeze: React.FC<IContract> = ({ parameter: par }) => {
    const parameter = par as IFreezeContract;

    return (
      <span>
        <strong>{formatAmount(parameter.amount)} KLV</strong>
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

  const Withdraw: React.FC<IContract> = ({ parameter: par }) => {
    const parameter = par as IWithdrawContract;

    return (
      <span>
        <Link href={`/account/${parameter.toAddress}`}>
          {parameter.toAddress}
        </Link>
      </span>
    );
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
      case Contract.ValidatorConfig:
        return getComponent(CreateValidator);
      case Contract.Freeze:
        return getComponent(Freeze);
      case Contract.Unfreeze:
      case Contract.Delegate:
      case Contract.Undelegate:
        return getComponent(Unfreeze);
      case Contract.Withdraw:
        return getComponent(Withdraw);
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
      case Contract.ValidatorConfig:
        newHeaders = ['Reward Address', 'Can Delegate'];
        break;
      case Contract.Freeze:
        newHeaders = ['Amount'];
        break;
      case Contract.Unfreeze:
      case Contract.Delegate:
      case Contract.Undelegate:
        newHeaders = ['Bucket ID'];
        break;
      case Contract.Withdraw:
        newHeaders = ['To'];
        break;
    }

    return header.concat(newHeaders);
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
        <span>{blockNum}</span>
        <span>
          <small>
            {format(fromUnixTime(timestamp / 1000), 'MM/dd/yyyy HH:mm')}
          </small>
        </span>
        <span>{sender}</span>
        <span>
          <ArrowRight />
        </span>
        <span>{toAddress}</span>
        <Status status={status}>
          <StatusIcon />
          <span>{status}</span>
        </Status>
        <span>
          <strong>{contractType}</strong>
        </span>
        <span>
          <strong>{kAppFee}</strong>
        </span>
        <span>
          <strong>{bandwidthFee}</strong>
        </span>

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

  return (
    <Container>
      <Title>
        <div onClick={router.back}>
          <ArrowLeft />
        </div>
        <h1>Transactions</h1>
      </Title>

      <Header>
        <FilterContainer>
          {filters.map((filter, index) => (
            <Filter key={String(index)} {...filter} />
          ))}
        </FilterContainer>

        <Input />
      </Header>

      <Table {...tableProps} />
      <PaginationContainer>
        <Pagination
          count={pagination.totalPages}
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
  async () => {
    const props: ITransactions = {
      transactions: [],
      pagination: {} as IPagination,
      assets: [],
    };

    const transactions: ITransactionResponse = await api.get({
      route: 'transaction/list',
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
