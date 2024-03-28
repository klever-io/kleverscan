import { ArrowRight } from '@/assets/icons';
import { getStatusIcon } from '@/assets/status';
import { TransactionDetails as Icon } from '@/assets/title-icons';
import Copy from '@/components/Copy';
import { Button } from '@/components/CreateTxShortCut/styles';
import Title from '@/components/Layout/Title';
import { MultiContractToolTip } from '@/components/MultiContractToolTip';
import Skeleton from '@/components/Skeleton';
import Table, { ITable } from '@/components/Table';
import { Status } from '@/components/Table/styles';
import { useMobile } from '@/contexts/mobile';
import { requestTransactionsDefault } from '@/pages/transactions';
import { requestNonce } from '@/services/requests/account/collection-nonce';
import { Container, Header } from '@/styles/common';
import {
  Contract,
  ContractsName,
  IContract,
  ITransferContract,
} from '@/types/contracts';
import {
  IParsedAsset,
  IReceipt,
  IRowSection,
  ITransaction,
} from '@/types/index';
import {
  contractTypes,
  filteredSections,
  getLabelForTableField,
  initialsTableHeaders,
} from '@/utils/contracts';
import { capitalizeString } from '@/utils/convertString';
import { formatAmount, formatDate } from '@/utils/formatFunctions';
import { KLV_PRECISION } from '@/utils/globalVariables';
import { parseAddress } from '@/utils/parseValues';
import { SingleNFTTableContainer } from '@/views/accounts';
import {
  CardContainer,
  CardContent,
  CardRaw,
  CenteredRow,
  Row,
} from '@/views/transactions/detail';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { useQuery } from 'react-query';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { xcode } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

interface INonceParams {
  collection: string;
  nonce: string;
  account: string;
}

