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

import { coins, contracts, status } from '@/configs/transactions';
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
} from '../../types';

import { formatAmount } from '../../utils';

import { ArrowRight, ArrowLeft } from '@/assets/icons';
import { KLV } from '@/assets/coins';
import { getStatusIcon } from '@/assets/status';

interface ITransactions {
  transactions: ITransaction[];
}

interface ITransactionResponse extends IResponse {
  data: {
    transactions: ITransaction[];
  };
  pagination: IPagination;
}

const Transactions: React.FC<ITransactions> = ({
  transactions: defaultTransactions,
}) => {
  const router = useRouter();

  const [loading] = useState(false);
  const [transactions] = useState(defaultTransactions);
  const [filter, setFilter] = useState<IFilterItem>({
    name: 'All',
    value: 'all',
  });

  const filters: IFilter[] = [
    {
      title: 'Coin',
      data: coins,
      onClick: selected => setFilter(selected),
    },
    {
      title: 'Status',
      data: status,
      onClick: selected => setFilter(selected),
    },
    {
      title: 'Contract',
      data: contracts,
      onClick: selected => setFilter(selected),
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
  ];

  useEffect(() => {
    // TODO: fetch new transactions with filter
  }, [filter]);

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
      contractType === filter.name ? <Component {...contract[0]} /> : <div />;

    switch (filter.name) {
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

    switch (filter.name) {
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
    const { hash, blockNum, timestamp, sender, contract, status } = props;

    const StatusIcon = getStatusIcon(status);
    let toAddress = '--';
    const contractType = getContractType(contract);

    if (contractType === Contract.Transfer) {
      const parameter = contract[0].parameter as ITransferContract;

      toAddress = parameter.ownerAddress;
    }

    return (
      <Row type="transactions" filter={filter}>
        <span>
          <Link href={`/transactions/${hash}`}>{hash}</Link>
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

        <FilteredComponent {...props} />
      </Row>
    );
  };

  const tableProps: ITable = {
    type: 'transactions',
    header: getHeader(),
    data: transactions as any[],
    body: TableBody,
    filter,
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
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps<ITransactions> =
  async () => {
    const props: ITransactions = {
      transactions: [],
    };

    const transactions: ITransactionResponse = await api.get({
      route: 'transaction/list',
    });
    if (!transactions.error) {
      props.transactions = transactions.data.transactions;
    }

    return { props };
  };

export default Transactions;
