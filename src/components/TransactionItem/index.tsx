import { getStatusIcon } from '@/assets/status';
import {
  TransactionAmount,
  TransactionData,
  TransactionRow,
} from '@/views/home';
import { format, fromUnixTime } from 'date-fns';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import React from 'react';
import { Contract, ITransaction, ITransferContract } from '../../types';
import { getContractType, parseAddress, toLocaleFixed } from '../../utils';

const TransactionItem: React.FC<ITransaction> = ({
  hash,
  timestamp,
  contract,
  sender,
  status,
}) => {
  let parameter: ITransferContract = {} as ITransferContract;
  let amount = 0;
  let precision = 6;
  const StatusIcon = getStatusIcon(status);

  const { t } = useTranslation('transactions');

  if (contract) {
    const contractPosition = 0;
    parameter = contract[contractPosition].parameter as ITransferContract;

    if (parameter?.amount) {
      amount = parameter.amount;
    }
    if (parameter && parameter?.precision) {
      precision = parameter.precision;
    }
  }

  const shouldRenderAssetId = () => {
    const contractType = Object.values(Contract)[contract[0].type];
    const checkContract = getContractType(contractType);

    if (contract.length > 1) {
      return <p>Multi Contract</p>;
    }
    if (contract.length === 1 && checkContract) {
      return (
        <Link href={`/asset/${parameter.assetId || 'KLV'}`}>
          <a className="clean-style">
            {toLocaleFixed(amount / 10 ** precision, precision)}{' '}
            {parameter?.assetId || 'KLV'}
          </a>
        </Link>
      );
    }
    return <p>{contractType}</p>;
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
          <strong>{t('From')}: </strong>
          <Link href={`/account/${sender}`}>
            <a className="clean-style">{parseAddress(sender, 12)}</a>
          </Link>
        </p>
        <p>
          <strong>{t('To')}: </strong>
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
        <span>{shouldRenderAssetId()}</span>
      </TransactionAmount>
    </TransactionRow>
  );
};

export default TransactionItem;
