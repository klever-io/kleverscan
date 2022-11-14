import { getStatusIcon } from '@/assets/status';
import {
  TransactionAmount,
  TransactionData,
  TransactionRow,
} from '@/views/home';
import { format, fromUnixTime } from 'date-fns';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { ITransaction } from '../../types';
import { getContractType, parseAddress, toLocaleFixed } from '../../utils';

export interface IContract {
  type: number;
  typeString: string;
  parameter: {
    amount: number;
    assetId: string;
    toAddress: string;
  };
  precision: number;
}
const TransactionItem: React.FC<ITransaction> = ({
  hash,
  timestamp,
  contract,
  sender,
  status,
}) => {
  let contractFilter: IContract = {} as IContract;
  const [amount, setAmount] = useState('');
  const [assetId, setAssetId] = useState('');

  const StatusIcon = getStatusIcon(status);

  const { t } = useTranslation('transactions');
  const contractPosition = 0;
  contractFilter = contract[contractPosition] as IContract;

  useEffect(() => {
    const getParams = async () => {
      const precision = contractFilter?.precision ?? 6;
      if (contract) {
        if (
          contractFilter?.parameter.amount &&
          contractFilter?.parameter.assetId
        ) {
          setAmount(
            toLocaleFixed(
              contractFilter?.parameter?.amount / 10 ** precision,
              precision,
            ),
          );
        }
      }
    };
    getParams();
  }, [contractFilter]);
  const shouldRenderAssetId = () => {
    const contractType = contract[0].typeString;
    const checkContract = getContractType(contractType);

    if (contract.length > 1) {
      return <p>Multi Contract</p>;
    }
    if (contract.length === 1 && checkContract) {
      return (
        <Link href={`/asset/${assetId || 'KLV'}`}>
          <a className="clean-style">
            {amount} {assetId || 'KLV'}
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
          <Link href={`/account/${contractFilter?.parameter?.toAddress}`}>
            <a className="clean-style">
              {contractFilter?.parameter?.toAddress
                ? parseAddress(contractFilter?.parameter?.toAddress, 12)
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
