import { TransactionDetails as Icon } from '@/assets/title-icons';
import Copy from '@/components/Copy';
import Title from '@/components/Layout/Title';
import api from '@/services/api';
import { INfts, IResponse } from '@/types/index';
import {
  CardContainer,
  CardContent,
  CardRaw,
  CenteredRow,
  Container,
  Header,
  Input,
  Row,
} from '@/views/transactions/detail';
import { GetServerSideProps } from 'next';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { xcode } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

interface INftResponse extends IResponse {
  data: {
    collection: INfts[];
  };
}

interface INftPage {
  nft: INfts | undefined;
  assetId: string | string[];
  address: string | string[];
}

const NftDetail: React.FC<INftPage> = ({ nft, address, assetId }) => {
  const isJsonString = (metadata: string) => {
    try {
      JSON.parse(metadata);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };
  return (
    <Container>
      <Header>
        <Title
          title="NFT Details"
          Icon={Icon}
          route={`/account/${address}/collection/${assetId}`}
        />

        <Input />
      </Header>
      <CardContainer>
        <h3>Overview</h3>
        <CardContent>
          <Row>
            <span>
              <strong>Address</strong>
            </span>
            <CenteredRow>
              <span>{nft?.address}</span>
              <Copy data={nft?.address} info="Address" />
            </CenteredRow>
          </Row>
          <Row>
            <span>
              <strong>Collection</strong>
            </span>
            {nft?.assetName}
          </Row>
          <Row>
            <span>
              <strong>Asset ID</strong>
            </span>
            <span>
              <p>{nft?.collection}</p>
            </span>
          </Row>
          <Row>
            <span>
              <strong>Nonce</strong>
            </span>
            <span>
              <p>{nft?.nftNonce}</p>
            </span>
          </Row>
          <Row>
            <span>
              <strong>Mime</strong>
            </span>
            <span>
              <p>{nft?.mime || '--'}</p>
            </span>
          </Row>
          {nft?.metadata && !isJsonString(nft?.metadata) && (
            <Row>
              <span>
                <strong>Metadata</strong>
              </span>
              <span>
                <p>{nft?.metadata}</p>
              </span>
            </Row>
          )}
        </CardContent>

        {nft?.metadata && isJsonString(nft?.metadata) && (
          <>
            <h3>Metadata</h3>
            <CardContent>
              <CardRaw>
                <SyntaxHighlighter
                  customStyle={{
                    height: '20rem',
                    backgroundColor: '#030307',
                    color: 'white',
                  }}
                  style={xcode}
                  language="json"
                  wrapLines={true}
                  wrapLongLines={true}
                >
                  {JSON.stringify(JSON.parse(nft?.metadata), null, 2)}
                </SyntaxHighlighter>
              </CardRaw>
            </CardContent>
          </>
        )}
      </CardContainer>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps<INftPage> = async ({
  params,
}) => {
  const redirectProps = { redirect: { destination: '/404', permanent: false } };

  const assetId = params?.collection;
  const address = params?.account;
  const nonce = params?.nonce;
  if (!assetId || !address || !nonce) {
    return redirectProps;
  }

  const response: INftResponse = await api.get({
    route: `address/${address}/collection/${assetId}`,
  });

  if (response.error) {
    return redirectProps;
  }

  const props: INftPage = {
    nft: response.data.collection.find(
      (collection: INfts) => +nonce === collection.nftNonce,
    ),
    assetId: assetId,
    address,
  };

  if (!props.nft) {
    return redirectProps;
  }

  return { props };
};

export default NftDetail;
