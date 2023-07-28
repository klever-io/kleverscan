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
  ErrorMessage,
  RequiredSpan,
} from '@/components/TransactionForms/FormInput/styles';
import { useContract } from '@/contexts/contract';
import { useMulticontract } from '@/contexts/contract/multicontract';
import { ReloadWrapper } from '@/contexts/contract/styles';
import { ICollectionList } from '@/types';
import { useEffect, useState } from 'react';
import { FieldError, useFormContext } from 'react-hook-form';
import { IoReloadSharp } from 'react-icons/io5';
import { useQuery } from 'react-query';
import { toLocaleFixed } from '../formatFunctions';

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

interface IKDASelect {
  assetTriggerType?: number | null;
  withdrawType?: number | null;
  validateFields?: string[];
}

interface ISelectProps {
  required?: boolean;
}

export const useKDASelect = (
  params?: IKDASelect,
): [ICollectionList | undefined, React.FC<ISelectProps>] => {
  const [loading, setLoading] = useState(false);

  const { getAssets, getKAssets, getOwnerAddress } = useContract();

  const {
    selectedContractType: contractType,
    queue,
    setCollection,
    setCollectionAssetId,
    parsedIndex,
  } = useMulticontract();

  const collectionAssetId = queue[parsedIndex]?.collectionAssetId;

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
  const watchCollectionAssetId = watch('collectionAssetId');

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

  const selectedCollection = assetsList?.find(
    asset => asset.value === watchCollection,
  );
  useEffect(() => {
    if (watchCollection && watchCollection !== selectedCollection?.value) {
      selectedCollection && setCollection(selectedCollection);
      !selectedCollection && setCollection(watchCollection);
    }
  }, [watchCollection, assetsList]);

  useEffect(() => {
    if (
      watchCollectionAssetId &&
      watchCollectionAssetId !== collectionAssetId
    ) {
      setCollectionAssetId(watchCollectionAssetId);
    }
  }, [watchCollectionAssetId]);

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

    useEffect(() => {
      if (!showAssetIdInputConditional) {
        setValue('collectionAssetID', '');
      }
    }, [showAssetIdInputConditional]);

    const CollectionIDField: React.FC = () => {
      // useEffect(() => {
      //   return () => {
      //     (!collection?.isNFT ||
      //       collectionContracts.includes(contractType) ||
      //       !showAssetIdInput(contractType, assetTriggerType)) &&
      //       setValue('collectionAssetID', '');
      //   };
      // }, []);

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
            selectedValue={
              selectedCollection?.value ? selectedCollection : undefined
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
