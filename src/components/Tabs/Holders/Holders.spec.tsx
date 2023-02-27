import { formatAmount } from '@/utils/formatFunctions';
import { parseAddress } from '@/utils/parseValues';
import { screen } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { klvAsset as KLVMock, mockedHolders } from '../../../test/mocks';
import { mockedHoldersResponse } from '../../../test/mocks/tabs/holders';
import { renderWithTheme } from '../../../test/utils';
import Holders from './';

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
    };
  },
}));

const klvAsset = KLVMock;

klvAsset.circulatingSupply = 1000000000 * 10 ** klvAsset.precision;

const holdersTableProps = {
  scrollUp: false,
  totalPages: 10,
  dataName: 'accounts',
  request: jest.fn((page: number, limit: number) => {
    return Promise.resolve(mockedHoldersResponse);
  }),
  page: 1,
};

describe('Component: Tabs/Holders', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should render the the Table, it's Body and header correctly", async () => {
    await act(async () => {
      renderWithTheme(
        <Holders
          holders={mockedHolders}
          asset={klvAsset}
          holdersTableProps={holdersTableProps}
        />,
      );
    });
    const headers = ['Rank', 'Address', 'Percentage', 'Frozen Amount'];
    const rank = screen.getByText('1');
    const tableBody = screen.getByTestId('table-body');

    headers.forEach(name => {
      const header = screen.getAllByText(name)[0];
      expect(header).toBeInTheDocument();
    });

    expect(rank).toBeInTheDocument();
  });

  it('Should render the correct values for "Rank", "Address", "Percentage" and " Frozen Amount"', async () => {
    await act(async () => {
      renderWithTheme(
        <Holders
          holders={mockedHolders}
          asset={klvAsset}
          holdersTableProps={holdersTableProps}
        />,
      );
    });
    const link = screen.getByRole('link', {
      name: parseAddress(mockedHoldersResponse.data.accounts[0].address, 40),
    });
    const balance = mockedHoldersResponse.data.accounts[0].frozenBalance;

    const calcPercentage = (
      (balance / klvAsset.circulatingSupply) *
      100
    ).toFixed(2);
    const percentage = screen.getAllByText(`${calcPercentage}%`)[0];

    const calcAmount = formatAmount(balance / 10 ** klvAsset.precision);
    const amount = screen.getAllByText(calcAmount)[0];

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      'href',
      `/account/${mockedHoldersResponse.data.accounts[0].address}`,
    );
    expect(percentage).toBeInTheDocument();
    expect(amount).toBeInTheDocument();
  });
});
