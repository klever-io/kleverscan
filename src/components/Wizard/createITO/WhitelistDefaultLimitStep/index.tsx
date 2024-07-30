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

export const WhitelistDefaultLimitStep: React.FC<
  PropsWithChildren<IWizardComponents>
> = ({ handleStep, t }) => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();

  let error = null;

  try {
    error = eval(`errors?.whitelistDefaultLimit`);
  } catch {
    error = null;
  }
  const buttonsProps = {
    handleStep,
    next: !!!error,
  };

  return (
    <GenericCardContainer>
      <div>
        <p>{t('wizards:createITO.steps.setUpITO').toUpperCase()}</p>
        <p>{t('wizards:common.step')} 3/4</p>
      </div>
      <div>
        <p>{t('wizards:createITO.steps.whitelistSettings')}</p>
        <p>{t('wizards:createITO.steps.defaultLimit')}</p>
        <ErrorInputContainer>
          <GenericInput
            error={error}
            type="number"
            autoFocus={true}
            align={'right'}
            {...register('whitelistDefaultLimit')}
          />
          {error && <ErrorMessage>{error?.message}</ErrorMessage>}
        </ErrorInputContainer>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};
