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
  Title,
} from '@/views/blocks';

import { TableContainer } from '@/views/accounts';

import Table, { ITable } from '@/components/Table';
import { Row } from '@/components/Table/styles';

import { IAccount, IPagination, IResponse } from '@/types/index';
import api from '@/services/api';
import { formatAmount, getAge } from '@/utils/index';

import { ArrowLeft } from '@/assets/icons';
import { Accounts as Icon } from '@/assets/title-icons';
import { PaginationContainer } from '@/components/Pagination/styles';
import Pagination from '@/components/Pagination';
import { useDidUpdateEffect } from '@/utils/hooks';
import Copy from '@/components/Copy';
import { CenteredRow } from '@/views/accounts/detail';

interface IAccounts {
  accounts: IAccount[];
  pagination: IPagination;
  createdYesterday: number;
}

interface IAccountResponse extends IResponse {
  data: {
    accounts: IAccount[];
  };
  pagination: IPagination;
}

interface IAccountRangeOfLastDays extends IResponse {
  data: {
    number_by_day: [
      {
        doc_count: number;
      },
    ];
  };
}

interface ICard {
  title: string;
  headers: string[];
  values: string[];
}

const Accounts: React.FC<IAccounts> = ({
  accounts: defaultAccounts,
  pagination,
  createdYesterday,
}) => {
  const router = useRouter();
  const precision = 6; // default KLV precision

  const [page, setPage] = useState(1);
  const [accounts, setAccounts] = useState(defaultAccounts);
  const [loading, setLoading] = useState(false);

  useDidUpdateEffect(() => {
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
      headers: ['Accounts created in the last 24h', 'Total accounts'],
      values: [
        createdYesterday === pagination.totalRecords
          ? '--'
          : createdYesterday.toLocaleString(),
        pagination.totalRecords?.toLocaleString(),
      ],
    },
  ];

  const CardContent: React.FC<ICard> = ({ title, headers, values }) => {
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

  const header = ['Address', 'KLV Staked', 'Nonce', 'KLV Balance'];

  const TableBody: React.FC<IAccount> = ({ address, balance, nonce }) => {
    // const getFreezeBalance = () => {
    //   if (Object.values(buckets).length <= 0) {
    //     return 0;
    //   }

    //   const freezeBalance = Object.values(buckets).reduce(
    //     (acc, bucket) => acc + bucket.balance,
    //     0,
    //   );

    //   return freezeBalance / 10 ** precision;
    // };

    return (
      <Row type="accounts">
        <span>
          <CenteredRow>
            <Link href={`/account/${address}`}>{address}</Link>

            <Copy info="Address" data={address} />
          </CenteredRow>
        </span>
        <span>
          <strong>{/* {formatAmount(getFreezeBalance())}  */}-- KLV</strong>
        </span>
        <span>{nonce}</span>
        <span>
          <strong>{formatAmount(balance / 10 ** precision)} KLV</strong>
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
          <div onClick={() => router.push('/')}>
            <ArrowLeft />
          </div>
          <h1>Accounts</h1>
          <Icon />
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
    createdYesterday: 0,
  };

  const accountsCall = new Promise<IAccountResponse>(
    async (resolve, reject) => {
      const res = await api.get({
        route: 'address/list',
      });

      if (!res.error || res.error === '') {
        resolve(res);
      }

      reject(res.error);
    },
  );

  const yesterdayAccountsCall = new Promise<IAccountRangeOfLastDays>(
    async (resolve, reject) => {
      const res = await api.get({
        route: 'address/list/count/1',
      });

      if (!res.error || res.error === '') {
        resolve(res);
      }

      reject(res.error);
    },
  );

  await Promise.allSettled([accountsCall, yesterdayAccountsCall]).then(
    responses => {
      responses.map((res, index) => {
        if (res.status !== 'rejected') {
          const { value }: any = res;
          switch (index) {
            case 0:
              props.accounts = value.data.accounts;
              props.pagination = value.pagination;
              break;

            case 1:
              props.createdYesterday = value.data.number_by_day[0].doc_count;
              break;

            default:
              break;
          }
        }
      });
    },
  );

  return { props };
};

export default Accounts;
