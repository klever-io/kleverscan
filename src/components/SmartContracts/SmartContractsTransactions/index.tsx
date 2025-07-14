import React from 'react';
import { useRouter } from 'next/router';
import { IRowSection } from '@/types';
import {
  CenteredRow,
  DoubleRow,
  InvokeMethodBagde,
  Mono,
} from '@/styles/common';
import { Status } from '@/components/Table/styles';
import { parseAddress } from '@/utils/parseValues';
import { getAge } from '@/utils/timeFunctions';
import { fromUnixTime } from 'date-fns';
import api from '@/services/api';
import Table, { ITable } from '@/components/Table';
import { smartContractInvokesTransactionsTableHeaders } from '@/utils/contracts';
import { useTranslation } from 'next-i18next';
import { InvokesList } from '@/types/smart-contract';
import Link from 'next/link';
import Copy from '@/components/Copy';
import { capitalizeString } from '@/utils/convertString';
import { formatAmount } from '@/utils/formatFunctions';
import { KLV_PRECISION } from '@/utils/globalVariables';

const invokesListRowSections = (invokes: InvokesList): IRowSection[] => {
  const { t: commonT } = useTranslation('common');
  const {
    hash,
    blockNumber,
    sender,
    nonce,
    timestamp,
    kAppFee,
    bandwidthFee,
    status,
    resultCode,
    version,
    chainID,
    signature,
    method,
    contract,
  } = invokes;

  return [
    {
      // tx hash
      element: props => (
        <DoubleRow>
          <CenteredRow>
            <Link href={``} key={hash}>
              <Mono>{parseAddress(hash, 30)}</Mono>
            </Link>
            <Copy data={hash} info="txHash" />
          </CenteredRow>
        </DoubleRow>
      ),
      span: 1,
    },
    {
      // age
      element: props => (
        <DoubleRow>
          <span>{getAge(fromUnixTime(timestamp), undefined)}</span>
        </DoubleRow>
      ),
      span: 1,
    },
    {
      // Status
      element: props => (
        <DoubleRow>
          <Status status={status}>
            <span>{capitalizeString(status)}</span>
          </Status>
        </DoubleRow>
      ),
      span: 1,
    },
    {
      // Fee
      element: props => (
        <DoubleRow>
          <span>{formatAmount(kAppFee / 10 ** KLV_PRECISION)} KLV</span>
        </DoubleRow>
      ),
      span: 1,
    },
    {
      // Bandwidth Fee
      element: props => (
        <DoubleRow>
          <span>{formatAmount(bandwidthFee / 10 ** KLV_PRECISION)} KLV</span>
        </DoubleRow>
      ),
      span: 1,
    },
    {
      // Method
      element: props => (
        <DoubleRow>
          <InvokeMethodBagde>{method}</InvokeMethodBagde>
        </DoubleRow>
      ),
      span: 1,
    },
    {
      // Type
      element: props => (
        <DoubleRow>
          {contract?.map(item => (
            <InvokeMethodBagde>
              {(item?.parameter?.type).slice(2)}
            </InvokeMethodBagde>
          ))}
        </DoubleRow>
      ),
      span: 1,
    },
  ];
};

interface SmartContractsTransactionsProps {
  contractAddress: string;
}

const SmartContractsTransactions: React.FC<SmartContractsTransactionsProps> = ({
  contractAddress,
}) => {
  const router = useRouter();

  const requestInvokesList = async (page: number, limit: number) => {
    try {
      const localQuery = { ...router.query, page, limit };
      const res = await api.get({
        route: `sc/invokes/${contractAddress}`,
        query: localQuery,
      });

      if (!res.error || res.error === '') {
        const data = {
          ...res,
          data: { invokes: res.data.invokes },
        };
        return data;
      }
    } catch (error) {
      console.error('Error fetching invokes list:', error);
      return [];
    }
  };

  const tableProps: ITable = {
    type: 'smartContractsInvokes',
    header: smartContractInvokesTransactionsTableHeaders,
    rowSections: invokesListRowSections,
    request: (page, limit) => requestInvokesList(page, limit),
    dataName: 'invokes',
    showLimit: false,
  };

  return <Table {...tableProps} />;
};

export default SmartContractsTransactions;
