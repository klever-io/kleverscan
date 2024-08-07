import { formatNumberDecimal } from '@/utils/formatFunctions';
import { PropsWithChildren, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { IAssetInformations } from '..';
import { ButtonsComponent } from '../ButtonsComponent';
import {
  ErrorMessage,
  GenericCardContainer,
  GenericInfoCard,
  GenericInput,
} from '../styles';

export const CreateAssetMaxSupplyStep: React.FC<PropsWithChildren<
  IAssetInformations
>> = ({ informations: { description, kleverTip }, handleStep, t }) => {
  const {
    watch,
    register,
    formState: { errors },
  } = useFormContext();
  const [inputValue, setInputValue] = useState('');
  const ticker = watch('ticker');
  watch('maxSupply');

  let error = errors?.maxSupply;

  const buttonsProps = {
    handleStep,
    next: !error,
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setInputValue(formatNumberDecimal(value));
  };

  return (
    <GenericCardContainer>
      <div>
        <p>{t('wizards:common.basicOptions.basicInfoText')}</p>
        <p>{t('wizards:common.step')} 6/7</p>
      </div>
      <div>
        <p>{t('wizards:common.maxSupplyOf', { ticker })}</p>
        <p>{description}</p>
        <GenericInput
          error={error}
          type="text"
          value={inputValue}
          placeholder="0"
          {...register('maxSupply', {
            pattern: {
              value: /\d+/g,
              message: t('wizards:common.errorMessage.onlyNumbers'),
            },
          })}
          onChange={handleInputChange}
          align={'right'}
        />
        {error && <ErrorMessage>{error?.message}</ErrorMessage>}

        <GenericInfoCard>{kleverTip}</GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};
