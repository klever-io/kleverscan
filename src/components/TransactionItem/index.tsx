import React from 'react';

import Link from 'next/link';

import { format, fromUnixTime } from 'date-fns';

import {
  TransactionRow,
  TransactionData,
  TransactionAmount,
} from '@/views/home';

import { toLocaleFixed } from '../../utils';

import { ITransaction, ITransferContract } from '../../types';

const TransactionItem: React.FC<ITransaction> = ({
  hash,
  timestamp,
  contract,
  precision,
  sender,
}) => {
  const contractPosition = 0;
  const parameter = contract[contractPosition].parameter as ITransferContract;

  const amount = parameter.amount || 0;

  return (
    <TransactionRow>
      <TransactionData>
        <Link href={`/transaction/${hash}`}>{hash}</Link>
        <span>
          {format(fromUnixTime(timestamp / 1000), 'MM/dd/yyyy HH:mm')}
        </span>
      </TransactionData>
      <TransactionData>
        <p>
          <strong>From: </strong>
          {sender}
        </p>
        <p>
          <strong>To: </strong>
          {parameter.toAddress || '--'}
        </p>
      </TransactionData>
      <TransactionAmount>
        <span>{toLocaleFixed(amount / 10 ** precision, precision)} KLV</span>
      </TransactionAmount>
    </TransactionRow>
  );
};

export default TransactionItem;
