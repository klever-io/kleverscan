import { Receive } from '@/assets/icons';
import { getStatusIcon } from '@/assets/status';
import { TransactionDetails as Icon } from '@/assets/title-icons';
import Copy from '@/components/Copy';
import Title from '@/components/Layout/Title';
import QrCodeModal from '@/components/QrCodeModal';
import { Status } from '@/components/Table/styles';
import {
  AssetTrigger,
  Buy,
  CancelMarketOrder,
  Claim,
  ConfigITO,
  ConfigMarketplace,
  CreateAsset,
  CreateMarketplace,
  CreateValidator,
  Delegate,
  Freeze,
  Proposal,
  Sell,
  SetAccountName,
  SetITOPrices,
  Transfer,
  Undelegate,
  Unfreeze,
  Unjail,
  Vote,
  Withdraw,
} from '@/components/TransactionContractComponents';
import api from '@/services/api';
import { Contract, IAsset, IResponse, ITransaction } from '@/types/index';
import {
  capitalizeString,
  hexToString,
  isDataEmpty,
  toLocaleFixed,
} from '@/utils/index';
import {
  CardContainer,
  CardContent,
  CardRaw,
  CenteredRow,
  Container,
  Header,
  Hr,
  Input,
  Row,
} from '@/views/transactions/detail';
import { ReceiveBackground } from '@/views/validator';
import { format, fromUnixTime } from 'date-fns';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { xcode } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

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
  verified: false,
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
  const { transaction } = props;

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

  const ContractComponent: React.FC<any> = ({ contracts }) => {
    return (
      <div>
        {contracts.map((contract: any, index: number) => {
          switch (contract.typeString) {
            case Contract.Transfer:
              return (
                <>
                  <Transfer {...contract} receipts={receipts} />
                  {index < contracts.length - 1 && <Hr />}
                </>
              );

            case Contract.CreateAsset:
              return (
                <>
                  <CreateAsset {...contract} receipts={receipts} />
                  {index < contracts.length - 1 && <Hr />}
                </>
              );
            case Contract.CreateValidator:
              return <CreateValidator {...contract} receipts={receipts} />;
            case Contract.ValidatorConfig:
            case Contract.Freeze:
              return (
                <>
                  <Freeze
                    {...contract}
                    contractIndex={index}
                    receipts={receipts}
                  />
                  {index < contracts.length - 1 && <Hr />}
                </>
              );
            case Contract.Unfreeze:
              return (
                <>
                  <Unfreeze {...contract} receipts={receipts} />
                  {index < contracts.length - 1 && <Hr />}
                </>
              );
            case Contract.Delegate:
              return (
                <>
                  <Delegate {...contract} receipts={receipts} />
                  {index < contracts.length - 1 && <Hr />}
                </>
              );
            case Contract.Undelegate:
              return (
                <>
                  <Undelegate {...contract} receipts={receipts} />
                  {index < contracts.length - 1 && <Hr />}
                </>
              );
            case Contract.Withdraw:
              return (
                <>
                  <Withdraw {...contract} receipts={receipts} />
                  {index < contracts.length - 1 && <Hr />}
                </>
              );
            case Contract.Claim:
              return (
                <>
                  <Claim {...contract} receipts={receipts} />
                  {index < contracts.length - 1 && <Hr />}
                </>
              );
            case Contract.Unjail:
              return (
                <>
                  <Unjail {...contract} receipts={receipts} />
                  {index < contracts.length - 1 && <Hr />}
                </>
              );
            case Contract.AssetTrigger:
              return (
                <>
                  <AssetTrigger {...contract} receipts={receipts} />
                  {index < contracts.length - 1 && <Hr />}
                </>
              );
            case Contract.SetAccountName:
              return (
                <>
                  <SetAccountName {...contract} receipts={receipts} />
                  {index < contracts.length - 1 && <Hr />}
                </>
              );
            case Contract.Proposal:
              return (
                <>
                  <Proposal {...contract} receipts={receipts} />
                  {index < contracts.length - 1 && <Hr />}
                </>
              );
            case Contract.Vote:
              return (
                <>
                  <Vote {...contract} receipts={receipts} />
                  {index < contracts.length - 1 && <Hr />}
                </>
              );
            case Contract.ConfigITO:
              return (
                <>
                  <ConfigITO {...contract} receipts={receipts} />
                  {index < contracts.length - 1 && <Hr />}
                </>
              );
            case Contract.SetITOPrices:
              return (
                <>
                  <SetITOPrices {...contract} receipts={receipts} />
                  {index < contracts.length - 1 && <Hr />}
                </>
              );
            case Contract.Buy:
              return (
                <>
                  <Buy {...contract} receipts={receipts} />
                  {index < contracts.length - 1 && <Hr />}
                </>
              );
            case Contract.Sell:
              return (
                <>
                  <Sell {...contract} receipts={receipts} />
                  {index < contracts.length - 1 && <Hr />}
                </>
              );
            case Contract.CancelMarketOrder:
              return (
                <>
                  <CancelMarketOrder {...contract} receipts={receipts} />
                  {index < contracts.length - 1 && <Hr />}
                </>
              );
            case Contract.CreateMarketplace:
              return (
                <>
                  <CreateMarketplace {...contract} receipts={receipts} />
                  {index < contracts.length - 1 && <Hr />}
                </>
              );
            case Contract.ConfigMarketplace:
              return (
                <>
                  <ConfigMarketplace {...contract} receipts={receipts} />
                  {index < contracts.length - 1 && <Hr />}
                </>
              );
            default:
              return <div />;
          }
        })}
      </div>
    );
  };

  return (
    <Container>
      <Header>
        <Title
          title="Transaction Details"
          Icon={Icon}
          route={'/transactions'}
        />

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
                {toLocaleFixed(status === 'success' ? kAppFee / 1000000 : 0, 6)}
              </p>
            </span>
          </Row>
          <Row>
            <span>
              <strong>Bandwidth Fee</strong>
            </span>
            <span>
              <p>{toLocaleFixed(bandwidthFee / 1000000, 6)}</p>
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
        <h3>Contracts</h3>
        <CardContent>
          <ContractComponent contracts={contract} />
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

  const props: ITransactionPage = {
    transaction: transaction.data.transaction,
  };

  return { props };
};

export default Transaction;
