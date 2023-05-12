import ContractComponent from '@/components/Contract';
import { getType } from '@/components/Contract/utils';
import { ISection } from '@/components/Form';
import api from '@/services/api';
import { ContractsIndex, IContractOption } from '@/types/contracts';
import {
  IAccount,
  IAccountResponse,
  IAssetOne,
  IAssetResponse,
  ICollectionList,
} from '@/types/index';
import { contractOptions as allContractOptions } from '@/utils/contracts';
import { KLV_PRECISION } from '@/utils/globalVariables';
import { useRouter } from 'next/router';
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
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
  collection?: ICollectionList;
  proposalId: number | null;
  binaryOperations: string[];
  depositType: string | null;
  withdrawType: number | null;
  assetID: number;
  itoTriggerType: number | null;
  buyType: boolean;
  isNFT: boolean | undefined;
  metadata: string;
  selectedBucket: string;
}

export interface IContractContext {
  tokenChosen: boolean;
  claimType: number;
  contractType: string;
  formSections: ISection[];
  ownerAddress: string;
  claimLabel: string;
  queue: IQueue[];
  isMultiContract: boolean;
  selectedIndex: number;
  formsData: IFormsData[];
  txLoading: boolean;
  showAdvancedOpts: boolean;
  txHash: string | null;
  assetsList: ICollectionList[] | null;
  showMultiContracts: boolean;
  showPayload: React.MutableRefObject<boolean>;
  isMultisig: React.MutableRefObject<boolean>;
  contractOptions: IContractOption[];
  kdaFee: ICollectionList;
  setTokenChosen: React.Dispatch<React.SetStateAction<boolean>>;
  setClaimType: React.Dispatch<React.SetStateAction<number>>;
  setContractType: React.Dispatch<React.SetStateAction<string>>;
  setFormSections: React.Dispatch<React.SetStateAction<ISection[]>>;
  setOwnerAddress: React.Dispatch<React.SetStateAction<string>>;
  setClaimLabel: React.Dispatch<React.SetStateAction<string>>;
  setQueue: React.Dispatch<React.SetStateAction<any>>;
  setIsMultiContract: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
  setFormsData: React.Dispatch<React.SetStateAction<any>>;
  setTxLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAdvancedOpts: React.Dispatch<React.SetStateAction<boolean>>;
  setTxHash: React.Dispatch<React.SetStateAction<string | null>>;
  setAssetsLists: React.Dispatch<
    React.SetStateAction<ICollectionList[] | null>
  >;
  setProposals: React.Dispatch<React.SetStateAction<any>>;
  setParamsList: React.Dispatch<React.SetStateAction<any>>;
  setShowMultiContracts: React.Dispatch<React.SetStateAction<boolean>>;
  setContractOptions: React.Dispatch<React.SetStateAction<IContractOption[]>>;
  setKdaFee: React.Dispatch<React.SetStateAction<ICollectionList>>;
  getAssets: () => void;
  getOwnerAddress: () => string;
  addToQueue: () => void;
  resetForms: () => void;
}

