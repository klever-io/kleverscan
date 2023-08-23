import { sumAllRoyaltiesFees } from '@/components/Contract/MultiContract';
import {
  buildTransaction,
  getType,
  precisionParse,
} from '@/components/Contract/utils';
import api from '@/services/api';
import { IContractOption } from '@/types/contracts';
import {
  IAccount,
  IAccountResponse,
  IAssetResponse,
  IAssetsResponse,
  ICollectionList,
  IFormData,
  INodeAccountResponse,
  Service,
} from '@/types/index';
import { contractOptions as allContractOptions } from '@/utils/contracts';
import { KLV_PRECISION } from '@/utils/globalVariables';
import { ITransaction, web } from '@klever/sdk';
import { useRouter } from 'next/router';
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import { useExtension } from '../extension';
import { useModal } from './modals';
import { useMulticontract } from './multicontract';

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

interface IFormPayload {
  type: number;
  payload: any;
  metadata: string;
}
export interface IContractContext {
  txLoading: boolean;
  showAdvancedOpts: boolean;
  txHash: string | null;
  showPayload: React.MutableRefObject<boolean>;
  isMultisig: React.MutableRefObject<boolean>;
  payload: any;
  contractOptions: IContractOption[];
  kdaFee: React.MutableRefObject<ICollectionList>;
  permID: number;
  senderAccount: string;
  ignoreCheckAmount: React.MutableRefObject<boolean>;
  setTxLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAdvancedOpts: React.Dispatch<React.SetStateAction<boolean>>;
  setTxHash: React.Dispatch<React.SetStateAction<string | null>>;
  setContractOptions: React.Dispatch<React.SetStateAction<IContractOption[]>>;
  setPayload: React.Dispatch<React.SetStateAction<any>>;
  setSenderAccount: React.Dispatch<React.SetStateAction<string>>;
  setPermID: React.Dispatch<React.SetStateAction<number>>;
  getAssets: () => Promise<ICollectionList[]>;
  getKAssets: () => Promise<ICollectionList[] | undefined>;
  getOwnerAddress: () => string;
  formSend: () => Promise<void>;
  resetFormsData: () => void;
  handleSubmit: (
    contractValues: any,
    metadata: string,
    contractType: string,
    queueLength: number,
  ) => Promise<void>;
  submitForms: () => Promise<void>;
}

