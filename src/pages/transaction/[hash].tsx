import { Proposal, Receive } from '@/assets/icons';
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
  Sell,
  SetAccountName,
  SetITOPrices,
  Transfer,
  Undelegate,
  Unfreeze,
  Unjail,
  UpdateAccountPermission,
  Vote,
  Withdraw,
} from '@/components/TransactionContractComponents';
import { useTheme } from '@/contexts/theme/index';
import api from '@/services/api';
import { IBlock } from '@/types/blocks';
import {
  Contract,
  IBuyContractPayload,
  IBuyITOsTotalPrices,
  IContract,
} from '@/types/contracts';
import { IAsset, IResponse, ITransaction } from '@/types/index';
import {
  capitalizeString,
  getPrecision,
  getTotalAssetsPrices,
  hexToString,
  isDataEmpty,
  parseJson,
  toLocaleFixed,
} from '@/utils/index';
import {
  BalanceContainer,
  FrozenContainer,
  RowContent,
} from '@/views/accounts/detail';
import {
  CardContainer,
  CardContent,
  CardRaw,
  CenteredRow,
  Container,
  ExpandCenteredRow,
  Header,
  Hr,
  IconsWrapper,
  Input,
  KappFeeFailedTx,
  KappFeeSpan,
  Row,
} from '@/views/transactions/detail';
import { ReceiveBackground } from '@/views/validator';
import { format, fromUnixTime } from 'date-fns';
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { BsPlus } from 'react-icons/bs';
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
  const [expandData, setExpandData] = useState(false);
  const { transaction, block } = props;
  const { isDarkTheme } = useTheme();
  const [totalAssetsPrices, setTotalAssetsPrices] =
    useState<IBuyITOsTotalPrices>({});

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

  const renderData = () =>
    parseJson(hexToString((data && data.length > 0 && data.join(',')) || ''));

  useEffect(() => {
    const getAsyncTotalAssetsPrices = async () => {
      const ITOBuyPrices = await getITOBuyPrices();
      if (Object.keys(ITOBuyPrices).length > 0) {
        const totalAssetsPrices = getTotalAssetsPrices(
          ITOBuyPrices,
          receipts,
          sender,
        );
        setTotalAssetsPrices(totalAssetsPrices);
      }
    };
    getAsyncTotalAssetsPrices();
  }, []);

  const getITOBuyPrices = async () => {
    const ITOBuyObject = {};
    for (let index = 0; index < contract.length; index++) {
      const parameter = contract[index]?.parameter as IBuyContractPayload;
      if (parameter?.buyType === 'ITOBuy' && parameter?.currencyID) {
        ITOBuyObject[parameter.currencyID] = { price: 0, precision: 0 };
        ITOBuyObject[parameter.currencyID].precision =
          (await getPrecision(parameter.currencyID)) ?? 6;
      }
    }
    return ITOBuyObject;
  };

  const renderMultiContractITOBuy = () => {
    if (Object.keys(totalAssetsPrices).length > 1) {
      return (
        <Row>
          <span>
            <strong>Total Price ITOBuy</strong>
          </span>
          <RowContent>
            <BalanceContainer>
              <FrozenContainer>
                {Object.entries(totalAssetsPrices).map(([asset, data]) => (
                  <div key={asset}>
                    <strong>{asset ?? 0}</strong>
                    <span>{data.price.toLocaleString() ?? 0}</span>
                  </div>
                ))}
              </FrozenContainer>
            </BalanceContainer>
          </RowContent>
        </Row>
      );
    }
  };

  const ContractComponent: React.FC<any> = ({ contracts }) => {
    return (
      <div>
        {contracts.map((contract: IContract, index: number) => {
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
                  <Buy
                    {...contract}
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
            case Contract.UpdateAccountPermission:
              return (
                <div key={`${index}`}>
                  <UpdateAccountPermission {...contract} receipts={receipts} />
                  {index < contracts.length - 1 && <Hr />}
                </div>
              );
            case Contract.Deposit:
              return (
                <div key={`${index}`}>
                  <Deposit {...contract} receipts={receipts} />
                  {index < contracts.length - 1 && <Hr />}
                </div>
              );
            case Contract.ITOTrigger:
              return (
                <div key={`${index}`}>
                  <ITOTrigger {...contract} receipts={receipts} />
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
    height: '30rem',
    color: isDarkTheme ? 'white' : 'black',
    backgroundColor: isDarkTheme ? '#181935' : 'white',
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

              <ExpandCenteredRow>
                <span>
                  {expandData ? (
                    <pre>{renderData()}</pre>
                  ) : (
                    <span>{renderData()}</span>
                  )}
                </span>
                <IconsWrapper>
                  <BsPlus
                    style={{ overflow: 'visible', marginRight: '3px' }}
                    onClick={() => setExpandData(!expandData)}
                  />
                  <Copy
                    data={hexToString(
                      (data && data.length > 0 && data.join(',')) || '',
                    )}
                    info="Data"
                  />
                </IconsWrapper>
              </ExpandCenteredRow>
            </Row>
          )}
          {renderMultiContractITOBuy()}
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
          <CardRaw>
            <SyntaxHighlighter
              customStyle={rawTxTheme}
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
