import Filter from '@/components/Filter';
import Tooltip from '@/components/Tooltip';
import { FilterContainer } from '@/components/TransactionsFilters/styles';
import { getRawTxTheme, OverviewDetails } from '@/pages/transaction/[hash]';
import api from '@/services/api';
import { CardContent, CardHeader, CardHeaderItem } from '@/styles/common';
import { Service } from '@/types';
import { getPrecision } from '@/utils/precisionFunctions';
import {
  PassThresholdContainer,
  ProgressBar,
  ProgressBarContent,
  ProgressBarVotes,
} from '@/views/proposals/detail';
import {
  CardContainer,
  CardRaw,
  DivDataJson,
} from '@/views/transactions/detail';
import { ITransaction, web } from '@klever/sdk-web';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { IMultisignData } from '.';
import {
  ButtonContainer,
  ButtonsContainerApi,
  DragContainer,
  EmptyMultisign,
  ImportJsonButton,
  MultiSigList,
  MultisignButton,
} from '../styles';

const ReactJson = dynamic(import('react-json-view'), { ssr: false });

interface IMultisignList {
  hashs: string[];
  selectedHash: string;
  setSelectedHash: React.Dispatch<React.SetStateAction<string>>;
}

interface IMultisignOverview {
  multiSignData: IMultisignData;
  loading: boolean;
  MultiSignList: React.FC<IMultisignList>;
  hashs: string[];
  selectedHash: string;
  setSelectedHash: React.Dispatch<React.SetStateAction<string>>;
}

interface IMultisignButtons {
  setSignBcastTransaction: React.Dispatch<React.SetStateAction<boolean>>;
  multiSignData: IMultisignData;
  setTxHash: React.Dispatch<React.SetStateAction<string | null>>;
  draggingOverlayCount: number;
  setDragginOverlayCount: React.Dispatch<React.SetStateAction<number>>;
  setSelectedHash: React.Dispatch<React.SetStateAction<string>>;
}

interface IDecodedRawData {
  multiSignData: IMultisignData;
  isDarkTheme: boolean;
}

const addNewSignatures = (
  signedTx: ITransaction,
  raw: ITransaction,
): ITransaction => {
  const JSONContractFile = raw;
  if (JSONContractFile?.Signature?.[0]) {
    JSONContractFile?.Signature.push(signedTx?.Signature[0]);
    return JSONContractFile;
  }
  return signedTx;
};

const preventEvent = (event: any) => {
  event.preventDefault();
  event.stopPropagation();
};

const processFile = (
  event: any,
  isDrop: boolean,
  setSelectedHash: React.Dispatch<React.SetStateAction<string>>,
) => {
  preventEvent(event);

  const files = isDrop ? event.dataTransfer.files : event.target.files;

  readFile(files, setSelectedHash);
};

const handleDragEnter = (
  event: React.DragEvent<HTMLDivElement>,
  draggingOverlayCount: number,
  setDragginOverlayCount: React.Dispatch<React.SetStateAction<number>>,
) => {
  preventEvent(event);

  let count = draggingOverlayCount;
  count++;

  setDragginOverlayCount(count);
};

const handleDragLeave = (
  event: React.DragEvent<HTMLDivElement>,
  draggingOverlayCount: number,
  setDragginOverlayCount: React.Dispatch<React.SetStateAction<number>>,
) => {
  preventEvent(event);

  let count = draggingOverlayCount;
  count--;

  setDragginOverlayCount(count);
};

const handleDecodeRequest = async (
  value: string,
  setSelectedHash: React.Dispatch<React.SetStateAction<string>>,
) => {
  const parsedValue = JSON.parse(value);
  try {
    const res = await api.post({
      route: 'transaction/decode',
      body: parsedValue,
      service: Service.NODE,
    });
    if (!res.error) {
      setSelectedHash(res.data.tx.hash);
      toast.success('Decode successful!');
    }
  } catch (e) {
    toast.error('Error while decoding, please try again.', {
      toastId: 'forbid duplicating',
    });
  }
};