export const Contract = createContext({} as IContractContext);
export const ContractProvider: React.FC = ({ children }) => {
  const [txLoading, setTxLoading] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [showAdvancedOpts, setShowAdvancedOpts] = useState(false);
  const [contractOptions, setContractOptions] =
    useState<IContractOption[]>(allContractOptions);
  const [payload, setPayload] = useState<any>({});

  const showPayload = useRef(false);
  const isMultisig = useRef(false);
  const formsData = useRef<IFormPayload[]>([] as IFormPayload[]);
  const ignoreCheckAmount = useRef(false);
  const kdaFee = useRef<ICollectionList>({} as ICollectionList);
  const [permID, setPermID] = useState<number>(0);

  const { queue, totalFees } = useMulticontract();

  const { setWarningOpen, setShowPayloadOpen } = useModal();

  const { extensionInstalled, walletAddress, setOpenDrawer } = useExtension();

  const router = useRouter();

  const getOwnerAddress = () => {
    if (typeof window === 'undefined') return '';
    return sessionStorage.getItem('walletAddress') || '';
  };

  const [senderAccount, setSenderAccount] = useState<string>(getOwnerAddress());

  useEffect(() => {
    if (txHash && router.pathname === '/create-transaction') {
      window.scrollTo(0, 0);
    }
  }, [txHash]);

  const getKAssets = async () => {
    const address = sessionStorage.getItem('walletAddress') || '';

    const response: IAssetsResponse = await api.get({
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

      const kAssetsList = [...list];

      return kAssetsList;
    }
  };

  const getAssets = async () => {
    const address = sessionStorage.getItem('walletAddress') || '';

    if (address === '' && router.pathname === '/create-transaction') {
      return [] as ICollectionList[];
    }

    const account: IAccountResponse = await api.get({
      route: `address/${address}`,
    });

    if (
      !account?.data?.account?.assets &&
      account?.data?.account?.balance === (0 || undefined)
    ) {
      return [] as ICollectionList[];
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
    const assetInfo: IAssetsResponse = await api.get({
      route: `assets/list`,
      query: {
        asset: Object.keys(assets).join(','),
        limit: 10000,
      },
    });

    assetInfo.data?.assets?.forEach(item => {
      const minEpochsToWithdraw = item?.staking?.minEpochsToWithdraw;

      list.push({
        ...assets[item.assetId],
        label: item.assetId,
        value: item.assetId,
        isNFT: assets?.[item.assetId]?.assetType === 1,
        minEpochsToWithdraw: minEpochsToWithdraw ? minEpochsToWithdraw : null,
        royalties: item.royalties || undefined,
      });
    });

    if (!Object.keys(assets).includes('KLV') && balance !== 0) {
      const assetInfo: IAssetResponse = await api.get({
        route: `assets/KLV`,
      });

      const minEpochsToWithdraw =
        assetInfo.data?.asset?.staking?.minEpochsToWithdraw;

      const royalties = assetInfo.data?.asset?.royalties;

      list.push({
        assetId: 'KLV',
        label: 'KLV',
        value: 'KLV',
        precision: KLV_PRECISION,
        isNFT: false,
        minEpochsToWithdraw: minEpochsToWithdraw ? minEpochsToWithdraw : null,
        balance,
        frozenBalance,
        royalties: royalties || undefined,
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

    const assetsList = [...KLV, ...KFI, ...list];

    return assetsList || ([] as ICollectionList[]);
  };

  const parseKda = (contractValues: any, contractType: string) => {
    const parsedValues = { ...contractValues };
    if (parsedValues.collection) {
      parsedValues['kda'] = parsedValues.collection;
      delete parsedValues.collection;
    }
    if (parsedValues.collectionAssetID) {
      parsedValues['kda'] += `/${parsedValues.collectionAssetID}`;
    }
    if ('collectionAssetID' in parsedValues) {
      delete parsedValues.collectionAssetID;
    }

    if (
      contractType === 'AssetTriggerContract' ||
      contractType === 'SellContract'
    ) {
      parsedValues['assetId'] = parsedValues['kda'];

      delete parsedValues.kda;
    }
    return parsedValues;
  };

  const checkExtensionInstalled = () => {
    return extensionInstalled;
  };

  const checkExtensionLoggedIn = () => {
    return walletAddress !== '';
  };

  const submitForms = async () => {
    if (!checkExtensionInstalled()) {
      setOpenDrawer(true);
      return;
    }

    if (!checkExtensionLoggedIn()) {
      toast.error(
        'Wallet not connected. Please connect your wallet and refresh the page. The transaction data will not be lost.',
      );
      return;
    }

    const allForms = document.querySelectorAll('form');
    allForms.forEach((form: HTMLFormElement) => {
      form.requestSubmit();
    });
  };

  const { data: assetsList } = useQuery({
    queryKey: 'assetsList',
    queryFn: getAssets,
    initialData: [],
  });

  const amountAndFeesGreaterThanBalance = (): boolean => {
    const formPayloads = formsData.current;

    const totalCosts = formPayloads.reduce(
      (acc, formPayload) => {
        if (!formPayload.payload?.amount) {
          return acc;
        }
        if (!formPayload.payload?.kda) {
          acc['KLV'] += formPayload.payload.amount;
          return acc;
        }

        acc[formPayload.payload.kda] = formPayload.payload.amount;
        return acc;
      },
      {
        KLV: 0,
      },
    );
    totalCosts['KLV'] += totalFees * 10 ** KLV_PRECISION;

    Object.entries(sumAllRoyaltiesFees(queue)).forEach(
      ([assetId, { precision, totalFee }]) => {
        const fee = Number(totalFee) * 10 ** precision;

        if (totalCosts[assetId]) {
          totalCosts[assetId] += fee;
        } else {
          totalCosts[assetId] = fee;
        }
      },
    );

    for (const assetId in totalCosts) {
      const amount = totalCosts[assetId];

      const asset = assetsList?.find(item => item.assetId === assetId);

      if ((asset?.balance || 0) < amount) {
        setWarningOpen(true);
        setTxLoading(false);
        return false;
      }
    }

    return true;
  };

  const formSend = async () => {
    const formPayloads = formsData.current;

    if (!ignoreCheckAmount.current && !amountAndFeesGreaterThanBalance()) {
      return;
    }

    setTxLoading(true);
    const parsedDataArray: string[] = [];
    const parsedPayloads = formPayloads.map(formPayload => {
      const { type, payload, metadata } = formPayload;
      const parsedData = Buffer.from(metadata, 'utf-8').toString('base64');
      parsedDataArray.push(parsedData);
      return {
        type,
        payload,
      };
    });
    try {
      const unsignedTx: ITransaction = await buildTransaction(
        parsedPayloads,
        parsedDataArray,
        {
          kdaFee: kdaFee.current.value,
          permID: permID,
        },
      );

      if (senderAccount !== getOwnerAddress()) {
        const senderData: INodeAccountResponse = await api.get({
          route: `address/${senderAccount}`,
          service: Service.NODE,
        });
        if (senderData.error) {
          throw new Error(senderData.code);
        }
        const { Address } = senderData.data.account;
        const Nonce = senderData.data.account.Nonce || 0;

        unsignedTx.RawData.Nonce = Nonce;
        unsignedTx.RawData.Sender = Address;
      }

      const signedTx = await window.kleverWeb.signTransaction(unsignedTx);

      if (isMultisig.current) {
        const blob = new Blob([JSON.stringify(signedTx)], {
          type: 'application/json',
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${getOwnerAddress()} - Nonce: ${
          signedTx.RawData.Nonce
        }.json`;
        link.click();
        window.URL.revokeObjectURL(url);
        setTxLoading(false);
        toast.success(
          'Transaction built and signed, send the file to the co-owner(s)',
        );
      } else {
        const response = await web.broadcastTransactions([signedTx]);
        setTxHash(response.data.txsHashes[0]);
        toast.success('Transaction broadcast successfully');
      }
    } catch (e: any) {
      console.warn(`%c ${e}`, 'color: red');
      toast.error(e.message ? e.message : e);
    } finally {
      resetFormsData();
    }
  };

  const resetFormsData = () => {
    ignoreCheckAmount.current = false;
    formsData.current = [];
    setTxLoading(false);
  };

  const parsePayload = (
    data: IFormData,
    metadata: string,
    contractType: string,
  ) => {
    formsData.current = [
      ...(formsData.current || []),
      {
        type: getType(contractType),
        payload: data,
        metadata,
      },
    ];
  };

  const handleSubmit = async (
    contractValues: any,
    metadata: string,
    contractType: string,
    queueLength: number,
  ) => {
    setTxLoading(true);

    const payload = JSON.parse(
      JSON.stringify(parseKda(contractValues, contractType)),
    );

    await precisionParse(payload, contractType);

    parsePayload(payload, metadata, contractType);

    if (showPayload.current) {
      setShowPayloadOpen(true);
      setPayload(formsData.current);
      setTxLoading(false);
    } else if (queueLength > 1) {
      if (formsData.current.length === queueLength) {
        formSend();
      }
    } else {
      formSend();
    }
  };

  const values: IContractContext = {
    txLoading,
    setTxLoading,
    txHash,
    setTxHash,
    showAdvancedOpts,
    setShowAdvancedOpts,
    getAssets,
    getKAssets,
    showPayload,
    isMultisig,
    contractOptions,
    setContractOptions,
    getOwnerAddress,
    formSend,
    handleSubmit,
    payload,
    setPayload,
    resetFormsData,
    submitForms,
    kdaFee,
    permID,
    setPermID,
    senderAccount,
    setSenderAccount,
    ignoreCheckAmount,
  };
  return <Contract.Provider value={values}>{children}</Contract.Provider>;
};
export const useContract = (): IContractContext => useContext(Contract);
