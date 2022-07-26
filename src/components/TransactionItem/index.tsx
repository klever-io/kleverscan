import React from 'react';

import Link from 'next/link';

import { format, fromUnixTime } from 'date-fns';

import {
  TransactionRow,
  TransactionData,
  TransactionAmount,
} from '@/views/home';
import { getStatusIcon } from '@/assets/status';

import { parseAddress, toLocaleFixed } from '../../utils';

import { ITransaction, ITransferContract } from '../../types';

const TransactionItem: React.FC<ITransaction> = ({
  hash,
  timestamp,
  contract,
  precision,
  sender,
  status
}) => {
  let parameter: ITransferContract = {} as ITransferContract;
  let amount = 0;
  const StatusIcon = getStatusIcon(status);
  if (contract) {
    const contractPosition = 0;
    parameter = contract[contractPosition].parameter as ITransferContract;

    if (parameter?.amount) {
      amount = parameter.amount;
    }
  }

  const shouldRenderAssetId = (
    amount: number,
    assetId: string | undefined,
  ): string | null => {
    if (assetId) {
      return assetId;
    }
    if (amount) {
      return 'KLV';
    }
    return null;
  };

  return (
    <TransactionRow>
      <TransactionData>
        <a href={`/transaction/${hash}`}>
          {`${hash.slice(0, 15)}...`}
          <span>
            <StatusIcon />
          </span>
        </a>
        <span>
          {format(fromUnixTime(timestamp / 1000), 'MM/dd/yyyy HH:mm')}
        </span>
      </TransactionData>
      <TransactionData>
        <p>
          <strong>From: </strong>
          <Link href={`/account/${sender}`}>
            <a className="clean-style">{parseAddress(sender, 12)}</a>
          </Link>
        </p>
        <p>
          <strong>To: </strong>
          <Link href={`/account/${parameter?.toAddress}`}>
            <a className="clean-style">
              {parameter?.toAddress
                ? parseAddress(parameter?.toAddress, 12)
                : '--'}
            </a>
          </Link>
        </p>
      </TransactionData>
      <TransactionAmount>
        <span>
          {toLocaleFixed(amount / 10 ** precision, precision)}
          <Link href={`/asset/KLV`}>
            <a className="clean-style">
              {' '}
              {shouldRenderAssetId(parameter?.amount, parameter?.assetId)}
            </a>
          </Link>
        </span>
      </TransactionAmount>
    </TransactionRow>
  );
};

export default TransactionItem;
