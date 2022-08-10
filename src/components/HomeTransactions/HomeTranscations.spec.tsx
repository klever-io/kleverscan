import { screen } from '@testing-library/react';
import React from 'react';
import theme from '../../styles/theme';
import { mockHomeTxs } from '../../test/mocks';
import { renderWithTheme } from '../../test/utils';
import HomeTransactions from './';

mockHomeTxs.setTotalTransactions = jest.fn();

describe('Component: HomeTransactions', () => {
  let container: HTMLElement;
  beforeEach(() => {
    jest.clearAllMocks();
    container = renderWithTheme(
      <HomeTransactions
        setTotalTransactions={jest.fn()}
        transactions={[]}
        transactionsList={mockHomeTxs.transactionsList}
        precision={6}
      />,
    ).container;
  });
  it("Should render the Title and the empty component when don't have any transaction", () => {
    const emptyElement = screen.getByText(/Oops! Apparently no data here./i);
    const link = screen.getByRole('heading');
    expect(emptyElement).toBeInTheDocument();
    expect(link).toBeInTheDocument();
  });

  it('Should render the Chart container with the day(s)', () => {
    const dailyTx = screen.getByText(/Daily Transactions/i);
    expect(dailyTx.parentNode).toBeInTheDocument();
    expect(dailyTx.nextSibling).toHaveTextContent(
      `(${mockHomeTxs.transactionsList.length} days)`,
    );
  });

  it('Should match the style for TransactionContent and TransactionEmpty', () => {
    const txContent = screen.getByText(/Oops! Apparently no data here./i)
      .parentNode?.parentNode;
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
