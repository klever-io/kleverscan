import { useContract } from '@/contexts/contract';
import { validatorsCall } from '@/services/requests/validators';
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
    ['validatorsList'],
    ({ pageParam = 1 }) => validatorsCall(pageParam),
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

  const parsePagesValues = validatorsList?.pages.map(value => {
    return value?.data?.validators.map((e: any) => {
      if (e.name) {
        return { label: e.name, value: e.ownerAddress };
      }
      return { label: e.parsedAddress, value: e.ownerAddress };
    });
  });

  const parseValidatorsOptions = [].concat(
    ...(parsePagesValues?.map(e => e) || []),
  );

  return (
    <FormBody onSubmit={handleSubmit(onSubmit)} key={formKey}>
      <FormSection>
        <FormInput
          zIndex={3}
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
          type="dropdown"
          options={parseValidatorsOptions}
          handleScrollBottom={handleScrollBottom}
        />
      </FormSection>
    </FormBody>
  );
};

export default Delegate;
