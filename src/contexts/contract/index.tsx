import ContractComponent from '@/components/Contract';
import Select from '@/components/Contract/Select';
import {
  AssetIDInput,
  BalanceContainer,
  BalanceLabel,
  FieldLabel,
  SelectContainer,
  SelectContent,
} from '@/components/Contract/styles';
import {
  buildTransaction,
  getAssetsList,
  getType,
  precisionParse,
  showAssetIdInput,
} from '@/components/Contract/utils';
import {
  ErrorMessage,
  RequiredSpan,
} from '@/components/TransactionForms/FormInput/styles';
import api from '@/services/api';
import { ContractsIndex, IContractOption } from '@/types/contracts';
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
import { FieldError, useFormContext } from 'react-hook-form';
import { IoReloadSharp } from 'react-icons/io5';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import { useExtension } from '../extension';
import { ReloadWrapper } from './styles';

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

interface IKDASelectProps {
  typeAssetTrigger: number | null;
  withdrawType: number | null;
}

interface ISelectProps {
  required?: boolean;
}

interface IKDASelect {
  assetTriggerType?: number | null;
  withdrawType?: number | null;
  validateFields?: string[];
}

export interface IContractContext {
  contractType: string;
  queue: IQueue[];
  isMultiContract: boolean;
  selectedIndex: number;
  txLoading: boolean;
  showAdvancedOpts: boolean;
  txHash: string | null;
  showMultiContracts: boolean;
  showPayload: React.MutableRefObject<boolean>;
  isMultisig: React.MutableRefObject<boolean>;
  payload: any;
  contractOptions: IContractOption[];
  kdaFee: React.MutableRefObject<ICollectionList>;
  permID: React.MutableRefObject<number>;
  openModal: boolean;
  senderAccount: React.MutableRefObject<string | null | undefined>;
  setContractType: (contract: string) => void;
  setQueue: React.Dispatch<React.SetStateAction<any>>;
  setIsMultiContract: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
  setTxLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAdvancedOpts: React.Dispatch<React.SetStateAction<boolean>>;
  setTxHash: React.Dispatch<React.SetStateAction<string | null>>;
  setShowMultiContracts: React.Dispatch<React.SetStateAction<boolean>>;
  setContractOptions: React.Dispatch<React.SetStateAction<IContractOption[]>>;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setPayload: React.Dispatch<React.SetStateAction<any>>;
  getAssets: () => Promise<ICollectionList[]>;
  getOwnerAddress: () => string;
  addToQueue: () => void;
  resetForms: () => void;
  formSend: () => Promise<void>;
  handleSubmit: (contractValues: any, metadata: string) => Promise<void>;
  submitForms: () => Promise<void>;
  useKDASelect: (
    params?: IKDASelect,
  ) => [ICollectionList | undefined, React.FC<ISelectProps>];
}

const kAssetContracts = [
  'AssetTriggerContract',
  'ConfigITOContract',
  'ITOTriggerContract',
  'WithdrawContract',
  'DepositContract',
];

const collectionContracts = [
  'ConfigITOContract',
  'ITOTriggerContract',
  'WithdrawContract',
];

