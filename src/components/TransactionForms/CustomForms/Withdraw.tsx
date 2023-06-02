import { useContract } from '@/contexts/contract';
import { withdrawTypes } from '@/utils/contracts';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { IContractProps } from '.';
import { FormSection } from '../../Form/styles';
import FormInput from '../FormInput';
import { FormBody } from '../styles';

type FormData = {
  withdrawType: number;
  kda: string;
  amount: number;
  currencyID: string;
};

const Withdraw: React.FC<IContractProps> = ({ formKey, handleFormSubmit }) => {
  const { handleSubmit, watch } = useFormContext<FormData>();
  const { useKDASelect } = useContract();
  const withdrawType: number = watch('withdrawType');

  const [_, KDASelect] = useKDASelect({ withdrawType });

  const onSubmit = async (data: FormData) => {
    await handleFormSubmit(data);
  };

  return (
    <FormBody onSubmit={handleSubmit(onSubmit)} key={formKey}>
      <FormSection>
        <FormInput
          name="withdrawType"
          title="Withdraw Type"
          type="dropdown"
          options={withdrawTypes}
          zIndex={3}
        />
      </FormSection>
      {(withdrawType === 0 || withdrawType === 1) && (
        <>
          <KDASelect />
          {withdrawType === 1 && (
            <FormSection>
              <FormInput
                name="amount"
                title="Amount"
                type="number"
                tooltip="Amount to be withdrawn from the pool"
              />
              <FormInput
                name="currencyId"
                title="Currency ID"
                tooltip="Asset to be withdrawn from the pool"
              />
            </FormSection>
          )}
        </>
      )}
    </FormBody>
  );
};

export default Withdraw;
