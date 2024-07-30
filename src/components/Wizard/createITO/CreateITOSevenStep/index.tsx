import Select from '@/components/Contract/Select';
import { statusOptions } from '@/components/TransactionForms/CustomForms/ConfigITO';
import { PropsWithChildren } from 'react';
import { useFormContext } from 'react-hook-form';
import { IAssetITOInformations, IStatusITO } from '..';
import { ButtonsComponent } from '../../createAsset/ButtonsComponent';
import {
  ErrorInputContainer,
  ErrorMessage,
  GenericCardContainer,
  GenericInfoCard,
} from '../../createAsset/styles';
import { checkEmptyField } from '../../utils';

export const CreateITOSevenStep: React.FC<
  PropsWithChildren<IAssetITOInformations>
> = ({ informations: { currentStep, title, description }, handleStep, t }) => {
  const {
    register,
    setValue,
    formState: { errors },
    watch,
  } = useFormContext();
  const status = watch('status');
  const collection = watch('collection');
  let error = null;

  try {
    error = eval(`errors?.status`);
  } catch {
    error = null;
  }
  const buttonsProps = {
    handleStep,
    next: !!(!error && checkEmptyField(status)),
  };

  const onChangeHandler = (value: IStatusITO) => {
    setValue('status', value?.value, {
      shouldValidate: true,
    });
  };

  return (
    <GenericCardContainer>
      <div>
        <p>{t('wizards:createITO.steps.setUpITO').toUpperCase()}</p>
        <p>
          {t('wizards:common.step')} {currentStep}
        </p>
      </div>
      <div>
        <p>{t('wizards:createITO.steps.initialITOStatus', { collection })}</p>
        <p>{description}</p>
        <ErrorInputContainer>
          <Select
            onChange={onChangeHandler}
            options={statusOptions}
            defaultValue={statusOptions[status - 1]}
            required
          />
          {error && <ErrorMessage>{error?.message}</ErrorMessage>}
        </ErrorInputContainer>
        <GenericInfoCard>
          Klever Tip: {t('wizards:createITO.steps.tooltipStatus')}
        </GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};
