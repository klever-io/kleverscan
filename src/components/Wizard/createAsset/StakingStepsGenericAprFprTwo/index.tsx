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

export const StakingStepsGenericAprFprTwo: React.FC<
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
      return `${stakingType} ${t('common.step')} 4/5`;
    }
    return `${stakingType} ${t('common.step')} 2/3`;
  };

  let error = errors?.staking?.minEpochsToUnstake;

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
        <p>{t('common.advancedOptions.staking.whatIsTheMinTime')}</p>
        <p>{t('common.advancedOptions.staking.eachEpoch')}</p>
        <GenericInput
          error={error}
          type="number"
          placeholder="0"
          {...register('staking.minEpochsToUnstake', {
            pattern: {
              value: /\d+/g,
              message: t('common.errorMessage.onlyNumbersValue'),
            },
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
