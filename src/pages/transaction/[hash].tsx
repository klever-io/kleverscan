import React, { useEffect, useState } from 'react';

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
import { toLocaleFixed } from '@/utils/index';
import {
  IResponse,
  ITransaction,
  IAsset,
  Contract,
  ITransferContract,
  ICreateAssetContract,
  IContract,
  ICreateValidatorContract,
  IFreezeContract,
  IUnfreezeContract,
  IWithdrawContract,
} from '@/types/index';

import { ArrowLeft, Copy } from '@/assets/icons';
import { getStatusIcon } from '@/assets/status';
import { KLV } from '@/assets/coins';

import { Loader } from '@/components/Loader/styles';

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
}

const klvAsset: IAsset = {
  type: '',
  address: '',
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
  sender,
  kAppFee,
  bandwidthFee,
  timestamp,
  signature,
  contract,
}) => {
  const router = useRouter();
  const StatusIcon = getStatusIcon(status);
  const precision = 6; // default KLV precision

  const [coin, setCoin] = useState<IAsset>(klvAsset);
  const [loading, setLoading] = useState(true);

  const getContractType = (contracts: IContract[]) =>
    contracts.length > 1
      ? 'Multi contract'
      : Object.values(Contract)[contracts[0].type];

  useEffect(() => {
    const fetchCoin = async () => {
      if (getContractType(contract) === Contract.Transfer) {
        const parameter = contract[0].parameter as ITransferContract;

        if (parameter.assetAddress) {
          const response: IAssetResponse = await api.get({
            route: `assets/${parameter.assetAddress}`,
          });

          if (!response.error) {
            setCoin(response.data.asset);
          }
        }
      }

      setLoading(false);
    };

    fetchCoin();
  }, []);

  const handleCopyInfo = (data: string) => {
    navigator.clipboard.writeText(String(data));
  };

  const Transfer: React.FC<IContract> = ({ parameter: par }) => {
    const parameter = par as ITransferContract;

    return (
      <>
        <Row>
          <span>
            <strong>Amount</strong>
          </span>
          <CenteredRow>
            {loading ? (
              <Loader />
            ) : (
              <>
                <strong>
                  {toLocaleFixed(
                    parameter.amount / 10 ** coin.precision,
                    precision,
                  )}
                </strong>
                <KLV style={{ marginLeft: '1rem' }} />
                <strong>{coin.ticker}</strong>
              </>
            )}
          </CenteredRow>
        </Row>
        <Row>
          <span>
            <strong>To</strong>
          </span>
          <span>
            <Link href={`/account/${parameter.toAddress}`}>
              {parameter.toAddress}
            </Link>
          </span>
        </Row>
      </>
    );
  };

  const CreateAsset: React.FC<IContract> = ({ parameter: par }) => {
    const parameter = par as ICreateAssetContract;

    return (
      <>
        <Row>
          <span>
            <strong>Name</strong>
          </span>
          <span>{parameter.name}</span>
        </Row>
        <Row>
          <span>
            <strong>Owner</strong>
          </span>
          <span>
            <Link href={`/account/${parameter.ownerAddress}`}>
              {parameter.ownerAddress}
            </Link>
          </span>
        </Row>
        <Row>
          <span>
            <strong>Token</strong>
          </span>
          <span>{parameter.ticker}</span>
        </Row>
        <Row>
          <span>
            <strong>Precision</strong>
          </span>
          <span>
            <p>{parameter.precision}</p>
          </span>
        </Row>
        <Row>
          <span>
            <strong>Circulating Supply</strong>
          </span>
          <span>
            <small>
              {toLocaleFixed(
                parameter.circulatingSupply / 10 ** parameter.precision,
                parameter.precision,
              )}
            </small>
          </span>
        </Row>
        <Row>
          <span>
            <strong>Initial Supply</strong>
          </span>
          <span>
            <small>
              {toLocaleFixed(
                parameter.initialSupply / 10 ** parameter.precision,
                parameter.precision,
              )}
            </small>
          </span>
        </Row>
        <Row>
          <span>
            <strong>Max Supply</strong>
          </span>
          <span>
            <small>
              {toLocaleFixed(
                parameter.maxSupply / 10 ** parameter.precision,
                parameter.precision,
              )}
            </small>
          </span>
        </Row>
      </>
    );
  };

  const CreateValidator: React.FC<IContract> = ({ parameter: par }) => {
    const parameter = par as ICreateValidatorContract;

    return (
      <>
        <Row>
          <span>
            <strong>Owner</strong>
          </span>
          <span>
            <Link href={`/account/${parameter.ownerAddress}`}></Link>
          </span>
        </Row>
        <Row>
          <span>
            <strong>Can Delegate</strong>
          </span>
          <span>
            <p>{parameter.config.canDelegate ? 'True' : 'False'}</p>
          </span>
        </Row>
        <Row>
          <span>
            <strong>Comission</strong>
          </span>
          <span>
            <small>{parameter.config.commission.toLocaleString()}</small>
          </span>
        </Row>
        <Row>
          <span>
            <strong>Max Delegation Amount</strong>
          </span>
          <span>
            <small>
              {toLocaleFixed(
                parameter.config.maxDelegationAmount / 10 ** precision,
                precision,
              )}
            </small>
          </span>
        </Row>
        <Row>
          <span>
            <strong>Reward</strong>
          </span>
          <span>
            <Link href={`/account/${parameter.config.rewardAddress}`}>
              {parameter.config.rewardAddress}
            </Link>
          </span>
        </Row>
      </>
    );
  };

  const Freeze: React.FC<IContract> = ({ parameter: par }) => {
    const parameter = par as IFreezeContract;

    return (
      <>
        <Row>
          <span>
            <strong>Owner</strong>
          </span>
          <span>
            <Link href={`/account/${parameter.ownerAddress}`}>
              {parameter.ownerAddress}
            </Link>
          </span>
        </Row>
        <Row>
          <span>
            <strong>Amount</strong>
          </span>
          <span>
            <small>{parameter.amount.toLocaleString()}</small>
          </span>
        </Row>
      </>
    );
  };

  const Unfreeze: React.FC<IContract> = ({ parameter: par }) => {
    const parameter = par as IUnfreezeContract;

    return (
      <>
        <Row>
          <span>
            <strong>Owner</strong>
          </span>
          <span>
            <Link href={`/account/${parameter.ownerAddress}`}>
              {parameter.ownerAddress}
            </Link>
          </span>
        </Row>
        <Row>
          <span>
            <strong>Bucket ID</strong>
          </span>
          <span>{parameter.bucketID}</span>
        </Row>
      </>
    );
  };

  const Withdraw: React.FC<IContract> = ({ parameter: par }) => {
    const parameter = par as IWithdrawContract;

    return (
      <>
        <Row>
          <span>
            <strong>Owner</strong>
          </span>
          <span>
            <Link href={`/account/${parameter.ownerAddress}`}>
              {parameter.ownerAddress}
            </Link>
          </span>
        </Row>
        <Row>
          <span>
            <strong>To</strong>
          </span>
          <span>
            <Link href={`/account/${parameter.toAddress}`}>
              {parameter.toAddress}
            </Link>
          </span>
        </Row>
      </>
    );
  };

  const ContractComponent: React.FC = () => {
    const contractType = getContractType(contract);

    switch (contractType) {
      case Contract.Transfer:
        return <Transfer {...contract[0]} />;
      case Contract.CreateAsset:
        return <CreateAsset {...contract[0]} />;
      case Contract.CreateValidator:
      case Contract.ValidatorConfig:
        return <CreateValidator {...contract[0]} />;
      case Contract.Freeze:
        return <Freeze {...contract[0]} />;
      case Contract.Unfreeze:
      case Contract.Delegate:
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
            <CenteredRow onClick={() => handleCopyInfo(hash)}>
              <span>{hash}</span>
              <Copy />
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
            <CenteredRow onClick={() => handleCopyInfo(signature)}>
              <span>{signature}</span>
              <Copy />
            </CenteredRow>
          </Row>
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
  const contractType =
    Object.values(Contract)[transaction.data.transaction.contract[0].type];

  if (contractType === Contract.Transfer) {
    const contract = transaction.data.transaction.contract[0]
      .parameter as ITransferContract;

    if (contract.assetAddress) {
      const asset: IAssetResponse = await api.get({
        route: `assets/${contract.assetAddress}`,
      });
      if (!asset.error) {
        precision = asset.data.asset.precision;
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
  };

  return { props };
};

export default Transaction;
