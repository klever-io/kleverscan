import { screen } from '@testing-library/react';
import { format, fromUnixTime } from 'date-fns';
import React from 'react';
import { mockedTransactions } from '../../../test/mocks';
import { renderWithTheme } from '../../../test/utils';
import { capitalizeString, formatAmount } from '../../../utils/index';
import Transaction from './';

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
    };
  },
}));

describe('Component: Tabs/Transactions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should render the the Table, it's Body and header correctly", () => {
    renderWithTheme(
      <Transaction transactions={mockedTransactions} loading={false} />,
    );

    const headers = [
      'Hash',
      'Block',
      'Created',
      'From',
      '',
      'To',
      'Status',
      'Contract',
      'Amount',
    ];
    const hash = screen.getByRole('link', { name: mockedTransactions[0].hash });
    const tableBody = hash.parentNode?.parentNode?.parentNode;
    const tableBodyStyle = {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
    };

    headers.forEach(name => {
      if (!name) return;
      const header = screen.getByText(name);
      expect(header).toBeInTheDocument();
    });

    expect(hash).toBeInTheDocument();
    expect(tableBody).toHaveStyle(tableBodyStyle);
  });

  it('Should render the correct values for "Hash", "Block", "Created", "From", "To", "Status", "Contract and "Amount"', () => {
    renderWithTheme(
      <Transaction transactions={mockedTransactions} loading={false} />,
    );

    const { hash, blockNum, timestamp, sender, status, contract } =
      mockedTransactions[0];

    const linkHash = screen.getByRole('link', { name: hash });
    const componentBlockNum = screen.getByText(blockNum);
    const formatedTimestamp = format(
      fromUnixTime(timestamp / 1000),
      'MM/dd/yyyy HH:mm',
    );
    const timeStamp = screen.getAllByText(formatedTimestamp)[0];

    const parsedAddress = /klv1hun5...jsdfr741/i;
    const componenetSender = screen.getAllByRole('link', {
      name: parsedAddress,
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

  it('Should be "Mult Contract" when has more than one contract on transaction and show the "toAdress" and "Amount" when the contract is "Transfer" and "BlockNum" must be 0 as fallback', () => {
    renderWithTheme(
      <Transaction transactions={mockedTransactions} loading={false} />,
    );

    const { parameter } = mockedTransactions[2].contract[0] as any;
    const multContract = screen.getByText(/Multi Contract/i);
    const blockNum = screen.getByRole('link', {
      name: mockedTransactions[2].hash,
    }).parentNode?.nextSibling;
    const formatedAmount = formatAmount(parameter?.amount / 10 ** 6);
    const amount = screen.getByText(formatedAmount);

    expect(multContract).toBeInTheDocument();
    expect(amount).toBeInTheDocument();
    expect(blockNum).toBeInTheDocument();
    expect(blockNum).toHaveTextContent('0');
  });
});
