import { TransactionDetails as Icon } from '@/assets/title-icons';
import Copy from '@/components/Copy';
import Title from '@/components/Layout/Title';
import Skeleton from '@/components/Skeleton';
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
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { xcode } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

interface INonceParams {
  collection: string;
  nonce: string;
  account: string;
}

const NftDetail: React.FC<IParsedAsset> = () => {
  const [params, setParams] = useState<null | INonceParams>(null);
  const [nonce, setNonce] = useState<null | IAsset>(null);
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      setParams(router.query as unknown as INonceParams);
    }
  }, [router.isReady]);

  useEffect(() => {
    if (params) {
      requestNonce();
    }
  }, [params]);

  const requestNonce = async () => {
    if (router.isReady) {
      const res: IAssetOne = await api.get({
        route: `assets/${params?.collection}/${params?.nonce}`,
      });
      if (!res.error || res.error == '') {
        setNonce(res.data?.asset);
      }
    }
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

  return (
    <>
      <Container>
        <Header>
          <Title
            title="NFT Details"
            Icon={Icon}
            route={
              params
                ? `/account/${params.account}/collection/${params.collection}`
                : '/'
            }
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
                {params ? (
                  <>
                    <span>{params.account}</span>
                    <Copy data={params.account} info="Address" />
                  </>
                ) : (
                  <Skeleton />
                )}
              </CenteredRow>
            </Row>
            <Row>
              <span>
                <strong>Collection</strong>
              </span>
              {nonce ? nonce.name : <Skeleton />}
            </Row>
            <Row>
              <span>
                <strong>Asset ID</strong>
              </span>
              {params ? (
                <span>
                  <p>{params.collection}</p>
                </span>
              ) : (
                <Skeleton />
              )}
            </Row>
            <Row>
              <span>
                <strong>Nonce</strong>
              </span>
              {params ? (
                <span>
                  <p>{params.nonce}</p>
                </span>
              ) : (
                <Skeleton />
              )}
            </Row>
            <Row>
              <span>
                <strong>Mime</strong>
              </span>
              {nonce ? (
                <span>
                  <p>{nonce?.mime || '--'}</p>
                </span>
              ) : (
                <Skeleton />
              )}
            </Row>
            {nonce?.metadata && !isJsonString(nonce.metadata) && (
              <Row>
                <span>
                  <strong>Metadata</strong>
                </span>
                <span>
                  <p>{nonce.metadata}</p>
                </span>
              </Row>
            )}
          </CardContent>

          {nonce?.metadata && isJsonString(nonce.metadata) && (
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
                    {JSON.stringify(JSON.parse(nonce.metadata), null, 2)}
                  </SyntaxHighlighter>
                </CardRaw>
              </CardContent>
            </>
          )}
        </CardContainer>
      </Container>
    </>
  );
};
export default NftDetail;
