import React from 'react';
import { screen } from '@testing-library/react';

import theme from '../../styles/theme';
import { IHomeTransactions } from '../../types'

import HomeTransactions from './';
import { renderWithTheme } from '../../test/utils';

const mockHomeTxs: IHomeTransactions = {
  setTotalTransactions: jest.fn(),
  transactions: [],
  transactionsList: [
    {
        doc_count: 9,
        key: 1652140800000
    },
    {
        doc_count: 32,
        key: 1652227200000
    },
  ],
  precision: 6,
  
}

describe('Component: HomeTransactions', () => {
  let container: HTMLElement;
  beforeEach(() => {
    container = renderWithTheme(
    <HomeTransactions 
      setTotalTransactions={jest.fn()}
      transactions={[]}
      transactionsList={mockHomeTxs.transactionsList}
      precision={6}
    />).container
  });
  it('Should render the Title and the empty component when don\'t have any transaction', () => {
    const emptyElement = screen.getByText(/Oops! Apparently no data here./i);
    const link = screen.getByRole('heading');
    expect(emptyElement).toBeInTheDocument();
    expect(link).toBeInTheDocument();
  });

  it('Should render the Chart container with the day(s)', () => {
    const dailyTx = screen.getByText(/Daily Transactions/i);
    expect(dailyTx.parentNode).toBeInTheDocument();
    expect(dailyTx.nextSibling).toHaveTextContent(`(${mockHomeTxs.transactionsList.length} days)`);
  });

  it('Should match the style for TransactionContent and TransactionEmpty', () => {
    const txContent = screen.getByText(/Oops! Apparently no data here./i).parentNode?.parentNode;
    const txContentStyle = {
      maxHeight: '27.5rem',
      minWidth: 'fit-content',
      padding: '1.5rem',
      backgroundColor: theme.white,
    };
    const txEmpty = txContent?.firstChild;
    const txEmptyStyle = {
      width: '27.5rem',
      height: '20rem',
    };

    expect(txContent).toHaveStyle(txContentStyle);
    expect(txEmpty).toHaveStyle(txEmptyStyle);
  });
}); 