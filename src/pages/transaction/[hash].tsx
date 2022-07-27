import React, { useState } from 'react';

import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { format, fromUnixTime } from 'date-fns';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { xcode } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

import {
  CardContainer,
  CardContent,
  CardRaw,
  CenteredRow,
  Container,
  Header,
  Input,
  Row,
  Title,
} from '@/views/transactions/detail';

import { Status } from '@/components/Table/styles';

import api from '@/services/api';
import {
  toLocaleFixed,
  hexToString,
  isDataEmpty,
  capitalizeString,
} from '@/utils/index';
import {
  IResponse,
  ITransaction,
  IAsset,
  Contract,
  ITransferContract,
  ICreateAssetContract,
  IContract,
} from '@/types/index';

import { ArrowLeft, Receive } from '@/assets/icons';
import {
  TransactionDetails as Icon,
  TransactionDetails,
} from '@/assets/title-icons';
import { getStatusIcon } from '@/assets/status';

import {
  Transfer,
  CreateAsset,
  CreateValidator,
  Freeze,
  Unfreeze,
  Withdraw,
  Delegate,
  Undelegate,
  Claim,
  Unjail,
  AssetTrigger,
  SetAccountName,
  Proposal,
  Vote,
  ConfigICO,
  SetICOPrices,
  Buy,
  Sell,
  CancelMarketOrder,
  CreateMarketplace,
  ConfigMarketplace,
} from '@/components/TransactionContractComponents';
import Copy from '@/components/Copy';
import QrCodeModal from '@/components/QrCodeModal';
import { ReceiveBackground } from '@/views/validator';

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

interface ITransactionPage {
  transaction: ITransaction;
  precision: number;
  asset: IAsset;
}

const klvAsset: IAsset = {
  assetType: '',
  assetId: '',
  name: 'Klever',
  ticker: 'KLV',
  ownerAddress: '',
  logo: '',
  precision: 6,
  uris: null,
  initialSupply: 0,
  circulatingSupply: 0,
  maxSupply: 0,
  royalties: 0,
  mintedValue: 0,
  issueDate: 0,
  burnedValue: 0,
  properties: {
    canAddRoles: true,
    canBurn: true,
    canChangeOwner: true,
    canFreeze: true,
    canMint: true,
    canPause: true,
    canWipe: false,
  },
  attributes: {
    isNFTMintStopped: false,
    isPaused: false,
  },
  staking: {
    minEpochsToWithdraw: 0,
    totalStaked: 0,
  },
};

