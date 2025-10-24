import { PropsWithChildren, useState } from 'react';
import { Button } from '@/components/CreateTxShortCut/styles';
import Copy from '@/components/Copy';
import Skeleton from '@/components/Skeleton';
import { IAsset, IParsedAsset } from '@/types';
import { Row } from '@/views/assets/detail';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { xcode } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import { CenteredRow } from '@/styles/common';
import { CardRaw } from '@/views/transactions/detail';

interface INonceDetails {
  nonce: (IAsset & { nonce?: string }) | undefined;
  holderAddress?: string;
  isLoading: boolean;
  showAddress?: boolean;
}

const isJsonString = (metadata: string) => {
  try {
    JSON.parse(metadata);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const NonceDetails: React.FC<PropsWithChildren<INonceDetails>> = ({
  nonce,
  holderAddress,
  isLoading,
  showAddress = true,
}) => {
  const [showRawData, setShowRawData] = useState(false);

  const RawDataComponent: React.FC<PropsWithChildren> = () => {
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
      {showAddress && holderAddress && (
        <Row span={2}>
          <span>
            <strong>Holder</strong>
          </span>
          <CenteredRow>
            {holderAddress ? (
              <>
                <span>{holderAddress}</span>
                <Copy data={holderAddress} info="Address" />
              </>
            ) : (
              <Skeleton />
            )}
          </CenteredRow>
        </Row>
      )}
      <Row>
        <span>
          <strong>Asset ID</strong>
        </span>
        {!isLoading ? (
          <span>
            <p>{nonce?.assetId}</p>
          </span>
        ) : (
          <Skeleton />
        )}
      </Row>
      <Row>
        <span>
          <strong>Nonce</strong>
        </span>
        {!isLoading ? (
          <span>
            <p>{nonce?.nonce}</p>
          </span>
        ) : (
          <Skeleton />
        )}
      </Row>
      <Row span={2}>
        <span>
          <strong>Collection</strong>
        </span>
        <span>{!isLoading ? nonce?.name : <Skeleton />}</span>
      </Row>
      {nonce?.mime && (
        <Row>
          <span>
            <strong>Mime</strong>
          </span>
          <span>
            <p>{nonce?.mime || '--'}</p>
          </span>
        </Row>
      )}
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
      {nonce?.metadata && isJsonString(nonce.metadata) && (
        <CardRaw>
          <Button
            onClick={() => setShowRawData(!showRawData)}
            style={{ marginBottom: '1rem' }}
          >
            {showRawData ? 'Collapse' : 'Expand'}
          </Button>
          <RawDataComponent />
        </CardRaw>
      )}
    </>
  );
};
