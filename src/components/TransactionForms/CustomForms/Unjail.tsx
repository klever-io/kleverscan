import { useContract } from '@/contexts/contract';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { IContractProps } from '.';
import { FormBody, FormSection, SectionText } from '../styles';

type FormData = {
  orderId: string;
};

const Unjail: React.FC<IContractProps> = ({ formKey, handleFormSubmit }) => {
  const { t } = useTranslation('transactions');
  const { handleSubmit } = useFormContext<FormData>();
  const {} = useContract();

  const onSubmit = async (data: FormData) => {
    await handleFormSubmit(data);
  };

  return (
    <FormBody onSubmit={handleSubmit(onSubmit)} key={formKey}>
      <FormSection>
        <SectionText>{t('NoData')}</SectionText>
      </FormSection>
    </FormBody>
  );
};

export default Unjail;
