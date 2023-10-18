import Select from '@/components/Contract/Select';
import {
  BalanceContainer,
  BalanceLabel,
  FieldLabel,
  SelectContainer,
  SelectContent,
} from '@/components/Contract/styles';
import { getAssetsList, showAssetIdInput } from '@/components/Contract/utils';
import {
  ErrorMessage,
  RequiredSpan,
} from '@/components/TransactionForms/FormInput/styles';
import { useContract } from '@/contexts/contract';
import { useMulticontract } from '@/contexts/contract/multicontract';
import { ReloadWrapper } from '@/contexts/contract/styles';
import { useExtension } from '@/contexts/extension';
import { collectionListCall } from '@/services/requests/collection';
import { ICollectionList, IDropdownItem } from '@/types';
import { NextRouter, useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FieldError, useFormContext } from 'react-hook-form';
import { IoReloadSharp } from 'react-icons/io5';
import { useQuery } from 'react-query';
import { setQueryAndRouter } from '..';
import { toLocaleFixed } from '../formatFunctions';

const collectionContracts = [
  'ConfigITOContract',
  'ITOTriggerContract',
  'WithdrawContract',
];

interface IKDASelect {
  assetTriggerType?: number | null;
  withdrawType?: number | null;
  validateFields?: string[];
}

interface ISelectProps {
  required?: boolean;
}

export const setQuery = async (
  key: string,
  value: string,
  router: NextRouter,
): Promise<void> => {
  while (!router.isReady) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  const newQuery = {
    ...router.query,
  };

  if (value) {
    if (!newQuery?.contractDetails) newQuery.contractDetails = '{}';

    newQuery.contractDetails = JSON.stringify({
      ...JSON.parse(newQuery.contractDetails as string),
      [key]: value,
    });
  } else {
    if (!newQuery?.contractDetails) return;

    const contractDetails = JSON.parse(newQuery.contractDetails as string);
    if (!contractDetails[key]) return;

    delete contractDetails[key];
    newQuery.contractDetails = JSON.stringify(contractDetails);
  }
  setQueryAndRouter(newQuery, router);
};

export const useKDASelect = (
  params?: IKDASelect,
): [ICollectionList | undefined, React.FC<ISelectProps>] => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const kAssetContracts = [
    'AssetTriggerContract',
    'ConfigITOContract',
    'ITOTriggerContract',
    'DepositContract',
  ];

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

  const collectionAssetId = queue[parsedIndex]?.collectionAssetId;

  const assetTriggerType =
    params?.assetTriggerType !== undefined ? params?.assetTriggerType : null;
  const withdrawType =
    params?.withdrawType !== undefined ? params?.withdrawType : null;
  const validateFields = params?.validateFields || [];

  if (withdrawType === 1 && !kAssetContracts.includes('WithdrawContract')) {
    kAssetContracts.push('WithdrawContract');
  } else if (withdrawType === 0) {
    const index = kAssetContracts.indexOf('WithdrawContract');
    if (index > -1) {
      kAssetContracts.splice(index, 1);
    }
  }

  const {
    register,
    setValue,
    formState: { errors },
    getValues,
    trigger,
    watch,
  } = useFormContext();

  const watchCollection: string = watch('collection');
  const watchCollectionAssetId = watch('collectionAssetId');

  const {
    data: assetsList,
    refetch: refetchAssetsList,
    isFetching: assetsFetching,
  } = useQuery({
    queryKey: 'assetsList',
    queryFn: getAssets,
    initialData: [],
    enabled: walletAddress !== '',
  });

  const { data: collectionIdList, isFetching: collectionIdListFetching } =
    useQuery({
      queryKey: ['collectionList', watchCollection],
      queryFn: () => collectionListCall(router, walletAddress),
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
    enabled: walletAddress !== '',
  });

  const [options, setOptions] = useState<IDropdownItem[]>([]);

  useEffect(() => {
    setOptions(
      getAssetsList(
        kAssetContracts.includes(contractType)
          ? kassetsList || []
          : assetsList || [],
        contractType,
        assetTriggerType,
        withdrawType,
        walletAddress,
      ),
    );
    setCollectionValue(undefined);
  }, [walletAddress, assetsList, kassetsList, assetTriggerType, withdrawType]);

  useEffect(() => {
    if (!kassetsFetching && !assetsFetching && loading) {
      setLoading(false);
    } else if (!loading) {
      setLoading(true);
    }
  }, [assetsFetching, kassetsFetching]);

  const setCollectionValue = async (value?: ICollectionList) => {
    if (!value) {
      await setQuery('collection', '', router);
      setCollection(undefined);
      setValue('collection', '', {
        shouldValidate: true,
      });
      return;
    }

    if (!isMultiContract && router.pathname !== '/')
      await setQuery('collection', value?.value, router);
    setCollection(value);
    setValue('collection', value?.value, {
      shouldValidate: false,
    });
  };

  const refetch = () => {
    refetchAssetsList();
    refetchKassetsList();
  };
  const getSelectedCollection = () => {
    const assets = [];
    kAssetContracts.includes(contractType)
      ? assets.push(...(kassetsList || []))
      : assets.push(...(assetsList || []));

    return assets?.find(asset => asset.value === watchCollection);
  };

  const selectedCollection = getSelectedCollection();

  useEffect(() => {
    selectedCollection && setCollection(selectedCollection);
  }, [assetsList, selectedCollection]);

  useEffect(() => {
    collectionAssetId && setCollectionAssetId(watchCollectionAssetId);
  }, [watchCollectionAssetId, collectionAssetId]);

  useEffect(() => {
    validateFields.forEach(field => {
      const value = getValues(field);
      if (value) {
        trigger(field);
      }
    });
  }, [selectedCollection]);

  let assetBalance = 0;
  assetBalance = selectedCollection?.balance || 0;

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
      selectedCollection?.isNFT &&
      !collectionContracts.includes(contractType) &&
      showAssetIdInput(contractType, assetTriggerType);

    const CollectionIDField: React.FC = () => {
      const selectedCollectionId = collectionIdList?.filter(
        e => e.value === watchCollectionAssetId,
      )[0] || { label: '', value: '' };

      const collectionIdChangeHandler = async (value: any) => {
        if (!isMultiContract)
          await setQuery('collectionAssetId', value?.value, router);
        setCollectionAssetId(value?.value);
        setValue('collectionAssetId', value?.value, {
          shouldValidate: true,
        });
      };
      return (
        <SelectContent>
          <FieldLabel>Asset ID</FieldLabel>
          <Select
            options={collectionIdList}
            onChange={collectionIdChangeHandler}
            loading={collectionIdListFetching}
            selectedValue={selectedCollectionId}
            zIndex={3}
            error={Boolean(assetIdError)}
          />
          {assetIdError && (
            <ErrorMessage style={{ color: 'red', fontSize: '0.8rem' }}>
              {collectionError?.message || 'This field is required'}
            </ErrorMessage>
          )}
        </SelectContent>
      );
    };

    useEffect(() => {
      router.isReady &&
        router.query.collection &&
        setCollection(
          assetsList?.find(
            asset => asset.value === router.query.collection?.toString(),
          ),
        );
    }, [router, assetsList]);

    const onChangeHandler = async (value: ICollectionList) => {
      setCollectionValue(value);
      if (!value.isNFT) {
        setValue('collectionAssetId', '');
      }
    };

    return (
      <SelectContainer key={JSON.stringify(selectedCollection)}>
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

  return [selectedCollection, KDASelect];
};
