import React, { useState } from 'react';

import { GetServerSideProps } from 'next';
import Link from 'next/link';

import List, { IList } from '../../components/Layout/List';

import api from '../../services/api';
import { IAccount, IPagination, IResponse } from '../../types';
import { navbarItems } from '../../configs/navbar';

interface IAccountPage {
  accounts: IAccount[];
  pagination: IPagination;
}

interface IAccountResponse extends IResponse {
  data: {
    accounts: IAccount[];
  };
  pagination: IPagination;
}

const Accounts: React.FC<IAccountPage> = ({
  accounts: defaultAccounts,
  pagination,
}) => {
  const title = 'Accounts';
  const Icon = navbarItems.find(item => item.name === 'Accounts')?.Icon;
  const maxItems = pagination.totalRecords;
  const headers = ['Address', 'Balance'];

  const [accounts, setAccounts] = useState<IAccount[]>(defaultAccounts);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(false);

  const loadMore = async () => {
    if (maxPage) {
      return;
    }

    const newAccounts: IAccountResponse = await api.get({
      route: 'address/list',
      query: { page },
    });
    if (!newAccounts.error) {
      if (page <= newAccounts.pagination.totalPages) {
        setAccounts([...accounts, ...newAccounts.data.accounts]);

        setPage(page + 1);

        if (page + 1 > newAccounts.pagination.totalPages) {
          setMaxPage(true);
        }
      }
    }
  };

  const listProps: IList = {
    title,
    Icon,
    maxItems,
    listSize: accounts.length,
    headers,
    loadMore,
    maxPage,
  };

  const renderItems = () =>
    accounts.map((account, index) => (
      <tr key={String(index)}>
        <td>
          <span>
            <Link href={`/accounts/${account.address}`}>{account.address}</Link>
          </span>
        </td>
        <td>{account.balance.toLocaleString()} KLV</td>
      </tr>
    ));

  return <List {...listProps}>{renderItems()}</List>;
};

export const getServerSideProps: GetServerSideProps<IAccountPage> =
  async () => {
    const props: IAccountPage = { accounts: [], pagination: {} as IPagination };

    const accounts: IAccountResponse = await api.get({ route: 'address/list' });
    if (!accounts.error) {
      props.accounts = accounts.data.accounts;
      props.pagination = accounts.pagination;
    }

    return { props };
  };

export default Accounts;
