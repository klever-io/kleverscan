import { PropsWithChildren } from 'react';
import { IMultisignData, IMultisignRawData } from '..';
import { ITransaction, web } from '@klever/sdk-web';
import api from '@/services/api';
import { Service } from '@/types';
import { toast } from 'react-toastify';
import {
  ButtonContainer,
  ButtonsContainerApi,
  DragContainer,
  ImportJsonButton,
  MultisignButton,
} from '../../styles';
interface IMultisignButtons {
  setSignBcastTransaction: React.Dispatch<React.SetStateAction<boolean>>;
  multiSignData: IMultisignData;
  multiSignDataRef: IMultisignData[];
  setTxHash: React.Dispatch<React.SetStateAction<string | null>>;
  draggingOverlayCount: number;
  setDragginOverlayCount: React.Dispatch<React.SetStateAction<number>>;
  setSelectedHash: React.Dispatch<React.SetStateAction<string>>;
  refetchMultisignData: () => void;
}

export const ButtonsComponent: React.FC<
  PropsWithChildren<IMultisignButtons>
> = ({
  setSignBcastTransaction,
  multiSignData,
  setTxHash,
  draggingOverlayCount,
  setDragginOverlayCount,
  setSelectedHash,
  multiSignDataRef,
  refetchMultisignData,
}) => {
  const multisignTotalWeight =
    multiSignData?.signers?.filter(e => e.signed)?.length || 0;

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
    multiSignDataRef?: IMultisignData[],
  ) => {
    const parsedValue = JSON.parse(value);
    try {
      const res = await api.post({
        route: 'transaction/decode',
        body: parsedValue,
        service: Service.NODE,
      });
      if (!res.error) {
        const tx = res.data.tx;
        setSelectedHash(tx.hash);
        multiSignDataRef &&
          multiSignDataRef.push({
            decodedTx: tx,
            raw: parsedValue as unknown as IMultisignRawData,
            hash: tx.hash,
            address: tx.sender,
            signers: [],
            Threshold: 0,
            error: null,
            fromJSON: true,
          });

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
    multiSignDataRef?: IMultisignData[],
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
          handleDecodeRequest(result, setSelectedHash, multiSignDataRef);
        }
      };
      reader.readAsText(file);
    }
  };

  const preventEvent = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const processFile = (
    event: any,
    isDrop: boolean,
    setSelectedHash: React.Dispatch<React.SetStateAction<string>>,
    multiSignDataRef?: IMultisignData[],
  ) => {
    preventEvent(event);

    const files = isDrop ? event.dataTransfer.files : event.target.files;

    readFile(files, setSelectedHash, multiSignDataRef);
  };

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

        if (multiSignData?.fromJSON) {
          const decodedTxRes = await api.post({
            route: 'transaction/decode',
            body: parsedWithSignatures,
            service: Service.NODE,
          });

          multiSignDataRef.map((data: IMultisignData) => {
            if (data.hash === multiSignData?.hash) {
              data.raw = parsedWithSignatures as unknown as IMultisignRawData;
              data.decodedTx = decodedTxRes.data.tx;
            }
            return data;
          });
        } else {
          const multiSignRes: any = await api.post({
            route: 'transaction',
            service: Service.MULTISIGN,
            body: parseMultisignTransaction,
          });

          if (multiSignRes.error) {
            toast.error(multiSignData?.error);
            return;
          }

          refetchMultisignData();
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
        let broadcastRes;
        if (multiSignData?.fromJSON) {
          broadcastRes = await web.broadcastTransactions([
            multiSignData?.raw as ITransaction,
          ]);
        } else {
          broadcastRes = await api.post({
            route: `broadcast/${multiSignData.hash}`,
            service: Service.MULTISIGN,
          });
        }

        if (broadcastRes.error) {
          toast.error(broadcastRes.error);
          return;
        }
        toast.success('Transaction broadcast successfully');
        setTxHash(multiSignData.hash);
        window.scrollTo(0, 0);
        refetchMultisignData();
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
        {multiSignData.hash && (
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
        )}
        <ButtonContainer>
          {multiSignData.hash && (
            <MultisignButton
              isJsonButton
              type="button"
              onClick={handleDownload}
            >
              Download JSON file
            </MultisignButton>
          )}
          <DragContainer
            onDragOver={preventEvent}
            onDrop={(event: any) => processFile(event, true, setSelectedHash)}
            onChange={(event: any) =>
              processFile(event, false, setSelectedHash, multiSignDataRef)
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
