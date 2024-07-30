import { PropsWithChildren } from 'react';
import { useFormContext } from 'react-hook-form';
import { IWizardComponents } from '../../createAsset';
import { ButtonsComponent } from '../../createAsset/ButtonsComponent';
import {
  ErrorInputContainer,
  ErrorMessage,
  GenericCardContainer,
  GenericInput,
} from '../../createAsset/styles';

export const WhitelistStartTimeStep: React.FC<
  PropsWithChildren<IWizardComponents>
> = ({ handleStep, previousStep, t }) => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();

  let errorStartTime = null;
  let errorEndTime = null;
  try {
    errorStartTime = eval(`errors?.whitelistStartTime`);
    errorEndTime = eval(`errors?.whitelistEndTime`);
  } catch {
    errorStartTime = null;
    errorEndTime = null;
  }
  const buttonsProps = {
    handleStep,
    previousStep,
    next: !!!errorStartTime,
  };

  return (
    <GenericCardContainer>
      <div>
        <p>{t('wizards:createITO.steps.setUpITO').toUpperCase()}</p>
        <p>{t('wizards:common.step')} 1/4</p>
      </div>
      <div>
        <p>{t('wizards:createITO.steps.whitelistSettings')}</p>
        <ErrorInputContainer>
          <GenericInput
            error={errorStartTime}
            type="datetime-local"
            autoFocus={true}
            {...register('whitelistStartTime')}
          />
          <p>{t('wizards:createITO.steps.whitelistStartTime')}</p>
          {errorStartTime && (
            <ErrorMessage>{errorStartTime?.message}</ErrorMessage>
          )}

          <GenericInput
            error={errorStartTime}
            type="datetime-local"
            autoFocus={true}
            {...register('whitelistEndTime')}
          />
          <p>{t('wizards:createITO.steps.whitelistEndTime')}</p>
          {errorEndTime && <ErrorMessage>{errorEndTime?.message}</ErrorMessage>}
        </ErrorInputContainer>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};
