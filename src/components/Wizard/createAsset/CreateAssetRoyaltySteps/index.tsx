import { PropsWithChildren, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { IWizardComponents } from '..';
import { ButtonsComponent } from '../ButtonsComponent';
import { CreateAssetRoyaltyAddress } from '../CreateAssetRoyaltyAddress';
import { CreateAssetRoyaltyITOPerc } from '../CreateAssetRoyaltyITOPerc';
import { CreateAssetRoyaltyTransferPerc } from '../CreateAssetRoyaltyTransferPerc';
import { CreateAssetSplitRoyalties } from '../CreateAssetSplitRoyalties';
import {
  ButtonsContainer,
  GenericCardContainer,
  GenericInfoCard,
  IconWizardInfoSquare,
  InfoCard,
  WizardButton,
} from '../styles';

export const CreateAssetRoyaltySteps: React.FC<
  PropsWithChildren<IWizardComponents>
> = ({ handleStep, isNFT = false, t }) => {
  const { watch } = useFormContext();
  const [royalties, setRoyalties] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const commonProps = {
    handleStep: setCurrentStep,
    previousStep: handleStep,
    t,
  };

  const tokenTransferRoyalties = [
    {
      key: 'selectRoyaltyTransferPerc',
      label: 'Select Royalty Transfer Perc',
      isDone: false,
      component: (
        <CreateAssetRoyaltyTransferPerc handleStep={setCurrentStep} t={t} />
      ),
    },
  ];

  const [royaltiesSteps, setRoyaltiesSteps] = useState([
    {
      key: 'selectRoyaltyAddress',
      label: 'Select Royalty Address',
      isDone: false,
      component: <CreateAssetRoyaltyAddress {...commonProps} />,
    },
    {
      key: 'selectRoyaltyITOPerc',
      label: 'Select Royalty ITO Perc',
      isDone: false,
      component: <CreateAssetRoyaltyITOPerc {...commonProps} isNFT={isNFT} />,
    },
    {
      key: 'selectSplitRoyalty',
      label: 'Select Split Royalty',
      isDone: false,
      component: (
        <CreateAssetSplitRoyalties {...commonProps} handleStep={handleStep} />
      ),
    },
  ]);

  useEffect(() => {
    if (isNFT) return;
    const newSteps = [...royaltiesSteps];
    newSteps.splice(2, 0, ...tokenTransferRoyalties);
    setRoyaltiesSteps(newSteps);
  }, []);

  const buttonsProps = {
    handleStep,
    next: true,
  };

  const [activeStep, setActiveStep] = useState(royaltiesSteps[0]);

  const ticker = watch('ticker');

  useEffect(() => {
    if (currentStep >= royaltiesSteps.length) return;
    setActiveStep(royaltiesSteps[currentStep]);
  }, [currentStep]);

  return !royalties ? (
    <GenericCardContainer>
      <div>
        <p>{t('wizards:common.advancedOptions.allAdvancedOption')}</p>
        <p>{t('wizards:common.advancedOptions.royalties.royalties')}</p>
      </div>
      <div>
        <p>
          {t('wizards:common.advancedOptions.royalties.enableRoyalties', {
            ticker,
          })}
        </p>
        <ButtonsContainer>
          <WizardButton infoStep centered onClick={() => setRoyalties(true)}>
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
          {t('wizards:common.advancedOptions.royalties.whatIsRoyalty')}
        </InfoCard>
        <GenericInfoCard>
          {t('wizards:common.advancedOptions.royalties.whatIsRoyaltyA')}
        </GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  ) : (
    activeStep.component
  );
};
