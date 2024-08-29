import { PropsWithChildren } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { IWizardStakingComponents } from '..';
import { ButtonsComponent } from '../ButtonsComponent';
import {
  GenericCardContainer,
  PreConfirmOptions,
  StakingTypeContainer,
  WizardRightArrowSVG,
} from '../styles';

export const SelectStakingTypeComponent: React.FC<
  PropsWithChildren<IWizardStakingComponents>
> = ({ handleStep, setCurrentStep }) => {
  const { t } = useTranslation('wizards');
  const { setValue } = useFormContext();

  const buttonsProps = {
    handleStep,
    next: true,
  };

  return (
    <GenericCardContainer>
      <div>
        <p>{t('common.advancedOptions.staking.staking').toUpperCase()}</p>
        <p>{t('common.step')} 1</p>
      </div>
      <div>
        <p>{t('common.advancedOptions.staking.whatRewardModel')}</p>

        <StakingTypeContainer>
          <PreConfirmOptions
            secondary
            onClick={() => {
              setCurrentStep(1);
              setValue('staking.interestType', 0);
            }}
          >
            <div>
              <span>APR</span>
              <span>{t('common.advancedOptions.staking.aprInfo')}</span>
            </div>
            <WizardRightArrowSVG />
          </PreConfirmOptions>
          <PreConfirmOptions
            secondary
            onClick={() => {
              setCurrentStep(2);
              setValue('staking.interestType', 1);
            }}
          >
            <div>
              <span>FPR</span>
              <span>{t('common.advancedOptions.staking.fprInfo')}</span>
            </div>
            <WizardRightArrowSVG />
          </PreConfirmOptions>
        </StakingTypeContainer>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps as any} noNextButton />
    </GenericCardContainer>
  );
};
