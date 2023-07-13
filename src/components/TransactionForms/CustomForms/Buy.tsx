import { useContract } from '@/contexts/contract';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { IContractProps } from '.';
import FormInput from '../FormInput';
import { FormBody, FormSection } from '../styles';

type FormData = {
  buyType: number;
  id: string;
  currencyId: string;
  amount: number;
};

const parseBuy = (data: FormData) => {
  data.buyType = data.buyType ? 1 : 0;
};

const Buy: React.FC<IContractProps> = ({ formKey, handleFormSubmit }) => {
  const { handleSubmit, watch } = useFormContext<FormData>();
  const {} = useContract();
  const buyType = watch('buyType');

  const onSubmit = async (data: FormData) => {
    parseBuy(data);
    await handleFormSubmit(data);
  };

  return (
    <FormBody onSubmit={handleSubmit(onSubmit)} key={formKey}>
      <FormSection>
        <FormInput
          name="buyType"
          title="Buy Type"
          type="checkbox"
          toggleOptions={['ITO Buy', 'Market Buy']}
        />
        <FormInput
          name="id"
          title={buyType ? 'Order ID' : 'ITO Asset ID'}
          required
        />
        <FormInput name="currencyId" title="Currency ID" required />
        <FormInput name="amount" title="Amount" type="number" required />
      </FormSection>
    </FormBody>
  );
};

export default Buy;
