import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import api from '../../../services/api';

import { renderWithTheme } from '../../../test/utils';
import {
  mockedHomeDataCards,
  mockedMetrics,
  mockedNewAccountsCall,
  mockedStatistics,
  mockedTransactionsCall,
  mockedYesterdayTxCall,
} from '../../../test/mocks'

import HomeDataCards from './';

const mockedTotalAccounts = {
  pagination: {
    totalRecords: 22,
  },
};

jest.mock('@/services/api', () => {
  return { 
    get: jest.fn(),
    text: jest.fn(),
    getCached: jest.fn(),
  }
});

describe('Component: HomeDataCards', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  const {
    totalAccounts: mockTotalAccounts,
    totalTransactions,
    epochInfo,
    tps: mockTps,
    coinsData,
    yesterdayTransactions,
    yesterdayAccounts,
  } = mockedHomeDataCards;



  it('Should render the "Total Accounts", "Total Transactions", "Live/Peak TPS", and "Epoch Remaining Time" cards with values', () => {
    renderWithTheme(
      <HomeDataCards
        totalAccounts={mockTotalAccounts}
        totalTransactions={totalTransactions}
        epochInfo={epochInfo}
        tps={mockTps}
        coinsData={coinsData}
        yesterdayTransactions={yesterdayTransactions}
        yesterdayAccounts={yesterdayAccounts}
      />
    );
    
    const totalAccounts = screen.getByText(/Total Accounts/i);
    const totalTxs = screen.getByText(/Total Transactions/i);
    const tps = screen.getByText(/Live\/Peak TPS/i);
    const epochRemainingTime = screen.getByText(/Epoch Remaining Time/i);

    expect(totalAccounts).toBeInTheDocument();
    expect(totalTxs).toBeInTheDocument();
    expect(tps).toBeInTheDocument();
    expect(epochRemainingTime).toBeInTheDocument();

    expect(totalAccounts.nextSibling)
      .toHaveTextContent(mockTotalAccounts.toLocaleString());
    expect(totalTxs.nextSibling)
      .toHaveTextContent(totalTransactions.toLocaleString());
    expect(tps.nextSibling)
      .toHaveTextContent(mockTps.toLocaleString());
    expect(epochRemainingTime.nextSibling)
      .toHaveTextContent(epochInfo.remainingTime.toLocaleString());
  });

  it('Should render the total accounts and transactions in the last 24h', () => {
    renderWithTheme(
      <HomeDataCards
        totalAccounts={mockTotalAccounts}
        totalTransactions={totalTransactions}
        epochInfo={epochInfo}
        tps={mockTps}
        coinsData={coinsData}
        yesterdayTransactions={yesterdayTransactions}
        yesterdayAccounts={yesterdayAccounts}
      />
    );

    const variant = screen.getAllByText('Last 24h');
    const accountsCreatedSinceYesterday = variant[0].nextSibling;
    const txSinceYesterday = variant[1].nextSibling;
    expect(accountsCreatedSinceYesterday).toBeInTheDocument();
    expect(txSinceYesterday).toBeInTheDocument();
    expect(accountsCreatedSinceYesterday).toHaveTextContent('+ 2');
    expect(txSinceYesterday).toHaveTextContent('+ 20');
  });


  it('Should update statistics every 4 secs and render the new info', async () => {
    renderWithTheme(
      <HomeDataCards
        totalAccounts={mockTotalAccounts}
        totalTransactions={totalTransactions}
        epochInfo={epochInfo}
        tps={mockTps}
        coinsData={coinsData}
        yesterdayTransactions={yesterdayTransactions}
        yesterdayAccounts={yesterdayAccounts}
      />
    );
    
    (api.get as jest.Mock)
      .mockReturnValueOnce(mockedStatistics)
      .mockReturnValueOnce(mockedTotalAccounts);

    (api.text as jest.Mock).mockReturnValueOnce(mockedMetrics);
    (api.getCached as jest.Mock)
    .mockReturnValueOnce(mockedNewAccountsCall)
    .mockReturnValueOnce(mockedTransactionsCall)
    .mockReturnValueOnce(mockedYesterdayTxCall)

    await waitFor(() => {
      expect(api.get).toHaveBeenCalled();
      expect(api.get).toHaveReturnedWith(mockedStatistics);
      expect(api.get).toHaveReturnedWith(mockedTotalAccounts);
      
      expect(api.text).toHaveBeenCalled();
      expect(api.text).toHaveReturnedWith(mockedMetrics);
      
      expect(api.getCached).toHaveBeenCalled();
      expect(api.getCached).toHaveReturnedWith(mockedNewAccountsCall);
      expect(api.getCached).nthReturnedWith(2, mockedTransactionsCall)
      expect(api.getCached).nthReturnedWith(3, mockedYesterdayTxCall)
      
    }, { timeout: 5000 });


  });

  it('Should reject promise with the error', async () => {
    renderWithTheme(
      <HomeDataCards
        totalAccounts={mockTotalAccounts}
        totalTransactions={totalTransactions}
        epochInfo={epochInfo}
        tps={mockTps}
        coinsData={coinsData}
        yesterdayTransactions={yesterdayTransactions}
        yesterdayAccounts={yesterdayAccounts}
      />
    );

    const totalAccountsWithError = {...mockedTotalAccounts, error: 'error'};
    const transactions = {...mockedTransactionsCall, error: 'error'};
    const yesterdayTx = {...mockedYesterdayTxCall, error: 'error'};
    const yesterdayAccs = {...mockedNewAccountsCall, error: 'error'};
    
    (api.get as jest.Mock)
      .mockReturnValueOnce(mockedStatistics)
      .mockReturnValueOnce(totalAccountsWithError);

  (api.text as jest.Mock).mockReturnValueOnce(mockedMetrics);
  (api.getCached as jest.Mock)
    .mockReturnValueOnce(yesterdayAccs)
    .mockReturnValueOnce(transactions)
    .mockReturnValueOnce(yesterdayTx);

  await waitFor(() => {
    expect(api.get).toHaveBeenCalled();
    expect(api.get).toHaveNthReturnedWith(2, totalAccountsWithError);
    
    expect(api.getCached).toHaveBeenCalled();
    expect(api.getCached).toHaveReturnedWith(yesterdayAccs);
    expect(api.getCached).nthReturnedWith(2, transactions);
    expect(api.getCached).nthReturnedWith(3, yesterdayTx);
    
  }, { timeout: 5000 });
  });

  it('Should render the fallback variant when there\'s no new accounts since yesterday' , () => {

    renderWithTheme(
      <HomeDataCards
        totalAccounts={0}
        totalTransactions={totalTransactions}
        epochInfo={epochInfo}
        tps={mockTps}
        coinsData={coinsData}
        yesterdayTransactions={yesterdayTransactions}
        yesterdayAccounts={0}
    />
    );

    
    const totalAccounts = screen.getByText(/Total Accounts/i);
    const variant = totalAccounts.parentNode?.nextSibling?.lastChild;
    expect(variant).toBeUndefined();
  });
});