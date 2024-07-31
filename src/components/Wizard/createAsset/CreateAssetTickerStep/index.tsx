import { PropsWithChildren } from 'react';
import { useFormContext } from 'react-hook-form';
import { IAssetInformations } from '..';
import { checkEmptyField } from '../../utils';
import { ButtonsComponent } from '../ButtonsComponent';
import {
  ErrorMessage,
  GenericCardContainer,
  GenericInfoCard,
  GenericInput,
} from '../styles';

export const CreateAssetTickerStep: React.FC<
  PropsWithChildren<IAssetInformations>
> = ({ informations: { currentStep, title, description }, handleStep, t }) => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const ticker = watch('ticker');
  let error = errors?.ticker;

  const buttonsProps = {
    handleStep,
    next: !!(!error && checkEmptyField(ticker)),
  };

  return (
    <GenericCardContainer>
      <div>
        <p>{t('wizards:common.basicOptions.basicInfoText')}</p>
        <p>
          {t('wizards:common.step')} {currentStep}
        </p>
      </div>
      <div>
        <p>{title}</p>
        <p>{description}</p>
        <GenericInput
          error={error}
          type="text"
          autoFocus={true}
          isUpperCase
          {...register('ticker', {
            required: {
              value: true,
              message: t('wizards:common.errorMessage.required'),
            },
            minLength: {
              value: 3,
              message: t('wizards:common.errorMessage.minLength'),
            },
            pattern: {
              value: /^[^\s]*$/,
              message: t('wizards:common.errorMessage.noSpaceTicker'),
            },
            validate: (value: string) => {
              if (
                value.toUpperCase() === 'KLV' ||
                value.toUpperCase() === 'KFI'
              ) {
                return `${t('wizards:common.errorMessage.cannotBeKLVnorKFI')}`;
              }
            },
          })}
        />
        {error && <ErrorMessage>{error?.message}</ErrorMessage>}

        <GenericInfoCard>
          {t('wizards:createAssetCommon.ticker.kleverTip')}
        </GenericInfoCard>
      </div>

      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};
