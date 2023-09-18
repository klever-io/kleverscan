import { useExtension } from '@/contexts/extension';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { IContractProps } from '.';
import FormInput from '../FormInput';
import { FormBody, FormSection } from '../styles';
import { percentageProps } from './utils';
import { marketplaceTooltips as tooltip } from './utils/tooltips';

type FormData = {
  bucketID: number;
  receiver: string;
};

const CreateMarketplace: React.FC<IContractProps> = ({
  formKey,
  handleFormSubmit,
}) => {
  const { handleSubmit } = useFormContext<FormData>();
  const { walletAddress } = useExtension();

  const onSubmit = async (data: FormData) => {
    await handleFormSubmit(data);
  };

  return (
    <FormBody onSubmit={handleSubmit(onSubmit)} key={formKey}>
      <FormSection>
        <FormInput name="name" title="Name" required />
        <FormInput
          name="referralAddress"
          title="Referral Address"
          watchChange={walletAddress}
          tooltip="Address that will receive the referral percentage"
        />
        <FormInput
          name="referralPercentage"
          title="Referral Percentage"
          type="number"
          tooltip={tooltip.referralPercentage}
          {...percentageProps}
        />
      </FormSection>
    </FormBody>
  );
};

export default CreateMarketplace;
