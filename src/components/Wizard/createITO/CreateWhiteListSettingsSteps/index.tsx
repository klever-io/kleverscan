import { PropsWithChildren, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { IAssetITOInformations } from '..';
import { ButtonsComponent } from '../../createAsset/ButtonsComponent';
import {
  ButtonsContainer,
  GenericCardContainer,
  GenericInfoCard,
  IconWizardInfoSquare,
  InfoCard,
  WizardButton,
} from '../../createAsset/styles';
import { WhitelistAddressSteps } from '../WhitelistAddressSteps';
import { WhitelistDefaultLimitStep } from '../WhitelistDefaultLimitStep';
import { WhitelistStartTimeStep } from '../WhitelistStartTimeStep';
import { WhitelistStatusStep } from '../WhitelistStatusStep';

export const CreateWhiteListSettingsSteps: React.FC<
  PropsWithChildren<IAssetITOInformations>
> = ({ informations: { assetType }, handleStep, t }) => {
  const { watch } = useFormContext();
  const [whitelist, setPackInfo] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const buttonsProps = {
    handleStep,
    next: true,
  };

  const [packInfoSteps, setPackInfoSteps] = useState([
    {
      key: 'selectWhitelistStartTime',
      label: 'Select whitelist start time',
      isDone: false,
      component: (
        <WhitelistStartTimeStep
          t={t}
          handleStep={setCurrentStep}
          previousStep={handleStep}
        />
      ),
    },
    {
      key: 'selectWhitelistLimitAddress',
      label: 'Select limit per Address',
      isDone: false,
      component: (
        <WhitelistDefaultLimitStep handleStep={setCurrentStep} t={t} />
      ),
    },
    {
      key: 'selectWhitelistLimitAddress',
      label: 'Select limit per Address',
      isDone: false,
      component: <WhitelistStatusStep handleStep={setCurrentStep} t={t} />,
    },
    {
      key: 'selectWhitelistAddAddress',
      label: 'Select whitelist add address',
      isDone: false,
      component: <WhitelistAddressSteps handleStep={handleStep} t={t} />,
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
        <p>{t('wizards:createITO.steps.whitelistAddAddress')}</p>
      </div>
      <div>
        <p>{t('wizards:createITO.steps.configureWhitelistAddresses')}</p>
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
            {t('common:Statements.Yes')}
          </WizardButton>
        </ButtonsContainer>

        <InfoCard>
          <IconWizardInfoSquare />
          {t('wizards:createITO.steps.whatIsWhitelist')}
        </InfoCard>
        <GenericInfoCard>
          {t('wizards:createITO.steps.tooltipWhitelist')}
        </GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} noNextButton />
    </GenericCardContainer>
  ) : (
    activeStep.component
  );
};
