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
import { CreatePackCurrencyID } from '../CreatePackCurrencyID';

export const CreatePackInfoSteps: React.FC<
  PropsWithChildren<IAssetITOInformations>
> = ({ informations: { assetType }, handleStep, t }) => {
  const { watch } = useFormContext();
  const [packInfo, setPackInfo] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const buttonsProps = {
    handleStep,
    next: true,
  };

  const [packInfoSteps, setPackInfoSteps] = useState([
    {
      key: 'selectPackCurrencyID',
      label: 'Select Pack Currency ID',
      isDone: false,
      component: (
        <CreatePackCurrencyID
          handleStep={handleStep}
          previousStep={handleStep}
          t={t}
        />
      ),
    },
  ]);

  const [activeStep, setActiveStep] = useState(packInfoSteps[0]);

  useEffect(() => {
    if (currentStep === packInfoSteps.length) return;
    setActiveStep(packInfoSteps[currentStep]);
  }, [currentStep]);

  return !packInfo ? (
    <GenericCardContainer>
      <div>
        <p>{t('wizards:createITO.steps.setUpITO').toUpperCase()}</p>
        <p>{t('wizards:createITO.steps.packInfo')}</p>
      </div>
      <div>
        <p>{t('wizards:createITO.steps.packInfoForNow')}</p>
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

        <InfoCard>
          <IconWizardInfoSquare />
          {t('wizards:createITO.steps.whatIsPackInfo')}
        </InfoCard>
        <GenericInfoCard>
          {t('wizards:createITO.steps.tooltipPackInfo')}
        </GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} noNextButton />
    </GenericCardContainer>
  ) : (
    activeStep.component
  );
};
