import { TransactionDetails as Icon } from '@/assets/title-icons';
import Copy from '@/components/Copy';
import { Button } from '@/components/CreateTxShortCut/styles';
import Title from '@/components/Layout/Title';
import Skeleton from '@/components/Skeleton';
import Table, { ITable } from '@/components/TableV2';
import {
  requestTransactionsDefault,
  transactionRowSections,
} from '@/pages/transactions';
import { requestNonce } from '@/services/requests/account/collection-nonce';
import { Container, Header } from '@/styles/common';
import { IParsedAsset } from '@/types/index';
import { transactionTableHeaders } from '@/utils/contracts';
import { SingleNFTTableContainer } from '@/views/accounts';
import {
  CardContainer,
  CardContent,
  CardRaw,
  CenteredRow,
  Row,
} from '@/views/transactions/detail';
import { useRouter } from 'next/router';
import { useState } from 'react';
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

  const tableProps: ITable = {
    type: 'transactions',
    header: transactionTableHeaders,
    rowSections: transactionRowSections,
    dataName: 'transactions',
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
