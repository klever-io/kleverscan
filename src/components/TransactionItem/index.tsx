import { getStatusIcon } from '@/assets/status';
import { getContractType } from '@/utils';
import { formatDate, toLocaleFixed } from '@/utils/formatFunctions';
import { parseAddress } from '@/utils/parseValues';
import {
  TransactionAmount,
  TransactionData,
  TransactionRow,
  TransactionStatus,
  TransactionTimer,
} from '@/views/home';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { ITransaction } from '../../types';
import Skeleton from '../Skeleton';

export interface IContract {
  type: number;
  typeString: string;
  parameter: {
    amount: number;
    assetId: string;
    toAddress: string;
  };
  precision?: number;
}

const TransactionItem: React.FC<ITransaction> = ({
  hash,
  timestamp,
  contract,
  sender,
  status,
}) => {
  let contractFilter = {} as IContract;
  const [amount, setAmount] = useState('');

  const StatusIcon = getStatusIcon(status);
  const { t } = useTranslation('transactions');
  const contractPosition = 0;
  contractFilter = contract[contractPosition] as IContract;
  let assetId = contractFilter?.parameter?.assetId;

  const contractType = contract[0].typeString;
  const checkContract = getContractType(contractType);

  if (checkContract && !assetId) {
    assetId = 'KLV';
  }
  const precision = contractFilter?.precision ?? 0;

  useEffect(() => {
    const getParams = async () => {
      if (contract) {
        if (contractFilter?.parameter?.amount) {
          setAmount(
            toLocaleFixed(
              contractFilter?.parameter?.amount / 10 ** precision,
              precision,
            ),
          );
        }
      }
    };
    assetId && getParams();
  }, [contractFilter]);

  const shouldRenderAssetId = () => {
    if (contract.length > 1) {
      return <p>Multi Contract</p>;
    }
    if (contract.length === 1 && checkContract) {
      return (
        <Link href={`/asset/${assetId || 'KLV'}`}>
          <a className="clean-style">
            <span>
              {amount && `${amount} ${assetId || 'KLV'}`}
              {!amount && <Skeleton />}
            </span>
          </a>
        </Link>
      );
    }
    return <p>{contractType}</p>;
  };

  return (
    <TransactionRow isLoading={!!amount}>
      <TransactionData>
        <StatusIcon />
        <TransactionStatus isSuccess={status === 'success'}>
          {status === 'success' ? 'Success' : 'Fail'}
        </TransactionStatus>
      </TransactionData>
      <TransactionTimer>
        <span>{formatDate(timestamp)}</span>
      </TransactionTimer>
      <TransactionData>
        <a href={`/transaction/${hash}`}>{`${hash.slice(0, 15)}...`}</a>
      </TransactionData>
      <TransactionAmount>
        <span>{shouldRenderAssetId()}</span>
      </TransactionAmount>
      <TransactionData>
        <p>
          <span>{t('From')}: </span>
          <Link href={`/account/${sender}`}>
            <a className="clean-style">{parseAddress(sender, 12)}</a>
          </Link>
        </p>
      </TransactionData>
      <TransactionData>
        <div>
          <span>{t('To')}: </span>
          <Link href={`/account/${contractFilter?.parameter?.toAddress}`}>
            <a className="clean-style">
              {contractFilter?.parameter?.toAddress
                ? parseAddress(contractFilter?.parameter?.toAddress, 12)
                : '--'}
            </a>
          </Link>
        </div>
      </TransactionData>
    </TransactionRow>
  );
};

export const TransactionItemLoading: React.FC = () => {
  return (
    <TransactionRow>
      <TransactionData loading>
        <a href="#">
          <Skeleton width={200} />
        </a>
      </TransactionData>
      <TransactionData loading>
        <p>
          <strong>
            <Skeleton width={200} />
          </strong>
        </p>
      </TransactionData>
      <TransactionAmount>
        <span>
          <Skeleton width={200} />
        </span>
      </TransactionAmount>
    </TransactionRow>
  );
};

export default TransactionItem;
