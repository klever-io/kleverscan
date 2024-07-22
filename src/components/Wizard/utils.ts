import { TFunction } from 'next-i18next';

interface ICreateWizard {
  commonValues: {
    assetType: number;
    additionalFields?: boolean;
    additionalValues?: boolean;
    basicTotalSteps: number;
  };
  welcome: {
    title: string;
    description: string;
    tooltip: string;
    kleverTip: string;
    transactionCost: string;
    timeEstimated: string;
  };
  name: {
    currentStep: string;
    title: string;
    description: string;
    kleverTip?: string;
  };
  transactionSuccess: {
    description: string;
    secondDescription: string;
  };
  stepsInformations: {
    basicStepsLabels: string[];
    advancedStepsIndex: number[];
    advancedStepsLabels: string[];
  };
}

interface ICreateAsset extends ICreateWizard {
  advancedSteps: {
    uris: {
      currentStep: string;
    };
    properties: {
      title: string;
      description: string;
    };
  };
  ticker: {
    currentStep: string;
    title: string;
    description: string;
  };
  ownerAddress: {
    currentStep: string;
    formValue: string;
    description: string;
  };
  maxSupply: {
    currentStep: string;
    description: string;
    kleverTip: string;
  };
  logo: {
    assetType?: 0;
    currentStep: string;
  };
}
interface ICreateITO extends ICreateWizard {
  whitelistSettings: {
    currentStep: string;
    title: string;
    description: string;
  };
  receiverAddress: {
    currentStep: string;
    formValue: string;
    title: string;
    description: string;
  };
  itoTime: {
    currentStep: string;
    nameTime: string;
    title: string;
    formValue: string;
    description: string;
  };
  maxAmount: {
    currentStep: string;
    title: string;
    description: string;
    kleverTip: string;
  };
  status: {
    currentStep: string;
    title: string;
    description: string;
  };
}

export const createToken = (t: TFunction): ICreateAsset => {
  return {
    commonValues: {
      assetType: 0,
      additionalFields: true,
      basicTotalSteps: 7,
    },
    welcome: {
      title: t('wizards:createToken.welcome.title'),
      description: t('wizards:createToken.welcome.description'),
      tooltip: t('wizards:createToken.welcome.tooltip'),
      kleverTip: t('wizards:createToken.welcome.kleverTip'),
      transactionCost: '20,000',
      timeEstimated: '10min',
    },
    name: {
      currentStep: '1/7',
      title: t('wizards:createToken.name.title'),
      description: t('wizards:createToken.name.description'),
      kleverTip: t('wizards:createToken.name.kleverTip'),
    },
    ticker: {
      currentStep: '2/7',
      title: t('wizards:createToken.ticker.title'),
      description: t('wizards:createToken.ticker.description'),
    },
    ownerAddress: {
      currentStep: '3/7',
      formValue: 'ownerAddress',
      description: t('wizards:createToken.ownerAddress.description'),
    },
    maxSupply: {
      currentStep: '6/7',
      description: t('wizards:createToken.maxSupply.description'),
      kleverTip: t('wizards:createToken.maxSupply.kleverTip'),
    },
    logo: {
      assetType: 0,
      currentStep: '7/7',
    },
    advancedSteps: {
      uris: {
        currentStep: 'URI',
      },
      properties: {
        title: t('wizards:createToken.advancedSteps.properties.title'),
        description: t(
          'wizards:createToken.advancedSteps.properties.description',
        ),
      },
    },
    transactionSuccess: {
      description: t('wizards:createToken.transactionSuccess.description'),
      secondDescription: t(
        'wizards:createToken.transactionSuccess.secondDescription',
      ),
    },
    stepsInformations: {
      basicStepsLabels: [
        t('wizards:createToken.stepsInformations.basicStepsLabels.tokenName'),
        t('wizards:createToken.stepsInformations.basicStepsLabels.tokenTicker'),
        t(
          'wizards:createToken.stepsInformations.basicStepsLabels.ownerAddress',
        ),
        t(
          'wizards:createToken.stepsInformations.basicStepsLabels.tokenPrecision',
        ),
        t(
          'wizards:createToken.stepsInformations.basicStepsLabels.initialSupply',
        ),
        t('wizards:createToken.stepsInformations.basicStepsLabels.maxSupply'),
        t('wizards:createToken.stepsInformations.basicStepsLabels.tokenImage'),
      ],
      advancedStepsIndex: [9, 10, 11, 12, 13],
      advancedStepsLabels: [
        t('wizards:createToken.stepsInformations.advancedStepsLabels.uri'),
        t('wizards:createToken.stepsInformations.advancedStepsLabels.staking'),
        t(
          'wizards:createToken.stepsInformations.advancedStepsLabels.royalties',
        ),
        t('wizards:createToken.stepsInformations.advancedStepsLabels.roles'),
        t(
          'wizards:createToken.stepsInformations.advancedStepsLabels.properties',
        ),
      ],
    },
  };
};

