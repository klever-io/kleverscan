import { useKDASelect } from '@/utils/hooks/contract';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { IContractProps } from '.';
import { FormSection } from '../../Form/styles';
import FormInput from '../FormInput';
import { FormBody } from '../styles';

type FormData = {
  receiver: string;
  amount: number;
  kda: string;
};

const Transfer: React.FC<IContractProps> = ({ formKey, handleFormSubmit }) => {
  const { handleSubmit } = useFormContext<FormData>();
  const [collection, KDASelect] = useKDASelect({
    validateFields: ['amount'],
  });

  const transferParse = (data: FormData) => {
    if (collection?.isNFT) {
      data['amount'] = 1;
    }
  };

  const onSubmit = async (data: FormData) => {
    transferParse(data);
    await handleFormSubmit(data);
  };

  return (
    <FormBody onSubmit={handleSubmit(onSubmit)} key={formKey}>
      <KDASelect />
      <FormSection>
        {!collection?.isNFT && (
          <FormInput
            name="amount"
            title="Amount"
            type="number"
            required
            precision={collection?.precision}
          />
        )}
        <FormInput name="receiver" title="Receiver Address" required />
      </FormSection>
    </FormBody>
  );
};

export default Transfer;
