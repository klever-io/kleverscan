import Select from '@/components/Contract/Select';
import {
  AssetIDInput,
  BalanceLabel,
  FieldLabel,
  SelectContainer,
  SelectContent,
} from '@/components/Contract/styles';
import { getAssetsList, showAssetIdInput } from '@/components/Contract/utils';
import {
  DropdownCustomLabel,
  ErrorMessage,
  MarginRightAutoLabel,
  RequiredSpan,
} from '@/components/TransactionForms/FormInput/styles';
import { useContract } from '@/contexts/contract';
import { useMulticontract } from '@/contexts/contract/multicontract';
import { ReloadWrapper } from '@/contexts/contract/styles';
import { useExtension } from '@/contexts/extension';
import { collectionListCall } from '@/services/requests/collection';
import { ICollection, ICollectionList, IDropdownItem } from '@/types';
import { toLocaleFixed } from '@/utils/formatFunctions';
import { useDebounce } from '@/utils/hooks';
import { setQuery } from '@/utils/hooks/contract';
import { useRouter } from 'next/router';
import { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { FieldError, useFormContext } from 'react-hook-form';
import { IoReloadSharp } from 'react-icons/io5';
import { useQuery } from 'react-query';

const collectionContracts = [
  'ConfigITOContract',
  'ITOTriggerContract',
  'WithdrawContract',
];

interface IKDASelect {
  assetTriggerType?: number | null;
  withdrawType?: number | null;
  validateFields?: string[];
  required?: boolean;
}

export const KDASelect: React.FC<PropsWithChildren<IKDASelect>> = props => {
  const { required } = props;
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const kAssetContracts = useMemo(() => {
    const baseContracts = [
      'AssetTriggerContract',
      'ConfigITOContract',
      'ITOTriggerContract',
      'DepositContract',
    ];
    if (
      props?.withdrawType === 1 &&
      !baseContracts.includes('WithdrawContract')
    ) {
      return [...baseContracts, 'WithdrawContract'];
    } else if (props?.withdrawType === 0) {
      return baseContracts.filter(contract => contract !== 'WithdrawContract');
    }
    return baseContracts;
  }, [props?.withdrawType]);

  const { getAssets, getKAssets, senderAccount } = useContract();
  const { walletAddress } = useExtension();

  const {
    selectedContractType: contractType,
    queue,
    setCollection,
    setCollectionAssetId,
    parsedIndex,
    isMultiContract,
  } = useMulticontract();

  const {
    register,
    setValue,
    formState: { errors },
    getValues,
    trigger,
    watch,
  } = useFormContext();

  const watchCollectionAssetId = watch('collectionAssetId');

  const collectionAssetId = queue[parsedIndex]?.collectionAssetId;

  const assetTriggerType =
    props?.assetTriggerType !== undefined ? props?.assetTriggerType : null;
  const withdrawType =
    props?.withdrawType !== undefined ? props?.withdrawType : null;
  const validateFields = props?.validateFields || [];

  const selectedCollection = queue[parsedIndex]?.collection;

  const {
    data: accountAssetsList,
    refetch: refetchAssetsList,
    isFetching: assetsFetching,
  } = useQuery({
    queryKey: 'assetsList',
    queryFn: getAssets,
    initialData: [],
    enabled: walletAddress !== '',
  });

  const {
    data: kAssetsList,
    refetch: refetchKAssetsList,
    isFetching: kAssetsFetching,
  } = useQuery({
    queryKey: 'kAssetsList',
    queryFn: getKAssets,
    initialData: [],
    enabled: walletAddress !== '',
  });

  const [options, setOptions] = useState<IDropdownItem[]>([]);

  const assetsList = useMemo(() => {
    return kAssetContracts.includes(contractType) && assetTriggerType !== 1
      ? kAssetsList || []
      : accountAssetsList || [];
  }, [accountAssetsList, kAssetsList, contractType, assetTriggerType]);

  useEffect(() => {
    setOptions(
      getAssetsList(
        assetsList,
        contractType,
        assetTriggerType,
        withdrawType,
        walletAddress,
      ),
    );
  }, [
    walletAddress,
    accountAssetsList,
    kAssetsList,
    assetTriggerType,
    withdrawType,
  ]);

  useEffect(() => {
    if (!kAssetsFetching && !assetsFetching && loading) {
      setLoading(false);
    } else if (!loading) {
      setLoading(true);
    }
  }, [assetsFetching, kAssetsFetching]);

  const setCollectionValue = async (value?: ICollectionList) => {
    if (!isMultiContract && router.pathname !== '/') {
      value?.value &&
        (await setQuery('collection', value?.value || '', router));

      await new Promise(resolve => setTimeout(resolve, 0));
      await setQuery('collectionAssetId', '', router);
    }

    setCollection(value?.value ? value : undefined);
    setValue('collection', value?.value || '');
    setValue('collectionAssetId', '');

    validateFields.forEach(field => {
      const value = getValues(field);
      if (value) {
        trigger(field);
      }
    });
    trigger('collection');
  };

  const refetch = () => {
    refetchAssetsList();
    refetchKAssetsList();
  };

  useEffect(() => {
    collectionAssetId && setCollectionAssetId(watchCollectionAssetId);
  }, [watchCollectionAssetId, collectionAssetId]);

  let assetBalance = 0;
  assetBalance = selectedCollection?.balance || 0;
  let collectionError: null | FieldError = null;

  try {
    collectionError = errors?.collection;
  } catch (e) {
    collectionError = null;
  }

  useEffect(() => {
    register('collection', {
      required: {
        value: required || false,
        message: 'This field is required',
      },
    });
  }, [register]);

  useEffect(() => {
    refetch();
  }, [senderAccount]);

  const showAssetIdInputConditional =
    selectedCollection &&
    !selectedCollection?.isFungible &&
    !collectionContracts.includes(contractType) &&
    showAssetIdInput(
      contractType,
      assetTriggerType,
      selectedCollection?.assetType,
    );

  useEffect(() => {
    if (router.isReady && router.query.contractDetails) {
      const contractDetails = JSON.parse(
        router.query.contractDetails as string,
      );
      const routerCollectionLabel = contractDetails?.collection;
      const routerCollection = assetsList?.find(
        asset => asset.value === routerCollectionLabel,
      );

      setCollection(routerCollection);
      setValue('collection', routerCollection?.assetId || '');

      if (contractDetails?.collectionAssetId) {
        setCollectionAssetId(Number(contractDetails?.collectionAssetId));
        setValue('collectionAssetId', contractDetails?.collectionAssetId);
      }
    }
  }, [router, assetsList]);

  const onChangeHandler = async (value: ICollectionList) => {
    setCollectionValue(value);
  };

  return (
    <SelectContainer key={selectedCollection?.assetId}>
      <SelectContent configITO={contractType === 'ConfigITOContract'}>
        <FieldLabel>
          <MarginRightAutoLabel>
            Select an asset/collection
          </MarginRightAutoLabel>
          {required && <RequiredSpan> (required)</RequiredSpan>}

          {selectedCollection?.isFungible && selectedCollection?.balance && (
            <BalanceLabel>
              Balance:{' '}
              {toLocaleFixed(
                assetBalance / 10 ** (selectedCollection?.precision || 0),
                selectedCollection?.precision || 0,
              )}
            </BalanceLabel>
          )}
          <ReloadWrapper onClick={refetch} $loading={loading}>
            <IoReloadSharp />
          </ReloadWrapper>
        </FieldLabel>
        <Select
          collection={selectedCollection}
          options={options}
          onChange={onChangeHandler}
          loading={loading}
          selectedValue={
            isMultiContract
              ? undefined
              : selectedCollection?.value
                ? selectedCollection
                : queue[0].collection
                  ? {
                      label: queue[0].collection?.label || '',
                      value: queue[0].collection?.value || '',
                    }
                  : undefined
          }
          zIndex={3}
          error={Boolean(collectionError)}
        />
        {collectionError && (
          <ErrorMessage style={{ color: 'red', fontSize: '0.8rem' }}>
            {collectionError?.message || 'This field is required'}
          </ErrorMessage>
        )}
      </SelectContent>
      {showAssetIdInputConditional && (
        <CollectionIDField collection={selectedCollection} />
      )}
    </SelectContainer>
  );
};

interface CollectionIDFieldProps {
  collection: ICollectionList;
}

const CollectionIDField: React.FC<
  PropsWithChildren<CollectionIDFieldProps>
> = ({ collection }) => {
  const [isCustom, setIsCustom] = useState(false);
  const [collectionInputValue, setCollectionInputValue] = useState('');
  const [collectionIdData, setCollectionIdData] = useState<ICollection[]>([]);
  const debouncedCollectionInput = useDebounce(collectionInputValue, 500);
  const router = useRouter();
  const { walletAddress } = useExtension();
  const { setCollectionAssetId, isMultiContract } = useMulticontract();
  const {
    register,
    setValue,
    formState: { errors },
    watch,
  } = useFormContext();

  const watchCollection: string = watch('collection');
  const watchCollectionAssetId = watch('collectionAssetId');

  const {
    isLoading: collectionIdListLoading,
    refetch,
    isFetching: collectionIdListFetching,
  } = useQuery({
    queryKey: ['collectionList', watchCollection, debouncedCollectionInput],
    queryFn: () =>
      collectionListCall(router, walletAddress, debouncedCollectionInput),
    initialData: [],
    onSuccess: newData => {
      if (!newData) return;

      setCollectionIdData(prevData => {
        const overwrittenValues = new Map(
          [...prevData, ...newData].map(item => [item.assetId, item]),
        ).values();
        return Array.from(overwrittenValues);
      });
    },
  });

  const selectedCollection = collectionIdData?.filter(
    e => String(e.nftNonce) === watchCollectionAssetId,
  )[0];

  const collectionOptions: IDropdownItem[] = useMemo(() => {
    const allCollectionIdData = collectionIdData.map(asset => {
      const parseCollectionId = asset.assetId.split('/')[1];
      return { label: parseCollectionId, value: parseCollectionId };
    });
    allCollectionIdData.unshift({ label: 'New Collection', value: '' });
    return allCollectionIdData;
  }, [collectionIdData, selectedCollection?.assetType]);

  const selectedCollectionId = collectionOptions?.filter(
    e => e.value === watchCollectionAssetId,
  )[0] || { label: watchCollectionAssetId, value: watchCollectionAssetId } || {
      label: '',
      value: '',
    };

  let assetIdError: null | FieldError = null;

  try {
    assetIdError = errors?.collectionAssetID;
  } catch (e) {
    assetIdError = null;
  }

  const collectionIdChangeHandler = async (value: any) => {
    if (!isMultiContract && router.pathname !== '/')
      await setQuery('collectionAssetId', value?.value, router);
    setCollectionAssetId(value?.value);
    setValue('collectionAssetId', value?.value, {
      shouldValidate: true,
    });
  };

  const handleInputChange = (newValue: string) => {
    setCollectionInputValue(newValue);
  };

  return (
    <SelectContent>
      <FieldLabel>
        <MarginRightAutoLabel>Asset ID</MarginRightAutoLabel>
        {!collection?.isNFT && selectedCollection?.balance && (
          <>
            <ReloadWrapper
              onClick={e => {
                e.stopPropagation();
                e.preventDefault();

                refetch();
              }}
              $loading={collectionIdListFetching}
            >
              <IoReloadSharp />
            </ReloadWrapper>
            <BalanceLabel>
              Balance:{' '}
              {toLocaleFixed(
                selectedCollection?.balance /
                  10 ** (selectedCollection?.precision || 0),
                selectedCollection?.precision || 0,
              )}
            </BalanceLabel>
          </>
        )}
        <DropdownCustomLabel>
          <span>Custom value?</span>
          <input
            type="checkbox"
            checked={isCustom}
            onChange={() => setIsCustom(!isCustom)}
          />
        </DropdownCustomLabel>
      </FieldLabel>
      {isCustom ? (
        <AssetIDInput
          type="number"
          $error={Boolean(assetIdError)}
          {...register('collectionAssetId', {
            required: {
              value: true,
              message: 'This field is required',
            },
            onChange: e => {
              collectionIdChangeHandler(e.target);
            },
          })}
        />
      ) : (
        <Select
          options={collectionOptions}
          onChange={collectionIdChangeHandler}
          onInputChange={handleInputChange}
          loading={collectionIdListLoading}
          selectedValue={selectedCollectionId}
          zIndex={4}
          error={Boolean(assetIdError)}
        />
      )}
      {assetIdError && (
        <ErrorMessage style={{ color: 'red', fontSize: '0.8rem' }}>
          {assetIdError?.message || 'This field is required'}
        </ErrorMessage>
      )}
    </SelectContent>
  );
};
