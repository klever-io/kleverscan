import { act, screen } from '@testing-library/react';
import * as nextRouter from 'next/router';
import React from 'react';
import Tabs, { ITabs } from '.';
import Transaction from '../../components/Tabs/Transactions';
import { mockedTransactions } from '../../test/mocks';
import { renderWithTheme } from '../../test/utils';
import { IInnerTableProps } from '../../types';
import {
  address,
  assetId,
  assetText,
  balanceText,
  frozenBalanceText,
  headerTable,
  mockedAssets,
} from './Assets/Assets.spec';

const precision = 6;
const request = jest.fn(async (page: number, limit: number) => {
  return Promise.resolve(mockedAPIResponse);
});

const mockedAPIResponse = {
  data: {
    transactions: mockedTransactions,
  },
  pagination: {
    self: 1,
    next: 2,
    previous: 1,
    perPage: 10,
    totalPages: 1000,
    totalRecords: 19348805,
  },
};

const transactionTableProps: IInnerTableProps = {
  scrollUp: false,
  dataName: 'transactions',
  request,
  query: {},
};
const mockedTransactionTab = (
  <Transaction transactionsTableProps={transactionTableProps} />
);

const tableHeaders = ['Assets', 'Transactions'];

describe('Component: Tabs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const localAddress = address;

    jest.mock('next/router');

    const useRouter: any = jest.spyOn(nextRouter, 'useRouter');
    useRouter.mockReturnValue({
      route: '/',
      pathname: '',
      query: {
        tab: 'Transactions',
        role: 'receiver',
      },
      isReady: true,
    });
  });

  let tabProps: ITabs = {
    headers: tableHeaders,
  };

  it('Should render the Assets Tab correctly', async () => {
    await act(async () => {
      renderWithTheme(<Tabs {...tabProps}>{mockedAssets}</Tabs>);
    });

    headerTable.map(header => {
      expect(screen.getAllByText(header)[0]).toBeInTheDocument();
    });

    expect(screen.getByText(balanceText)).toBeInTheDocument();
    expect(screen.getByText(frozenBalanceText)).toBeInTheDocument();
    expect(screen.getByText(assetText)).toBeInTheDocument();

    const idButton = screen.getByRole('link', { name: assetId });

    expect(idButton).toBeInTheDocument();
  });

  tabProps = {
    headers: tableHeaders,
    dateFilterProps: {
      resetDate: jest.fn(),
      filterDate: jest.fn(),
      empty: true,
    },
    showDataFilter: false,
  };
});