const validateJson = (jsonFile: string) => {
  if (typeof jsonFile !== 'string') {
    return false;
  }
  let parsedJson;
  try {
    parsedJson = JSON.parse(jsonFile);
  } catch (error) {
    toast.error('Cannot parse Json.');
  }
  const sender = parsedJson?.RawData?.Sender;
  const contract = parsedJson?.RawData?.Contract;
  if (!sender || !contract || contract.length === 0 || contract[0] === null) {
    return false;
  }
  return true;
};

const readFile = (
  files: FileList,
  setSelectedHash: React.Dispatch<React.SetStateAction<string>>,
) => {
  if (files && files.length > 0) {
    const file = files[0];
    const fileExtension = /[^.]+$/.exec(file.name)![0];

    if (fileExtension !== 'json') {
      toast.error('Invalid file format.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      let result = e.target?.result;
      if (typeof result !== 'string') {
        result = '';
      }
      const validation = validateJson(result);
      if (!validation) {
        toast.error('The JSON data is malformed or incorrect');
      } else {
        handleDecodeRequest(result, setSelectedHash);
      }
    };
    reader.readAsText(file);
  }
};

export const MultiSignList: React.FC<IMultisignList> = ({
  hashs,
  selectedHash,
  setSelectedHash,
}) => {
  const items = [
    {
      title: 'Transactions hash',
      data: hashs || 'None',
      onClick: (selected: string) => setSelectedHash(selected),
      current: selectedHash,
      loading: false,
      maxWidth: true,
    },
  ];

  return (
    <MultiSigList>
      <FilterContainer>
        {items.map(filter => (
          <Filter key={JSON.stringify(filter)} {...filter} />
        ))}
      </FilterContainer>
    </MultiSigList>
  );
};

export const OverviewInfo: React.FC<IMultisignOverview> = ({
  multiSignData,
  loading,
  MultiSignList,
  hashs,
  selectedHash,
  setSelectedHash,
}) => {
  const [precision, SetPrecision] = useState(6);

  useEffect(() => {
    const fetchPrecision = async () => {
      if (multiSignData?.decodedTx?.kdaFee?.kda) {
        const responsePrecision = await getPrecision(
          multiSignData?.decodedTx?.kdaFee?.kda || 'KLV',
        );
        SetPrecision(responsePrecision);
      }
    };
    fetchPrecision();
  }, []);

  const multisignTotalWeight =
    multiSignData?.signers?.filter(e => e.signed)?.length || 0;
  const thresholdPercentage =
    (multisignTotalWeight / (multiSignData?.Threshold ?? 0)) * 100;

  const Progress: React.FC = () => {
    return (
      <ProgressBar>
        <ProgressBarContent
          widthPercentage={String(thresholdPercentage)}
          background={'#B039BF'}
        />
      </ProgressBar>
    );
  };
  const ThresholdComponent: React.FC = () => {
    return (
      <>
        <ProgressBarVotes width={'60%'} noMarginBottom>
          <PassThresholdContainer>
            <Progress />
          </PassThresholdContainer>
        </ProgressBarVotes>
        <span>
          {multisignTotalWeight}/{multiSignData?.Threshold ?? 0}
        </span>
        <Tooltip msg="The transaction below isn't processed yet, it must achieve the threshold" />
      </>
    );
  };

  const multiSignListProps = {
    hashs,
    selectedHash,
    setSelectedHash,
  };

  const overviewProps = {
    hash: multiSignData?.hash,
    nonce: multiSignData?.decodedTx?.nonce,
    sender: multiSignData?.decodedTx?.sender,
    bandwidthFee: multiSignData?.decodedTx?.bandwidthFee,
    kdaFee: {
      amount:
        multiSignData?.decodedTx?.kdaFee?.amount ||
        multiSignData?.decodedTx?.kAppFee,
      kda: multiSignData?.decodedTx?.kdaFee?.kda || 'KLV',
    },
    signature: multiSignData?.raw?.Signature,
    ThresholdComponent,
    precisionTransaction: precision,
    loading: loading,
    MultiSignList: () => <MultiSignList {...multiSignListProps} />,
  };

  return <OverviewDetails {...overviewProps} />;
};

export const DecodedRawData: React.FC<IDecodedRawData> = ({
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

export const ButtonsComponent: React.FC<IMultisignButtons> = ({
  setSignBcastTransaction,
  multiSignData,
  setTxHash,
  draggingOverlayCount,
  setDragginOverlayCount,
  setSelectedHash,
}) => {
  const multisignTotalWeight =
    multiSignData?.signers?.filter(e => e.signed)?.length || 0;
  const handleSign = async () => {
    setSignBcastTransaction(true);
    try {
      if (multiSignData?.raw) {
        const buildedTx = { ...multiSignData?.raw };
        const signedTx = await web.signTransaction(buildedTx);
        const parsedWithSignatures = addNewSignatures(
          signedTx,
          multiSignData?.raw,
        );

        const parseMultisignTransaction = {
          hash: multiSignData?.hash,
          address: multiSignData?.address,
          raw: parsedWithSignatures,
        };

        const multiSignRes: any = await api.post({
          route: 'transaction',
          service: Service.MULTISIGN,
          body: parseMultisignTransaction,
        });

        if (multiSignRes.error) {
          toast.error(multiSignData?.error);
          return;
        }

        toast.success('Transaction signed successfully');
      }
    } catch (error) {
      toast.error('Something went wrong, please try again');
    } finally {
      setSignBcastTransaction(false);
    }
  };

  const handleBroadcast = async () => {
    setSignBcastTransaction(true);
    try {
      if (multiSignData?.raw) {
        const multiSignRes = await api.post({
          route: `broadcast/${multiSignData.hash}`,
          service: Service.MULTISIGN,
        });

        if (multiSignRes.error) {
          toast.error(multiSignRes.error);
          return;
        }
        toast.success('Transaction broadcast successfully');
        setTxHash(multiSignData.hash);
        window.scrollTo(0, 0);
      }
    } catch (error) {
      toast.error('Something went wrong, please try again');
    } finally {
      setSignBcastTransaction(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(multiSignData?.raw)], {
      type: 'application/json',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${multiSignData?.address} - Nonce: ${multiSignData?.raw.RawData.Nonce}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
    toast.success(
      'Transaction built and signed, send the file to the co-owner(s)',
    );
  };

  return (
    <>
      <ButtonsContainerApi>
        <ButtonContainer>
          <MultisignButton onClick={handleSign} type="button">
            Sign Transaction
          </MultisignButton>
          <MultisignButton
            onClick={handleBroadcast}
            disabled={multisignTotalWeight < (multiSignData?.Threshold ?? 0)}
            type="button"
          >
            Broadcast Transaction
          </MultisignButton>
        </ButtonContainer>
        <ButtonContainer>
          <MultisignButton isJsonButton type="button" onClick={handleDownload}>
            Download JSON file
          </MultisignButton>
          <DragContainer
            onDragOver={preventEvent}
            onDrop={(event: any) => processFile(event, true, setSelectedHash)}
            onChange={(event: any) =>
              processFile(event, false, setSelectedHash)
            }
            onDragEnter={event => {
              handleDragEnter(
                event,
                draggingOverlayCount,
                setDragginOverlayCount,
              );
            }}
            onDragLeave={event => {
              handleDragLeave(
                event,
                draggingOverlayCount,
                setDragginOverlayCount,
              );
            }}
            isHidden
          >
            <input type="file" accept=".json" id="import-json" />
          </DragContainer>
          <ImportJsonButton htmlFor="import-json">
            Import Signed JSON file
          </ImportJsonButton>
        </ButtonContainer>
      </ButtonsContainerApi>
    </>
  );
};

export const EmptyTransaction: React.FC<{ msg: string }> = ({ msg }) => {
  return <EmptyMultisign>{msg}</EmptyMultisign>;
};
