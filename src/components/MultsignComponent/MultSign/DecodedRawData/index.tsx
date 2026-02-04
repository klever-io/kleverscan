import { PropsWithChildren } from 'react';
import { IMultisignData } from '..';
import {
  CardContainer,
  CardRaw,
  DivDataJson,
} from '@/views/transactions/detail';
import { CardContent, CardHeader, CardHeaderItem } from '@/styles/common';
import dynamic from 'next/dynamic';
import { getRawTxTheme } from '@/pages/transaction/[hash]';

interface IDecodedRawData {
  multiSignData: IMultisignData;
  isDarkTheme: boolean;
}

const ReactJson = dynamic(
  () => import('@microlink/react-json-view').then(mod => mod.default),
  { ssr: false },
);

export const DecodedRawData: React.FC<PropsWithChildren<IDecodedRawData>> = ({
  multiSignData,
  isDarkTheme,
}) => {
  const decodedTx = multiSignData?.decodedTx;

  return (
    <>
      <CardContainer>
        <CardHeader>
          <CardHeaderItem selected={true}>
            <span>Raw Tx</span>
          </CardHeaderItem>
        </CardHeader>
        <CardContent>
          <CardRaw>
            <DivDataJson>
              <ReactJson
                src={decodedTx}
                name={false}
                displayObjectSize={false}
                enableClipboard={true}
                displayDataTypes={false}
                theme={getRawTxTheme(isDarkTheme)}
              />
            </DivDataJson>
          </CardRaw>
        </CardContent>
      </CardContainer>
    </>
  );
};
