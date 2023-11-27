import { useMulticontract } from '@/contexts/contract/multicontract';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { IContractProps } from '.';
import FormInput from '../FormInput';
import { KDASelect } from '../KDASelect';
import { FormBody, FormSection } from '../styles';

type FormData = {
  amount: number;
  kda: string;
};

const Freeze: React.FC<IContractProps> = ({ formKey, handleFormSubmit }) => {
  const { t } = useTranslation('transactions');
  const { handleSubmit } = useFormContext<FormData>();
  const { queue } = useMulticontract();

  const collection = queue[formKey].collection;

  const onSubmit = async (data: FormData) => {
    await handleFormSubmit(data);
  };

  return (
    <FormBody onSubmit={handleSubmit(onSubmit)} key={formKey}>
      <KDASelect validateFields={['amount']} />
      <FormSection>
        <FormInput
          name="amount"
          title={t('Amount')}
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
