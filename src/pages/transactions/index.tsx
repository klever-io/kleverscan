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
} from '../../types';

import { ArrowRight, ArrowLeft } from '@/assets/icons';
import { KLV } from '@/assets/coins';
import { formatAmount } from '../../utils';

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

  const getHeader = () => {
    switch (filter.name) {
      case Contract.Transfer:
        return [...header, 'Coin', 'Amount'];
      default:
        return header;
    }
  };

  const getContractType = (contracts: IContract[]) =>
    contracts.length > 1
      ? 'Multi contract'
      : Object.values(Contract)[contracts[0].type];

  const Transfer: React.FC<ITransaction> = ({ contract }) => {
    let amount = 0;
    const contractType = getContractType(contract);

    if (contractType === Contract.Transfer) {
      const parameter = contract[0].parameter as ITransferContract;

      amount = parameter.amount;
    }

    return (
      <>
        <CenteredRow>
          <div>
            <KLV />
            <p>KLV</p>
          </div>
        </CenteredRow>
        <span>
          <strong>{formatAmount(amount)}</strong>
        </span>
      </>
    );
  };

  const FilteredComponent: React.FC<ITransaction> = props => {
    switch (filter.name) {
      case Contract.Transfer:
        return <Transfer {...props} />;
      default:
        return <div />;
    }
  };

  const TableBody: React.FC<ITransaction> = props => {
    const { hash, blockNum, timestamp, sender, contract, status } = props;

    let toAddress = '--';
    const contractType = getContractType(contract);

    if (contractType === Contract.Transfer) {
      const parameter = contract[0].parameter as ITransferContract;

      toAddress = parameter.ownerAddress;
    }

    return (
      <Row type="transactions" filter={filter}>
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
        <Status status={status}>{status}</Status>
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
