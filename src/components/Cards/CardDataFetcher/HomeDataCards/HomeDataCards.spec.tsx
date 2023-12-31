import * as HomeData from '@/contexts/mainPage';
import { fireEvent, screen } from '@testing-library/react';
import React from 'react';
import HomeDataCards from '.';
import {
  mockedHomeDataCards,
  mockedNewAccountsCall,
  mockedStatistics,
  mockedTransactionsCall,
  mockedYesterdayTxCall,
} from '../../../../test/mocks';
import { renderWithTheme } from '../../../../test/utils';

const mockedTotalAccounts = {
  pagination: {
    totalRecords: 22,
  },
};

jest.mock('@/services/api', () => {
  return {
    get: jest.fn(),
    getCached: jest.fn(),
  };
});

describe('Component: HomeDataCards', () => {
  let mock;
  const {
    totalAccounts: mockTotalAccounts,
    totalTransactions,
    actualTPS,
    newTransactions,
    newAccounts,
    beforeYesterdayTransactions,
    blocks,
    counterEpoch,
    metrics,
  } = mockedHomeDataCards;

  const contextValues = {
    totalAccounts: mockTotalAccounts,
    totalTransactions,
    actualTPS,
    newTransactions,
    newAccounts,
    beforeYesterdayTransactions,
    blocks,
    counterEpoch,
    metrics,
  };
  beforeEach(() => {
    mock = jest
      .spyOn(HomeData, 'useHomeData')
      .mockImplementation(() => contextValues as unknown as HomeData.IHomeData);
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  const statistics = { ...mockedStatistics };
  const totalAccs = { ...mockedTotalAccounts, error: '' };
  const transactions = { ...mockedTransactionsCall, error: '' };
  const yesterdayTx = { ...mockedYesterdayTxCall, error: '' };
  const yesterdayAccs = { ...mockedNewAccountsCall, error: '' };

  it('Should render the "Total Accounts", "Total Transactions", "Live/Peak TPS", and "Epoch Remaining Time" cards with values', () => {
    renderWithTheme(<HomeDataCards />);
    const totalAccountsLabel = screen.getByText(/Total Accounts/i);
    const totalTxsLabel = screen.getByText(/Total Transactions/i);
    const epochRemainingTimeLabel = screen.getByText(/Time remaining/i);

    expect(totalAccountsLabel).toBeInTheDocument();
    expect(totalTxsLabel).toBeInTheDocument();
    expect(epochRemainingTimeLabel).toBeInTheDocument();

    const totalAccounts = screen.getAllByText(/100/);
    const totalTx = screen.getAllByText(/20,000/i);
    const button = screen.getByText(/Expand cards/i);
    fireEvent.click(button);
    const tps = screen.getAllByText(/0 \/ 3000/i);
    const epochRemainingTime = screen.getAllByText(/6h/i);

    expect(totalAccounts[0]).toBeInTheDocument();
    expect(totalTx[0]).toBeInTheDocument();
    expect(tps[0]).toBeInTheDocument();
    expect(epochRemainingTime[0]).toBeInTheDocument();
  });

  it('Should render the total accounts and transactions in the last 24h', () => {
    renderWithTheme(<HomeDataCards />);

    const variant = screen.getByText('+ 20/24h');
    expect(variant).toBeInTheDocument();
    expect(variant).toHaveTextContent('+ 20');
  });

  it("Should render the fallback variant when there's no new accounts since yesterday", () => {
    const newContextValues = {
      ...contextValues,
      newAccounts: 0,
    };
    mock = jest
      .spyOn(HomeData, 'useHomeData')
      .mockImplementation(
        () => newContextValues as unknown as HomeData.IHomeData,
      );
    renderWithTheme(<HomeDataCards />);
    const totalAccounts = screen.getByText(/Total Accounts/i);
    const variant =
      totalAccounts.nextSibling?.lastChild?.firstChild?.firstChild;
    expect(variant).toBe(null);
  });
});
