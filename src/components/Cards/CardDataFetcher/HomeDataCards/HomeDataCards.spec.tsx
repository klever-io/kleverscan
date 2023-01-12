import { screen } from '@testing-library/react';
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
  beforeEach(() => {
    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  const {
    totalAccounts: mockTotalAccounts,
    totalTransactions,
    actualTPS,
    newTransactions,
    newAccounts,
    beforeYesterdayTransactions,
    block,
    counterEpoch,
    metrics,
  } = mockedHomeDataCards;

  const statistics = { ...mockedStatistics };
  const totalAccs = { ...mockedTotalAccounts, error: '' };
  const transactions = { ...mockedTransactionsCall, error: '' };
  const yesterdayTx = { ...mockedYesterdayTxCall, error: '' };
  const yesterdayAccs = { ...mockedNewAccountsCall, error: '' };

  it('Should render the "Total Accounts", "Total Transactions", "Live/Peak TPS", and "Epoch Remaining Time" cards with values', () => {
    renderWithTheme(
      <HomeDataCards
        totalAccounts={mockTotalAccounts}
        totalTransactions={totalTransactions}
        newTransactions={newTransactions}
        beforeYesterdayTransactions={beforeYesterdayTransactions}
        newAccounts={newAccounts}
        block={block}
        actualTPS={actualTPS}
        counterEpoch={counterEpoch}
        metrics={metrics}
      />,
    );
    const totalAccountsLabel = screen.getByText(/Total Accounts/i);
    const totalTxsLabel = screen.getByText(/Total Transactions/i);
    const tpsLabel = screen.getByText(/Live\/Peak TPS/i);
    const epochRemainingTimeLabel = screen.getByText(/Epoch Remaining Time/i);

    expect(totalAccountsLabel).toBeInTheDocument();
    expect(totalTxsLabel).toBeInTheDocument();
    expect(tpsLabel).toBeInTheDocument();
    expect(epochRemainingTimeLabel).toBeInTheDocument();

    const totalAccounts = screen.getAllByText(/100/);
    const totalTx = screen.getAllByText(/20,000/i);
    const tps = screen.getAllByText(/0 \/ 3000/i);
    const epochRemainingTime = screen.getAllByText(/6h/i);

    expect(totalAccounts[0]).toBeInTheDocument();
    expect(totalTx[0]).toBeInTheDocument();
    expect(tps[0]).toBeInTheDocument();
    expect(epochRemainingTime[0]).toBeInTheDocument();
  });

  it('Should render the total accounts and transactions in the last 24h', () => {
    renderWithTheme(
      <HomeDataCards
        totalAccounts={mockTotalAccounts}
        totalTransactions={totalTransactions}
        newTransactions={newTransactions}
        beforeYesterdayTransactions={beforeYesterdayTransactions}
        newAccounts={newAccounts}
        block={block}
        actualTPS={actualTPS}
        counterEpoch={counterEpoch}
        metrics={metrics}
      />,
    );

    const variant = screen.getAllByText('Last 24h');
    const accountsCreatedSinceYesterday = variant[0].nextSibling;
    const txSinceYesterday = variant[1].nextSibling;
    expect(accountsCreatedSinceYesterday).toBeInTheDocument();
    expect(txSinceYesterday).toBeInTheDocument();
    expect(accountsCreatedSinceYesterday).toHaveTextContent('+ 2');
    expect(txSinceYesterday).toHaveTextContent('+ 20');
  });

  it("Should render the fallback variant when there's no new accounts since yesterday", () => {
    renderWithTheme(
      <HomeDataCards
        totalAccounts={mockTotalAccounts}
        totalTransactions={totalTransactions}
        newTransactions={newTransactions}
        beforeYesterdayTransactions={beforeYesterdayTransactions}
        newAccounts={0}
        block={block}
        actualTPS={actualTPS}
        counterEpoch={counterEpoch}
        metrics={metrics}
      />,
    );
    const totalAccounts = screen.getByText(/Total Accounts/i);
    const variant = totalAccounts.parentNode?.nextSibling?.lastChild;
    expect(variant).toBeUndefined();
  });
});