import { PropsWithChildren, useState, ChangeEvent, useEffect } from 'react';
import { depositTypes } from '@/utils/contracts';
import { toUpperCaseValue } from '@/utils';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { IContractProps } from '.';
import FormInput from '../FormInput';
import { KDASelect } from '../KDASelect';
import { FormBody, FormSection } from '../styles';
import { getAsset } from '@/services/requests/asset';

type FormData = {
  depositType: number;
  kda: string;
  amount: number;
  currencyID: string;
};

const Deposit: React.FC<PropsWithChildren<IContractProps>> = ({
  formKey,
  handleFormSubmit,
}) => {
  const { handleSubmit, watch } = useFormContext<FormData>();
  const [currencyValue, setCurrencyValue] = useState<string>('');
  const [currencyIsValid, setCurrencyIsValid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const depositType: number = watch('depositType');

  const onSubmit = async (data: FormData) => {
    await handleFormSubmit(data);
  };

  useEffect(() => {
    const validateCurrency = async (): Promise<void> => {
      if (currencyValue === '') {
        setCurrencyIsValid(false);
        setError('Invalid Currency');
        return;
      }

      setIsLoading(true);
      setError('');

      try {
        const data = await getAsset(currencyValue);

        if (data?.data?.asset?.assetType === 'Fungible') {
          setCurrencyIsValid(true);
          setError('');
        } else {
          setCurrencyIsValid(false);
          setError('Invalid Currency');
        }
      } catch (err) {
        setError('Error validating currency');
        setCurrencyIsValid(false);
      } finally {
        setIsLoading(false);
      }
    };
    const timeoutId = setTimeout(validateCurrency, 1000);

    return () => clearTimeout(timeoutId);
  }, [currencyValue]);

  const handlerValidate = () => {
    if (!currencyIsValid) {
      return error;
    }
    return true;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const newValue = toUpperCaseValue(e.target.value);
    setCurrencyValue(newValue);
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
              value={currencyValue}
              onChange={handleChange}
              tooltip={`Asset to be deposited into the ${
                depositType ? 'KDA Fee' : 'FPR'
              } pool`}
              required
              loading={isLoading}
              propsValidate={handlerValidate}
            />
          </FormSection>
        </>
      )}
    </FormBody>
  );
};

export default Deposit;
