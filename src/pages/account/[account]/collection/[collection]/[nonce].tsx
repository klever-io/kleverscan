import { TransactionDetails as Icon } from '@/assets/title-icons';
import Copy from '@/components/Copy';
import Title from '@/components/Layout/Title';
import api from '@/services/api';
import { IAsset, IAssetOne, IParsedAsset } from '@/types/index';
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

const NftDetail: React.FC<IParsedAsset> = ({
  assetId,
  name,
  metadata,
  mime,
  nonce,
  nonceOwner,
}) => {
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
          route={`/account/${nonceOwner}/collection/${assetId}`}
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
              <span>{nonceOwner}</span>
              <Copy data={nonceOwner} info="Address" />
            </CenteredRow>
          </Row>
          <Row>
            <span>
              <strong>Collection</strong>
            </span>
            {name}
          </Row>
          <Row>
            <span>
              <strong>Asset ID</strong>
            </span>
            <span>
              <p>{assetId}</p>
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
              <strong>Mime</strong>
            </span>
            <span>
              <p>{mime || '--'}</p>
            </span>
          </Row>
          {metadata && !isJsonString(metadata) && (
            <Row>
              <span>
                <strong>Metadata</strong>
              </span>
              <span>
                <p>{metadata}</p>
              </span>
            </Row>
          )}
        </CardContent>

        {metadata && isJsonString(metadata) && (
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
                  {JSON.stringify(JSON.parse(metadata), null, 2)}
                </SyntaxHighlighter>
              </CardRaw>
            </CardContent>
          </>
        )}
      </CardContainer>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps<IAsset> = async ({
  params,
}) => {
  const redirectProps = { redirect: { destination: '/404', permanent: false } };

  const assetId = params?.collection;
  const address = params?.account;
  const nonce = params?.nonce;
  if (!assetId || !address || !nonce) {
    return redirectProps;
  }

  const response: IAssetOne = await api.get({
    route: `assets/${assetId}/${nonce}`,
  });

  const props = response?.data?.asset;
  props['nonce'] = nonce;
  props['nonceOwner'] = address;

  if (response.error || !props) {
    return redirectProps;
  }

  return { props };
};

export default NftDetail;
