import { Button } from '@/components/CreateTxShortCut/styles';
import { getRawTxTheme } from '@/pages/transaction/[hash]';
import { ISftAsset } from '@/types';
import { AssetCardContent } from '@/views/assets';
import { Row } from '@/views/assets/detail';
import { CardRaw } from '@/views/transactions/detail';
import dynamic from 'next/dynamic';
import { PropsWithChildren, useMemo, useState } from 'react';
import { useTheme } from 'styled-components';

interface INonceDetails {
  sft: (ISftAsset & { nonce?: string }) | undefined;
}

export const SftMetadata: React.FC<PropsWithChildren<INonceDetails>> = ({
  sft,
}) => {
  const [showRawData, setShowRawData] = useState(false);
  const { isDarkTheme } = useTheme();

  const ReactJson = useMemo(
    () =>
      dynamic(() => import('react-json-view').then(mod => mod.default), {
        ssr: false,
      }),
    [],
  );

  const RawDataComponent: React.FC<PropsWithChildren> = () => {
    return (
      <>
        <CardRaw>
          <ReactJson
            src={sft?.meta ?? {}}
            name={false}
            displayObjectSize={false}
            enableClipboard={true}
            displayDataTypes={false}
            theme={getRawTxTheme(isDarkTheme)}
          />
        </CardRaw>
      </>
    );
  };

  return (
    <AssetCardContent>
      {sft?.meta && (
        <Row span={2}>
          <span>
            <strong>Metadata</strong>
          </span>
          <CardRaw>
            <RawDataComponent />
            <Button
              onClick={() => setShowRawData(!showRawData)}
              style={{ marginBottom: '1rem' }}
            >
              {showRawData ? 'Collapse' : 'Expand'}
            </Button>
          </CardRaw>
        </Row>
      )}
      {sft?.meta?.metadata?.contentType && (
        <Row span={2}>
          <span>
            <strong>Mime</strong>
          </span>
          <span>
            <p>{sft?.meta?.metadata?.contentType || '--'}</p>
          </span>
        </Row>
      )}
    </AssetCardContent>
  );
};
