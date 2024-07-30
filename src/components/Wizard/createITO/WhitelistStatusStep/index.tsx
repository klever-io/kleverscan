import Select from '@/components/Contract/Select';
import { statusOptions } from '@/components/TransactionForms/CustomForms/ConfigITO';
import { PropsWithChildren } from 'react';
import { useFormContext } from 'react-hook-form';
import { IStatusITO } from '..';
import { IWizardComponents } from '../../createAsset';
import { ButtonsComponent } from '../../createAsset/ButtonsComponent';
import {
  ErrorInputContainer,
  ErrorMessage,
  GenericCardContainer,
  GenericInfoCard,
} from '../../createAsset/styles';

export const WhitelistStatusStep: React.FC<
  PropsWithChildren<IWizardComponents>
> = ({ handleStep, t }) => {
  statusOptions;
  const {
    setValue,
    formState: { errors },
    watch,
  } = useFormContext();
  const whitelistStatus = watch('whitelistStatus');
  let error = null;

  try {
    error = eval(`errors?.whitelistStatus`);
  } catch {
    error = null;
  }
  const buttonsProps = {
    handleStep,
    next: !!!error,
  };

  const onChangeHandler = (value: IStatusITO) => {
    setValue('whitelistStatus', value?.value, {
      shouldValidate: true,
    });
  };

  return (
    <GenericCardContainer>
      <div>
        <p>{t('wizards:createITO.steps.setUpITO').toUpperCase()}</p>
        <p>{t('wizards:common.step')} 4/4</p>
      </div>
      <div>
        <p>{t('wizards:createITO.steps.whitelistSettings')}</p>
        <p>{t('wizards:createITO.steps.whitelistStatus')}</p>
        <ErrorInputContainer>
          <Select
            onChange={onChangeHandler}
            options={statusOptions}
            defaultValue={statusOptions[whitelistStatus - 1]}
            required
          />
          {error && <ErrorMessage>{error?.message}</ErrorMessage>}
        </ErrorInputContainer>
        <GenericInfoCard>
          Klever Tip: {t('wizards:createITO.steps.tooltipStatusWhitelist')}
        </GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};
