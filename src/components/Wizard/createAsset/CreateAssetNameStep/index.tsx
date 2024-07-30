import { PropsWithChildren } from 'react';
import { useFormContext } from 'react-hook-form';
import { IAssetInformations } from '..';
import { checkEmptyField } from '../../utils';
import { ButtonsComponent } from '../ButtonsComponent';
import {
  ErrorInputContainer,
  ErrorMessage,
  GenericCardContainer,
  GenericInfoCard,
  GenericInput,
} from '../styles';

export const CreateAssetNameStep: React.FC<
  PropsWithChildren<IAssetInformations>
> = ({
  informations: { currentStep, title, description, kleverTip },
  handleStep,
  t,
}) => {
  const { register, watch } = useFormContext();
  const name = watch('name');

  let error = null;

  try {
    error = eval(`errors?.name`);
  } catch {
    error = null;
  }

  const buttonsProps = {
    handleStep,
    next: !!(!error && checkEmptyField(name)),
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
        <ErrorInputContainer>
          <GenericInput
            error={error}
            type="text"
            autoFocus={true}
            {...register('name', {
              required: {
                value: true,
                message: t('wizards:common.errorMessage.required'),
              },
              pattern: {
                value: /^[^\s]+(\s+[^\s]+)*$/,
                message: t('wizards:common.errorMessage.blankSpace'),
              },
            })}
          />

          {error && <ErrorMessage>{error?.message}</ErrorMessage>}
        </ErrorInputContainer>
        <GenericInfoCard>{kleverTip}</GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};
