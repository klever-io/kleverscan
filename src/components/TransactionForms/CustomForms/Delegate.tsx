import { useContract } from '@/contexts/contract';
import { validatorsCall } from '@/services/requests/validators';
import { IValidator } from '@/types';
import { KLV_PRECISION, PERCENTAGE_PRECISION } from '@/utils/globalVariables';
import { useDebounce } from '@/utils/hooks';
import { parseAddress } from '@/utils/parseValues';
import React, { useEffect, useState } from 'react';
import { FieldError, useFormContext } from 'react-hook-form';
import { useInfiniteQuery } from 'react-query';
import { IContractProps, SelectOption } from '.';
import FormInput from '../FormInput';
import { FormBody, FormSection } from '../styles';

type FormData = {
  bucketId: number;
  receiver: string;
};

const Delegate: React.FC<IContractProps> = ({ formKey, handleFormSubmit }) => {
  const [bucketsList, setBucketsList] = useState<any>([]);
  const [typedName, setTypedName] = useState<string>('');

  const debouncedName = useDebounce(typedName, 500);

  const { handleSubmit } = useFormContext<FormData>();
  const { getAssets } = useContract();

  const onSubmit = async (data: FormData) => {
    await handleFormSubmit(data);
  };

  const {
    formState: { errors },
  } = useFormContext();

  let validatorError: null | FieldError = null;

  try {
    validatorError = errors?.collectionAssetID;
  } catch (e) {
    validatorError = null;
  }

  useEffect(() => {
    const fetchBuckets = async () => {
      const assetsList = (await getAssets()) || [];
      const buckets: SelectOption[] = [];
      assetsList?.forEach((item: any) => {
        if (item.label === 'KLV' || item.label === 'KFI') {
          item?.buckets?.forEach((bucket: any) => {
            buckets.push({
              label: parseAddress(bucket.id, 20),
              value: bucket.id,
            });
          });
        }
      });
      setBucketsList(buckets);
    };
    fetchBuckets();
  }, []);

  const { data: validatorsList, fetchNextPage } = useInfiniteQuery(
    ['validatorsList', debouncedName],
    ({ pageParam = 1 }) => validatorsCall(pageParam, debouncedName),
    {
      getNextPageParam: lastPage => {
        if (lastPage) {
          const { self, totalPages } = lastPage?.pagination;
          if (totalPages > self) {
            return self + 1;
          }
        }
      },
    },
  );

  const handleScrollBottom = () => {
    fetchNextPage();
  };

  const parsePagesValues = validatorsList?.pages.flatMap(page =>
    page.data.validators.map((validator: IValidator) => ({
      label: `${validator.name || validator.parsedAddress} - status: ${
        validator.status
      } - delegated KLV: ${validator.staked / 10 ** KLV_PRECISION} (max: ${
        validator.maxDelegation === 0
          ? '∞'
          : validator.maxDelegation / 10 ** KLV_PRECISION
      }) - commission: ${validator.commission / 10 ** PERCENTAGE_PRECISION}%`,
      value: validator.ownerAddress,
    })),
  );

  const handleInputChange = (newValue: string) => {
    setTypedName(newValue);
  };

  return (
    <FormBody onSubmit={handleSubmit(onSubmit)} key={formKey}>
      <FormSection>
        <FormInput
          name="bucketId"
          title="Bucket"
          type="dropdown"
          options={bucketsList}
          required
        />
        <FormInput
          name="receiver"
          title="Validator Address"
          span={2}
          tooltip="Validator to whom the bucket will be delegated"
          required
          creatable
          type="dropdown"
          options={parsePagesValues}
          handleScrollBottom={handleScrollBottom}
          onInputChange={handleInputChange}
        />
      </FormSection>
    </FormBody>
  );
};

export default Delegate;
