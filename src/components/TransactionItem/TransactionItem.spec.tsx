import React from 'react';
import { screen } from '@testing-library/react';
import { format, fromUnixTime } from 'date-fns';

import theme from '../../styles/theme';
import { ITransaction, Contract, ITransferContract } from '../../types'

import TransactionItem from './';
import { renderWithTheme } from '../../test/utils';
import { parseAddress } from '../../utils'

const mockTxItem: ITransaction = {
  chainID: '10020',
  blockNum: 123,
  nonce: 123123,
  signature: 'b66845fe95baef343b35393eb861f8bee4c41b06c8efab47aa243fe3560ff4e45518bfc7d89010dadaea37d2d0bf5be7d35c13b38b2f65d6baa9baa65s8d452w',
  searchOrder: 35,
  kAppFee: 0,
  bandwidthFee: 150000,
  status: 'success',
  resultCode: 'Ok',
  precision: 6,
  receipts: [{
    assetId: 'KLV',
  }],
  hash: 'a632bece34e0716fc465113e418f31911425783ea70624cb1555506225beeb4b',
  sender: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jquca668',
  timestamp: 1653331031000,
  contract: [
    {
      sender: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jquca668',
      type: Contract.Transfer,
      parameter: {
          amount: 3000000,
          assetId: 'KLV',
          toAddress: 'klv1t4cykcfs6k9kglwrcg95d5sas68d7w4a2rkv7v5qqqyj0gw4hd3s4uas4w'
      }
    }
  ],
};

describe('Component: TransactionItem', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = renderWithTheme(<TransactionItem {...mockTxItem} precision={6}/>).container;
  });

  it('Should render hash, timestamp ( formated ), sender, toAddress and amount', () => {

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
    const parameter = mockTxItem.contract[0].parameter as ITransferContract;

    const hash = screen.getByRole('link', {name: mockTxItem.hash } );
    const sender = screen.getByRole('link', { name: parseAddress(mockTxItem.sender, 12)});
    const toAddressTx = screen.getByRole('link', { name: parseAddress(parameter.toAddress, 12)});

    expect(hash).toHaveAttribute('href', `/transaction/${mockTxItem.hash}`);
    expect(sender).toHaveAttribute('href', `/account/${mockTxItem.sender}`);
    expect(toAddressTx).toHaveAttribute('href', `/account/${parameter.toAddress}`);
  });

  it('Should match the style for the Transaction Data', () => {
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
}); 