import { Accounts as Icon } from '@/assets/title-icons';
import Copy from '@/components/Copy';
import Title from '@/components/Layout/Title';
import Table, { ITable } from '@/components/Table';
import { useMobile } from '@/contexts/mobile';
import api from '@/services/api';
import { IAccount, IPagination, IResponse, IRowSection } from '@/types/index';
import { formatAmount, getAge, parseAddress } from '@/utils/index';
import { TableContainer } from '@/views/accounts';
import { CenteredRow } from '@/views/accounts/detail';
import { Card, CardContainer, Container, Header, Input } from '@/views/blocks';
import { fromUnixTime } from 'date-fns';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

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

const Accounts: React.FC<IAccounts> = ({ pagination, createdYesterday }) => {
  const precision = 6; // default KLV precision

  const requestAccounts = async (page: number, limit: number) =>
    await api.get({
      route: `address/list?page=${page}&limit=${limit}`,
    });

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

  const { isMobile } = useMobile();

  const rowSections = (account: IAccount): IRowSection[] => {
    const { address, balance, frozenBalance, nonce } = account;
    const sections = [
      {
        element: (
          <CenteredRow key={address}>
            <Link href={`/account/${address}`}>
              {isMobile ? parseAddress(address, 24) : address}
            </Link>

            <Copy info="Address" data={address} />
          </CenteredRow>
        ),
        span: 2,
      },

      {
        element: (
          <strong key={frozenBalance}>
            {formatAmount(frozenBalance / 10 ** precision)} KLV
          </strong>
        ),
        span: 1,
      },
      {
        element: <span key={nonce}>{nonce}</span>,
        span: 1,
      },
      {
        element: (
          <strong key={balance}>
            {formatAmount(balance / 10 ** precision)} KLV
          </strong>
        ),
        span: 1,
      },
    ];
    return sections;
  };

  const tableProps: ITable = {
    type: 'accounts',
    header,
    rowSections,
    request: (page, limit) => requestAccounts(page, limit),
    dataName: 'accounts',
    scrollUp: true,
  };

  return (
    <Container>
      <Header>
        <Title title="Accounts" Icon={Icon} />

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
              props.pagination = value.pagination;
              break;

            case 1:
              props.createdYesterday = value.data.number_by_day[0]?.doc_count;
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
