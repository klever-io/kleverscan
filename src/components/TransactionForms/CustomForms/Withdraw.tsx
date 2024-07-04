import { PropsWithChildren } from 'react';
import { withdrawTypes } from '@/utils/contracts';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { IContractProps } from '.';
import FormInput from '../FormInput';
import { KDASelect } from '../KDASelect';
import { FormBody, FormSection } from '../styles';

type FormData = {
  withdrawType: number;
  kda: string;
  amount: number;
  currencyID: string;
};

const Withdraw: React.FC<PropsWithChildren<IContractProps>> = ({
  formKey,
  handleFormSubmit,
}) => {
  const { handleSubmit, watch } = useFormContext<FormData>();
  const withdrawType: number = watch('withdrawType');

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
          <KDASelect withdrawType={withdrawType} />
          {withdrawType === 1 && (
            <FormSection>
              <FormInput
                name="amount"
                title="Amount"
                type="number"
                tooltip="Amount to be withdrawn from the pool"
              />
              <FormInput
                name="currencyId" // although the doc says it is currencyID, using currencyId still works, changing it now will break many things
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