export const Contract = createContext({} as IContractContext);
export const ContractProvider: React.FC = ({ children }) => {
  const [contractType, setContractType] = useState('');
  const [isMultiContract, setIsMultiContract] = useState<boolean>(false);
  const [queue, setQueue] = useState<IQueue[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [txLoading, setTxLoading] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [showAdvancedOpts, setShowAdvancedOpts] = useState(false);
  const [showMultiContracts, setShowMultiContracts] = useState<boolean>(false);
  const [contractOptions, setContractOptions] =
    useState<IContractOption[]>(allContractOptions);
  const [openModal, setOpenModal] = useState(false);
  const [payload, setPayload] = useState<any>({});

  const showPayload = useRef(false);
  const isMultisig = useRef(false);
  const formsData = useRef<IFormPayload[]>([] as IFormPayload[]);
  const kdaFee = useRef<ICollectionList>({} as ICollectionList);
  const permID = useRef<number>(0);
  const senderAccount = useRef<string | null>();

  const { logoutExtension, extensionInstalled } = useExtension();
  const router = useRouter();

  const getOwnerAddress = () => {
    if (typeof window === 'undefined') return '';
    return sessionStorage.getItem('walletAddress') || '';
  };

  useEffect(() => {
    if (txHash && router.pathname === '/create-transaction') {
      window.scrollTo(0, 0);
    }
  }, [txHash]);

  useEffect(() => {
    if (router.isReady) {
      const { contract } = router.query;
      if (contract) {
        setContractType(contract as string);
      }
    }
  }, [router.isReady]);

  const setContractAndQuery = (contract: string) => {
    setContractType(contract);

    if (router.pathname !== '/create-transaction') return;

    if (contract !== '')
      router.push(`/create-transaction?contract=${contract}`, undefined, {
        shallow: true,
      });
    else
      router.push(`/create-transaction`, undefined, {
        shallow: true,
      });
  };

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
      logoutExtension && logoutExtension();
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
      });
    });

    if (!Object.keys(assets).includes('KLV') && balance !== 0) {
      const assetInfo: IAssetResponse = await api.get({
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

    const assetsList = [...KLV, ...KFI, ...list];

    return assetsList || ([] as ICollectionList[]);
  };

  const contractProps = {
    contractType,
    setContractType,
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
      elementIndex: queue.length,
    };
    setQueue([
      ...queue,
      {
        elementIndex: queue.length,
        contract: ContractsIndex[getType(contractType)],
        ref: <ContractComponent {...contractPropsWithIndex} />,
      },
    ]);
    setSelectedIndex(0);
    setTxLoading(false);
  };

  useEffect(() => {
    resetForms();
  }, [isMultiContract, contractType]);

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

  const submitForms = async () => {
    const allForms = document.querySelectorAll('form');
    allForms.forEach((form: HTMLFormElement) => {
      form.requestSubmit();
    });
  };

  interface IFormPayload {
    type: number;
    payload: any;
    metadata: string;
  }

  const formSend = async () => {
    const formPayloads = formsData.current;
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
          permID: permID.current,
        },
      );

      if (isMultisig.current && senderAccount.current) {
        const senderData: INodeAccountResponse = await api.get({
          route: `address/${senderAccount.current}`,
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
        link.download = `${contractType} - Nonce: ${signedTx.RawData.Nonce}.json`;
        link.click();
        window.URL.revokeObjectURL(url);
        setTxLoading(false);
        toast.success(
          'Transaction built and signed, send the file to the co-owner(s)',
        );
      } else {
        const response = await web.broadcastTransactions([signedTx]);
        setTxLoading(false);
        setTxHash(response.data.txsHashes[0]);
        toast.success('Transaction broadcast successfully');
      }
    } catch (e: any) {
      setTxLoading(false);
      console.warn(`%c ${e}`, 'color: red');
      toast.error(e.message ? e.message : e);
    }
  };

  const parsePayload = (data: IFormData, metadata: string) => {
    formsData.current = [
      ...(formsData.current || []),
      {
        type: getType(contractType),
        payload: data,
        metadata,
      },
    ];
  };

  const handleSubmit = async (contractValues: any, metadata: string) => {
    setTxLoading(true);

    formsData.current = [];
    const payload = JSON.parse(
      JSON.stringify(parseKda(contractValues, contractType)),
    );

    await precisionParse(payload, contractType);

    parsePayload(payload, metadata);
    if (showPayload.current) {
      setOpenModal(true);
      setPayload(formsData.current);
      setTxLoading(false);
    } else if (isMultiContract) {
      if (formsData.current.length === queue.length) {
        formSend();
      }
    } else {
      formSend();
    }
  };

  const useKDASelect = (
    params?: IKDASelect,
  ): [ICollectionList | undefined, React.FC<ISelectProps>] => {
    const [collection, setCollection] = useState<ICollectionList | undefined>(
      {} as ICollectionList,
    );
    const [loading, setLoading] = useState(false);

    const assetTriggerType =
      params?.assetTriggerType !== undefined ? params?.assetTriggerType : null;
    const withdrawType = params?.withdrawType || null;
    const validateFields = params?.validateFields || [];

    const {
      register,
      setValue,
      formState: { errors },
      getValues,
      trigger,
      watch,
    } = useFormContext();

    const watchCollection = watch('collection');

    const {
      data: assetsList,
      refetch: refetchAssetsList,
      isFetching: assetsFetching,
    } = useQuery({
      queryKey: 'assetsList',
      queryFn: getAssets,
      initialData: [],
    });
    const {
      data: kassetsList,
      refetch: refetchKassetsList,
      isFetching: kassetsFetching,
    } = useQuery({
      queryKey: 'kassetsList',
      queryFn: getKAssets,
      initialData: [],
    });

    useEffect(() => {
      if (!kassetsFetching && !assetsFetching && loading) {
        setLoading(false);
      } else if (!loading) {
        setLoading(true);
      }
    }, [assetsFetching, kassetsFetching]);

    const refetch = () => {
      refetchAssetsList();
      refetchKassetsList();
    };

    useEffect(() => {
      if (watchCollection && watchCollection !== collection?.value) {
        const selectedCollection = assetsList?.find(
          asset => asset.value === watchCollection,
        );
        selectedCollection && setCollection(selectedCollection);
        !selectedCollection &&
          setCollection({
            label: watchCollection,
            value: watchCollection,
          } as ICollectionList);
      }
    }, [watchCollection, assetsList]);

    useEffect(() => {
      validateFields.forEach(field => {
        const value = getValues(field);
        if (value) {
          trigger(field);
        }
      });
    }, [collection]);

    let assetBalance = 0;
    assetBalance = collection?.balance || 0;

    const KDASelect: React.FC<ISelectProps> = ({ required }) => {
      let collectionError: null | FieldError = null;

      try {
        collectionError = errors?.collection;
      } catch (e) {
        collectionError = null;
      }

      let assetIdError: null | FieldError = null;

      try {
        assetIdError = errors?.collectionAssetID;
      } catch (e) {
        assetIdError = null;
      }

      useEffect(() => {
        register('collection', {
          required: {
            value: required || false,
            message: 'This field is required',
          },
        });
      }, [register]);

      const showAssetIdInputConditional =
        collection?.isNFT &&
        !collectionContracts.includes(contractType) &&
        showAssetIdInput(contractType, assetTriggerType);

      useEffect(() => {
        if (!showAssetIdInputConditional) {
          setValue('collectionAssetID', '');
        }
      }, [showAssetIdInputConditional]);

      const CollectionIDField: React.FC = () => {
        useEffect(() => {
          return () => {
            (!collection?.isNFT ||
              collectionContracts.includes(contractType) ||
              !showAssetIdInput(contractType, assetTriggerType)) &&
              setValue('collectionAssetID', '');
          };
        }, []);

        return (
          <SelectContent>
            <FieldLabel>Asset ID</FieldLabel>
            <AssetIDInput
              type="number"
              $error={Boolean(assetIdError)}
              {...register('collectionAssetID', {
                required: {
                  value: true,
                  message: 'This field is required',
                },
              })}
            />
            {assetIdError && (
              <ErrorMessage style={{ color: 'red', fontSize: '0.8rem' }}>
                {collectionError?.message || 'This field is required'}
              </ErrorMessage>
            )}
          </SelectContent>
        );
      };

      return (
        <SelectContainer key={JSON.stringify(collection)}>
          <SelectContent configITO={contractType === 'ConfigITOContract'}>
            <BalanceContainer>
              <FieldLabel>
                Select an asset/collection
                {required && <RequiredSpan> (required)</RequiredSpan>}
              </FieldLabel>
              <ReloadWrapper onClick={refetch} $loading={loading}>
                <IoReloadSharp />
              </ReloadWrapper>
              {collection?.balance && (
                <BalanceLabel>
                  Balance: {assetBalance / 10 ** (collection?.precision || 0)}
                </BalanceLabel>
              )}
            </BalanceContainer>
            <Select
              collection={collection}
              options={getAssetsList(
                kAssetContracts.includes(contractType)
                  ? kassetsList || []
                  : assetsList || [],
                contractType,
                assetTriggerType,
                withdrawType,
                getOwnerAddress(),
              )}
              onChange={value => {
                setCollection(value);
                setValue('collection', value?.value, {
                  shouldValidate: true,
                });
                if (!value.isNFT) {
                  setValue('collectionAssetID', '');
                }
              }}
              loading={loading}
              selectedValue={collection?.value ? collection : undefined}
              zIndex={3}
              error={Boolean(collectionError)}
            />
            {collectionError && (
              <ErrorMessage style={{ color: 'red', fontSize: '0.8rem' }}>
                {collectionError?.message || 'This field is required'}
              </ErrorMessage>
            )}
          </SelectContent>
          {showAssetIdInputConditional && <CollectionIDField />}
        </SelectContainer>
      );
    };

    return [collection, KDASelect];
  };

  const values: IContractContext = {
    contractType,
    setContractType: setContractAndQuery,
    queue,
    setQueue,
    isMultiContract,
    setIsMultiContract,
    selectedIndex,
    setSelectedIndex,
    txLoading,
    setTxLoading,
    txHash,
    setTxHash,
    showAdvancedOpts,
    setShowAdvancedOpts,
    getAssets,
    addToQueue,
    showMultiContracts,
    setShowMultiContracts,
    showPayload,
    isMultisig,
    resetForms,
    contractOptions,
    setContractOptions,
    getOwnerAddress,
    formSend,
    handleSubmit,
    openModal,
    setOpenModal,
    payload,
    setPayload,
    submitForms,
    useKDASelect,
    kdaFee,
    permID,
    senderAccount,
  };
  return <Contract.Provider value={values}>{children}</Contract.Provider>;
};
export const useContract = (): IContractContext => useContext(Contract);
