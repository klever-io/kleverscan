import Contract, { IContract } from '@/components/Contract';
import { getType } from '@/components/Contract/utils';
import { IAsset, ICollectionList } from '@/types';
import { ContractsIndex } from '@/types/contracts';
import { setQueryAndRouter } from '@/utils';
import { BASE_TX_SIZE } from '@/utils/globalVariables';
import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useMobile } from '../mobile';
import { useFees } from './fees';

export interface IQueue {
  elementId: number;
  contractName: string;
  ref: JSX.Element;
  metadata: string;
  contractType: string;
  collection?: ICollectionList;
  royaltiesFeeAmount?: number;
  ITOAssetId?: IAsset;
  collectionAssetId?: number;
}

interface IMulticontract {
  queue: IQueue[];
  selectedId: number;
  isMultiContract: boolean;
  selectedContractType: string;
  metadata: string;
  totalKappFees: number;
  totalBandwidthFees: number;
  totalFees: number;
  showMultiContracts: boolean;
  parsedIndex: number;
  isModal: boolean;
  addToQueue: () => void;
  removeContractQueue: (contractIndex: number, e: any) => void;
  editContract: (index: number) => void;
  resetForms: (defaultValues?: any) => void;
  setQueue: React.Dispatch<React.SetStateAction<IQueue[]>>;
  setSelectedId: React.Dispatch<React.SetStateAction<number>>;
  setIsMultiContract: React.Dispatch<React.SetStateAction<boolean>>;
  setShowMultiContracts: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedContractAndQuery: (contractType: string) => void;
  setMetadata: (metadata: string) => void;
  setCollection: (collection?: ICollectionList) => void;
  setSelectedRoyaltiesFees: (amount: number) => void;
  setCollectionAssetId: (id: number) => void;
  setIsModal: React.Dispatch<React.SetStateAction<boolean>>;
  clearQuery: () => void;
}

export const MultiContractContext = createContext({} as IMulticontract);

