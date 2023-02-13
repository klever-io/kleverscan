import ContractComponent from '@/components/Contract';
import { getType } from '@/components/Contract/utils';
import { ISection } from '@/components/Form';
import api from '@/services/api';
import { ContractsIndex } from '@/types/contracts';
import { ICollectionList, IKAssets } from '@/types/index';
import { useRouter } from 'next/router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useExtension } from '../extension';

interface IQueue {
  elementIndex: number;
  contract: string;
  ref: JSX.Element;
}

export interface IFormsData {
  data: any;
  contractType: string;
  typeAssetTrigger: number | null;
}

interface IContractContext {
  ITOBuy: boolean;
  tokenChosen: boolean;
  claimType: number;
  buyLabel: string;
  contractType: string;
  formSections: ISection[];
  ownerAddress: string;
  claimLabel: string;
  queue: IQueue[];
  isMultiContract: boolean;
  selectedIndex: number;
  formsData: IFormsData[];
  selectedBucket: string;
  proposalId: number | null;
  collection: any;
  binaryOperations: any;
  assetID: number;
  buyKey: number;
  txLoading: boolean;
  showAdvancedOpts: boolean;
  txHash: string | null;
  assetsList: ICollectionList[] | null;
  kassetsList: IKAssets[];
  proposals: any;
  paramsList: any;
  showMultiContracts: boolean;
  showPayload: boolean;
  isMultisig: boolean;
  setITOBuy: React.Dispatch<React.SetStateAction<boolean>>;
  setTokenChosen: React.Dispatch<React.SetStateAction<boolean>>;
  setClaimType: React.Dispatch<React.SetStateAction<number>>;
  setBuyLabel: React.Dispatch<React.SetStateAction<string>>;
  setContractType: React.Dispatch<React.SetStateAction<string>>;
  setFormSections: React.Dispatch<React.SetStateAction<ISection[]>>;
  setOwnerAddress: React.Dispatch<React.SetStateAction<string>>;
  setClaimLabel: React.Dispatch<React.SetStateAction<string>>;
  setQueue: React.Dispatch<React.SetStateAction<any>>;
  setIsMultiContract: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
  setFormsData: React.Dispatch<React.SetStateAction<any>>;
  setSelectedBucket: React.Dispatch<React.SetStateAction<string>>;
  setProposalId: React.Dispatch<React.SetStateAction<number | null>>;
  setCollection: React.Dispatch<React.SetStateAction<any>>;
  setBinaryOperations: React.Dispatch<React.SetStateAction<any>>;
  setAssetID: React.Dispatch<React.SetStateAction<number>>;
  setBuyKey: React.Dispatch<React.SetStateAction<number>>;
  setTxLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAdvancedOpts: React.Dispatch<React.SetStateAction<boolean>>;
  setTxHash: React.Dispatch<React.SetStateAction<string | null>>;
  setAssetsLists: React.Dispatch<
    React.SetStateAction<ICollectionList[] | null>
  >;
  setKAssetsList: React.Dispatch<React.SetStateAction<IKAssets[]>>;
  setProposals: React.Dispatch<React.SetStateAction<any>>;
  setParamsList: React.Dispatch<React.SetStateAction<any>>;
  setShowMultiContracts: React.Dispatch<React.SetStateAction<boolean>>;
  setShowPayload: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMultisig: React.Dispatch<React.SetStateAction<boolean>>;
  getAssets: () => void;
  addToQueue: () => void;
  resetForms: () => void;
}

