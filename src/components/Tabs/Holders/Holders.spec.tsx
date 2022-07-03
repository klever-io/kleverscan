import React from 'react';
import { screen } from '@testing-library/react';

import { klvAsset, mockedHolders } from '../../../test/mocks'
import { renderWithTheme } from '../../../test/utils';
import { toLocaleFixed } from '../../../utils/index';
import Holders from './';

jest.mock('next/router', () => ({
  useRouter() {
    return ({
      route: '/',
      pathname: '',
    });
  },
}));

describe('Component: Tabs/Holders', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should render the the Table, it\'s Body and header correctly', () => {
    renderWithTheme(
      <Holders
        holders={mockedHolders}
        asset={klvAsset}
        loading={false}
      />
    );
    
    const headers = ['Rank', 'Address', 'Percentage', 'Amount'];
    const rank = screen.getByText('1°');
    const tableBody = rank.parentNode?.parentNode?.parentNode?.parentNode;
    const tableBodyStyle = {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
    };
    
    headers.forEach(( name ) => {
      const header = screen.getByText(name);
      expect(header).toBeInTheDocument();
    });

    expect(rank).toBeInTheDocument();
    expect(tableBody).toHaveStyle(tableBodyStyle);



  });

  it('Should render the correct values for "Rank", "Addrress", "Percentage" and "Amount"', () => {
    renderWithTheme(
      <Holders
        holders={mockedHolders}
        asset={klvAsset}
        loading={false}
      />
    );
    
    const link = screen.getByRole('link',
      { name: /klv1hun5jj78k8563wc7...29mfvy95waf9jsdfr741/i });
    const balance = mockedHolders[0].balance + mockedHolders[0].frozenBalance;

    const calcPercentage = ((balance / klvAsset.circulatingSupply) * 100)
      .toFixed(2);
    const percentage = screen.getByText(`${calcPercentage}%`);

    const calcAmount = toLocaleFixed(balance / 10 ** klvAsset.precision, klvAsset.precision);
    const amount = screen.getByText(calcAmount);

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', `/account/${mockedHolders[0].address}`);
    expect(percentage).toBeInTheDocument();
    expect(amount).toBeInTheDocument();
  });
});