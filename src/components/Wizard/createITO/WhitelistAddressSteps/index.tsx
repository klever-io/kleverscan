import { PropsWithChildren, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { IWizardComponents } from '../../createAsset';
import { ButtonsComponent } from '../../createAsset/ButtonsComponent';
import {
  ButtonsContainer,
  GenericCardContainer,
  WizardButton,
} from '../../createAsset/styles';
import { CreateWhitelistedAddress } from '../CreateWhitelistedAddress';

export const WhitelistAddressSteps: React.FC<
  PropsWithChildren<IWizardComponents>
> = ({ handleStep, t }) => {
  const { watch } = useFormContext();
  const [whitelist, setPackInfo] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const buttonsProps = {
    handleStep,
    next: true,
  };

  const [packInfoSteps, setPackInfoSteps] = useState([
    {
      key: 'selectWhitelistAddress',
      label: 'Select whitelist add address',
      isDone: false,
      component: (
        <CreateWhitelistedAddress
          t={t}
          handleStep={handleStep}
          previousStep={handleStep}
        />
      ),
    },
  ]);

  const [activeStep, setActiveStep] = useState(packInfoSteps[0]);

  useEffect(() => {
    if (currentStep === packInfoSteps.length) return;
    setActiveStep(packInfoSteps[currentStep]);
  }, [currentStep]);

  return !whitelist ? (
    <GenericCardContainer>
      <div>
        <p>{t('wizards:createITO.steps.setUpITO').toUpperCase()}</p>
        <p>{t('wizards:createITO.steps.whitelistSettings')}</p>
      </div>
      <div>
        <p>{t('wizards:createITO.steps.whitelistAddressInfo')}</p>
        <ButtonsContainer>
          <WizardButton infoStep centered onClick={() => setPackInfo(true)}>
            {t('common:Statements.Yes')}
          </WizardButton>
          <WizardButton
            infoStep
            secondary
            centered
            onClick={() => handleStep(prev => prev + 1)}
          >
            {t('common:Statements.No')}
          </WizardButton>
        </ButtonsContainer>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} noNextButton />
    </GenericCardContainer>
  ) : (
    activeStep.component
  );
};
