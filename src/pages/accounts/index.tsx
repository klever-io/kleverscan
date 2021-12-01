import React, { useEffect, useState } from 'react';

import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { fromUnixTime } from 'date-fns';

import {
  Card,
  CardContainer,
  Container,
  Header,
  Input,
  TableContainer,
  Title,
} from '@/views/blocks';

import Table, { ITable } from '@/components/Table';
import { Row } from '@/components/Table/styles';

import { IAccount, IPagination, IResponse } from '@/types/index';
import api from '@/services/api';
import { formatAmount, getAge } from '@/utils/index';

import { ArrowLeft } from '@/assets/icons';
import { PaginationContainer } from '@/components/Pagination/styles';
import Pagination from '@/components/Pagination';

interface IAccounts {
  accounts: IAccount[];
  pagination: IPagination;
}

interface IAccountResponse extends IResponse {
  data: {
    accounts: IAccount[];
  };
  pagination: IPagination;
}

interface ICard {
  title: string;
  headers: string[];
  values: string[];
}

const Accounts: React.FC<IAccounts> = ({
  accounts: defaultAccounts,
  pagination,
}) => {
  const router = useRouter();
  const precision = 6; // default KLV precision

  const [page, setPage] = useState(1);
  const [accounts, setAccounts] = useState(defaultAccounts);
  const [loading, setLoading] = useState(false);
  const [uptime] = useState(new Date().getTime());
  const [age, setAge] = useState(
    getAge(fromUnixTime(new Date().getTime() / 1000)),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const newAge = getAge(fromUnixTime(uptime / 1000));

      setAge(newAge);
    }, 1 * 1000); // 1 sec

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const response: IAccountResponse = await api.get({
        route: `address/list?page=${page}`,
      });
      if (!response.error) {
        setAccounts(response.data.accounts);
      }

      setLoading(false);
    };

    fetchData();
  }, [page]);

  const cards: ICard[] = [
    {
      title: 'Number of Accounts',
      headers: ['Accounts Yesterday', 'Total'],
      values: ['--', pagination.totalRecords.toLocaleString()],
    },
    {
      title: 'Number of Accounts',
      headers: ['Accounts Yesterday', 'Total'],
      values: ['--', pagination.totalRecords.toLocaleString()],
    },
  ];

  const CardContent: React.FC<ICard> = ({ title, headers, values }) => {
    return (
      <Card>
        <div>
          <span>
            <strong>{title}</strong>
          </span>
          <p>{age} ago</p>
        </div>
        <div>
          <span>
            <small>{headers[0]}</small>
          </span>
          <span>
            <small>{headers[1]}</small>
          </span>
        </div>
        <div>
          <span>{values[0]}</span>
          <span>{values[1]}</span>
        </div>
      </Card>
    );
  };

  const header = ['Address', 'KLV Staked', 'Transaction Count', 'KLV Balance'];

  const TableBody: React.FC<IAccount> = ({ address, buckets, balance }) => {
    const getFreezeBalance = () => {
      if (Object.values(buckets).length <= 0) {
        return 0;
      }

      const freezeBalance = Object.values(buckets).reduce(
        (acc, bucket) => acc + bucket.stakeValue,
        0,
      );

      return freezeBalance / 10 ** precision;
    };

    return (
      <Row type="accounts">
        <span>
          <Link href={`/account/${address}`}>{address}</Link>
        </span>
        <span>
          <strong>{formatAmount(getFreezeBalance())} KLV</strong>
        </span>
        <span>-</span>
        <span>
          <strong>{formatAmount(balance)} KLV</strong>
        </span>
      </Row>
    );
  };

  const tableProps: ITable = {
    type: 'accounts',
    header,
    data: accounts as any[],
    body: TableBody,
    loading,
  };

  return (
    <Container>
      <Header>
        <Title>
          <div onClick={router.back}>
            <ArrowLeft />
          </div>
          <h1>Accounts</h1>
        </Title>

        <Input />
      </Header>

      <CardContainer>
        {cards.map((card, index) => (
          <CardContent key={String(index)} {...card} />
        ))}
      </CardContainer>

      <TableContainer>
        <h3>List of accounts</h3>
        <Table {...tableProps} />
      </TableContainer>

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

export const getServerSideProps: GetServerSideProps<IAccounts> = async () => {
  const props: IAccounts = {
    accounts: [],
    pagination: {} as IPagination,
  };

  const accounts: IAccountResponse = await api.get({
    route: 'address/list',
  });
  if (!accounts.error) {
    props.accounts = accounts.data.accounts;
    props.pagination = accounts.pagination;
  }

  return { props };
};

export default Accounts;
