import { HomeDataProvider } from '@/contexts/mainPage';
import { screen } from '@testing-library/react';
import React from 'react';
import HomeTransactions from '.';
import { mockHomeTxs } from '../../test/mocks';
import { renderWithTheme } from '../../test/utils';

mockHomeTxs.setTotalTransactions = jest.fn();

describe('Component: HomeTransactions', () => {
  let container: HTMLElement;

  beforeEach(() => {
    jest.clearAllMocks();
    container = renderWithTheme(
      <HomeDataProvider>
        <HomeTransactions />
      </HomeDataProvider>,
    ).container;
  });
  it("Should render the Title and the empty component when don't have any transaction", () => {
    const emptyElement = screen.getByText(/EmptyData/i);
    const title = screen.getByText('Last transactions');
    expect(emptyElement).toBeInTheDocument();
    expect(title).toBeInTheDocument();
  });

  it('Should render the Chart container with the day(s)', () => {
    const dailyTx = screen.getByText(/Last transactions/i);
    expect(dailyTx.parentNode).toBeInTheDocument();
    expect(dailyTx.nextSibling).toHaveTextContent('Hide');
  });

  it('Should match the style for TransactionContent and TransactionEmpty', () => {
    const txContent = screen.getByText(/EmptyData/i).parentNode?.parentNode;
    const txContentStyle = {
      display: 'flex',
      'border-radius': '16px',
    };
    const txEmpty = txContent?.firstChild;
    const txEmptyStyle = {
      height: '20rem',
      gridTemplateColumns: 'initial',
      justifyContent: 'center',
      alignItems: 'center',
    };

    expect(txContent).toHaveStyle(txContentStyle);
    expect(txEmpty).toHaveStyle(txEmptyStyle);
  });
});
