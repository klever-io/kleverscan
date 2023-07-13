import { useContract } from '@/contexts/contract';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { IContractProps } from '.';
import FormInput from '../FormInput';
import { FormBody, FormSection } from '../styles';

type FormData = {
  orderId: string;
};

const CancelMarketOrder: React.FC<IContractProps> = ({
  formKey,
  handleFormSubmit,
}) => {
  const { handleSubmit } = useFormContext<FormData>();
  const {} = useContract();

  const onSubmit = async (data: FormData) => {
    await handleFormSubmit(data);
  };

  return (
    <FormBody onSubmit={handleSubmit(onSubmit)} key={formKey}>
      <FormSection>
        <FormInput
          name="orderId"
          title="Order ID"
          tooltip='ID generated on "Sell" Contract'
          required
        />
      </FormSection>
    </FormBody>
  );
};

export default CancelMarketOrder;
