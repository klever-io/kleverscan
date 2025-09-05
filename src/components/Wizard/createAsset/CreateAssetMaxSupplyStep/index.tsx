import ToggleButton from '@/components/Button/Toggle';
import { formatNumberDecimal } from '@/utils/formatFunctions';
import { PropsWithChildren, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { IAssetInformations } from '..';
import { ButtonsComponent } from '../ButtonsComponent';
import {
  ErrorMessage,
  GenericCardContainer,
  GenericInfoCard,
  GenericInfoContainer,
  GenericInput,
} from '../styles';

export const CreateAssetMaxSupplyStep: React.FC<
  PropsWithChildren<IAssetInformations>
> = ({ informations: { description, kleverTip }, handleStep, t }) => {
  const {
    watch,
    register,
    setValue,
    formState: { errors },
  } = useFormContext();
  const [inputValue, setInputValue] = useState('');
  const [iAgree, setIAgree] = useState(false);
  const [isEqual, setIsEqual] = useState(false);
  const ticker = watch('ticker');
  const initialSupply = watch('initialSupply');
  const formMaxSupply = watch('maxSupply');
  let error = errors?.maxSupply;

  useEffect(() => {
    if (formMaxSupply && formMaxSupply !== inputValue) {
      setInputValue(formMaxSupply);
    }
  }, [formMaxSupply]);

  const buttonsProps = {
    handleStep,
    next: !error && ((isEqual && iAgree) || !isEqual),
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const formattedValue = formatNumberDecimal(value);
    setInputValue(formattedValue);
    setValue('maxSupply', formattedValue);
  };

  function handlerOnClick() {
    setIAgree(old => !old);
  }

  useEffect(() => {
    if (initialSupply === inputValue) {
      setIsEqual(true);
    } else {
      setIsEqual(false);
      setIAgree(false);
    }
  }, [initialSupply, inputValue]);

  return (
    <GenericCardContainer>
      <div>
        <p>{t('wizards:common.basicOptions.basicInfoText')}</p>
        <p>{t('wizards:common.step')} 6/7</p>
      </div>
      <div>
        <p>{t('wizards:common.maxSupplyOf', { ticker })}</p>
        <p>{description}</p>
        <span>
          {t('wizards:common.initialSupply')}: {initialSupply}
        </span>
        <GenericInput
          color={isEqual ? '#FFE380' : undefined}
          borderBottom={isEqual ? '#FFE380' : undefined}
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
        {isEqual && (
          <GenericInfoContainer>
            <ToggleButton active={iAgree} onClick={handlerOnClick} />
            <p>{t('wizards:common.errorMessage.IAgree')}</p>
          </GenericInfoContainer>
        )}
        <GenericInfoCard>{kleverTip}</GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};
