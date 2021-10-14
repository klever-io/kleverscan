import React, { useState } from 'react';

import { GetStaticProps } from 'next';
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

  const loadMore = async () => {
    const newAccounts: IAccountResponse = await api.get({
      route: 'address/list',
      query: { page },
    });
    if (!newAccounts.error) {
      setAccounts([...accounts, ...newAccounts.data.accounts]);

      const next = newAccounts.pagination.next;
      if (next !== 0) {
        setPage(next);
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

export const getStaticProps: GetStaticProps<IAccountPage> = async () => {
  const props: IAccountPage = { accounts: [], pagination: {} as IPagination };

  const accounts: IAccountResponse = await api.get({ route: 'address/list' });
  if (!accounts.error) {
    props.accounts = accounts.data.accounts;
    props.pagination = accounts.pagination;
  }

  return { props };
};

export default Accounts;
