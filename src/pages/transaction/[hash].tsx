import { getStatusIcon } from '@/assets/status';
import { TransactionDetails as Icon } from '@/assets/title-icons';
import Title from '@/components/Layout/Title';
import { useTheme } from '@/contexts/theme/index';
import api from '@/services/api';
import {
  CardContent,
  CardHeader,
  CardHeaderItem,
  Container,
  Header,
} from '@/styles/common';
import {
  IKdaFee,
  ITransactionPage,
  ITransactionResponse,
  NotFound,
  Service,
} from '@/types';
import { IBlock, IBlockResponse } from '@/types/blocks';
import { getPrecision } from '@/utils/precisionFunctions';
import { CardContainer, CardRaw } from '@/views/transactions/detail';
import KappFee from '@/components/TransactionDetails/KappFee';
import ContractsList from '@/components/TransactionDetails/ContractsList';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import nextI18nextConfig from '../../../next-i18next.config';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import OverviewDetails from '@/components/TransactionDetails/OverviewDetails';
export { OverviewDetails };

interface IRawTxTheme {
  base00: string;
  base01: string;
  base02: string;
  base03: string;
  base04: string;
  base05: string;
  base06: string;
  base07: string;
  base08: string;
  base09: string;
  base0A: string;
  base0B: string;
  base0C: string;
  base0D: string;
  base0E: string;
  base0F: string;
}

export interface IOverviewDetails {
  hash: string | undefined;
  StatusIcon?: any;
  status?: string;
  resultCode?: string;
  block?: IBlock;
  blockNum?: number;
  nonce: number | undefined;
  sender: string | undefined;
  KappFeeRow?: React.FC<PropsWithChildren>;
  bandwidthFee: number | undefined;
  kdaFee?: IKdaFee | undefined;
  precisionTransaction?: number | undefined;
  timestamp?: number;
  signature: string | string[] | undefined;
  ThresholdComponent?: React.FC<PropsWithChildren>;
  loading?: boolean;
  MultiSignList?: React.FC<PropsWithChildren>;
}

export const getRawTxTheme = (isDarkTheme = false): IRawTxTheme => {
  return {
    base00: '',
    base01: '#ddd',
    base02: '#ddd',
    base03: '',
    base04: '',
    base05: isDarkTheme ? 'white' : 'black',
    base06: isDarkTheme ? 'white' : 'black',
    base07: isDarkTheme ? 'white' : 'black',
    base08: isDarkTheme ? 'white' : 'black',
    base09: '',
    base0A: '',
    base0B: '',
    base0C: '',
    base0D: '',
    base0E: '',
    base0F: '',
  };
};

const Transaction: React.FC<PropsWithChildren<ITransactionPage>> = props => {
  const { transaction, block } = props;
  const {
    hash,
    status,
    resultCode,
    sender,
    data,
    kAppFee,
    bandwidthFee,
    timestamp,
    signature,
    contract,
    receipts,
    blockNum,
    nonce,
    kdaFee,
  } = transaction;
  const [precisionTransaction, setPrecisionTransaction] = useState<number>(0);

  const { isDarkTheme } = useTheme();
  const ReactJson = dynamic(
    () => import('@microlink/react-json-view').then(mod => mod.default),
    { ssr: false },
  );
  const StatusIcon = getStatusIcon(status);

  const getPrecisionTransaction = async () => {
    if (kdaFee) {
      const precision = await getPrecision(kdaFee.kda);
      setPrecisionTransaction(precision);
    }
  };

  useEffect(() => {
    getPrecisionTransaction();
  }, []);

  const overviewProps = {
    hash,
    StatusIcon,
    status,
    resultCode,
    block,
    blockNum,
    nonce,
    sender,
    kAppFee,
    bandwidthFee,
    kdaFee,
    precisionTransaction,
    timestamp,
    signature,
    receipts,
  };

  return (
    <Container>
      <Header>
        <Title
          title="Transaction Details"
          Icon={Icon}
          route={'/transactions'}
        />
      </Header>
      <CardContainer>
        <CardHeader>
          <CardHeaderItem selected={true}>
            <span>Overview</span>
          </CardHeaderItem>
        </CardHeader>
        <OverviewDetails {...overviewProps} />
      </CardContainer>
      <CardContainer>
        <CardHeader>
          <CardHeaderItem selected={true}>
            <span>Contracts</span>
          </CardHeaderItem>
        </CardHeader>
        <CardContent>
          <ContractsList
            contracts={contract}
            receipts={receipts}
            sender={sender}
            data={data}
            logs={transaction?.logs}
          />
        </CardContent>
      </CardContainer>
      <CardContainer>
        <CardHeader>
          <CardHeaderItem selected={true}>
            <span>Raw Tx</span>
          </CardHeaderItem>
        </CardHeader>
        <CardContent>
          <CardRaw>
            <ReactJson
              src={transaction}
              name={false}
              displayObjectSize={false}
              enableClipboard={true}
              displayDataTypes={false}
              theme={getRawTxTheme(isDarkTheme)}
            />
          </CardRaw>
        </CardContent>
      </CardContainer>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps<ITransactionPage> = async ({
  params,
  locale = 'en',
}) => {
  const serverSideTranslationsProps = await serverSideTranslations(
    locale,
    ['common'],
    nextI18nextConfig,
    ['en'],
  );

  const redirectProps: NotFound = {
    notFound: true,
  };

  const hash = params?.hash;
  if (!hash) {
    return redirectProps;
  }

  const transaction: ITransactionResponse = await api.get({
    route: `transaction/${hash}`,
  });

  const tx = transaction?.data?.transaction;
  if (transaction.error || (!tx?.blockNum && !tx?.nonce && !tx?.sender)) {
    return redirectProps;
  }

  if (tx?.contract.some(contract => contract.type == 63)) {
    const nodeTransaction: any = await api.get({
      service: Service.NODE,
      route: `transaction/${hash}?withResults=true`,
    });

    const logs = nodeTransaction?.data?.transaction?.logs;

    tx['logs'] = logs;
  }
  const block: IBlockResponse = await api.get({
    route: `block/by-nonce/${transaction?.data?.transaction?.blockNum}`,
  });

  const props: ITransactionPage = {
    ...serverSideTranslationsProps,
    transaction: tx,
    block: block?.data?.block || {},
  };

  return {
    props,
  };
};
export default Transaction;
