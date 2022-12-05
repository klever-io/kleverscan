import { screen, waitFor } from '@testing-library/react';
import React from 'react';
import api from '../../../services/api';
import {
  mockedHomeDataCards,
  mockedMetrics,
  mockedNewAccountsCall,
  mockedStatistics,
  mockedTransactionsCall,
  mockedYesterdayTxCall,
} from '../../../test/mocks';
import { renderWithTheme } from '../../../test/utils';
import HomeDataCards from './';

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
    beforeYesterdayTransactions,
    block,
    assetsData,
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
        beforeYesterdayTransactions={beforeYesterdayTransactions}
        assetsData={assetsData}
        block={block}
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

    const totalAccounts = screen.getByText(/100/);
    const totalTx = screen.getByText(/20,000/i);
    const tps = screen.getByText(/0 \/ 3000/i);
    const epochRemainingTime = screen.getByText(/two days/i);

    expect(totalAccounts).toBeInTheDocument();
    expect(totalTx).toBeInTheDocument();
    expect(tps).toBeInTheDocument();
    expect(epochRemainingTime).toBeInTheDocument();
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
        beforeYesterdayTransactions={beforeYesterdayTransactions}
        assetsData={assetsData}
        block={block}
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
        beforeYesterdayTransactions={beforeYesterdayTransactions}
        assetsData={assetsData}
        block={block}
      />,
    );

    const statistics = { ...mockedStatistics };
    const metrics = { ...mockedMetrics };
    const totalAccs = { ...mockedTotalAccounts, error: '' };
    const transactions = { ...mockedTransactionsCall, error: '' };
    const yesterdayTx = { ...mockedYesterdayTxCall, error: '' };
    const yesterdayAccs = { ...mockedNewAccountsCall, error: '' };

    (api.get as jest.Mock)
      .mockReturnValueOnce(mockedStatistics)
      .mockReturnValueOnce(mockedMetrics);

    (api.getCached as jest.Mock)
      .mockReturnValueOnce(totalAccs)
      .mockReturnValueOnce(yesterdayAccs)
      .mockReturnValueOnce(transactions)
      .mockReturnValueOnce(yesterdayTx);

    await waitFor(
      () => {
        expect(api.get).toHaveBeenCalled();
        expect(api.get).toHaveReturnedWith(statistics);
        expect(api.get).nthReturnedWith(2, metrics);

        expect(api.getCached).toHaveBeenCalled();
        expect(api.getCached).toHaveReturnedWith(totalAccs);
        expect(api.getCached).nthReturnedWith(2, yesterdayAccs);
        expect(api.getCached).nthReturnedWith(3, transactions);
        expect(api.getCached).nthReturnedWith(4, yesterdayTx);
      },
      { timeout: 5000 },
    );
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
        beforeYesterdayTransactions={beforeYesterdayTransactions}
        assetsData={assetsData}
        block={block}
      />,
    );

    const totalAccountsWithError = { ...mockedTotalAccounts, error: 'error' };
    const transactions = { ...mockedTransactionsCall, error: 'error' };
    const yesterdayTx = { ...mockedYesterdayTxCall, error: 'error' };
    const yesterdayAccs = { ...mockedNewAccountsCall, error: 'error' };

    (api.get as jest.Mock)
      .mockReturnValueOnce(mockedStatistics)
      .mockReturnValueOnce(mockedMetrics);

    (api.getCached as jest.Mock)
      .mockReturnValueOnce(totalAccountsWithError)
      .mockReturnValueOnce(yesterdayAccs)
      .mockReturnValueOnce(transactions)
      .mockReturnValueOnce(yesterdayTx);

    await waitFor(
      () => {
        expect(api.get).toBeCalled();
        expect(api.get).toHaveBeenCalledTimes(2);

        expect(api.getCached).toHaveBeenCalled();
        expect(api.getCached).toHaveReturnedWith(totalAccountsWithError);
        expect(api.getCached).toHaveNthReturnedWith(2, yesterdayAccs);
        expect(api.getCached).nthReturnedWith(3, transactions);
        expect(api.getCached).nthReturnedWith(4, yesterdayTx);
      },
      { timeout: 5000 },
    );
  });

  it("Should render the fallback variant when there's no new accounts since yesterday", () => {
    renderWithTheme(
      <HomeDataCards
        totalAccounts={mockTotalAccounts}
        totalTransactions={totalTransactions}
        tps={mockTps}
        epochInfo={epochInfo}
        coinsData={coinsData}
        yesterdayTransactions={yesterdayTransactions}
        beforeYesterdayTransactions={beforeYesterdayTransactions}
        yesterdayAccounts={0}
        assetsData={assetsData}
        block={block}
      />,
    );
    const totalAccounts = screen.getByText(/Total Accounts/i);
    const variant = totalAccounts.parentNode?.nextSibling?.lastChild;
    expect(variant).toBeUndefined();
  });
});
