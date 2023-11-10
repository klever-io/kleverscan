import Select from '@/components/Contract/Select';
import {
  AssetIDInput,
  BalanceContainer,
  BalanceLabel,
  FieldLabel,
  SelectContainer,
  SelectContent,
} from '@/components/Contract/styles';
import { getAssetsList, showAssetIdInput } from '@/components/Contract/utils';
import {
  DropdownCustomLabel,
  ErrorMessage,
  RequiredSpan,
} from '@/components/TransactionForms/FormInput/styles';
import { useContract } from '@/contexts/contract';
import { useMulticontract } from '@/contexts/contract/multicontract';
import { ReloadWrapper } from '@/contexts/contract/styles';
import { useExtension } from '@/contexts/extension';
import { collectionListCall } from '@/services/requests/collection';
import { ICollectionList, IDropdownItem } from '@/types';
import { toLocaleFixed } from '@/utils/formatFunctions';
import { useDebounce } from '@/utils/hooks';
import { setQuery } from '@/utils/hooks/contract';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
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

export const KDASelect: React.FC<IKDASelect> = props => {
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

  const { getAssets, getKAssets } = useContract();
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
    data: kassetsList,
    refetch: refetchKassetsList,
    isFetching: kassetsFetching,
  } = useQuery({
    queryKey: 'kassetsList',
    queryFn: getKAssets,
    initialData: [],
    enabled: walletAddress !== '',
  });

  const [options, setOptions] = useState<IDropdownItem[]>([]);

  const assetsList = useMemo(() => {
    return kAssetContracts.includes(contractType)
      ? kassetsList || []
      : accountAssetsList || [];
  }, [accountAssetsList, kassetsList, contractType]);

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
    kassetsList,
    assetTriggerType,
    withdrawType,
  ]);

  useEffect(() => {
    if (!kassetsFetching && !assetsFetching && loading) {
      setLoading(false);
    } else if (!loading) {
      setLoading(true);
    }
  }, [assetsFetching, kassetsFetching]);

  const setCollectionValue = async (value?: ICollectionList) => {
    if (!isMultiContract && router.pathname !== '/')
      value?.value &&
        (await setQuery('collection', value?.value || '', router));

    setCollection(value?.value ? value : undefined);
    setValue('collection', value?.value || '');

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
    refetchKassetsList();
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

  const showAssetIdInputConditional =
    selectedCollection?.isNFT &&
    !collectionContracts.includes(contractType) &&
    showAssetIdInput(contractType, assetTriggerType);

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
    if (!value.isNFT) {
      setValue('collectionAssetId', '');
    }
  };

  return (
    <SelectContainer key={selectedCollection?.assetId}>
      <SelectContent configITO={contractType === 'ConfigITOContract'}>
        <BalanceContainer>
          <FieldLabel>
            Select an asset/collection
            {required && <RequiredSpan> (required)</RequiredSpan>}
          </FieldLabel>
          <ReloadWrapper onClick={refetch} $loading={loading}>
            <IoReloadSharp />
          </ReloadWrapper>
          {selectedCollection?.balance && (
            <BalanceLabel>
              Balance:{' '}
              {toLocaleFixed(
                assetBalance / 10 ** (selectedCollection?.precision || 0),
                selectedCollection?.precision || 0,
              )}
            </BalanceLabel>
          )}
        </BalanceContainer>
        <Select
          collection={selectedCollection}
          options={options}
          onChange={onChangeHandler}
          loading={loading}
          selectedValue={
            selectedCollection?.value
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
      {showAssetIdInputConditional && <CollectionIDField />}
    </SelectContainer>
  );
};

const CollectionIDField: React.FC = () => {
  const [isCustom, setIsCustom] = useState(false);
  const [collectionInputValue, setCollectionInputValue] = useState('');
  const [collectionIdData, setCollectionIdData] = useState<IDropdownItem[]>([]);
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

  const { isLoading: collectionIdListLoading } = useQuery({
    queryKey: ['collectionList', watchCollection, debouncedCollectionInput],
    queryFn: () =>
      collectionListCall(router, walletAddress, debouncedCollectionInput),
    initialData: [],
    onSuccess: newData => {
      if (!newData) return;

      setCollectionIdData(prevData => {
        return [...prevData, ...newData];
      });
    },
  });

  const selectedCollectionId = collectionIdData?.filter(
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
    if (!isMultiContract)
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
        <span>Asset ID</span>
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
          options={collectionIdData}
          onChange={collectionIdChangeHandler}
          onInputChange={handleInputChange}
          loading={collectionIdListLoading}
          selectedValue={selectedCollectionId}
          zIndex={3}
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
