import { TFunction } from 'next-i18next';

interface ICreateToken {
  commomValues: {
    assetType: number;
    additionalFields: boolean;
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
    kleverTip: string;
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
    assetType: 0;
    currentStep: string;
  };
  advancedSteps: {
    uris: {
      currentStep: string;
    };
    properties: {
      title: string;
      description: string;
    };
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

export const createToken = (t: TFunction): ICreateToken => {
  return {
    commomValues: {
      assetType: 0,
      additionalFields: true,
      basicTotalSteps: 7,
    },
    welcome: {
      title: t('wizards:welcome.title'),
      description: t('wizards:welcome.description'),
      tooltip: t('wizards:welcome.tooltip'),
      kleverTip: t('wizards:welcome.kleverTip'),
      transactionCost: '20,000',
      timeEstimated: '10min',
    },
    name: {
      currentStep: '1/7',
      title: t('wizards:name.title'),
      description: t('wizards:name.description'),
      kleverTip: t('wizards:name.kleverTip'),
    },
    ticker: {
      currentStep: '2/7',
      title: t('wizards:ticker.title'),
      description: t('wizards:ticker.description'),
    },
    ownerAddress: {
      currentStep: '3/7',
      formValue: 'ownerAddress',
      description: t('wizards:ownerAddress.description'),
    },
    maxSupply: {
      currentStep: '6/7',
      description: t('wizards:maxSupply.description'),
      kleverTip: t('wizards:maxSupply.kleverTip'),
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
        title: t('wizards:advancedSteps.properties.title'),
        description: t('wizards:advancedSteps.properties.description'),
      },
    },
    transactionSuccess: {
      description: t('wizards:transactionSuccess.description'),
      secondDescription: t('wizards:transactionSuccess.secondDescription'),
    },
    stepsInformations: {
      basicStepsLabels: [
        t('wizards:stepsInformations.basicStepsLabels.tokenName'),
        t('wizards:stepsInformations.basicStepsLabels.tokenTicker'),
        t('wizards:stepsInformations.basicStepsLabels.ownerAddress'),
        t('wizards:stepsInformations.basicStepsLabels.tokenPrecision'),
        t('wizards:stepsInformations.basicStepsLabels.initialSupply'),
        t('wizards:stepsInformations.basicStepsLabels.maxSupply'),
        t('wizards:stepsInformations.basicStepsLabels.tokenImage'),
      ],
      advancedStepsIndex: [9, 10, 11, 12, 13],
      advancedStepsLabels: [
        t('wizards:stepsInformations.advancedStepsLabels.uri'),
        t('wizards:stepsInformations.advancedStepsLabels.staking'),
        t('wizards:stepsInformations.advancedStepsLabels.royalties'),
        t('wizards:stepsInformations.advancedStepsLabels.roles'),
        t('wizards:stepsInformations.advancedStepsLabels.properties'),
      ],
    },
  };
};

export const createNFT = {
  commomValues: {
    assetType: 1,
    additionalValues: false,
    basicTotalSteps: 5,
  },
  welcome: {
    title: 'Create a NFT',
    description: 'To create a KDA NFT we will guide you through a few steps.',
    tooltip: 'What is a NFT?',
    kleverTip: 'NFTs are tokens used to represent ownership of unique items',
    transactionCost: '20,000',
    timeEstimated: '10min',
  },
  name: {
    currentStep: '1/5',
    title: 'What will be the name of your NFT?',
    description:
      "Examples of token names: Bitcoin, Ethereum, Matic, Klever...Don't worry, you will have the opportunity to choose the ticker name next.",
    kleverTip:
      'Klever Tip: Choose the name carefully, it will most likely be your brand on the blockchain.',
  },
  ticker: {
    currentStep: '2/5',
    title: 'What is your NFT ticker?',
    description:
      'Now you will choose your ticker, it will represent your NFT in wallets and exchanges. Examples of Ticker names: BTC, ETH, KLV, BNB...',
  },
  ownerAddress: {
    currentStep: '3/5',
    formValue: 'ownerAddress',
    description:
      'This address will be the NFT manager and will be able to edit some settings. Only the Owner of the NFT can do this.',
  },
  maxSupply: {
    currentStep: '4/7',
    description:
      'The max amount is the upper limit for the total supply of NFT that can be minted',
    kleverTip:
      'If no value is specified now, the initial max amount will be set to infinity. This value can be adjusted later, but use with caution and consider the impact on the NFT value.',
  },
  logo: {
    currentStep: '5/5',
  },
  advancedSteps: {
    uris: {
      currentStep: 'URI',
    },
    properties: {
      title: "Review or change your NFT's properties.",
      description:
        "The settings will only be applied after creating the NFT, so they don't affect the settings you made during this process.",
    },
  },
  transactionSuccess: {
    description: 'When confirmed on the blockchain, your NFT will be created.',
    secondDescription: 'The NFT contract is generated after this confirmation.',
  },
  stepsInformations: {
    basicStepsLabels: [
      'NFT Name',
      'NFT Ticker',
      'Owner Address',
      'Max Supply',
      'NFT Image',
    ],
    advancedStepsIndex: [7, 8, 9, 10],
    advancedStepsLabels: ['Uri', 'Royalties', 'Roles', 'Properties'],
  },
};

export const createITO = {
  commomValues: {
    assetType: 15,
    additionalValues: false,
    basicTotalSteps: 7,
  },
  welcome: {
    title: 'Set up an Initial Token Offering',
    description:
      'To set up an Initial Token Offering we will guide you through a few steps.',
    tooltip: 'What is a ITO?',
    kleverTip:
      'An ITO stands for "Initial Token Offering", a fundraising method for issuing and selling new Klever Digital Assets (KDA).',
    transactionCost: '20,000',
    timeEstimated: '10min',
  },
  name: {
    currentStep: '1/7',
    title: 'Which token do you want to set up ITO?',
    description:
      'Select a token from the list below. Only tokens owned by you will be listed.',
  },
  receiverAddress: {
    currentStep: '2/7',
    formValue: 'receiverAddress',
    title: 'What is your receiver address?',
    description:
      'This address will be the main royalties receiver from the sold tokens.',
  },
  itoTime: {
    currentStep: '3/7',
    nameTime: 'startTime',
    title: 'Set start / end time ITO',
    formValue: 'startTime',
    description:
      'The duration of the ITO refers to the time period during which your token will be available for purchase in the initial offering.',
  },
  maxAmount: {
    currentStep: '4/7',
    title: 'Max Amount',
    description: 'Max amount of tokens to be sold in the ITO',
    kleverTip:
      'Maximum amount of tokens that will be offered for sale in this initial offeringn',
  },
  status: {
    currentStep: '5/7',
    title: 'Status',
    description: 'Sets the status of the ITO',
  },
  whitelistSettings: {
    currentStep: '6/7',
    title: 'Whitelist Settings',
    description: 'Sets the status of the ITO',
  },

  transactionSuccess: {
    description: 'When confirmed on the blockchain, your ITO will be created.',
    secondDescription: 'The ITO contract is generated after this confirmation.',
  },
  stepsInformations: {
    basicStepsLabels: [
      'Asset / Collection',
      'Receiver Address',
      'ITO Time',
      'Max Amount',
      'Status',
      'Pack Info',
      'Whitelist Settings',
    ],
  },
};

export const parseRoles = (data: unknown): void => {
  if ((data as any)?.roles && (data as any)?.roles[0]?.address) {
    return;
  }
  (data as any).roles = [];
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
