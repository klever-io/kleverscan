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

const ConfigMarketplace: React.FC<IContractProps> = ({
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
        <FormInput name="marketplaceId" title="Marketplace ID" required />
        <FormInput name="name" title="New Name" required />
        <FormInput
          name="referralAddress"
          title="New Referral Address"
          dynamicInitialValue={walletAddress}
        />
        <FormInput
          name="referralPercentage"
          title="New Referral Percentage"
          type="number"
          tooltip={tooltip.referralPercentage}
          {...percentageProps}
          required
        />
      </FormSection>
    </FormBody>
  );
};

export default ConfigMarketplace;
