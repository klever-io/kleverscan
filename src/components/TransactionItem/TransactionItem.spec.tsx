import { formatDate } from '@/utils/formatFunctions';
import { parseAddress } from '@/utils/parseValues';
import { screen } from '@testing-library/react';
import React from 'react';
import theme from '../../styles/theme';
import { mockTxItem } from '../../test/mocks';
import { renderWithTheme } from '../../test/utils';
import TransactionItem, { IContract } from './';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));
jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () =>
          new Promise(() => {
            'Transaction';
          }),
      },
    };
  },
}));

describe('Component: TransactionItem', () => {
  it('Should render hash, timestamp ( formatted ), sender, toAddress and amount', () => {
    renderWithTheme(<TransactionItem {...mockTxItem} precision={6} />);

    const contract = mockTxItem.contract[0] as IContract;

    const hash = screen.getByRole('link', { name: 'a632bece34e0716...' });
    const timeStamp = screen.getByText(formatDate(mockTxItem.timestamp));
    const sender = screen.getByRole('link', {
      name: parseAddress(mockTxItem.sender, 12),
    });
    const toAddressTx = screen.getByRole('link', {
      name: parseAddress(contract.parameter.toAddress, 12),
    });

    expect(hash).toBeInTheDocument();
    expect(timeStamp).toBeInTheDocument();
    expect(sender).toBeInTheDocument();
    expect(toAddressTx).toBeInTheDocument();
  });

  it('Should have the correct href for each link', () => {
    renderWithTheme(<TransactionItem {...mockTxItem} precision={6} />);

    const contract = mockTxItem.contract[0] as IContract;

    const hash = screen.getByRole('link', { name: 'a632bece34e0716...' });
    const sender = screen.getByRole('link', {
      name: parseAddress(mockTxItem.sender, 12),
    });

    const toAddressTx = screen.getByRole('link', {
      name: parseAddress(contract.parameter?.toAddress, 12),
    });

    expect(hash).toHaveAttribute('href', `/transaction/${mockTxItem.hash}`);
    expect(sender).toHaveAttribute('href', `/account/${mockTxItem.sender}`);
    expect(toAddressTx).toHaveAttribute(
      'href',
      `/account/${contract.parameter.toAddress}`,
    );
  });

  it('Should match the style for the Transaction Data', () => {
    const { container } = renderWithTheme(
      <TransactionItem {...mockTxItem} precision={6} />,
    );

    const containerStyle = {
      padding: '0.4rem 0 0.4rem 0',
      gap: '0.5rem',
      flexDirection: 'row',
    };
    const linkStyle = {
      // textOverflow: 'ellipsis',
      // fontWeight: '6000',
      color: `${theme.darkBlue}`,
    };

    const transactionDataElement = container.firstChild?.lastChild;
    const linkElement = transactionDataElement?.firstChild?.lastChild;
    expect(transactionDataElement).toHaveStyle(containerStyle);
    expect(linkElement).toHaveStyle(linkStyle);
  });

  it('Should match the style for Transaction Amount', () => {
    const { container } = renderWithTheme(
      <TransactionItem {...mockTxItem} precision={6} />,
    );

    const style = {
      width: '100%',
      padding: '0.4rem 0 0.4rem 0',
      color: theme.darkBlue,
    };
    const spanStyle = {
      fontWeight: 400,
      fontSize: '0.9rem',
    };
    const transactionAmountElement = container.firstChild?.lastChild;
    expect(transactionAmountElement).toHaveStyle(style);
    expect(transactionAmountElement?.firstChild?.firstChild).toHaveStyle(
      spanStyle,
    );
  });

  it('Should render "--" as fallback when don\'t has "toAddress"', () => {
    const txItem = { ...mockTxItem };
    txItem.contract[0].parameter = {
      amount: 3000000,
      assetId: 'KLV',
      toAddress: '',
    };
    renderWithTheme(<TransactionItem {...txItem} precision={6} />);

    const toAddress = screen.getByText(/To:/i).nextSibling?.firstChild;
    expect(toAddress).toHaveTextContent('--');
  });
});
