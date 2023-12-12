import { useContract } from '@/contexts/contract';
import { claimTypes } from '@/utils/contracts';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { IContractProps } from '.';
import FormInput from '../FormInput';
import { FormBody, FormSection } from '../styles';

type FormData = {
  claimType: number;
  id: string;
};

const Claim: React.FC<IContractProps> = ({ formKey, handleFormSubmit }) => {
  const { t } = useTranslation('transactions');
  const { handleSubmit, watch } = useFormContext<FormData>();
  const {} = useContract();
  const claimType = watch('claimType');

  const onSubmit = async (data: FormData) => {
    await handleFormSubmit(data);
  };

  return (
    <FormBody onSubmit={handleSubmit(onSubmit)} key={formKey}>
      <FormSection>
        <FormInput
          name="claimType"
          title={t('CreateAsset.Claim Type')}
          type="dropdown"
          options={claimTypes}
          required
        />
        <FormInput
          name="id"
          span={2}
          title={
            claimType === 2
              ? `${t('DelegateUndelegate.OrderId')}`
              : `${t('AssetId')}`
          }
          required
        />
      </FormSection>
    </FormBody>
  );
};

export default Claim;