export const Contract = createContext({} as IContractContext);
export const ContractProvider: React.FC = ({ children }) => {
  const [ITOBuy, setITOBuy] = useState(false);
  const [tokenChosen, setTokenChosen] = useState(false);
  const [claimType, setClaimType] = useState(0);
  const [buyLabel, setBuyLabel] = useState('Order ID');
  const [contractType, setContractType] = useState('');
  const [formSections, setFormSections] = useState<ISection[]>([]);
  const [ownerAddress, setOwnerAddress] = useState('');
  const [claimLabel, setClaimLabel] = useState('Asset ID');
  const [isMultiContract, setIsMultiContract] = useState<boolean>(false);
  const [queue, setQueue] = useState<IQueue[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [formsData, setFormsData] = useState<IFormsData[]>([]);
  const [selectedBucket, setSelectedBucket] = useState<any>([]);
  const [proposalId, setProposalId] = useState<number | null>(null);
  const [collection, setCollection] = useState<any>({});
  const [binaryOperations, setBinaryOperations] = useState([]);
  const [assetID, setAssetID] = useState(0);
  const [buyKey, setBuyKey] = useState(0);
  const [txLoading, setTxLoading] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [showAdvancedOpts, setShowAdvancedOpts] = useState(false);
  const [showPayload, setShowPayload] = useState(false);
  const [isMultisig, setIsMultisig] = useState(false);
  const [assetsList, setAssetsLists] = useState<ICollectionList[] | null>(null);
  const [kassetsList, setKAssetsList] = useState<IKAssets[]>([]);
  const [proposals, setProposals] = useState<any>([]);
  const [paramsList, setParamsList] = useState<any>([]);
  const [showMultiContracts, setShowMultiContracts] = useState<boolean>(false);

  const { logoutExtension } = useExtension();
  const router = useRouter();

  const getKAssets = async (address: string) => {
    const response: any = await api.get({
      route: `assets/kassets`,
      query: {
        owner: address,
        limit: 10000,
      },
    });
    if (response.error) return;

    const list: IKAssets[] = [];

    if (response?.data?.assets?.length > 0) {
      response.data.assets.forEach((item: any) => {
        list.push({
          label: item.assetId,
          value: item.assetId,
          properties: item.properties,
          isNFT: item.assetType !== 'Fungible',
          isPaused: item.attributes.isPaused,
        });
      });

      setKAssetsList([...list]);
    }
  };

  useEffect(() => {
    if (txHash) {
      window.scrollTo(0, 0);
    }
  }, [txHash]);

  const getAssets = async () => {
    if (typeof window !== 'undefined') {
      const address = sessionStorage.getItem('walletAddress') || '';

      if (address === '' && router.pathname === '/create-transaction') {
        logoutExtension();
        toast.error('Please connect your wallet to create a transaction');
        router.push('/');
        return;
      }

      getKAssets(address);

      const account: any = await api.get({
        route: `address/${address}`,
      });

      if (
        !account?.data?.account?.assets &&
        account?.data?.account?.balance === 0
      ) {
        setAssetsLists([]);
        return;
      }

      const accountData = account?.data?.account
        ? account.data.account
        : {
            assets: [],
            frozenBalance: 0,
            balance: 0,
          };

      const { assets, frozenBalance, balance } = accountData;
      const list: ICollectionList[] = [];
      const addAssetsInfo = Object.keys(assets).map(async item => {
        const assetInfo: any = await api.get({
          route: `assets/${item}`,
        });

        const minEpochsToWithdraw =
          assetInfo.data?.asset?.staking?.minEpochsToWithdraw;
        const ownerAddress = assetInfo.data?.asset?.ownerAddress;
        const { assetType, frozenBalance, balance, precision, buckets } =
          account.data.account.assets[item];

        list.push({
          label: item,
          value: item,
          isNFT: assetType === 1,
          balance,
          frozenBalance,
          precision,
          buckets,
          minEpochsToWithdraw: minEpochsToWithdraw ? minEpochsToWithdraw : null,
          ownerAddress,
        });
      });

      await Promise.all(addAssetsInfo);

      if (!Object.keys(assets).includes('KLV') && balance !== 0) {
        const assetInfo: any = await api.get({
          route: `assets/KLV`,
        });

        const minEpochsToWithdraw =
          assetInfo.data?.asset?.staking?.minEpochsToWithdraw;

        list.push({
          label: 'KLV',
          value: 'KLV',
          isNFT: false,
          balance,
          frozenBalance: frozenBalance ? frozenBalance : 0,
          precision: 6,
          buckets: [],
          minEpochsToWithdraw: minEpochsToWithdraw ? minEpochsToWithdraw : null,
        });
      }
      list.sort((a, b) => (a.label > b.label ? 1 : -1));

      const KLV = list.splice(
        list.indexOf(
          list.find(item => item.label === 'KLV') as ICollectionList,
        ),
        1,
      );

      const KFI = list.splice(
        list.indexOf(
          list.find(item => item.label === 'KFI') as ICollectionList,
        ),
        1,
      );

      setAssetsLists([...KLV, ...KFI, ...list]);
    }
  };

  useEffect(() => {
    getAssets();
  }, []);

  const contractProps = {
    contractType,
    setContractType,
    assetsList: assetsList,
    proposalsList: proposals,
    paramsList: paramsList,
    getAssets: getAssets,
    kAssets: kassetsList,
  };

  const addToQueue = () => {
    try {
      const componenetIndex = queue[queue.length - 1].elementIndex + 1;
      const contractPropsWithIndex = {
        ...contractProps,
        elementIndex: componenetIndex,
      };
      setQueue([
        ...queue,
        {
          elementIndex: componenetIndex,
          contract: ContractsIndex[getType(contractType)],
          ref: <ContractComponent {...contractPropsWithIndex} />,
        },
      ]);
      setSelectedIndex(componenetIndex);
    } catch (e: any) {
      toast.error(e.message ? e.message : e);
    }
  };

  const resetForms = () => {
    const contractPropsWithIndex = {
      ...contractProps,
      elementIndex: 0,
    };
    setQueue([
      {
        elementIndex: 0,
        contract: ContractsIndex[getType(contractType)],
        ref: <ContractComponent {...contractPropsWithIndex} />,
      },
    ]);
    setFormsData([]);
    setSelectedIndex(0);
    setTxLoading(false);
    setTxHash('');
  };

  useEffect(() => {
    resetForms();
  }, [isMultiContract, contractType]);

  const values: IContractContext = {
    ITOBuy,
    setITOBuy,
    tokenChosen,
    setTokenChosen,
    claimType,
    setClaimType,
    buyLabel,
    setBuyLabel,
    contractType,
    setContractType,
    formSections,
    setFormSections,
    ownerAddress,
    setOwnerAddress,
    claimLabel,
    setClaimLabel,
    queue,
    setQueue,
    isMultiContract,
    setIsMultiContract,
    selectedIndex,
    setSelectedIndex,
    formsData,
    setFormsData,
    selectedBucket,
    setSelectedBucket,
    proposalId,
    setProposalId,
    collection,
    setCollection,
    binaryOperations,
    setBinaryOperations,
    assetID,
    setAssetID,
    buyKey,
    setBuyKey,
    txLoading,
    setTxLoading,
    txHash,
    setTxHash,
    showAdvancedOpts,
    setShowAdvancedOpts,
    assetsList,
    setAssetsLists,
    kassetsList,
    setKAssetsList,
    proposals,
    setProposals,
    paramsList,
    setParamsList,
    getAssets,
    addToQueue,
    showMultiContracts,
    setShowMultiContracts,
    showPayload,
    setShowPayload,
    isMultisig,
    resetForms,
    setIsMultisig,
  };
  return <Contract.Provider value={values}>{children}</Contract.Provider>;
};
export const useContract = (): IContractContext => useContext(Contract);