export const createNFT = (t: TFunction): ICreateAsset => {
  return {
    commonValues: {
      assetType: 1,
      additionalValues: false,
      basicTotalSteps: 5,
    },
    welcome: {
      title: t('wizards:createNFT.welcome.title'),
      description: t('wizards:createNFT.welcome.description'),
      tooltip: t('wizards:createNFT.welcome.tooltip'),
      kleverTip: t('wizards:createNFT.welcome.kleverTip'),
      transactionCost: '20,000',
      timeEstimated: '10min',
    },
    name: {
      currentStep: '1/5',
      title: t('wizards:createNFT.name.title'),
      description: t('wizards:createNFT.name.description'),
      kleverTip: t('wizards:createNFT.name.kleverTip'),
    },
    ticker: {
      currentStep: '2/5',
      title: t('wizards:createNFT.ticker.title'),
      description: t('wizards:createNFT.ticker.description'),
    },
    ownerAddress: {
      currentStep: '3/5',
      formValue: 'ownerAddress',
      description: t('wizards:createNFT.ownerAddress.description'),
    },
    maxSupply: {
      currentStep: '4/7',
      description: t('wizards:createNFT.maxSupply.description'),
      kleverTip: t('wizards:createNFT.maxSupply.kleverTip'),
    },
    logo: {
      currentStep: '5/5',
    },
    advancedSteps: {
      uris: {
        currentStep: 'URI',
      },
      properties: {
        title: t('wizards:createNFT.advancedSteps.properties.title'),
        description: t(
          'wizards:createNFT.advancedSteps.properties.description',
        ),
      },
    },
    transactionSuccess: {
      description: t(
        'wizards:createNFT.advancedSteps.transactionSuccess.description',
      ),
      secondDescription: t(
        'wizards:createNFT.advancedSteps.transactionSuccess.secondDescription',
      ),
    },
    stepsInformations: {
      basicStepsLabels: [
        t('wizards:createNFT.stepsInformations.basicStepsLabels.tokenName'),
        t('wizards:createNFT.stepsInformations.basicStepsLabels.tokenTicker'),
        t('wizards:createNFT.stepsInformations.basicStepsLabels.ownerAddress'),
        t('wizards:createNFT.stepsInformations.basicStepsLabels.maxSupply'),
        t('wizards:createNFT.stepsInformations.basicStepsLabels.tokenImage'),
      ],
      advancedStepsIndex: [7, 8, 9, 10],
      advancedStepsLabels: [
        'Uri',
        'Royalties',
        t('wizards:createNFT.stepsInformations.advancedStepsLabels.roles'),
        t('wizards:createNFT.stepsInformations.advancedStepsLabels.properties'),
      ],
    },
  };
};

