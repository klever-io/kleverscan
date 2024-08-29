import { TFunction } from 'next-i18next';
import React, { PropsWithChildren, useState } from 'react';
import { WizCreateITO } from '../createITO/configITO';
import WizCreateNFT from './createNFT';
import { WizCreateSFT } from './CreateSFT';
import WizCreateToken from './createToken';

export interface IWizardComponents {
  handleStep: React.Dispatch<React.SetStateAction<number>>;
  previousStep?: React.Dispatch<React.SetStateAction<number>>;
  selectedStep?: number;
  handleAdvancedSteps?: () => void;
  isNFT?: boolean;
  isLastStep?: boolean;
  t: TFunction;
}

export interface IAssetInformations extends IWizardComponents {
  informations: {
    title?: string;
    description?: string;
    tooltip?: string;
    kleverTip?: string;
    transactionCost?: string;
    timeEstimated?: string;
    assetType?: number;
    additionalFields?: boolean;
    currentStep?: string;
    formValue?: string;
  };
}

export interface IWizardConfirmProps
  extends IWizardComponents,
    IAssetInformations {
  txHash: string;
  fromAdvancedSteps: boolean;
}

export interface IWizardStakingComponents {
  handleStep?: React.Dispatch<React.SetStateAction<number>>;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

export const propertiesValues = (t: TFunction): any[] => {
  return [
    {
      label: t('common:Properties.Can', {
        type: `${t('common:Properties.Freeze')}`,
      }),
      isDefaultChecked: true,
      property: 'canFreeze',
      tooltip: t('wizards:common.advancedOptions.properties.tooltipFreeze'),
    },
    {
      label: t('common:Properties.Can', {
        type: `${t('common:Properties.Pause')}`,
      }),
      isDefaultChecked: true,
      property: 'canPause',
      tooltip: t('wizards:common.advancedOptions.properties.tooltipPause'),
    },
    {
      label: t('common:Properties.Can', {
        type: `${t('common:Properties.Burn')}`,
      }),
      isDefaultChecked: true,
      property: 'canBurn',
      tooltip: t('wizards:common.advancedOptions.properties.tooltipBurn'),
    },
    {
      label: t('common:Properties.Can', {
        type: `${t('common:Properties.Add Roles')}`,
      }),
      isDefaultChecked: true,
      property: 'canAddRoles',
      tooltip: t('wizards:common.advancedOptions.properties.tooltipAddRoles'),
    },
    {
      label: t('common:Properties.Can', {
        type: `${t('common:Properties.Mint')}`,
      }),
      isDefaultChecked: true,
      property: 'canMint',
      tooltip: t('wizards:common.advancedOptions.properties.tooltipMint'),
    },
    {
      label: t('common:Properties.Can', {
        type: `${t('common:Properties.Change Owner')}`,
      }),
      isDefaultChecked: true,
      property: 'canChangeOwner',
      tooltip: t(
        'wizards:common.advancedOptions.properties.tooltipChangeOwner',
      ),
    },
    {
      label: t('common:Properties.Can', {
        type: `${t('common:Properties.Wipe')}`,
      }),
      isDefaultChecked: false,
      property: 'canWipe',
      tooltip: t('wizards:common.advancedOptions.properties.tooltipWipe'),
    },
  ];
};

export const propertiesCommonDefaultValues = {
  name: '',
  ticker: '',
  ownerAddress: '',
  maxSupply: '',
  logo: '',
  properties: {
    canAddRoles: true,
    canBurn: true,
    canChangeOwner: true,
    canFreeze: true,
    canMint: true,
    canPause: true,
    canWipe: false,
  },
};
export const infinitySymbol = '\u221e';

const CreateAssetWizard: React.FC<PropsWithChildren<any>> = ({
  isOpen,
  txHash,
  setTxHash,
}) => {
  const [fromAdvancedSteps, setFromAdvancedSteps] = useState(false);

  const stepsProps = {
    setTxHash,
    txHash,
    fromAdvancedSteps,
    setFromAdvancedSteps,
  };

  const CreateContractWizard: React.FC<PropsWithChildren> = () => {
    if (isOpen === 'Token') {
      return <WizCreateToken {...stepsProps} />;
    }
    if (isOpen === 'SFT') {
      return <WizCreateSFT {...stepsProps} />;
    }
    if (isOpen === 'NFT') {
      return <WizCreateNFT {...stepsProps} />;
    }
    if (isOpen === 'ITO') {
      return <WizCreateITO {...stepsProps} />;
    }
    return <></>;
  };

  return <CreateContractWizard />;
};

export default CreateAssetWizard;
