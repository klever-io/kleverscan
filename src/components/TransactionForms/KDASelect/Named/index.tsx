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
  DropdownCustomLabel,
  ErrorMessage,
  RequiredSpan,
} from '@/components/TransactionForms/FormInput/styles';
import { useContract } from '@/contexts/contract';
import { useMulticontract } from '@/contexts/contract/multicontract';
import { ReloadWrapper } from '@/contexts/contract/styles';
import { useExtension } from '@/contexts/extension';
import { collectionListCall } from '@/services/requests/collection';
import { IDropdownItem } from '@/types';
import { setQueryAndRouter } from '@/utils';
import { toLocaleFixed } from '@/utils/formatFunctions';
import { useDebounce } from '@/utils/hooks';
import { NextParsedUrlQuery } from 'next/dist/server/request-meta';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { FieldError, useFormContext } from 'react-hook-form';
import { IoReloadSharp } from 'react-icons/io5';
import { useQuery } from 'react-query';
import FormInput, { cleanEmptyValues } from '../../FormInput';

const collectionContracts = [
  'ConfigITOContract',
  'ITOTriggerContract',
  'WithdrawContract',
];

interface IKDASelect {
  validateFields?: string[];
  shouldUseOwnedCollections?: boolean;
  name?: string;
  required?: boolean;
  allowedAssets?: string[];
}

export const NamedKDASelect: React.FC<IKDASelect> = props => {
  const { required } = props;
  const shouldUseOwnedCollections = props?.shouldUseOwnedCollections || false;
  const allowedAssets = props?.allowedAssets || ['*'];

  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<IDropdownItem[]>([]);
  const router = useRouter();

  const { getAssets, getKAssets, senderAccount } = useContract();
  const { walletAddress } = useExtension();

  const {
    register,
    setValue,
    formState: { errors },
    getValues,
    trigger,
    watch,
  } = useFormContext();

  const validateFields = props?.validateFields || [];

  const collection = watch('collection');

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

  const assetsList = useMemo(() => {
    const allAssetsList = shouldUseOwnedCollections
      ? kassetsList || []
      : accountAssetsList || [];

    if (allowedAssets.includes('*')) {
      return allAssetsList;
    }

    return allAssetsList.filter(asset => allowedAssets.includes(asset.assetId));
  }, [accountAssetsList, kassetsList, shouldUseOwnedCollections]);

  useEffect(() => {
    setOptions(assetsList);
  }, [assetsList]);

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

  let assetBalance = 0;
  assetBalance = collection?.balance || 0;
  let collectionError: null | FieldError = null;

  try {
    collectionError = errors?.collection;
  } catch (e) {
    collectionError = null;
  }

  useEffect(() => {
    refetch();
  }, [senderAccount]);

  const showAssetIdInputConditional = collection?.isNFT;

  return (
    <SelectContainer key={collection?.assetId} span={2}>
      <SelectContent>
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
              Balance:{' '}
              {toLocaleFixed(
                assetBalance / 10 ** (collection?.precision || 0),
                collection?.precision || 0,
              )}
            </BalanceLabel>
          )}
        </BalanceContainer>
        <FormInput
          name={props.name || 'collection'}
          type="dropdown"
          selectPlaceholder="Select an asset/collection"
          options={options}
          required={required}
          selectFilter={item => {
            const filtered = item;
            filtered.label = item.label.split('/')[0];
            filtered.value = item.label.split('/')[0];

            return item;
          }}
          titleLess
        />
        {collectionError && (
          <ErrorMessage style={{ color: 'red', fontSize: '0.8rem' }}>
            {collectionError?.message || 'This field is required'}
          </ErrorMessage>
        )}
      </SelectContent>
      {showAssetIdInputConditional && (
        <CollectionIDField name={props.name || 'collection'} />
      )}
    </SelectContainer>
  );
};

const CollectionIDField: React.FC<{ name: string }> = props => {
  const name = props.name;
  const [isCustom, setIsCustom] = useState(false);
  const [collectionInputValue, setCollectionInputValue] = useState('');
  const [collectionIdData, setCollectionIdData] = useState<IDropdownItem[]>([]);
  const debouncedCollectionInput = useDebounce(collectionInputValue, 500);
  const router = useRouter();
  const { walletAddress } = useExtension();
  const { isMultiContract } = useMulticontract();

  const {
    register,
    setValue,
    formState: { errors },
    watch,
    trigger,
    getValues,
  } = useFormContext();

  const collectionName: string = (watch(name) || '').split('/')[0];
  const collectionAssetId =
    (collectionName || '').split('/').length > 1
      ? collectionName.split('/')[1]
      : '';

  const { isLoading: collectionIdListLoading } = useQuery({
    queryKey: ['collectionList', collectionName, debouncedCollectionInput],
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

  const collectionId = collectionIdData?.filter(
    e => e.value === collectionAssetId,
  )[0] || {
      label: collectionAssetId,
      value: collectionAssetId,
    } || {
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
    const newValue = collectionName + '/' + value?.value;

    setValue(name, newValue, {
      shouldValidate: true,
    });

    if (isMultiContract) {
      return;
    }

    const nonEmptyValues = cleanEmptyValues(getValues());

    let newQuery: NextParsedUrlQuery = router.query?.contract
      ? { contract: router.query?.contract }
      : {};

    newQuery = {
      ...newQuery,
      ...router.query,
      contractDetails: JSON.stringify(nonEmptyValues),
    };

    setQueryAndRouter(newQuery, router);
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
          onChange={e => collectionIdChangeHandler(e.target)}
        />
      ) : (
        <Select
          options={collectionIdData}
          onChange={collectionIdChangeHandler}
          onInputChange={handleInputChange}
          loading={collectionIdListLoading}
          selectedValue={collectionId}
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