const NftDetail: React.FC<IParsedAsset> = () => {
  const [showRawData, setShowRawData] = useState(false);
  const router = useRouter();

  const { data: nonce, isLoading } = useQuery({
    queryKey: [
      `nftDetail-${router.query.nonce}`,
      router.query.collection,
      router.query.nonce,
    ],
    queryFn: () => requestNonce(router),
    enabled: !!router?.isReady,
  });

  const { isMobile } = useMobile();
  const getContractType = useCallback(contractTypes, []);

  const header = [...initialsTableHeaders, 'kApp Fee', 'Bandwidth Fee'];
  const getFilteredSections = (
    contract: IContract[],
    receipts: IReceipt[],
    precision?: number,
  ): IRowSection[] => {
    const contractType = getContractType(contract);
    return filteredSections(contract, contractType, receipts, precision);
  };

  const rowSections = (props: ITransaction): IRowSection[] => {
    const {
      hash,
      blockNum,
      timestamp,
      sender,
      receipts,
      contract,
      kAppFee,
      bandwidthFee,
      status,
      precision,
    } = props;

    const StatusIcon = getStatusIcon(status);
    let toAddress = '--';
    const contractType = getContractType(contract);

    if (contractType === Contract.Transfer) {
      const parameter = contract[0].parameter as ITransferContract;

      toAddress = parameter.toAddress;
    }

    const sections = [
      {
        element: (
          <CenteredRow className="bucketIdCopy" key={hash}>
            <Link href={`/transaction/${hash}`}>{parseAddress(hash, 24)}</Link>
            <Copy info="TXHash" data={hash} />
          </CenteredRow>
        ),
        span: 2,
      },
      {
        element: (
          <Link href={`/block/${blockNum || 0}`} key={blockNum}>
            <a className="address">{blockNum || 0}</a>
          </Link>
        ),
        span: 1,
      },

      {
        element: <small key={timestamp}>{formatDate(timestamp)}</small>,
        span: 1,
      },
      {
        element: (
          <Link href={`/account/${sender}`} key={sender}>
            <a className="address">{parseAddress(sender, 16)}</a>
          </Link>
        ),
        span: 1,
      },
      { element: !isMobile ? <ArrowRight /> : <></>, span: -1 },
      {
        element: (
          <Link href={`/account/${toAddress}`} key={toAddress}>
            <a className="address">{parseAddress(toAddress, 16)}</a>
          </Link>
        ),
        span: 1,
      },
      {
        element: (
          <Status status={status} key={status}>
            <StatusIcon />
            <span>{capitalizeString(status)}</span>
          </Status>
        ),
        span: 1,
      },
      {
        element:
          contractType === 'Multi contract' ? (
            <MultiContractToolTip
              contract={contract}
              contractType={contractType}
            />
          ) : (
            <strong key={contractType}>{ContractsName[contractType]}</strong>
          ),
        span: 1,
      },
      {
        element: contractType ? (
          <strong>{formatAmount(kAppFee / 10 ** KLV_PRECISION)}</strong>
        ) : (
          <></>
        ),
        span: 1,
      },
      {
        element: !router.query.type ? (
          <strong>{formatAmount(bandwidthFee / 10 ** KLV_PRECISION)}</strong>
        ) : (
          <></>
        ),
        span: 1,
      },
    ];
    const filteredContract = getFilteredSections(contract, receipts, precision);

    if (router.query.type) {
      sections.pop();
      sections.pop();
      sections.push(...filteredContract);
    }

    return sections;
  };

  const tableProps: ITable = {
    type: 'transactions',
    header: getLabelForTableField(router, header),
    rowSections,
    dataName: 'transactions',
    scrollUp: true,
    request: (page, limit) =>
      requestTransactionsDefault(page, limit, router, {
        asset: `${router.query.collection}/${router.query.nonce}`,
      }),
  };

  const isJsonString = (metadata: string) => {
    try {
      JSON.parse(metadata);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const RawDataComponent: React.FC = () => {
    return (
      <>
        <SyntaxHighlighter
          customStyle={{
            height: showRawData ? '20rem' : '5rem',
            backgroundColor: '#030307',
            color: 'white',
          }}
          style={xcode}
          language="json"
          wrapLines={true}
          wrapLongLines={true}
        >
          {JSON.stringify(JSON.parse(nonce?.metadata ?? ''), null, 2)}
        </SyntaxHighlighter>
      </>
    );
  };

  return (
    <>
      <Container>
        <Header>
          <Title
            title="NFT Details"
            Icon={Icon}
            route={
              router.isReady
                ? `/account/${router.query.account}/collection/${router.query.collection}`
                : '/'
            }
          />
        </Header>
        <CardContainer>
          <h3>Overview</h3>
          <CardContent>
            <Row isLoading={!!router.isReady}>
              <span>
                <strong>Address</strong>
              </span>
              <CenteredRow>
                {router.isReady ? (
                  <>
                    <span>{router.query.account}</span>
                    <Copy
                      data={router.query.account as string}
                      info="Address"
                    />
                  </>
                ) : (
                  <Skeleton />
                )}
              </CenteredRow>
            </Row>
            <Row isLoading={isLoading}>
              <span>
                <strong>Collection</strong>
              </span>
              <span>{!isLoading ? nonce?.name : <Skeleton />}</span>
            </Row>
            <Row isLoading={!!router.isReady}>
              <span>
                <strong>Asset ID</strong>
              </span>
              {router.isReady ? (
                <span>
                  <p>{router.query.collection}</p>
                </span>
              ) : (
                <Skeleton />
              )}
            </Row>
            <Row isLoading={!!router.isReady}>
              <span>
                <strong>Nonce</strong>
              </span>
              {router.isReady ? (
                <span>
                  <p>{router.query.nonce}</p>
                </span>
              ) : (
                <Skeleton />
              )}
            </Row>
            <Row isLoading={isLoading}>
              <span>
                <strong>Mime</strong>
              </span>
              {!isLoading ? (
                <span>
                  <p>{nonce?.mime || '--'}</p>
                </span>
              ) : (
                <Skeleton />
              )}
            </Row>
            {nonce?.metadata && !isJsonString(nonce.metadata) && (
              <Row isLoading={isLoading}>
                <span>
                  <strong>Metadata</strong>
                </span>
                {!isLoading ? (
                  <span>
                    <p>{nonce.metadata}</p>
                  </span>
                ) : (
                  <Skeleton />
                )}
              </Row>
            )}
          </CardContent>

          {nonce?.metadata && isJsonString(nonce.metadata) && (
            <>
              <h3>Metadata</h3>
              <CardContent>
                <CardRaw>
                  <Button
                    onClick={() => setShowRawData(!showRawData)}
                    style={{ marginBottom: '1rem' }}
                  >
                    {showRawData ? 'Collapse' : 'Expand'}
                  </Button>
                  <RawDataComponent />
                </CardRaw>
              </CardContent>
            </>
          )}
          {router.isReady && (
            <SingleNFTTableContainer>
              <h3>Asset Transactions</h3>
              <Table {...tableProps} />
            </SingleNFTTableContainer>
          )}
        </CardContainer>
      </Container>
    </>
  );
};
export default NftDetail;
