import { getStatusIcon } from '@/assets/status';
import { useMobile } from '@/contexts/mobile';
import { ContractsName } from '@/types/contracts';
import { getContractType } from '@/utils';
import { formatDate, toLocaleFixed } from '@/utils/formatFunctions';
import { parseAddress } from '@/utils/parseValues';
import {
  SpanWithLimit,
  TransactionAmount,
  TransactionContainerContent,
  TransactionData,
  TransactionRow,
  TransactionStatus,
  TransactionTimer,
} from '@/views/home';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { ITransaction } from '../../types';
import {
  NextImageCardWrapper,
  StackedImageWrapper,
} from '../Home/NewCards/style';
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
  const { isMobile } = useMobile();

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
            <SpanWithLimit>
              {amount && `${amount} ${assetId || 'KLV'}`}
              {!amount && <Skeleton />}
            </SpanWithLimit>
          </a>
        </Link>
      );
    }
    return <p>{ContractsName[contractType]}</p>;
  };
  return (
    <TransactionRow isLoading={!!amount}>
      {!isMobile && (
        <StackedImageWrapper>
          <NextImageCardWrapper>
            <Image
              src="/homeCards/transactionsBackground.svg"
              alt="transaction icon background"
              width={44}
              height={44}
              loader={({ src, width }) => `${src}?w=${width}`}
            />
          </NextImageCardWrapper>
          <NextImageCardWrapper>
            <Image
              src="/homeCards/transaction.svg"
              alt="transaction icon"
              width={18}
              height={18}
              loader={({ src, width }) => `${src}?w=${width}`}
            />
          </NextImageCardWrapper>
        </StackedImageWrapper>
      )}
      <TransactionContainerContent>
        <TransactionData>
          <div className="status-icon">
            <StatusIcon />
            <TransactionStatus isSuccess={status === 'success'}>
              {status === 'success' ? 'Success' : 'Fail'}
            </TransactionStatus>
          </div>
          <TransactionTimer>
            <span>{formatDate(timestamp)}</span>
          </TransactionTimer>
        </TransactionData>
        <TransactionData>
          <p>
            <Link href={`/transaction/${hash}`}>
              <a>
                {isMobile
                  ? `${hash.slice(0, 15)}...`
                  : `${hash.slice(0, 30)}...`}
              </a>
            </Link>
          </p>
          <TransactionAmount>
            <span>{shouldRenderAssetId()}</span>
          </TransactionAmount>
        </TransactionData>
        <TransactionData>
          <p>
            <span>
              <Link href={`/account/${sender}`}>
                <a className="clean-style">
                  {t('From')}:{' '}
                  {isMobile
                    ? parseAddress(sender, 12)
                    : parseAddress(sender, 26)}
                </a>
              </Link>
            </span>
          </p>

          <Link href={`/account/${contractFilter?.parameter?.toAddress}`}>
            <a className="clean-style">
              {t('To')}:{' '}
              {contractFilter?.parameter?.toAddress
                ? isMobile
                  ? parseAddress(contractFilter?.parameter?.toAddress, 12)
                  : parseAddress(contractFilter?.parameter?.toAddress, 15)
                : '--'}
            </a>
          </Link>
        </TransactionData>
      </TransactionContainerContent>
    </TransactionRow>
  );
};

export const TransactionItemLoading: React.FC = () => {
  return (
    <TransactionRow>
      <TransactionData $loading>
        <a href="#">
          <Skeleton width={50} />
        </a>
      </TransactionData>
      <TransactionData $loading>
        <p>
          <strong>
            <Skeleton width={50} />
          </strong>
        </p>
      </TransactionData>
      <TransactionAmount>
        <span>
          <Skeleton width={50} />
        </span>
      </TransactionAmount>
    </TransactionRow>
  );
};

export default TransactionItem;
