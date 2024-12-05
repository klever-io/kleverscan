import { PropsWithChildren } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { IWizardStakingComponents } from '..';
import { ButtonsComponent } from '../ButtonsComponent';
import {
  ErrorMessage,
  GenericCardContainer,
  GenericInfoCard,
  GenericInput,
} from '../styles';

export const StakingStepsGeneric: React.FC<
  PropsWithChildren<IWizardStakingComponents>
> = ({ setCurrentStep }) => {
  const { t } = useTranslation('wizards');
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();
  const stakingTypeNum = watch('staking.interestType');
  const stakingType = stakingTypeNum === 0 ? 'APR' : 'FPR';
  const renderStakingStep = () => {
    if (stakingType === 'APR') {
      return `${stakingType} ${t('common.step')} 2/5`;
    }
    return `${stakingType} ${t('common.step')}  1/3`;
  };

  let error = errors?.staking?.apr;

  const buttonsProps = {
    handleStep: setCurrentStep,
    next: true,
  };

  return (
    <GenericCardContainer>
      <div>
        <p>{t('common.advancedOptions.staking.staking').toUpperCase()}</p>
        <p>{renderStakingStep()}</p>
      </div>
      <div>
        <p>{t('common.advancedOptions.staking.aprRate')}</p>
        <p>{t('common.advancedOptions.staking.aprRateInfo')}</p>
        <GenericInput
          error={error}
          align={'center'}
          type="number"
          placeholder="0"
          {...register('staking.apr', {
            pattern: {
              value: /\d+/g,
              message: t('common.errorMessage.onlyNumbersValue'),
            },
            valueAsNumber: true,
          })}
        />
        {error && <ErrorMessage>{error?.message}</ErrorMessage>}

        <GenericInfoCard>
          {t('common.advancedOptions.staking.tooltipStepGeneric')}
        </GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};
