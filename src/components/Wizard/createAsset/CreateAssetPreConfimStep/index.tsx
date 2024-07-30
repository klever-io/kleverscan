import React, { PropsWithChildren, useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { IAssetInformations } from '..';
import { ButtonsComponent } from '../ButtonsComponent';
import {
  DefaultSettingsContainer,
  DefaultSettingsOptions,
  GenericCardContainer,
  PreConfirmOptions,
  WizardRightArrowSVG,
} from '../styles';

export const CreateAssetPreConfimStep: React.FC<
  PropsWithChildren<IAssetInformations>
> = ({ informations: { assetType }, handleStep, handleAdvancedSteps, t }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const buttonsProps = {
    handleStep,
    next: true,
  };

  const assetText = assetType === 0 ? 'token' : 'NFT';

  const handleAdvancedStepsWrapper = () => {
    handleAdvancedSteps && handleAdvancedSteps();
  };

  return (
    <GenericCardContainer>
      <div>
        <p>{t('wizards:common.basicOptions.basicInfoText')}</p>
        <p>{t('wizards:common.already')}</p>
      </div>
      <div>
        <p>{t('wizards:common.preConfirmInfo', { assetText })}</p>

        <PreConfirmOptions
          onClick={() => {
            handleStep((prev: number) => prev + (assetText === 'NFT' ? 5 : 6));
          }}
        >
          <div>
            <span>
              {t('wizards:common.generateWithBasicInformation', { assetText })}
            </span>
            <span>
              {t('wizards:common.basicInformationConfirm', { assetText })}
            </span>
          </div>
          <WizardRightArrowSVG />
        </PreConfirmOptions>
        <PreConfirmOptions secondary onClick={handleAdvancedStepsWrapper}>
          <div>
            <span>{t('wizards:common.addAdvancedSettings')}</span>
            <span>{t('wizards:common.advancedSettingsConfirm')}</span>
          </div>
          <WizardRightArrowSVG />
        </PreConfirmOptions>
        <DefaultSettingsContainer
          showAdvanced={showAdvanced}
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <span>{t('wizards:common.showAllDefaultSettings')}</span>
          {!showAdvanced ? <IoIosArrowDown /> : <IoIosArrowUp />}
        </DefaultSettingsContainer>
        <DefaultSettingsOptions showAdvanced={showAdvanced}>
          <div>
            <span>{t('common:Properties.Staking')}</span>
            <span>{t('common:Properties.Roles')}</span>
            <span>{t('common:Properties.Freeze')}</span>
            <span>{t('common:Properties.Burn')}</span>
            <span>{t('common:Properties.Add Roles')}</span>
            <span>{t('common:Properties.Wipe')}</span>
            <span>{t('common:Properties.Mint')}</span>
            <span>{t('common:Properties.Change Owner')}</span>
          </div>
          <div>
            <span> - </span>
            <span> - </span>
            <span> {t('common:Statements.No')}</span>
            <span> {t('common:Statements.No')}</span>
            <span> {t('common:Statements.No')}</span>
            <span> {t('common:Statements.Yes')}</span>
            <span> {t('common:Statements.No')}</span>
            <span> {t('common:Statements.No')}</span>
          </div>
        </DefaultSettingsOptions>
      </div>
      <ButtonsComponent
        buttonsProps={buttonsProps}
        noNextButton
        showAdvanced={showAdvanced}
      />
    </GenericCardContainer>
  );
};
