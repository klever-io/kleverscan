import React from 'react';
import { screen } from '@testing-library/react';
import { format, fromUnixTime } from 'date-fns';

import theme from '../../styles/theme';
import { ITransferContract } from '../../types';
import { mockTxItem } from '../../test/mocks';

import TransactionItem from './';
import { renderWithTheme } from '../../test/utils';
import { parseAddress } from '../../utils'



describe('Component: TransactionItem', () => {

  it('Should render hash, timestamp ( formated ), sender, toAddress and amount', () => {
    renderWithTheme(<TransactionItem {...mockTxItem} precision={6}/>);

    const parameter = mockTxItem.contract[0].parameter as ITransferContract;

    const hash = screen.getByRole('link', {name: mockTxItem.hash } );
    const timeStamp = screen.getByText(format(fromUnixTime(mockTxItem.timestamp / 1000), 'MM/dd/yyyy HH:mm'));
    const sender = screen.getByRole('link', { name: parseAddress(mockTxItem.sender, 12)});
    const toAddressTx = screen.getByRole('link', { name: parseAddress(parameter.toAddress, 12)})

    expect(hash).toBeInTheDocument();
    expect(timeStamp).toBeInTheDocument();
    expect(sender).toBeInTheDocument();
    expect(toAddressTx).toBeInTheDocument();
  });

  it('Should have the correct href for each link', () => {
    renderWithTheme(<TransactionItem {...mockTxItem} precision={6}/>);

    const parameter = mockTxItem.contract[0].parameter as ITransferContract;

    const hash = screen.getByRole('link', {name: mockTxItem.hash } );
    const sender = screen.getByRole('link', { name: parseAddress(mockTxItem.sender, 12)});
    const toAddressTx = screen.getByRole('link', { name: parseAddress(parameter.toAddress, 12)});

    expect(hash).toHaveAttribute('href', `/transaction/${mockTxItem.hash}`);
    expect(sender).toHaveAttribute('href', `/account/${mockTxItem.sender}`);
    expect(toAddressTx).toHaveAttribute('href', `/account/${parameter.toAddress}`);
  });

  it('Should match the style for the Transaction Data', () => {
  const { container } = renderWithTheme(<TransactionItem {...mockTxItem} precision={6}/>);

    const containerStyle = {
      marginRight: '2.5rem',
      gap: '0.25rem',
      flexDirection: 'column',
    };
    const linkStyle = {
      maxWidth: '10rem',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      fontWeight: '600',
      color: theme.black,
    };

    const transactionDataElement = container.firstChild?.firstChild;
    const linkElement = transactionDataElement?.firstChild;
    expect(transactionDataElement).toHaveStyle(containerStyle);
    expect(linkElement).toHaveStyle(linkStyle);
  });

  it('Should match the style for Transaction Amount', () => {
  const { container } = renderWithTheme(<TransactionItem {...mockTxItem} precision={6}/>);

    const style = {
      width: '12.5rem',
      textAlign: 'right',
    };
    const spanStyle = {
      maxWidth: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      color: theme.transactionCard.amount,
    }
    const transactionAmountElement = container.firstChild?.lastChild;
    expect(transactionAmountElement).toHaveStyle(style);
    expect(transactionAmountElement?.firstChild).toHaveStyle(spanStyle);
  });

  it('Should render "--" as fallback when don\'t has "toAddress"', () => {
    const txItem = { ...mockTxItem };
    // TODO - Make ts stop the error, should type correctly
    txItem.contract[0].parameter.toAddress = '';
    renderWithTheme(<TransactionItem {...txItem} precision={6}/>);

    const parameter = mockTxItem.contract[0].parameter as ITransferContract;
    const toAddress = screen.getByText(/To:/i).nextSibling?.firstChild;
    expect(toAddress).toHaveTextContent('--');
  });
}); 