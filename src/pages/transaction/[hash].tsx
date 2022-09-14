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
import { IBlock } from '@/types/blocks';
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
import React, { useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { xcode } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

interface IBlockResponse extends IResponse {
  data: {
    block: IBlock;
  };
}

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
  block: IBlock;
}

const Transaction: React.FC<ITransactionPage> = props => {
  const [showModal, setShowModal] = useState(false);
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
  } = transaction;

  const StatusIcon = getStatusIcon(status);

  const ContractComponent: React.FC<any> = ({ contracts }) => {
    return (
      <div>
        {contracts.map((contract: any, index: number) => {
          switch (contract.typeString) {
            case Contract.Transfer:
              return (
                <div key={`${index}`}>
                  <Transfer {...contract} receipts={receipts} />
                  {index < contracts.length - 1 && <Hr />}
                </div>
              );

            case Contract.CreateAsset:
              return (
                <div key={`${index}`}>
                  <CreateAsset {...contract} receipts={receipts} />
                  {index < contracts.length - 1 && <Hr />}
                </div>
              );
            case Contract.CreateValidator:
              return (
                <div key={`${index}`}>
                  <CreateValidator {...contract} receipts={receipts} />
                  {index < contracts.length - 1 && <Hr />}
                </div>
              );
            case Contract.ValidatorConfig:
            case Contract.Freeze:
              return (
                <div key={`${index}`}>
                  <Freeze
                    {...contract}
                    contractIndex={index}
                    receipts={receipts}
                  />
                  {index < contracts.length - 1 && <Hr />}
                </div>
              );
            case Contract.Unfreeze:
              return (
                <div key={`${index}`}>
                  <Unfreeze {...contract} receipts={receipts} />
                  {index < contracts.length - 1 && <Hr />}
                </div>
              );
            case Contract.Delegate:
              return (
                <div key={`${index}`}>
                  <Delegate {...contract} receipts={receipts} />
                  {index < contracts.length - 1 && <Hr />}
                </div>
              );
            case Contract.Undelegate:
              return (
                <div key={`${index}`}>
                  <Undelegate {...contract} receipts={receipts} />
                  {index < contracts.length - 1 && <Hr />}
                </div>
              );
            case Contract.Withdraw:
              return (
                <div key={`${index}`}>
                  <Withdraw {...contract} receipts={receipts} />
                  {index < contracts.length - 1 && <Hr />}
                </div>
              );
            case Contract.Claim:
              return (
                <div key={`${index}`}>
                  <Claim {...contract} receipts={receipts} />
                  {index < contracts.length - 1 && <Hr />}
                </div>
              );
            case Contract.Unjail:
              return (
                <div key={`${index}`}>
                  <Unjail {...contract} receipts={receipts} />
                  {index < contracts.length - 1 && <Hr />}
                </div>
              );
            case Contract.AssetTrigger:
              return (
                <div key={`${index}`}>
                  <AssetTrigger {...contract} receipts={receipts} />
                  {index < contracts.length - 1 && <Hr />}
                </div>
              );
            case Contract.SetAccountName:
              return (
                <div key={`${index}`}>
                  <SetAccountName {...contract} receipts={receipts} />
                  {index < contracts.length - 1 && <Hr />}
                </div>
              );
            case Contract.Proposal:
              return (
                <div key={`${index}`}>
                  <Proposal {...contract} receipts={receipts} />
                  {index < contracts.length - 1 && <Hr />}
                </div>
              );
            case Contract.Vote:
              return (
                <div key={`${index}`}>
                  <Vote {...contract} receipts={receipts} />
                  {index < contracts.length - 1 && <Hr />}
                </div>
              );
            case Contract.ConfigITO:
              return (
                <div key={`${index}`}>
                  <ConfigITO {...contract} receipts={receipts} />
                  {index < contracts.length - 1 && <Hr />}
                </div>
              );
            case Contract.SetITOPrices:
              return (
                <div key={`${index}`}>
                  <SetITOPrices {...contract} receipts={receipts} />
                  {index < contracts.length - 1 && <Hr />}
                </div>
              );
            case Contract.Buy:
              return (
                <div key={`${index}`}>
                  <Buy {...contract} receipts={receipts} />
                  {index < contracts.length - 1 && <Hr />}
                </div>
              );
            case Contract.Sell:
              return (
                <div key={`${index}`}>
                  <Sell {...contract} receipts={receipts} />
                  {index < contracts.length - 1 && <Hr />}
                </div>
              );
            case Contract.CancelMarketOrder:
              return (
                <div key={`${index}`}>
                  <CancelMarketOrder {...contract} receipts={receipts} />
                  {index < contracts.length - 1 && <Hr />}
                </div>
              );
            case Contract.CreateMarketplace:
              return (
                <div key={`${index}`}>
                  <CreateMarketplace {...contract} receipts={receipts} />
                  {index < contracts.length - 1 && <Hr />}
                </div>
              );
            case Contract.ConfigMarketplace:
              return (
                <div key={`${index}`}>
                  <ConfigMarketplace {...contract} receipts={receipts} />
                  {index < contracts.length - 1 && <Hr />}
                </div>
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
              <strong>Epoch</strong>
            </span>
            <span>
              <p>{block.epoch}</p>
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

  const block: IBlockResponse = await api.get({
    route: `block/by-nonce/${transaction?.data?.transaction?.blockNum}`,
  });

  if (block.error) {
    return redirectProps;
  }

  const props: ITransactionPage = {
    transaction: transaction.data.transaction,
    block: block.data.block,
  };

  return { props };
};
export default Transaction;
