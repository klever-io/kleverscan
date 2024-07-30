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

export const StakingStepsGenericAprFprThree: React.FC<
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
      return `${stakingType} ${t('common.step')} 5/5`;
    }
    return `${stakingType} ${t('common.step')} 3/3`;
  };

  let error = null;

  try {
    error = eval(`errors?.staking.minEpochsToWithdraw`);
  } catch {
    error = null;
  }

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
        <p>{t('common.advancedOptions.staking.howLongWill')}</p>
        <p>{t('common.advancedOptions.staking.eachEpoch')}</p>
        <GenericInput
          error={error}
          type="number"
          placeholder="0"
          {...register('staking.minEpochsToWithdraw', {
            pattern: { value: /\d+/g, message: 'Value must be only numbers' },
            valueAsNumber: true,
          })}
          align={'center'}
        />
        {error && <ErrorMessage>{error?.message}</ErrorMessage>}

        <GenericInfoCard>
          {t('common.advancedOptions.staking.tooltipAprFpr')}
        </GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};
