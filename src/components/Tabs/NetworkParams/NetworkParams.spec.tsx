import api from '@/services/api';
import { screen } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { renderWithTheme } from '../../../test/utils';
import NetworkParams from './';
import { mockedNetworkRequestResponse } from './mock';

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      push: jest.fn(),
    };
  },
}));

jest.mock('@/services/api', () => {
  return {
    get: jest.fn(),
  };
});

describe('Component: Tabs/NetworkParams', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (api.get as jest.Mock).mockImplementation(
      () => mockedNetworkRequestResponse,
    );
  });

  it("Should render the the Table and it's Body and header correctly", async () => {
    await act(async () => {
      renderWithTheme(<NetworkParams />);
    });

    const headers = ['Number', 'Parameter', 'Current Value'];
    const tableBody = screen.getByTestId('table-body');

    const tableBodyStyle = {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
    };

    expect(tableBody).toHaveStyle(tableBodyStyle);
    headers.forEach(name => {
      const header = screen.getAllByText(name)[0];
      expect(header).toBeInTheDocument();
    });
  });

  it('Should render the "Number", "Parameter" and "Current Value" with the correct values', async () => {
    await act(async () => {
      renderWithTheme(<NetworkParams />);
    });

    const number = screen.getByText('#0');
    const parameter = screen.getByText('Fee Per Data Byte');
    const fee = screen.getByText('4000');
    const number2 = screen.getByText('#1');
    const parameter2 = screen.getByText('KApp Fee for Validator Creation');
    const fee2 = screen.getAllByText('50000000000')[0];

    expect(number).toBeInTheDocument();
    expect(parameter).toBeInTheDocument();
    expect(fee).toBeInTheDocument();
    expect(number2).toBeInTheDocument();
    expect(parameter2).toBeInTheDocument();
    expect(fee2).toBeInTheDocument();
  });
});
