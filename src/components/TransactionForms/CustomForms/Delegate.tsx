import { useContract } from '@/contexts/contract';
import { parseAddress } from '@/utils/parseValues';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { IContractProps, SelectOption } from '.';
import { FormSection } from '../../Form/styles';
import FormInput from '../FormInput';
import { FormBody } from '../styles';

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
        />
      </FormSection>
    </FormBody>
  );
};

export default Delegate;
