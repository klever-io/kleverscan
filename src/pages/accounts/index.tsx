import { PropsWithChildren } from 'react';
import { Accounts as Icon } from '@/assets/title-icons';
import Copy from '@/components/Copy';
import Title from '@/components/Layout/Title';
import Skeleton from '@/components/Skeleton';
import Table, { ITable } from '@/components/Table';
import { useMobile } from '@/contexts/mobile';
import api from '@/services/api';
import {
  Card,
  CardContainer,
  CenteredRow,
  Container,
  Header,
  Mono,
} from '@/styles/common';
import { IAccount, IPagination, IResponse, IRowSection } from '@/types/index';
import { formatAmount } from '@/utils/formatFunctions';
import { KLV_PRECISION } from '@/utils/globalVariables';
import { parseAddress } from '@/utils/parseValues';
import { getAge } from '@/utils/timeFunctions';
import { TableContainer } from '@/views/accounts';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import nextI18nextConfig from '../../../next-i18next.config';
import { GetServerSideProps } from 'next';

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
  values: Array<string | JSX.Element>;
}

const Accounts: React.FC<PropsWithChildren<IAccounts>> = () => {
  const [pagination, setPagination] = useState<null | IPagination>(null);
  const [createdYesterday, setCreatedYesterday] = useState<null | number>(null);
  const { t } = useTranslation(['common', 'accounts', 'table']);
  const requestAccounts = async (page: number, limit: number) =>
    await api.get({
      route: `address/list?page=${page}&limit=${limit}`,
    });

  const loadInitialData = async () => {
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
                setPagination(value.pagination);
                break;

              case 1:
                setCreatedYesterday(value.data.number_by_day[0]?.doc_count);
                break;

              default:
                break;
            }
          }
        });
      },
    );
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const cards: ICard[] = [
    {
      title: t('accounts:AccountsPage.Number of Accounts'),
      headers: [
        t('accounts:AccountsPage.Accounts created in the last 24h'),
        t('common:Cards.Total Accounts'),
      ],
      values: [
        createdYesterday === pagination?.totalRecords
          ? '--'
          : (createdYesterday?.toLocaleString() ?? <Skeleton />),
        pagination?.totalRecords?.toLocaleString() ?? <Skeleton />,
      ],
    },
  ];

  const CardContent: React.FC<PropsWithChildren<ICard>> = ({
    title,
    headers,
    values,
  }) => {
    const [uptime] = useState(new Date().getTime());
    const [age, setAge] = useState(getAge(new Date(), t));

    useEffect(() => {
      const interval = setInterval(() => {
        const newAge = getAge(new Date(uptime / 1000), t);

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
          <p>
            {age} {t('common:Date.Elapsed_Time')}
          </p>
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

  const header = [
    `${t('table:Address')}`,
    'Nonce',
    `KLV ${t('table:Balance')}`,
    `KLV ${t('table:Staked')}`,
  ];

  const { isMobile } = useMobile();

  const rowSections = (account: IAccount): IRowSection[] => {
    const { address, balance, frozenBalance, nonce } = account;
    const sections: IRowSection[] = [
      {
        element: props => (
          <CenteredRow key={address}>
            <Link href={`/account/${address}`}>
              <Mono>{isMobile ? parseAddress(address, 24) : address}</Mono>
            </Link>

            <Copy info="Address" data={address} />
          </CenteredRow>
        ),
        span: 2,
      },
      {
        element: props => <span key={nonce}>{nonce}</span>,
        span: 1,
        width: 100,
      },
      {
        element: props => (
          <span key={balance}>
            {formatAmount(balance / 10 ** KLV_PRECISION)} KLV
          </span>
        ),
        span: 1,
      },
      {
        element: props => (
          <span key={frozenBalance}>
            {formatAmount(frozenBalance / 10 ** KLV_PRECISION)} KLV
          </span>
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
  };

  return (
    <Container>
      <Header>
        <Title title={t('common:Titles.Accounts')} Icon={Icon} />
      </Header>

      <CardContainer>
        {cards.map((card, index) => (
          <CardContent key={String(index)} {...card} />
        ))}
      </CardContainer>

      <TableContainer>
        <h3>{t('accounts:AccountsPage.List Of Accounts')}</h3>
        <Table {...tableProps} />
      </TableContainer>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => {
  const props = await serverSideTranslations(
    locale,
    ['common', 'accounts', 'table'],
    nextI18nextConfig,
    ['en'],
  );

  return { props };
};

export default Accounts;
