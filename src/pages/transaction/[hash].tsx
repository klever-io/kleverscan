import React from 'react';

import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { format, fromUnixTime } from 'date-fns';

import {
  CardContainer,
  CardContent,
  CenteredRow,
  Container,
  Header,
  Input,
  Row,
  Title,
} from '@/views/transactions/detail';

import { Status } from '@/components/Table/styles';

import api from '@/services/api';
import { toLocaleFixed, hexToString } from '@/utils/index';
import {
  IResponse,
  ITransaction,
  IAsset,
  Contract,
  ITransferContract,
  ICreateAssetContract,
  IContract,
} from '@/types/index';

import { ArrowLeft } from '@/assets/icons';
import { getStatusIcon } from '@/assets/status';

import {
  Transfer,
  CreateAsset,
  CreateValidator,
  Freeze,
  Unfreeze,
  Withdraw,
  Delegate,
} from '@/components/TransactionContractComponents';
import Copy from '@/components/Copy';

interface ITransactionResponse extends IResponse {
  data: {
    transaction: ITransaction;
  };
}

interface IAssetResponse extends IResponse {
  data: {
    asset: IAsset;
  };
}

interface ITransactionPage extends ITransaction {
  precision: number;
  asset: IAsset;
}
const klvAsset: IAsset = {
  assetType: '',
  assetId: '',
  name: 'Klever',
  ticker: 'KLV',
  ownerAddress: '',
  precision: 6,
  uris: null,
  initialSupply: 0,
  circulatingSupply: 0,
  maxSupply: 0,
  royalties: 0,
};

const Transaction: React.FC<ITransactionPage> = ({
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
  blockNum,
  nonce,
  asset,
}) => {
  const router = useRouter();
  const StatusIcon = getStatusIcon(status);
  const precision = 6; // default KLV precision

  const getContractType = (contracts: IContract[]) =>
    contracts.length > 1
      ? 'Multi contract'
      : Object.values(Contract)[contracts[0].type];

  const ContractComponent: React.FC = () => {
    const contractType = getContractType(contract);

    switch (contractType) {
      case Contract.Transfer:
        return (
          <Transfer {...contract[0]} precision={precision} asset={asset} />
        );
      case Contract.CreateAsset:
        return <CreateAsset {...contract[0]} />;
      case Contract.CreateValidator:
      case Contract.ValidatorConfig:
        return <CreateValidator {...contract[0]} precision={precision} />;
      case Contract.Freeze:
        return <Freeze {...contract[0]} />;
      case Contract.Unfreeze:
      case Contract.Delegate:
        return <Delegate {...contract[0]} />;
      case Contract.Undelegate:
        return <Unfreeze {...contract[0]} />;
      case Contract.Withdraw:
        return <Withdraw {...contract[0]} />;
      default:
        return <div />;
    }
  };

  return (
    <Container>
      <Header>
        <Title>
          <div onClick={router.back}>
            <ArrowLeft />
          </div>
          <h1>Transaction Detail</h1>
        </Title>

        <Input />
      </Header>

      <CardContainer>
        <h3>Overview</h3>

        <CardContent>
          <Row>
            <span>
              <strong>Hash</strong>
            </span>
            <CenteredRow>
              <span>{hash}</span>
              <Copy data={hash} info="Hash" />
            </CenteredRow>
          </Row>
          <Row>
            <span>
              <strong>Status</strong>
            </span>
            <Status status={status}>
              <StatusIcon />
              <span>{status}</span>
            </Status>
          </Row>
          <Row>
            <span>
              <strong>Result Code</strong>
            </span>
            <span>
              <p>{resultCode}</p>
            </span>
          </Row>
          <Row>
            <span>
              <strong>Block Number</strong>
            </span>
            <span>
              <p>{blockNum}</p>
            </span>
          </Row>
          <Row>
            <span>
              <strong>Nonce</strong>
            </span>
            <span>
              <p>{nonce}</p>
            </span>
          </Row>
          <Row>
            <span>
              <strong>From</strong>
            </span>
            <span>
              <Link href={`/account/${sender}`}>{sender}</Link>
            </span>
          </Row>
          <Row>
            <span>
              <strong>kApp Fee</strong>
            </span>
            <span>
              <p>{toLocaleFixed(kAppFee / 10 ** precision, precision)}</p>
            </span>
          </Row>
          <Row>
            <span>
              <strong>Bandwidth Fee</strong>
            </span>
            <span>
              <p>{toLocaleFixed(bandwidthFee / 10 ** precision, precision)}</p>
            </span>
          </Row>
          <Row>
            <span>
              <strong>Time</strong>
            </span>
            <span>
              <p>
                {format(fromUnixTime(timestamp / 1000), 'dd/MM/yyyy HH:mm')}
              </p>
            </span>
          </Row>
          <Row>
            <span>
              <strong>Signature</strong>
            </span>
            <CenteredRow>
              <span>{signature}</span>
              <Copy data={signature} info="Signature" />
            </CenteredRow>
          </Row>
          {data && (
            <Row>
              <span>
                <strong>Data</strong>
              </span>
              <CenteredRow>
                <span>{hexToString(data)}</span>
                <Copy data={hexToString(data)} info="Data" />
              </CenteredRow>
            </Row>
          )}
        </CardContent>
      </CardContainer>

      <CardContainer>
        <h3>Contract</h3>

        <CardContent>
          <Row>
            <span>
              <strong>Contract</strong>
            </span>
            <span>
              <p>{getContractType(contract)}</p>
            </span>
          </Row>

          <ContractComponent />
        </CardContent>
      </CardContainer>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps<ITransactionPage> = async ({
  params,
}) => {
  const redirectProps = { redirect: { destination: '/404', permanent: false } };

  const hash = params?.hash;
  if (!hash) {
    return redirectProps;
  }

  const transaction: ITransactionResponse = await api.get({
    route: `transaction/${hash}`,
  });
  if (transaction.error) {
    return redirectProps;
  }

  let precision = 6; // Default KLV precision
  let asset: IAsset = klvAsset;
  const contractType =
    Object.values(Contract)[transaction.data.transaction.contract[0].type];

  if (contractType === Contract.Transfer) {
    const contract = transaction.data.transaction.contract[0]
      .parameter as ITransferContract;

    if (contract.assetAddress) {
      const assetRes: IAssetResponse = await api.get({
        route: `assets/${contract.assetAddress}`,
      });
      if (!assetRes.error) {
        precision = assetRes.data.asset.precision;
        asset = assetRes.data.asset;
      }
    }
  } else if (contractType === Contract.CreateAsset) {
    const contract = transaction.data.transaction.contract[0]
      .parameter as ICreateAssetContract;

    precision = contract.precision;
  }

  const props: ITransactionPage = {
    ...transaction.data.transaction,
    precision,
    asset,
  };

  return { props };
};

export default Transaction;
