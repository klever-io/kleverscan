import { useContract } from '@/contexts/contract';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { IContractProps } from '.';
import FormInput from '../FormInput';
import { FormBody, FormSection } from '../styles';

type FormData = {
  orderId: string;
};

const SetAccountName: React.FC<IContractProps> = ({
  formKey,
  handleFormSubmit,
}) => {
  const { t } = useTranslation('transactions');
  const { handleSubmit } = useFormContext<FormData>();
  const {} = useContract();

  const onSubmit = async (data: FormData) => {
    await handleFormSubmit(data);
  };

  return (
    <FormBody onSubmit={handleSubmit(onSubmit)} key={formKey}>
      <FormSection>
        <FormInput name="name" title={t('AccountName')} required />
      </FormSection>
    </FormBody>
  );
};

export default SetAccountName;
