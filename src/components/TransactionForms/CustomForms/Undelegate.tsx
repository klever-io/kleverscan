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
  kda: string;
};

const Undelegate: React.FC<IContractProps> = ({
  formKey,
  handleFormSubmit,
}) => {
  const [bucketsList, setBucketsList] = useState<any>([]);

  const { handleSubmit } = useFormContext<FormData>();
  const { getAssets, getOwnerAddress } = useContract();

  const onSubmit = async (data: FormData) => {
    await handleFormSubmit(data);
  };

  useEffect(() => {
    const getBuckets = async () => {
      const assetsList = (await getAssets()) || [];
      const buckets: SelectOption[] = [];
      assetsList?.forEach((asset: any) => {
        asset?.buckets?.forEach((bucket: any) => {
          if (bucket?.delegation !== getOwnerAddress() && bucket.delegation) {
            buckets.push({
              label: parseAddress(bucket.id, 20),
              value: bucket.id,
            });
          }
        });
      });

      setBucketsList(buckets);
    };
    getBuckets();
  }, []);

  return (
    <FormBody onSubmit={handleSubmit(onSubmit)} key={formKey}>
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

export default Undelegate;