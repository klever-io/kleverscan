export const assetsTooltip = {
  ticker: 'Capital letters only',
  precision: 'Asset precision (0 to 8)',
  initialSupply: 'Initial minted supply',
  maxSupply: 'Maximum supply of the asset',
  logo: 'Logo URI',
  uris: {
    title: 'Any useful URIs related to the token',
    label: 'URI identifier. Ex: "foo"',
    address: 'URI address. Ex: "http://bar.com"',
  },
  royalties: {
    title: 'Defines the Royalties distribution for the asset',
    address: 'Royalty receiver address',
    itoPercentage:
      'Percentage of the currency that will be charged from an ITO Buy',
    itoFixed:
      'Fixed amount of the currency that will be charged from an ITO Buy',
    transferFixed: 'Fixed transfer fee for non-fungible tokens (in KLV)',
    marketPercentage:
      'Market percentage fee for non-fungible tokens of the currency',
    marketFixed: 'Market fixed fee details for non-fungible tokens (in KLV)',
    transferPercentage: {
      title:
        'How much to be charged with fees in a transfer, the cost can increase or decrease depending on the amount of the transfer',
      amount: 'Max amount for that percentage',
      percentage: 'Fee, in percentage',
    },
    splitRoyalties: {
      title: 'How the royalties are split',
      address: 'Royalty receiver address',
      percentTransferPercentage:
        'Percentage that the given address will receive from "transfer percentage" fee',
      percentMarketPercentage:
        'Percentage that the given address will receive from "market percentage" fee',
      percentMarketFixed:
        'Percentage that the given address will receive from "market fixed" fee',
      percentItoPercentage:
        'Percentage that the given address will receive from "ITO percentage" fee',
      percentItoFixed:
        'Percentage that the given address will receive from "ITO fixed" fee',
      percentTransferFixed:
        'Percentage that the given address will receive from "transfer fixed" fee',
    },
  },
  staking: {
    title: 'Staking properties',
    apr: 'Annual percentage rate, in percentage, 100 = 100%',
    minEpochsToClaim:
      'Minimum amount of epochs to claim rewards ( each epoch has 6h )',
    minEpochsToUnstake:
      'Minimum amount of epochs to unstake tokens ( each epoch has 6h )',
    minEpochsToWithdraw:
      'Minimum amount of epochs to withdraw tokens after unstaking ( each epoch has 6h )',
  },
  roles: {
    title: 'Set permissions to specific address',
    address: 'Target Address',
    hasRoleMint: 'Should be able to mint?',
    hasRoleSetITOPrices: 'Should be able to set ITO prices?',
  },
  properties: {
    title: 'Choose the properties the new token will have',
    canFreeze: 'Lock up tokens to generate rewards',
    canWipe:
      'Burn the tokens from a suspicious account and send them back to owner',
    canPause: 'Stop transactions',
    canMint: 'Create new tokens using a mint process',
    canBurn: 'Eliminate part of the token circulation',
    canChangeOwner: 'Gives the option of changing the asset owner',
    canAddRoles:
      'Defines whether roles can be applied to addresses that\nweren’t defined during the token creation process',
  },
};

export const assetTriggerTooltips = {
  receiver: 'Target address for transaction',
  addRole: {
    role: 'Set permissions to specific address',
    address: 'Address of another wallet',
    hasRoleMint: 'Should be able to mint?',
    hasRoleSetITOPrices: 'Should be able to set ITO prices?',
  },
  updateMetadata: {
    mime: 'The nature and format of the metadata',
    data: 'Metadata',
  },
  updateLogo: {
    logo: 'Logo image URL',
  },
  updateKdaPool: {
    quotient:
      'KDA ratio for each KLV E.g.: when KLV the quotient is 2, the cost is 2 KDA per 1 KLV',
    active: '"Yes" if the pooling should be active',
  },
  role: {
    ...assetsTooltip.roles,
  },
};

export const ITOTooltips = {
  receiverAddress: 'Address of the main royalty receiver',
  status: 'Sets the status of the ITO',
  maxAmount: 'Max amount of tokens to be sold in the ITO',
  defaultLimitPerAddress:
    'Default limit of the KDA that can be acquired per address during the whitelist',
  startTime: 'ITO start time',
  endTime: 'ITO end time',
  whitelistStatus: 'Whitelist status',
  whitelist: 'Whitelist Addresses Info',
  whitelistStartTime: 'Whitelist start time',
  whitelistEndTime: 'Whitelist end time',
  whitelistInfo: {
    address: 'Whitelisted address',
    limit:
      'Max amount of tokens that can be purchased by the address during the whitelist',
  },
  packInfo: {
    packCurrency: 'Defines the currency in which the pack will be sold',
    packItem: {
      amount:
        'For NFTs: Amount sold; For token: Min amount for that price to be applied',
      price: 'For NFTs: Price for that amount; For Tokens: Price of each token',
    },
  },
};

export const validatorTooltips = {
  rewardAddress: 'Address that will receive the rewards',
  canDelegate: 'Should the validator be able to receive delegations',
  commission:
    'Percentage of the rewards that will be kept by the validator, in the range of 0 to 100, precision of 2 decimal places',
  maxDelegationAmount:
    'Maximum amount of KLV that can be delegated to this validator',
  logo: 'URL of the logo image for the validator',
  URIs: 'Any relevant URIs for the validator',
};

export const marketplaceTooltips = {
  referralPercentage:
    'Percentage of the sale that will be sent to the referral address, in the range of 0 to 100, precision of 2 decimal places',
};

export const smartContractTooltips = {
  data: 'Binary data to be passed to the smart contract',
  address: 'Address of the smart contract',
  deployAddress: 'Address of the owner of the smart contract',
  properties: {
    title: 'Choose the properties the new token will have',
    upgradable: 'The smart contract can be upgraded',
    readable: 'The smart contract can be read',
    payable: 'The smart contract can receive assets',
    payableBySC:
      'The smart contract can receive assets from another smart contract',
  },
  abi: 'ABI of the smart contract',
  arguments: {
    title: 'Values to be passed to the smart contract',
    value: 'Value of the parameter',
    function: 'Function to be called',
  },
  callValue: {
    title: 'Assets to be sent to the smart contract',
    label: 'Asset Id',
    value: 'Amount of assets to be sent',
  },
};
