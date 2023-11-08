import { useContract } from '@/contexts/contract';
import { useMulticontract } from '@/contexts/contract/multicontract';
import { parseAddress } from '@/utils/parseValues';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { IContractProps, SelectOption } from '.';
import FormInput from '../FormInput';
import { KDASelect } from '../KDASelect';
import { FormBody, FormSection } from '../styles';

type FormData = {
  bucketID: number;
};

const Unfreeze: React.FC<IContractProps> = ({ formKey, handleFormSubmit }) => {
  const [bucketsList, setBucketsList] = useState<any>([]);

  const { handleSubmit } = useFormContext<FormData>();
  const { getAssets } = useContract();
  const { queue } = useMulticontract();

  const collection = queue[formKey].collection;

  const onSubmit = async (data: FormData) => {
    await handleFormSubmit(data);
  };

  useEffect(() => {
    const fetchBuckets = async () => {
      const assetsList = (await getAssets()) || [];
      const buckets: SelectOption[] = [];
      assetsList?.forEach((item: any) => {
        if (item.label === collection?.label) {
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
  }, [collection]);

  return (
    <FormBody onSubmit={handleSubmit(onSubmit)} key={formKey}>
      <KDASelect />
      <FormSection>
        <FormInput
          name="bucketId"
          title="bucket"
          type="dropdown"
          options={bucketsList}
          required
        />
      </FormSection>
    </FormBody>
  );
};

export default Unfreeze;
