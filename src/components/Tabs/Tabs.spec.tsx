import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as nextRouter from 'next/router';
import React from 'react';
import Tabs, { ITabs } from '.';
import { renderWithTheme } from '../../test/utils';
import {
  address,
  assetId,
  assetText,
  balanceText,
  frozenBalanceText,
  headerTable,
  mockedAssets,
} from './Assets/Assets.spec';
import { mockedTransactionTab } from './Transactions/Transaction.spec';

const tableHeaders = ['Assets', 'Transactions'];

const filterOptions = [
  'Transactions Out',
  'Transactions In',
  'All Transactions',
];

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
        toAddress: localAddress,
      },
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
    showTxInTxOutFilter: true,
  };

  it('Should change tab to transactions and change filters upon click', async () => {
    await act(async () => {
      renderWithTheme(<Tabs {...tabProps}>{mockedTransactionTab}</Tabs>);
    });

    tableHeaders.map(header => {
      expect(screen.getAllByText(header)[0]).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText(tableHeaders[1]));

    const filterContainer = screen.getByTestId('filter-container');

    expect(filterContainer).toBeInTheDocument(); // test if filter container is visible

    const inOutFilter = filterContainer.lastElementChild
      ?.lastElementChild as HTMLElement;

    await userEvent.click(inOutFilter);

    filterOptions.map(filter => {
      expect(screen.getByText(filter)).toBeInTheDocument(); // test if filter options are visible
    });

    for (const filter of filterOptions) {
      await userEvent.click(screen.getByText(filter));

      expect(inOutFilter).toHaveTextContent(filter); // test if filter option is selected
    }
  });

  it('Should change initial filter depending on router query', async () => {
    await act(async () => {
      renderWithTheme(<Tabs {...tabProps}>{mockedTransactionTab}</Tabs>);
    });

    tableHeaders.map(header => {
      expect(screen.getAllByText(header)[0]).toBeInTheDocument();
    });

    const filterContainer = screen.getByTestId('filter-container');

    const inOutFilter = filterContainer.lastElementChild
      ?.lastElementChild as HTMLElement;

    expect(filterContainer).toBeInTheDocument(); // test if filter container is visible

    expect(inOutFilter.firstElementChild).toHaveTextContent(filterOptions[1]); // test if filter option is selected
  });
});