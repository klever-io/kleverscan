import { capitalizeString } from '@/utils/convertString';
import { parseAddress } from '@/utils/parseValues';
import { act, screen } from '@testing-library/react';
import { format, fromUnixTime } from 'date-fns';
import React from 'react';
import { mockedTransactions } from '../../../test/mocks';
import { renderWithTheme } from '../../../test/utils';
import { IInnerTableProps } from '../../../types';
import Transaction from './';

const precision = 6;

const mockedAPIResponse = {
  data: {
    transactions: mockedTransactions,
  },
  pagination: {
    self: 1,
    next: 2,
    previous: 1,
    perPage: 10,
    totalPages: 1000,
    totalRecords: 19348805,
  },
};

const request = jest.fn(async (page: number, limit: number) => {
  return Promise.resolve(mockedAPIResponse);
});

const transactionTableProps: IInnerTableProps = {
  scrollUp: false,
  dataName: 'transactions',
  request,
  query: {},
};

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
    };
  },
}));

export const mockedTransactionTab = (
  <Transaction transactionsTableProps={transactionTableProps} />
);

describe('Component: Tabs/Transactions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should render the the Table, it's Body and header correctly", async () => {
    await act(async () => {
      renderWithTheme(mockedTransactionTab);
    });

    const headers = [
      'Hash',
      'Block',
      'Created',
      'From',
      '',
      'To',
      'Status',
      'Contract',
      'kApp Fee',
      'Bandwidth Fee',
    ];
    const hash = screen.getByRole('link', {
      name: parseAddress(mockedTransactions[0].hash, 24),
    });
    const tableBody = screen.getByTestId('table-body');

    const tableBodyStyle = {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
    };

    headers.forEach(name => {
      if (!name) return;
      const header = screen.getAllByText(name)[0];
      expect(header).toBeInTheDocument();
    });

    expect(hash).toBeInTheDocument();
    expect(tableBody).toHaveStyle(tableBodyStyle);
  });

  it('Should render the correct values for "Hash", "Block", "Created", "From", "To", "Status", "Contract", "kApp Fee", "Bandwidth Fee"', async () => {
    await act(async () => {
      renderWithTheme(
        <Transaction transactionsTableProps={transactionTableProps} />,
      );
    });

    const { hash, blockNum, timestamp, sender, status, contract } =
      mockedTransactions[0];

    const linkHash = screen.getByRole('link', {
      name: parseAddress(hash, 24),
    });
    const componentBlockNum = screen.getByText(blockNum);
    const formatedTimestamp = format(
      fromUnixTime(timestamp / 1000),
      'MM/dd/yyyy HH:mm',
    );
    const timeStamp = screen.getAllByText(formatedTimestamp)[0];

    const componenetSender = screen.getAllByRole('link', {
      name: parseAddress(mockedTransactions[0].sender, 16),
    })[0];
    const toAddress = screen.getAllByRole('link', { name: '--' })[0];
    const componentStatus = screen.getAllByText(capitalizeString(status))[0];
    const contactType = screen.getByText('Delegate');
    const amount = screen.getAllByText('--');

    expect(linkHash).toBeInTheDocument();
    expect(componentBlockNum).toBeInTheDocument();
    expect(timeStamp).toBeInTheDocument();
    expect(componenetSender).toBeInTheDocument();
    expect(toAddress).toBeInTheDocument();
    expect(componentStatus).toBeInTheDocument();
    expect(contactType).toBeInTheDocument();
    expect(amount[amount.length - 1]).toBeInTheDocument();

    expect(linkHash).toHaveAttribute('href', `/transaction/${hash}`);
    expect(componenetSender).toHaveAttribute('href', `/account/${sender}`);
  });

  it('Should be "Multi Contract" when has more than one contract on transaction and show the "toAdress" and "Amount" when the contract is "Transfer" and "BlockNum" must be 0 as fallback', async () => {
    await act(async () => {
      renderWithTheme(
        <Transaction transactionsTableProps={transactionTableProps} />,
      );
    });

    const multiContract = screen.getByText(/Multi Contract/i);
    const blockNum = screen.getByRole('link', {
      name: parseAddress(mockedTransactions[2].hash, 24),
    }).parentNode?.parentNode?.nextSibling?.childNodes[1];

    expect(multiContract).toBeInTheDocument();
    expect(blockNum).toBeInTheDocument();
    expect(blockNum).toHaveTextContent('0');
  });
});
