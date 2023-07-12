export const createToken = {
  commomValues: {
    assetType: 0,
    additionalFields: true,
    basicTotalSteps: 7,
  },
  welcome: {
    title: 'Create a fungible token',
    description:
      'To create a KDA fungible token we will guide you through a few steps.',
    tooltip: 'What is a fungible token?',
    kleverTip:
      'Physical money and cryptocurrencies are fungible, which means they can be traded or exchanged for one another.',
    transactionCost: '20,000',
    timeEstimated: '10min',
  },
  name: {
    currentStep: '1/7',
    title: 'What will be the name of your token?',
    description:
      "Examples of token names: Bitcoin, Ethereum, Matic, Klever...Don't worry, you will have the opportunity to choose the ticker name next.",
    kleverTip:
      'Klever Tip: Choose the name carefully, it will most likely be your brand on the blockchain.',
  },
  ticker: {
    currentStep: '2/7',
    title: "What is your token's ticker?",
    description:
      'Now you will choose your ticker, it will represent your token in wallets and exchanges. Examples of Ticker names: BTC, ETH, KLV, BNB...',
  },
  ownerAddress: {
    currentStep: '3/7',
    formValue: 'ownerAddress',
    description:
      'This address will be the token manager and will be able to edit some settings. Only the Owner of the token can do this.',
  },
  maxSupply: {
    currentStep: '6/7',
    description:
      'The max amount is the upper limit for the total supply of tokens that can be minted',
    kleverTip:
      "If no value is specified now, the initial max amount will be set to infinity. This value can be adjusted later, but use with caution and consider the impact on the token's value and usability.",
  },
  logo: {
    currentStep: '7/7',
  },
  advancedSteps: {
    uris: {
      currentStep: 'URI',
    },
    properties: {
      title: "Review or change your token's properties.",
      description:
        "The settings will only be applied after creating the token, so they don't affect the settings you made during this process.",
    },
  },
  transactionSuccess: {
    description:
      'When confirmed on the blockchain, your token will be created.',
    secondDescription:
      'The token contract is generated after this confirmation.',
  },
  stepsInformations: {
    basicStepsLabels: [
      'Token Name',
      'Token Ticker',
      'Owner Address',
      'Token Precision',
      'Initial Supply',
      'Max Supply',
      'Token Image',
    ],
    advancedStepsIndex: [9, 10, 11, 12, 13],
    advancedStepsLabels: ['URI', 'STAKING', 'ROYALTIES', 'ROLES', 'PROPERTIES'],
  },
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
    advancedStepsLabels: ['URI', 'ROYALTIES', 'ROLES', 'PROPERTIES'],
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
