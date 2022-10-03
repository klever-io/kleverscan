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
import { Contract, ITransaction, ITransferContract } from '../../types';
import { getContractType, getPrecision, parseAddress } from '../../utils';

const TransactionItem: React.FC<ITransaction> = ({
  hash,
  timestamp,
  contract,
  sender,
  status,
}) => {
  let parameter: ITransferContract = {} as ITransferContract;
  const [amount, setAmount] = useState(0);
  const [assetId, setAssetId] = useState('');

  const StatusIcon = getStatusIcon(status);

  const { t } = useTranslation('transactions');

  useEffect(() => {
    const getParams = async () => {
      if (contract) {
        const contractPosition = 0;
        parameter = contract[contractPosition].parameter as ITransferContract;

        if (parameter?.amount && parameter?.assetId) {
          const precision = (await getPrecision(parameter.assetId)) ?? 6;
          setAmount(parameter.amount / 10 ** precision);
          setAssetId(parameter.assetId);
        }
      }
    };
    getParams();
  }, []);

  const shouldRenderAssetId = () => {
    const contractType = Object.values(Contract)[contract[0].type];
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
