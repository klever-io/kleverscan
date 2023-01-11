import { renderWithTheme } from '@/test/utils';
import { screen } from '@testing-library/react';
import React from 'react';
import HomeDataCardsSkeleton from '.';

jest.mock('@/services/api', () => {
  return {
    get: jest.fn(),
    getCached: jest.fn(),
  };
});

describe('Component: HomeDataCardsSkeleton', () => {
  it('Should render the Skeleton and the correct texts', () => {
    renderWithTheme(<HomeDataCardsSkeleton />);
    const totalAccounts = screen.getByText(/Total Accounts/i);
    const totalTransactions = screen.getByText(/Total Transactions/i);
    const livePeakTPS = screen.getByText(/Live\/Peak TPS/i);

    expect(totalAccounts).toBeInTheDocument();
    expect(totalTransactions).toBeInTheDocument();
    expect(livePeakTPS).toBeInTheDocument();
  });

  it('Should render all the Skeleton components', () => {
    const container = renderWithTheme(<HomeDataCardsSkeleton />).container;
    const skeletonsInCoinCards = screen.getAllByTestId('skeleton');

    expect(skeletonsInCoinCards.length).toBe(10);
  });
});