const Transaction: React.FC<ITransactionPage> = props => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const { transaction, asset } = props;

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
  } = transaction;

  const StatusIcon = getStatusIcon(status);
  const precision = 6; // default KLV precision

  const getContractType = (contracts: IContract[]) => {
    if (!contract) {
      return 'Unkown';
    }

    return contracts.length > 1
      ? 'Multi contract'
      : Object.values(Contract)[contracts[0].type];
  };

  const ContractComponent: React.FC = () => {
    const contractType = getContractType(contract);
    let emptyContract: IContract = {} as IContract;

    if (contract) {
      emptyContract = { ...contract[0] };
    }

    const parsedContract = { ...emptyContract, sender };

    switch (contractType) {
      case Contract.Transfer:
        return (
          <Transfer {...contract[0]} precision={precision} asset={asset} />
        );
      case Contract.CreateAsset:
        return <CreateAsset {...parsedContract} receipts={receipts} />;
      case Contract.CreateValidator:
      case Contract.ValidatorConfig:
        return (
          <CreateValidator
            {...parsedContract}
            precision={precision}
            receipts={receipts}
          />
        );
      case Contract.Freeze:
        return (
          <Freeze
            {...parsedContract}
            precision={precision}
            receipts={receipts}
          />
        );
      case Contract.Unfreeze:
        return <Unfreeze {...parsedContract} receipts={receipts} />;
      case Contract.Delegate:
        return <Delegate {...parsedContract} receipts={receipts} />;
      case Contract.Undelegate:
        return <Undelegate {...parsedContract} receipts={receipts} />;
      case Contract.Withdraw:
        return <Withdraw {...parsedContract} receipts={receipts} />;
      case Contract.Claim:
        return <Claim {...parsedContract} receipts={receipts} />;
      case Contract.Unjail:
        return <Unjail {...parsedContract} receipts={receipts} />;
      case Contract.AssetTrigger:
        return <AssetTrigger {...parsedContract} receipts={receipts} />;
      case Contract.SetAccountName:
        return <SetAccountName {...parsedContract} receipts={receipts} />;
      case Contract.Proposal:
        return <Proposal {...parsedContract} receipts={receipts} />;
      case Contract.Vote:
        return <Vote {...parsedContract} receipts={receipts} />;
      case Contract.ConfigICO:
        return <ConfigICO {...parsedContract} receipts={receipts} />;
      case Contract.SetICOPrices:
        return <SetICOPrices {...parsedContract} receipts={receipts} />;
      case Contract.Buy:
        return <Buy {...parsedContract} receipts={receipts} />;
      case Contract.Sell:
        return <Sell {...parsedContract} receipts={receipts} />;
      case Contract.CancelMarketOrder:
        return <CancelMarketOrder {...parsedContract} receipts={receipts} />;
      case Contract.CreateMarketplace:
        return <CreateMarketplace {...parsedContract} receipts={receipts} />;
      case Contract.ConfigMarketplace:
        return <ConfigMarketplace {...parsedContract} receipts={receipts} />;

      default:
        return <div />;
    }
  };

  return (
    <Container>
      <Header>
        <Title>
          <div onClick={() => router.push('/transactions')}>
            <ArrowLeft />
          </div>
          <h1>
            <p>Transaction</p>{' '}
            <p>
              Details <Icon />
            </p>
          </h1>
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
              <ReceiveBackground>
                <Receive onClick={() => setShowModal(!showModal)} />
                <QrCodeModal
                  show={showModal}
                  setShowModal={() => setShowModal(false)}
                  value={hash}
                  onClose={() => setShowModal(false)}
                />
              </ReceiveBackground>
            </CenteredRow>
          </Row>
          <Row>
            <span>
              <strong>Status</strong>
            </span>
            <Status status={status}>
              <StatusIcon />
              <span>{capitalizeString(status)}</span>
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
              <p>{blockNum || 0}</p>
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
              <CenteredRow>
                <Link href={`/account/${sender}`}>{sender}</Link>
                <Copy data={sender} info="Sender" />
              </CenteredRow>
            </span>
          </Row>
          <Row>
            <span>
              <strong>kApp Fee</strong>
            </span>
            <span>
              <p>
                {toLocaleFixed(
                  status === 'success' ? kAppFee / 10 ** precision : 0,
                  precision,
                )}
              </p>
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
          {!isDataEmpty(data || []) && (
            <Row>
              <span>
                <strong>Data</strong>
              </span>
              <CenteredRow>
                <span>
                  {hexToString(
                    (data && data.length > 0 && data.join(',')) || '',
                  )}
                </span>
                <Copy
                  data={hexToString(
                    (data && data.length > 0 && data.join(',')) || '',
                  )}
                  info="Data"
                />
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
      <CardContainer>
        <h3>Raw Tx</h3>
        <CardContent>
          <CardRaw>
            <SyntaxHighlighter
              customStyle={{ height: '30rem', backgroundColor: 'white' }}
              style={xcode}
              language="json"
              wrapLines={true}
              wrapLongLines={true}
            >
              {JSON.stringify(transaction, null, 2)}
            </SyntaxHighlighter>
          </CardRaw>
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
  let contractType = 'Unkown';
  if (transaction.data.transaction.contract) {
    contractType =
      Object.values(Contract)[transaction.data.transaction.contract[0].type];
  }

  if (contractType === Contract.Transfer) {
    const contract = transaction.data.transaction.contract[0]
      .parameter as ITransferContract;
    if (contract.assetId) {
      const assetRes: IAssetResponse = await api.get({
        route: `assets/${contract.assetId}`,
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
    transaction: transaction.data.transaction,
    precision,
    asset,
  };

  return { props };
};

export default Transaction;
