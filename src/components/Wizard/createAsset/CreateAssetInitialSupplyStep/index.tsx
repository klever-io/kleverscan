import { formatNumberDecimal } from '@/utils/formatFunctions';
import { PropsWithChildren, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { IWizardComponents } from '..';
import { ButtonsComponent } from '../ButtonsComponent';
import {
  ErrorMessage,
  GenericCardContainer,
  GenericInfoCard,
  GenericInput,
} from '../styles';

export const CreateAssetInitialSupplyStep: React.FC<PropsWithChildren<
  IWizardComponents
>> = ({ handleStep, t }) => {
  const {
    watch,
    register,
    formState: { errors },
  } = useFormContext();
  const [inputValue, setInputValue] = useState('');
  const ticker = watch('ticker');
  watch('initialSupply');

  let error = errors?.initialSupply;

  const buttonsProps = {
    handleStep,
    next: !error,
  };
  const handleInputChange = (e: { target: { value: string } }) => {
    setInputValue(formatNumberDecimal(e.target.value));
  };
  return (
    <GenericCardContainer>
      <div>
        <p>{t('wizards:common.basicOptions.basicInfoText')}</p>
        <p>{t('wizards:common.step')} 5/7</p>
      </div>
      <div>
        <p>{t('wizards:common.basicOptions.initialSupplyOf', { ticker })}</p>
        <p>{t('wizards:common.basicOptions.initialSupplyHint')}</p>
        <GenericInput
          error={error}
          type="text"
          placeholder="0"
          autoFocus={true}
          value={inputValue}
          {...register('initialSupply', {
            pattern: { value: /\d+/g, message: 'Only numbers are allowed' },
          })}
          onChange={handleInputChange}
          align={'right'}
        />
        {error && <ErrorMessage>{error?.message}</ErrorMessage>}

        <GenericInfoCard>
          {t('wizards:common.basicOptions.kleverInitialSupplyTip')}
        </GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};
