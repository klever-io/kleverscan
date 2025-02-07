import {
  PropsWithChildren,
  useState,
  ChangeEvent,
  useEffect,
  useCallback,
} from 'react';
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
  const [apiError, setApiError] = useState<string>('');

  const depositType: number = watch('depositType');

  const onSubmit = async (data: FormData) => {
    try {
      await handleFormSubmit(data);
      setApiError('');
    } catch (err) {
      setApiError('Error submitting form');
    }
  };

  useEffect(() => {
    const validateCurrency = async (): Promise<void> => {
      setIsLoading(true);

      try {
        if (currencyValue !== '') {
          const data = await getAsset(currencyValue);

          if (data?.data?.asset?.assetType === 'Fungible') {
            setCurrencyIsValid(true);
            setApiError('');
          } else {
            setCurrencyIsValid(false);
            setApiError('Invalid Currency');
          }
        }
      } catch (err) {
        setApiError('Error validating currency');
        setCurrencyIsValid(false);
      } finally {
        setIsLoading(false);
      }
    };
    const timeoutId = setTimeout(validateCurrency, 1000);

    return () => clearTimeout(timeoutId);
  }, [currencyValue]);

  const handlerValidate = useCallback(async () => {
    if (!currencyIsValid) {
      return 'Invalid Currency';
    }
    return true;
  }, [currencyIsValid]);

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
              apiError={apiError}
              propsValidate={handlerValidate}
            />
          </FormSection>
        </>
      )}
    </FormBody>
  );
};

export default Deposit;
