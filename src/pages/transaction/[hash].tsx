import { getStatusIcon } from '@/assets/status';
import { TransactionDetails as Icon } from '@/assets/title-icons';
import Copy from '@/components/Copy';
import Title from '@/components/Layout/Title';
import QrCodeModal from '@/components/QrCodeModal';
import { Status } from '@/components/Table/styles';
import Tooltip from '@/components/Tooltip';
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
import {
  CardContent,
  CardHeader,
  CardHeaderItem,
  Container,
  Header,
  Row,
} from '@/styles/common';
import { ITransactionPage, ITransactionResponse, NotFound } from '@/types';
import { IBlockResponse } from '@/types/blocks';
import { Contract, IIndexedContract } from '@/types/contracts';
import { capitalizeString, hexToString } from '@/utils/convertString';
import { filterReceipts } from '@/utils/findKey';
import { formatDate, toLocaleFixed } from '@/utils/formatFunctions';
import { parseJson } from '@/utils/parseValues';
import { getPrecision } from '@/utils/precisionFunctions';
import {
  ButtonExpand,
  CardContainer,
  CardRaw,
  CenteredRow,
  DivDataJson,
  ExpandCenteredRow,
  Hr,
  IconsWrapper,
  KappFeeFailedTx,
  KappFeeSpan,
  KdaFeeSpan,
  Row as DetailRow,
} from '@/views/transactions/detail';
import { ReceiveBackground } from '@/views/validator';
import { GetStaticPaths, GetStaticProps } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

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
    kdaFee,
  } = transaction;
  const [precisionTransaction, setPrecisionTransaction] = useState<number>(0);
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

  const [expandData, setExpandData] = useState(initializeExpandData());
  const { isDarkTheme } = useTheme();
  const ReactJson = dynamic(import('react-json-view'), { ssr: false });

  const StatusIcon = getStatusIcon(status);

  const updateExpandArray = (index: number) => {
    const newArray = [...expandData];
    newArray[index] = !expandData[index];
    setExpandData(newArray);
  };

  const renderMetadata = (
    data: string[] | undefined,
    index: number,
  ): JSX.Element | null => {
    if (!data || (data && !data[index])) return null;
    return (
      <DetailRow>
        <span>
          <strong>Metadata</strong>
        </span>
        <ExpandCenteredRow openJson={expandData[index]}>
          {processMetadata(data[index], index)}
        </ExpandCenteredRow>
        <IconsWrapper>
          <ButtonExpand onClick={() => updateExpandArray(index)}>
            {expandData[index] ? 'Hide' : 'Expand'}
          </ButtonExpand>
          <Copy data={hexToString(data[index])} info="Data" />
        </IconsWrapper>
      </DetailRow>
    );
  };

  const processMetadata = (data: string, index: number) => {
    const formatData = (hexData: any) => <span>{hexToString(hexData)}</span>;

    if (expandData[index]) {
      try {
        const jsonData = JSON.parse(parseJson(hexToString(data)));
        if (jsonData && typeof jsonData === 'object') {
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
        }
        return formatData(data);
      } catch (error) {
        return formatData(data);
      }
    }
    return <span>{hexToString(data)}</span>;
  };

  const ContractComponent: React.FC<any> = ({ contracts }) => {
    return (
      <div>
        {contracts.map((contract: IIndexedContract, index: number) => {
          const filteredReceipts = filterReceipts(receipts, index);
          switch (contract.typeString) {
            case Contract.Transfer:
              return (
                <div key={`${index}`}>
                  <Transfer
                    {...contract}
                    contractIndex={index}
                    filteredReceipts={filteredReceipts}
                    renderMetadata={() => renderMetadata(data, index)}
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
                    filteredReceipts={filteredReceipts}
                    renderMetadata={() => renderMetadata(data, index)}
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
                    filteredReceipts={filteredReceipts}
                    renderMetadata={() => renderMetadata(data, index)}
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
                    filteredReceipts={filteredReceipts}
                    renderMetadata={() => renderMetadata(data, index)}
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
                    filteredReceipts={filteredReceipts}
                    renderMetadata={() => renderMetadata(data, index)}
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
                    filteredReceipts={filteredReceipts}
                    renderMetadata={() => renderMetadata(data, index)}
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
                    filteredReceipts={filteredReceipts}
                    renderMetadata={() => renderMetadata(data, index)}
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
                    filteredReceipts={filteredReceipts}
                    renderMetadata={() => renderMetadata(data, index)}
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
                    filteredReceipts={filteredReceipts}
                    renderMetadata={() => renderMetadata(data, index)}
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
                    filteredReceipts={filteredReceipts}
                    renderMetadata={() => renderMetadata(data, index)}
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
                    filteredReceipts={filteredReceipts}
                    renderMetadata={() => renderMetadata(data, index)}
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
                    filteredReceipts={filteredReceipts}
                    renderMetadata={() => renderMetadata(data, index)}
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
                    filteredReceipts={filteredReceipts}
                    renderMetadata={() => renderMetadata(data, index)}
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
                    filteredReceipts={filteredReceipts}
                    renderMetadata={() => renderMetadata(data, index)}
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
                    filteredReceipts={filteredReceipts}
                    renderMetadata={() => renderMetadata(data, index)}
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
                    filteredReceipts={filteredReceipts}
                    renderMetadata={() => renderMetadata(data, index)}
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
                    filteredReceipts={filteredReceipts}
                    renderMetadata={() => renderMetadata(data, index)}
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
                    filteredReceipts={filteredReceipts}
                    sender={sender}
                    contracts={contracts}
                    renderMetadata={() => renderMetadata(data, index)}
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
                    filteredReceipts={filteredReceipts}
                    renderMetadata={() => renderMetadata(data, index)}
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
                    filteredReceipts={filteredReceipts}
                    renderMetadata={() => renderMetadata(data, index)}
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
                    renderMetadata={() => renderMetadata(data, index)}
                    filteredReceipts={filteredReceipts}
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
                    filteredReceipts={filteredReceipts}
                    renderMetadata={() => renderMetadata(data, index)}
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
                    filteredReceipts={filteredReceipts}
                    renderMetadata={() => renderMetadata(data, index)}
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
                    filteredReceipts={filteredReceipts}
                    renderMetadata={() => renderMetadata(data, index)}
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
                    filteredReceipts={filteredReceipts}
                    renderMetadata={() => renderMetadata(data, index)}
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
  const getPrecisionTransaction = async () => {
    if (kdaFee) {
      const precision = await getPrecision(kdaFee.kda);
      setPrecisionTransaction(precision);
    }
  };
  useEffect(() => {
    getPrecisionTransaction();
  }, []);
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
        <CardContent>
          <Row>
            <span>
              <strong>Hash</strong>
            </span>
            <CenteredRow>
              <span>{hash}</span>
              <Copy data={hash} info="Hash" />
              <ReceiveBackground isOverflow={true}>
                <QrCodeModal value={hash} isOverflow={true} />
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
              <strong>KDA Fee</strong>
            </span>
            <KdaFeeSpan>
              <span>
                {kdaFee &&
                  toLocaleFixed(
                    kdaFee?.amount / 10 ** precisionTransaction,
                    precisionTransaction,
                  )}{' '}
                {kdaFee?.kda || 'KLV'}
              </span>
              <Tooltip
                msg={`Both kApp fee and bandwidth fee were payed with ${
                  kdaFee?.kda || 'KLV'
                }`}
              />
            </KdaFeeSpan>
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
        </CardContent>
      </CardContainer>
      <CardContainer>
        <CardHeader>
          <CardHeaderItem selected={true}>
            <span>Contracts</span>
          </CardHeaderItem>
        </CardHeader>
        <CardContent>
          <ContractComponent contracts={contract} sender={sender} />
        </CardContent>
      </CardContainer>
      <CardContainer>
        <CardHeader>
          <CardHeaderItem selected={true}>
            <span>Raw Tx</span>
          </CardHeaderItem>
        </CardHeader>
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
