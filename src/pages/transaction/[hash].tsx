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
  Deposit,
  Freeze,
  ITOTrigger,
  Proposal,
  Sell,
  SetAccountName,
  SetITOPrices,
  Transfer,
  Undelegate,
  Unfreeze,
  Unjail,
  UpdateAccountPermission,
  ValidatorConfig,
  Vote,
  Withdraw,
} from '@/components/TransactionContractComponents';
import { useTheme } from '@/contexts/theme/index';
import api from '@/services/api';
import { IBlock } from '@/types/blocks';
import { Contract, IIndexedContract } from '@/types/contracts';
import { IAsset, IResponse, ITransaction } from '@/types/index';
import {
  capitalizeString,
  formatDate,
  hexToString,
  parseJson,
  toLocaleFixed,
} from '@/utils/index';
import { BalanceContainer, RowContent } from '@/views/accounts/detail';
import {
  ButtonExpand,
  CardContainer,
  CardContent,
  CardRaw,
  CenteredRow,
  Container,
  DivDataJson,
  ExpandCenteredRow,
  FrozenContainer,
  Header,
  Hr,
  IconsWrapper,
  Input,
  KappFeeFailedTx,
  KappFeeSpan,
  Row,
} from '@/views/transactions/detail';
import { ReceiveBackground } from '@/views/validator';
import { GetStaticPaths, GetStaticProps } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import React, { useState } from 'react';

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

  const initializeExpandData = () => {
    if (data && data.length > 0) {
      const expandArray: boolean[] = [];
      data.forEach(() => {
        expandArray.push(false);
      });
      return expandArray;
    }
    return [];
  };

  const [showModal, setShowModal] = useState(false);
  const [expandData, setExpandData] = useState(initializeExpandData());
  const { isDarkTheme } = useTheme();
  const ReactJson = dynamic(import('react-json-view'), { ssr: false });

  const StatusIcon = getStatusIcon(status);

  const updateExpandArray = (index: number) => {
    const newArray = [...expandData];
    newArray[index] = !expandData[index];
    setExpandData(newArray);
  };

  const renderAllData = () => {
    if (!data || data.length === 0) {
      return null;
    }
    if (data.length === 1) {
      return renderOneMetadata(data, 0);
    }
    return renderAllMetadata(data);
  };

  const renderAllMetadata = (data: string[]) => {
    return data.map((_, index) => (
      <FrozenContainer key={index}>
        {renderOneMetadata(data, index)}
      </FrozenContainer>
    ));
  };

  const renderOneMetadata = (data: string[], index: number) => {
    return (
      <ExpandCenteredRow openJson={expandData[index]}>
        {renderData(data[index], index)}
        <IconsWrapper>
          <ButtonExpand onClick={() => updateExpandArray(index)}>
            {expandData[index] ? 'Hide' : 'Expand'}
          </ButtonExpand>
          <Copy data={hexToString(data[index])} info="Data" />
        </IconsWrapper>
      </ExpandCenteredRow>
    );
  };

  const renderData = (data: string, index: number) => {
    if (expandData[index]) {
      try {
        const jsonData = JSON.parse(parseJson(hexToString(data)));
        return (
          <DivDataJson>
            <ReactJson
              src={jsonData}
              name={false}
              displayObjectSize={false}
              enableClipboard={true}
              displayDataTypes={false}
              theme={rawTxTheme}
            />
          </DivDataJson>
        );
      } catch (error) {
        return <span>{hexToString(data)}</span>;
      }
    }
    return <span>{parseJson(hexToString(data))}</span>;
  };

  const ContractComponent: React.FC<any> = ({ contracts }) => {
    return (
      <div>
        {contracts.map((contract: IIndexedContract, index: number) => {
          switch (contract.typeString) {
            case Contract.Transfer:
              return (
                <div key={`${index}`}>
                  <Transfer
                    {...contract}
                    contractIndex={index}
                    receipts={receipts}
                  />
                  {index < contracts.length - 1 && <Hr />}
                </div>
              );

            case Contract.CreateAsset:
              return (
                <div key={`${index}`}>
                  <CreateAsset
                    {...contract}
                    contractIndex={index}
                    receipts={receipts}
                  />
                  {index < contracts.length - 1 && <Hr />}
                </div>
              );
            case Contract.CreateValidator:
              return (
                <div key={`${index}`}>
                  <CreateValidator
                    {...contract}
                    contractIndex={index}
                    receipts={receipts}
                  />
                  {index < contracts.length - 1 && <Hr />}
                </div>
              );
            case Contract.ValidatorConfig:
              return (
                <div key={`${index}`}>
                  <ValidatorConfig
                    {...contract}
                    contractIndex={index}
                    receipts={receipts}
                  />
                  {index < contracts.length - 1 && <Hr />}
                </div>
              );
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
                  <Unfreeze
                    {...contract}
                    contractIndex={index}
                    receipts={receipts}
                  />
                  {index < contracts.length - 1 && <Hr />}
                </div>
              );
            case Contract.Delegate:
              return (
                <div key={`${index}`}>
                  <Delegate
                    {...contract}
                    contractIndex={index}
                    receipts={receipts}
                  />
                  {index < contracts.length - 1 && <Hr />}
                </div>
              );
            case Contract.Undelegate:
              return (
                <div key={`${index}`}>
                  <Undelegate
                    {...contract}
                    contractIndex={index}
                    receipts={receipts}
                  />
                  {index < contracts.length - 1 && <Hr />}
                </div>
              );
            case Contract.Withdraw:
              return (
                <div key={`${index}`}>
                  <Withdraw
                    {...contract}
                    contractIndex={index}
                    receipts={receipts}
                  />
                  {index < contracts.length - 1 && <Hr />}
                </div>
              );
            case Contract.Claim:
              return (
                <div key={`${index}`}>
                  <Claim
                    {...contract}
                    contractIndex={index}
                    receipts={receipts}
                  />
                  {index < contracts.length - 1 && <Hr />}
                </div>
              );
            case Contract.Unjail:
              return (
                <div key={`${index}`}>
                  <Unjail
                    {...contract}
                    contractIndex={index}
                    receipts={receipts}
                  />
                  {index < contracts.length - 1 && <Hr />}
                </div>
              );
            case Contract.AssetTrigger:
              return (
                <div key={`${index}`}>
                  <AssetTrigger
                    {...contract}
                    contractIndex={index}
                    receipts={receipts}
                  />
                  {index < contracts.length - 1 && <Hr />}
                </div>
              );
            case Contract.SetAccountName:
              return (
                <div key={`${index}`}>
                  <SetAccountName
                    {...contract}
                    contractIndex={index}
                    receipts={receipts}
                  />
                  {index < contracts.length - 1 && <Hr />}
                </div>
              );
            case Contract.Proposal:
              return (
                <div key={`${index}`}>
                  <Proposal
                    {...contract}
                    contractIndex={index}
                    receipts={receipts}
                  />
                  {index < contracts.length - 1 && <Hr />}
                </div>
              );
            case Contract.Vote:
              return (
                <div key={`${index}`}>
                  <Vote
                    {...contract}
                    contractIndex={index}
                    receipts={receipts}
                  />
                  {index < contracts.length - 1 && <Hr />}
                </div>
              );
            case Contract.ConfigITO:
              return (
                <div key={`${index}`}>
                  <ConfigITO
                    {...contract}
                    contractIndex={index}
                    receipts={receipts}
                  />
                  {index < contracts.length - 1 && <Hr />}
                </div>
              );
            case Contract.SetITOPrices:
              return (
                <div key={`${index}`}>
                  <SetITOPrices
                    {...contract}
                    contractIndex={index}
                    receipts={receipts}
                  />
                  {index < contracts.length - 1 && <Hr />}
                </div>
              );
            case Contract.Buy:
              return (
                <div key={`${index}`}>
                  <Buy
                    {...contract}
                    contractIndex={index}
                    receipts={receipts}
                    sender={sender}
                    contracts={contracts}
                  />
                  {index < contracts.length - 1 && <Hr />}
                </div>
              );
            case Contract.Sell:
              return (
                <div key={`${index}`}>
                  <Sell
                    {...contract}
                    contractIndex={index}
                    receipts={receipts}
                  />
                  {index < contracts.length - 1 && <Hr />}
                </div>
              );
            case Contract.CancelMarketOrder:
              return (
                <div key={`${index}`}>
                  <CancelMarketOrder
                    {...contract}
                    contractIndex={index}
                    receipts={receipts}
                  />
                  {index < contracts.length - 1 && <Hr />}
                </div>
              );
            case Contract.CreateMarketplace:
              return (
                <div key={`${index}`}>
                  <CreateMarketplace
                    {...contract}
                    contractIndex={index}
                    receipts={receipts}
                  />
                  {index < contracts.length - 1 && <Hr />}
                </div>
              );
            case Contract.ConfigMarketplace:
              return (
                <div key={`${index}`}>
                  <ConfigMarketplace
                    {...contract}
                    contractIndex={index}
                    receipts={receipts}
                  />
                  {index < contracts.length - 1 && <Hr />}
                </div>
              );
            case Contract.UpdateAccountPermission:
              return (
                <div key={`${index}`}>
                  <UpdateAccountPermission
                    {...contract}
                    contractIndex={index}
                    receipts={receipts}
                  />
                  {index < contracts.length - 1 && <Hr />}
                </div>
              );
            case Contract.Deposit:
              return (
                <div key={`${index}`}>
                  <Deposit
                    {...contract}
                    contractIndex={index}
                    receipts={receipts}
                  />
                  {index < contracts.length - 1 && <Hr />}
                </div>
              );
            case Contract.ITOTrigger:
              return (
                <div key={`${index}`}>
                  <ITOTrigger
                    {...contract}
                    contractIndex={index}
                    receipts={receipts}
                  />
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

  const rawTxTheme = {
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
  const KappFeeRow: React.FC = () => {
    if (status === 'fail') {
      return (
        <KappFeeSpan>
          <KappFeeFailedTx>
            {toLocaleFixed(transaction.kAppFee / 1000000, 6)}
          </KappFeeFailedTx>
          <span>Value not charged on failed transactions</span>
        </KappFeeSpan>
      );
    }
    return (
      <span>
        <p>{toLocaleFixed(kAppFee / 1000000, 6)}</p>
      </span>
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
              <p>{block?.epoch}</p>
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
            <KappFeeRow />
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
              <p>{formatDate(timestamp)}</p>
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
          <Row>
            <span>
              <strong>Data</strong>
            </span>
            <RowContent>
              <BalanceContainer>{renderAllData()}</BalanceContainer>
            </RowContent>
          </Row>
        </CardContent>
      </CardContainer>
      <CardContainer>
        <h3>Contracts</h3>
        <CardContent>
          <ContractComponent contracts={contract} sender={sender} />
        </CardContent>
      </CardContainer>
      <CardContainer>
        <h3>Raw Tx</h3>
        <CardContent>
          <CardRaw style={{ height: '30rem' }}>
            <ReactJson
              src={transaction}
              name={false}
              displayObjectSize={false}
              enableClipboard={true}
              displayDataTypes={false}
              theme={rawTxTheme}
            />
          </CardRaw>
        </CardContent>
      </CardContainer>
    </Container>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: string[] = [];

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<ITransactionPage> = async ({
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
  const tx = transaction?.data?.transaction;
  if (transaction.error || (!tx?.blockNum && !tx?.nonce && !tx?.sender)) {
    return redirectProps;
  }
  const block: IBlockResponse = await api.get({
    route: `block/by-nonce/${transaction?.data?.transaction?.blockNum}`,
  });

  const props: ITransactionPage = {
    transaction: transaction.data.transaction,
    block: block?.data?.block || {},
  };

  return {
    props,
  };
};
export default Transaction;
