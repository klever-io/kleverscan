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
import { gtagEvent } from '@/utils/gtag';
import { web } from '@klever/sdk-web';
import { useRouter } from 'next/router';
import React, {
  createContext,
  PropsWithChildren,
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
  signTxMultiSign: React.MutableRefObject<boolean>;
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
  formSend: (payload?: IFormPayload[]) => Promise<void>;
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
export const ContractProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [txLoading, setTxLoading] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [showAdvancedOpts, setShowAdvancedOpts] = useState(false);
  const [contractOptions, setContractOptions] =
    useState<IContractOption[]>(allContractOptions);
  const [payload, setPayload] = useState<any>({});

  const showPayload = useRef(false);
  const isMultisig = useRef(false);
  const signTxMultiSign = useRef(false);
  const formsData = useRef<IFormPayload[]>([] as IFormPayload[]);
  const ignoreCheckAmount = useRef(false);
  const kdaFee = useRef<ICollectionList>({} as ICollectionList);
  const [permID, setPermID] = useState<number>(0);

  const { queue, totalFees, selectedContractType } = useMulticontract();

  const { setWarningOpen, setShowPayloadOpen } = useModal();

  const { extensionInstalled, walletAddress, setOpenDrawer } = useExtension();

  const router = useRouter();

  const [senderAccount, setSenderAccount] = useState<string>('');

  useEffect(() => {
    if (walletAddress !== '') {
      setSenderAccount(walletAddress);
    }
  }, [walletAddress]);

  useEffect(() => {
    if (txHash && router.pathname === '/create-transaction') {
      window.scrollTo(0, 0);
    }
  }, [txHash]);

  const getKAssets = async () => {
    if (walletAddress === '') {
      return [] as ICollectionList[];
    }

    const list: ICollectionList[] = [];

    let page = 1;
    while (page !== -1) {
      const response: IAssetsResponse = await api.get({
        route: `assets/list`,
        query: {
          owner: walletAddress,
          limit: 100,
          page,
        },
      });
      if (response.error) return;

      if (response?.data?.assets?.length > 0) {
        response.data.assets.forEach(item => {
          list.push({
            ...item,
            label: item.assetId,
            value: item.assetId,
            isNFT: item.assetType === 'NonFungible',
            isFungible: item.assetType === 'Fungible',
          });
        });
      }

      page =
        (response?.pagination?.self || 0) <
        (response?.pagination?.totalPages || 0)
          ? page + 1
          : -1;
    }

    const kAssetsList = [...list];

    return kAssetsList;
  };

  const getAssets = async () => {
    let account: IAccountResponse;
    if (walletAddress === '') {
      return [] as ICollectionList[];
    }
    if (senderAccount !== '') {
      account = await api.get({
        route: `address/${senderAccount}`,
      });
    } else {
      account = await api.get({
        route: `address/${walletAddress}`,
      });
    }

    if (
      !account?.data?.account?.assets &&
      account?.data?.account?.balance === (0 || undefined)
    ) {
      return [] as ICollectionList[];
    }

    const accountData: IAccount = account?.data?.account
      ? account.data.account
      : ({
          assets: [],
          frozenBalance: 0,
          balance: 0,
        } as unknown as IAccount);

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
        ...item,
        ...assets[item.assetId],
        label: item.assetId,
        value: item.assetId,
        isNFT: assets?.[item.assetId]?.assetType === 1,
        isFungible: assets?.[item.assetId]?.assetType === 0,
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
        isFungible: true,
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
    if (parsedValues.collectionAssetId) {
      parsedValues['kda'] += `/${parsedValues.collectionAssetId}`;
    }
    if ('collectionAssetId' in parsedValues) {
      delete parsedValues.collectionAssetId;
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

  const { data: assetsList, refetch: refetchAssetsList } = useQuery({
    queryKey: 'assetsList',
    queryFn: getAssets,
    initialData: [],
    enabled: !!walletAddress,
  });

  useEffect(() => {
    refetchAssetsList();
  }, [senderAccount]);

  const amountAndFeesGreaterThanBalance = (): boolean => {
    const formPayloads = formsData.current;

    if (formPayloads[0].type !== 14) {
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
        } as { [key: string]: number },
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
        if (asset?.balance && asset.balance < amount) {
          setWarningOpen(true);
          setTxLoading(false);
          return false;
        }
      }
    } else {
      const kfiAmount = formPayloads.map(asset => ({
        KFI: asset.payload.amount,
      }))[0];
      for (const assetId in kfiAmount) {
        const amount = kfiAmount[assetId as keyof typeof kfiAmount];
        const asset = assetsList
          ?.find(item => item.assetId === assetId)
          ?.buckets?.reduce((acc, current) => acc + current.balance, 0);
        if ((asset || 0) < amount) {
          setWarningOpen(true);
          setTxLoading(false);
          return false;
        }
      }
    }

    return true;
  };

  const formSend = async (payload?: IFormPayload[]) => {
    const formPayloads = payload || formsData.current;

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
      let nonce;
      if (senderAccount !== walletAddress) {
        const senderData: INodeAccountResponse = await api.get({
          route: `address/${senderAccount}`,
          service: Service.NODE,
        });
        if (!senderData.error) {
          nonce = senderData.data.account.Nonce || 0;
        }
      }

      const unsignedTx = await buildTransaction(
        parsedPayloads,
        parsedDataArray,
        {
          kdaFee: kdaFee.current.value,
          permID: permID,
          nonce,
          sender: senderAccount ?? null,
        },
      );

      if (isMultisig.current) {
        let parseMultisignTransaction;
        const senderAddress =
          senderAccount !== walletAddress ? senderAccount : walletAddress;
        if (signTxMultiSign.current) {
          const signedTx = await window.kleverWeb.signTransaction(
            unsignedTx.result,
          );
          const { RawData, Signature } = signedTx;

          parseMultisignTransaction = {
            hash: unsignedTx.txHash,
            address: senderAddress,
            raw: {
              rawData: RawData,
              Signature,
            },
          };
        } else {
          parseMultisignTransaction = {
            hash: unsignedTx.txHash,
            address: senderAddress,
            raw: {
              rawData: unsignedTx.result.RawData,
              Signature: [],
            },
          };
        }

        const multiSignRes: any = await api.post({
          route: 'transaction',
          service: Service.MULTISIGN,
          body: parseMultisignTransaction,
        });

        if (multiSignRes.error) {
          toast.error('Something went wrong, please try again');
          return;
        }

        setTxLoading(false);
        toast.success('Transaction built and signed');
      } else {
        const signedTx = await window.kleverWeb.signTransaction(
          unsignedTx.result,
        );
        const response = await web.broadcastTransactions([signedTx]);
        setTxHash(response.data.txsHashes[0]);
        toast.success('Transaction broadcast successfully');
        gtagEvent('send_transaction', {
          event_category: 'transaction',
          event_label: 'send_transaction',
          hash: response.data.txsHashes[0],
          sender: senderAccount,
          transaction_type: selectedContractType,
        });
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
    signTxMultiSign,
    contractOptions,
    setContractOptions,
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