export const MulticontractProvider: React.FC = ({ children }) => {
  const [isMultiContract, setIsMultiContract] = useState<boolean>(false);
  const [queue, setQueue] = useState<IQueue[]>([]);
  const [selectedId, setSelectedId] = useState<number>(0);
  const [showMultiContracts, setShowMultiContracts] = useState<boolean>(false);
  const [isModal, setIsModal] = useState<boolean>(false);

  const indexRef = useRef<number>(0);

  const { getKappFee, bandwidthFeeMultiplier } = useFees();
  const { isTablet } = useMobile();

  const baseBandwidthFee = BASE_TX_SIZE * bandwidthFeeMultiplier;

  const totalKappFees = queue.reduce((acc, curr) => {
    return acc + getKappFee(curr.contractType);
  }, 0);

  const totalBandwidthFees = queue.reduce((acc, curr) => {
    return (
      acc + curr.metadata.length * bandwidthFeeMultiplier + baseBandwidthFee
    );
  }, 0);

  const totalFees = totalKappFees + totalBandwidthFees;

  const router = useRouter();

  const parsedIndex = queue.findIndex(item => item.elementId === selectedId);

  const selectedContractType = queue[parsedIndex]?.contractType;

  const setSelectedContractType = (contractType: string) => {
    if (queue.length === 0) return;

    if (contractType === undefined) return;

    const newQueue = [...queue];

    newQueue[parsedIndex].contractType = contractType;
    newQueue[parsedIndex].contractName = ContractsIndex[getType(contractType)];

    setQueue(newQueue);
  };

  const setSelectedRoyaltiesFees = (amount: number) => {
    if (queue.length === 0) return;

    if (amount === undefined) return;

    const newQueue = [...queue];
    if (newQueue[parsedIndex]) {
      newQueue[parsedIndex]['royaltiesFeeAmount'] = amount;
    }
    setQueue(newQueue);
  };

  const setCollectionAssetId = (id: number) => {
    if (queue.length === 0) return;

    if (id === undefined) return;

    const newQueue = [...queue];
    if (newQueue[parsedIndex]) {
      newQueue[parsedIndex]['collectionAssetId'] = id;
    }
    setQueue(newQueue);
  };

  const setSelectedContractAndQuery = (contract: string) => {
    setSelectedContractType(contract);

    if (contract !== '') {
      const newQuery = {
        contract: contract,
      };

      setQueryAndRouter(newQuery, router);
    }
  };

  const clearQuery = () => {
    delete router.query['contractDetails'];

    if (router.pathname === '/create-transaction') {
      setQueryAndRouter({ contract: selectedContractType }, router);
    } else {
      delete router.query['contract'];
      setQueryAndRouter({}, router);
    }
  };

  const metadata = queue[parsedIndex]?.metadata;

  const setMetadata = (metadata: string) => {
    const newQueue = [...queue];

    newQueue[parsedIndex].metadata = metadata;

    setQueue(newQueue);
  };

  const setCollection = (collection?: ICollectionList) => {
    const newQueue = [...queue];
    newQueue[parsedIndex].collection = collection;
    setQueue(newQueue);
  };

  const addToQueue = () => {
    try {
      const componentIndex = ++indexRef.current;
      const lastContract = queue[queue.length - 1];
      const contractPropsWithIndex = {
        elementId: componentIndex,
      };

      const newItem = {
        elementId: componentIndex,
        contractType: lastContract.contractType,
        contractName: lastContract.contractName,
        ref: <Contract {...contractPropsWithIndex} />,
        metadata: '',
      };

      setQueue([...queue, newItem]);
      setSelectedId(componentIndex);
    } catch (e: any) {
      toast.error(e.message ? e.message : e);
    }
  };

  const editContract = (elementId: any) => {
    setSelectedId(elementId);

    if (isTablet && showMultiContracts) {
      setShowMultiContracts(false);
    }
  };

  const removeContractQueue = (contractIndex: number, e: any) => {
    e.stopPropagation();

    if (queue.length > 1) {
      const newItems = queue.filter(item => item.elementId !== contractIndex);

      setQueue(newItems);
      if (contractIndex === selectedId) {
        setSelectedId(queue[newItems.length - 1].elementId);
      }
    }
  };

  const resetForms = (defaultValues?: any) => {
    const contractPropsWithIndex: IContract = {
      elementId: 0,
      defaultValues: JSON.parse(
        (router.query?.contractDetails as string) ||
          JSON.stringify(defaultValues || {}),
      ),
    };

    const selectedContractType =
      (router.query?.contract as string) || 'TransferContract';

    const contractTypeProps = {
      contractType: isMultiContract
        ? queue[0]?.contractType
        : selectedContractType,
      contractName: isMultiContract
        ? queue[0]?.contractName
        : ContractsIndex[getType(selectedContractType)],
    };

    setQueue([
      {
        elementId: 0,
        ref: <Contract {...contractPropsWithIndex} />,
        metadata: '',
        collection: queue[0]?.collection,
        royaltiesFeeAmount: queue[0]?.royaltiesFeeAmount,
        collectionAssetId: queue[0]?.collectionAssetId,
        ...contractTypeProps,
      },
    ]);
    setSelectedId(0);
  };

  useEffect(() => {
    if (router.isReady) resetForms();

    if (isMultiContract) {
      setQueryAndRouter({}, router);
    }
  }, [isMultiContract, router.isReady]);

  const values = {
    queue,
    selectedId,
    isMultiContract,
    selectedContractType,
    metadata,
    totalKappFees,
    totalBandwidthFees,
    totalFees,
    showMultiContracts,
    parsedIndex,
    isModal,
    addToQueue,
    editContract,
    removeContractQueue,
    resetForms,
    setQueue,
    setSelectedId,
    setIsMultiContract,
    setSelectedContractAndQuery,
    setMetadata,
    setShowMultiContracts,
    setCollection,
    setSelectedRoyaltiesFees,
    setCollectionAssetId,
    setIsModal,
    clearQuery,
  };

  return (
    <MultiContractContext.Provider value={values}>
      {children}
    </MultiContractContext.Provider>
  );
};

export const useMulticontract = (): IMulticontract =>
  useContext(MultiContractContext);