export const createITO = (t: TFunction): ICreateITO => {
  return {
    commonValues: {
      assetType: 15,
      additionalValues: false,
      basicTotalSteps: 7,
    },
    welcome: {
      title: t('wizards:createITO.welcome.title'),
      description: t('wizards:createITO.welcome.description'),
      tooltip: t('wizards:createITO.welcome.tooltip'),
      kleverTip: t('wizards:createITO.welcome.kleverTip'),
      transactionCost: '20,000',
      timeEstimated: '10min',
    },
    name: {
      currentStep: '1/7',
      title: t('wizards:createITO.name.title'),
      description: t('wizards:createITO.welcome.description'),
    },
    receiverAddress: {
      currentStep: '2/7',
      formValue: 'receiverAddress',
      title: t('wizards:createITO.receiverAddress.'),
      description: t('wizards:createITO.receiverAddress.description'),
    },
    itoTime: {
      currentStep: '3/7',
      nameTime: 'startTime',
      title: t('wizards:createITO.itoTime.title'),
      formValue: 'startTime',
      description: t('wizards:createITO.itoTime.description'),
    },
    maxAmount: {
      currentStep: '4/7',
      title: t('wizards:createITO.maxAmount.title'),
      description: t('wizards:createITO.maxAmount.description'),
      kleverTip: t('wizards:createITO.maxAmount.kleverTip'),
    },
    status: {
      currentStep: '5/7',
      title: t('wizards:createITO.status.title'),
      description: t('wizards:createITO.status.description'),
    },
    whitelistSettings: {
      currentStep: '6/7',
      title: t('wizards:createITO.whitelistSettings.title'),
      description: t('wizards:createITO.whitelistSettings.description'),
    },

    transactionSuccess: {
      description: t('wizards:createITO.transactionSuccess.description'),
      secondDescription: t(
        'wizards:createITO.transactionSuccess.secondDescription',
      ),
    },
    stepsInformations: {
      basicStepsLabels: [
        t(
          'wizards:createITO.stepsInformations.basicStepsLabels.asset/collection',
        ),
        t(
          'wizards:createITO.stepsInformations.basicStepsLabels.receiverAddress',
        ),
        t('wizards:createITO.stepsInformations.basicStepsLabels.itoTime'),
        t('wizards:createITO.stepsInformations.basicStepsLabels.maxAmount'),
        t('wizards:createITO.stepsInformations.basicStepsLabels.Status'),
        t('wizards:createITO.stepsInformations.basicStepsLabels.packInfo'),
        t(
          'wizards:createITO.stepsInformations.basicStepsLabels.whitelistSettings',
        ),
      ],
      advancedStepsIndex: [],
      advancedStepsLabels: [],
    },
  };
};

export const parseRoles = (data: any) => {
  if (data.roles === undefined) {
    data.roles = [];
    return;
  }

  const rolesReference = data.roles;
  if (rolesReference.length === 0) return;

  return data.roles;
};

export const checkEmptyField = (field: string | number): boolean => {
  if (!field || field === '') {
    return false;
  }
  return true;
};

export const validateUrl = (url: string, isLogo = true): boolean => {
  try {
    const parsedUrl = new URL(url);
    const regex = /(https?:\/\/.*\.(?:png|jpg))/i;
    if (!isLogo) {
      return true;
    }
    if (isLogo && regex.test(parsedUrl.href)) {
      return true;
    }
    return false;
  } catch (_) {
    return false;
  }
};

export const formatPrecision = (
  precisionValue: number,
  isMinValue = false,
): string => {
  const checkPrecision = precisionValue === null || precisionValue === 0;
  const valueWithPrecision = (1 * 10 ** (precisionValue || 0))
    .toString()
    .split('');

  if (isMinValue) {
    if (checkPrecision) return '0.1';
    return `0.${''.padStart(precisionValue, '0')}1`;
  }
  if (checkPrecision) return '1';
  return `${valueWithPrecision[0]}.${''.padStart(precisionValue, '0')}`;
};
