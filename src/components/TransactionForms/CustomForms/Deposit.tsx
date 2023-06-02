import { useContract } from '@/contexts/contract';
import { depositTypes } from '@/utils/contracts';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { IContractProps } from '.';
import { FormSection } from '../../Form/styles';
import FormInput from '../FormInput';
import { FormBody } from '../styles';

type FormData = {
  depositType: number;
  kda: string;
  amount: number;
  currencyID: string;
};

const Deposit: React.FC<IContractProps> = ({ formKey, handleFormSubmit }) => {
  const { handleSubmit, watch } = useFormContext<FormData>();
  const { useKDASelect } = useContract();
  const depositType: number = watch('depositType');

  const [_, KDASelect] = useKDASelect();

  const onSubmit = async (data: FormData) => {
    await handleFormSubmit(data);
  };

  return (
    <FormBody onSubmit={handleSubmit(onSubmit)} key={formKey}>
      <FormSection>
        <FormInput
          name="depositType"
          title="Deposit Type"
          type="dropdown"
          options={depositTypes}
          zIndex={4}
          required
        />
      </FormSection>
      {(depositType === 0 || depositType === 1) && (
        <>
          <KDASelect required />
          <FormSection>
            <FormInput
              name="amount"
              title="Amount"
              type="number"
              tooltip={`Amount to be deposited into the ${
                depositType ? 'KDA Fee' : 'FPR'
              } pool`}
              required
            />
            <FormInput
              name="currencyId"
              title="Currency ID"
              tooltip={`Asset to be deposited into the ${
                depositType ? 'KDA Fee' : 'FPR'
              } pool`}
              required
            />
          </FormSection>
        </>
      )}
    </FormBody>
  );
};

export default Deposit;
