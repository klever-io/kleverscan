import { PropsWithChildren, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { IWizardComponents } from '..';
import { ButtonsComponent } from '../ButtonsComponent';
import { SelectStakingTypeComponent } from '../SelectStakingTypeComponent';
import { StakingStepsGeneric } from '../StakingStepsGeneric';
import { StakingStepsGenericAprFprOne } from '../StakingStepsGenericAprFprOne';
import { StakingStepsGenericAprFprThree } from '../StakingStepsGenericAprFprThree';
import { StakingStepsGenericAprFprTwo } from '../StakingStepsGenericAprFprTwo';
import {
  ButtonsContainer,
  GenericCardContainer,
  GenericInfoCard,
  IconWizardInfoSquare,
  InfoCard,
  WizardButton,
} from '../styles';

export const CreateAssetStakingStep: React.FC<
  PropsWithChildren<IWizardComponents>
> = ({ handleStep, t }) => {
  const { watch } = useFormContext();
  const [staking, setStaking] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const [stakingSteps, setStakingSteps] = useState([
    {
      key: 'staking 1',
      label: 'staking 1',
      isDone: false,
      component: (
        <SelectStakingTypeComponent
          handleStep={handleStep}
          setCurrentStep={setCurrentStep}
        />
      ),
    },
    {
      key: 'staking 2',
      label: 'staking 2',
      isDone: false,
      component: <StakingStepsGeneric setCurrentStep={setCurrentStep} />,
    },
    {
      key: 'staking 2',
      label: 'staking 2',
      isDone: false,
      component: (
        <StakingStepsGenericAprFprOne setCurrentStep={setCurrentStep} />
      ),
    },
    {
      key: 'staking 3',
      label: 'staking 3',
      isDone: false,
      component: (
        <StakingStepsGenericAprFprTwo setCurrentStep={setCurrentStep} />
      ),
    },
    {
      key: 'staking 4',
      label: 'staking 4',
      isDone: false,
      component: <StakingStepsGenericAprFprThree setCurrentStep={handleStep} />,
    },
  ]);

  const buttonsProps = {
    handleStep,
    next: true,
  };

  const [activeStep, setActiveStep] = useState(stakingSteps[0]);

  const ticker = watch('ticker');

  useEffect(() => {
    if (currentStep === stakingSteps.length) return;
    setActiveStep(stakingSteps[currentStep]);
  }, [currentStep]);

  return !staking ? (
    <GenericCardContainer>
      <div>
        <p>{t('wizards:common.advancedOptions.allAdvancedOption')}</p>
        <p>
          {t('wizards:common.advancedOptions.staking.staking').toUpperCase()}
        </p>
      </div>
      <div>
        <p>
          {t('wizards:common.advancedOptions.staking.enableStaking', {
            ticker,
          })}
        </p>
        <ButtonsContainer>
          <WizardButton infoStep centered onClick={() => setStaking(true)}>
            {t('common:Statements.Yes')}
          </WizardButton>
          <WizardButton
            infoStep
            secondary
            centered
            onClick={() => handleStep(11)}
          >
            {t('common:Statements.No')}
          </WizardButton>
        </ButtonsContainer>

        <InfoCard>
          <IconWizardInfoSquare />
          {t('wizards:common.advancedOptions.staking.whatIsStaking')}
        </InfoCard>
        <GenericInfoCard>
          {t('wizards:common.advancedOptions.staking.tooltip')}
        </GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} noNextButton />
    </GenericCardContainer>
  ) : (
    activeStep.component
  );
};
