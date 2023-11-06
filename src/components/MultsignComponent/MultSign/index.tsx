import { LoadingBackground } from '@/components/Contract/styles';
import { Loader } from '@/components/Loader/styles';
import { useExtension } from '@/contexts/extension';
import { useTheme } from '@/contexts/theme';
import {
  requestDecoded,
  requestMultisign,
} from '@/services/requests/multisign';
import { ITransaction as ITransactionDecoded } from '@/types/index';
import { useDidUpdateEffect } from '@/utils/hooks';
import { ITransaction } from '@klever/sdk-web';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useQuery } from 'react-query';
import { Content } from '../styles';
import {
  ButtonsComponent,
  DecodedRawData,
  EmptyTransaction,
  MultiSignList,
  OverviewInfo,
} from './components';

interface IMultisignSigenrers {
  address: string;
  weight: number;
  signed: boolean;
}

interface IMultisignRawData extends Omit<ITransaction, 'RawData.PermissionID'> {
  hash: string;
}
export interface IMultisignData {
  hash: string;
  address: string;
  signers: IMultisignSigenrers[];
  Threshold: number;
  raw: IMultisignRawData;
  decodedTx: ITransactionDecoded;
  error?: any;
}

const MultisignComponent: React.FC<{
  setTxHash: React.Dispatch<React.SetStateAction<string | null>>;
}> = ({ setTxHash }) => {
  const [selectedHash, setSelectedHash] = useState<string>('');
  const [signBcastTransaction, setSignBcastTransaction] = useState(false);
  const [draggingOverlayCount, setDragginOverlayCount] = useState(0);

  const { extensionInstalled, connectExtension, walletAddress } =
    useExtension();

  const { isDarkTheme } = useTheme();

  useDidUpdateEffect(() => {
    if (extensionInstalled) {
      connectExtension();
    }
  }, [extensionInstalled]);

  const { data: multiSignData, isFetching: loading } = useQuery({
    queryKey: ['multiSignData'],
    queryFn: () => requestMultisign(walletAddress),
    initialData: [] as IMultisignData[],
    enabled: !!walletAddress,
  });

  const { data: decodedData } = useQuery({
    queryKey: ['decodedData', selectedHash],
    queryFn: () =>
      requestDecoded({
        RawData: {
          ...multiSignData?.find((e: IMultisignData) => e.hash === selectedHash)
            .raw?.RawData,
        },
      }),
    initialData: {},
    enabled: !!walletAddress,
  });

  useEffect(() => {
    setSelectedHash(multiSignData[0]?.hash);
  }, [multiSignData]);

  const overviewInfoProps = {
    multiSignData: {
      ...(multiSignData?.find((e: IMultisignData) => e.hash === selectedHash) ||
        multiSignData[0]),
      decodedTx: decodedData,
    },
    hashs: multiSignData?.map((e: IMultisignData) => e.hash),
    loading,
    MultiSignList,
    selectedHash,
    setSelectedHash,
  };

  const buttonsProps = {
    setSignBcastTransaction,
    multiSignData: {
      ...multiSignData[0],
      decodedTx: decodedData,
    },
    setTxHash,
    draggingOverlayCount,
    setDragginOverlayCount,
    setSelectedHash,
  };

  const decodedRawProps = {
    multiSignData: {
      ...multiSignData[0],
      decodedTx: decodedData,
    },
    isDarkTheme,
  };

  const RenderMultisignComponent: React.FC = () => {
    if (!!!walletAddress) {
      return (
        <EmptyTransaction
          msg={'To view multisign transactions, please connect your wallet'}
        />
      );
    }

    if (walletAddress && !loading && !multiSignData.length) {
      return (
        <EmptyTransaction
          msg={'There are no pending transactions with multisignatures'}
        />
      );
    }
    return <OverviewInfo {...overviewInfoProps} />;
  };

  return (
    <Content $loading={false}>
      {signBcastTransaction &&
        ReactDOM.createPortal(
          <LoadingBackground>
            <Loader />
          </LoadingBackground>,
          window.document.body,
        )}
      <RenderMultisignComponent />
      {!!walletAddress && multiSignData.length && (
        <>
          <ButtonsComponent {...buttonsProps} />
          <DecodedRawData {...decodedRawProps} />
        </>
      )}
    </Content>
  );
};

export default MultisignComponent;