export const Contract = createContext({} as IContractContext);
export const ContractProvider: React.FC = ({ children }) => {
  const [tokenChosen, setTokenChosen] = useState(false);
  const [claimType, setClaimType] = useState(0);
  const [contractType, setContractType] = useState('');
  const [formSections, setFormSections] = useState<ISection[]>([]);
  const [ownerAddress, setOwnerAddress] = useState('');
  const [claimLabel, setClaimLabel] = useState('Asset ID');
  const [isMultiContract, setIsMultiContract] = useState<boolean>(false);
  const [kdaFee, setKdaFee] = useState<ICollectionList>({} as ICollectionList);
  const [queue, setQueue] = useState<IQueue[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [formsData, setFormsData] = useState<IFormsData[]>([]);
  const [txLoading, setTxLoading] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [showAdvancedOpts, setShowAdvancedOpts] = useState(false);
  const [assetsList, setAssetsLists] = useState<ICollectionList[] | null>(null);
  const [kassetsList, setKAssetsList] = useState<ICollectionList[]>([]);
  const [proposals, setProposals] = useState<any>([]);
  const [paramsList, setParamsList] = useState<any>([]);
  const [showMultiContracts, setShowMultiContracts] = useState<boolean>(false);
  const [contractOptions, setContractOptions] =
    useState<IContractOption[]>(allContractOptions);

  const showPayload = useRef(false);
  const isMultisig = useRef(false);

  const { logoutExtension, extensionInstalled } = useExtension();
  const router = useRouter();

  const getOwnerAddress = () => {
    return sessionStorage.getItem('walletAddress') || '';
  };

  const getKAssets = async (address: string) => {
    const response: IAssetResponse = await api.get({
      route: `assets/list`,
      query: {
        owner: address,
        limit: 10000,
      },
    });
    if (response.error) return;

    const list: ICollectionList[] = [];

    if (response?.data?.assets?.length > 0) {
      response.data.assets.forEach(item => {
        list.push({
          ...item,
          label: item.assetId,
          value: item.assetId,
          isNFT: item.assetType !== 'Fungible',
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
    const address = sessionStorage.getItem('walletAddress') || '';

    if (address === '' && router.pathname === '/create-transaction') {
      logoutExtension && logoutExtension();
      return;
    }

    getKAssets(address);

    const account: IAccountResponse = await api.get({
      route: `address/${address}`,
    });

    if (
      !account?.data?.account?.assets &&
      account?.data?.account?.balance === 0
    ) {
      setAssetsLists([]);
      return;
    }

    const accountData: IAccount = account?.data?.account
      ? account.data.account
      : {
          assets: [],
          frozenBalance: 0,
          balance: 0,
        };

    const { assets, frozenBalance, balance } = accountData;
    const list: ICollectionList[] = [];
    const addAssetsInfo = Object.keys(assets).map(async item => {
      const assetInfo: IAssetOne = await api.get({
        route: `assets/${item}`,
      });

      const minEpochsToWithdraw =
        assetInfo.data?.asset?.staking?.minEpochsToWithdraw;

      list.push({
        ...assets[item],
        label: item,
        value: item,
        isNFT: assets[item].assetType === 1,
        minEpochsToWithdraw: minEpochsToWithdraw ? minEpochsToWithdraw : null,
      });
    });

    await Promise.all(addAssetsInfo);

    if (!Object.keys(assets).includes('KLV') && balance !== 0) {
      const assetInfo: IAssetOne = await api.get({
        route: `assets/KLV`,
      });

      const minEpochsToWithdraw =
        assetInfo.data?.asset?.staking?.minEpochsToWithdraw;

      list.push({
        label: 'KLV',
        value: 'KLV',
        precision: KLV_PRECISION,
        isNFT: false,
        minEpochsToWithdraw: minEpochsToWithdraw ? minEpochsToWithdraw : null,
        balance,
        frozenBalance,
      });
    }
    list.sort((a, b) => (a.label > b.label ? 1 : -1));

    const KLV = list.splice(
      list.indexOf(list.find(item => item.label === 'KLV') as ICollectionList),
      1,
    );

    const KFI = list.splice(
      list.indexOf(list.find(item => item.label === 'KFI') as ICollectionList),
      1,
    );

    setAssetsLists([...KLV, ...KFI, ...list]);
  };

  useEffect(() => {
    if (extensionInstalled) {
      getAssets();
    }
  }, [extensionInstalled]);

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
  };

  useEffect(() => {
    if (isMultiContract) {
      const allowedMultiContract = [
        'Transfer',
        'Delegate',
        'Undelegate',
        'Freeze',
        'Unfreeze',
        'Asset Trigger',
        'Deposit',
      ];
      const filterContractOptions = contractOptions.filter(contract =>
        allowedMultiContract.includes(contract.label),
      );
      setContractOptions(filterContractOptions);
    }

    if (!isMultiContract) {
      setContractOptions(allContractOptions);
    }

    resetForms();
  }, [isMultiContract, contractType]);

  const values: IContractContext = {
    tokenChosen,
    setTokenChosen,
    claimType,
    setClaimType,
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
    txLoading,
    setTxLoading,
    txHash,
    setTxHash,
    showAdvancedOpts,
    setShowAdvancedOpts,
    assetsList,
    setAssetsLists,
    setProposals,
    setParamsList,
    getAssets,
    addToQueue,
    showMultiContracts,
    setShowMultiContracts,
    showPayload,
    isMultisig,
    resetForms,
    contractOptions,
    setContractOptions,
    kdaFee,
    setKdaFee,
    getOwnerAddress,
  };
  return <Contract.Provider value={values}>{children}</Contract.Provider>;
};
export const useContract = (): IContractContext => useContext(Contract);
