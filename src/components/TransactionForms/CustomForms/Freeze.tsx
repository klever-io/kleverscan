import { useKDASelect } from '@/utils/hooks/contract';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { IContractProps } from '.';
import { FormSection } from '../../Form/styles';
import FormInput from '../FormInput';
import { FormBody } from '../styles';

type FormData = {
  amount: number;
  kda: string;
};

const Freeze: React.FC<IContractProps> = ({ formKey, handleFormSubmit }) => {
  const { handleSubmit } = useFormContext<FormData>();
  const [collection, KDASelect] = useKDASelect({
    validateFields: ['amount'],
  });

  const onSubmit = async (data: FormData) => {
    await handleFormSubmit(data);
  };

  return (
    <FormBody onSubmit={handleSubmit(onSubmit)} key={formKey}>
      <KDASelect />
      <FormSection>
        <FormInput
          name="amount"
          title="Amount"
          type="number"
          tooltip="Amount to be frozen"
          precision={collection?.precision}
          required
        />
      </FormSection>
    </FormBody>
  );
};

export default Freeze;
