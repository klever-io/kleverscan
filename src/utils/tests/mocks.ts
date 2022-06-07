const KFI = {
  assetType: 'Fungible',
  assetId: 'KFI',
  name: 'KLEVER FINANCE',
  ticker: 'KFI',
  ownerAddress: '',
  logo: '',
  uris: {
    Exchange: 'https://klever.io',
    Github: 'https://github.com/klever-io',
    Instagram: 'https://instagram.com/klever.io',
    Twitter: 'https://twitter.com/klever_io',
    Wallet: 'https://klever.finance/wallet',
    Website: 'https://klever.finance',
    Whitepaper:
      'https://klever.finance/wp-content/uploads/2021/10/Klever_Finance_Whitepaper_v1.1.pdf',
  },
  precision: 6,
  initialSupply: 21000000000000,
  circulatingSupply: 21000000000000,
  maxSupply: 21000000000000,
  mintedValue: 21000000000000,
  burnedValue: 0,
  issueDate: 0,
  royalties: 0,
  staking: {
    interestType: 'FPRI',
    apr: [],
    fpr: [
      {
        totalAmount: 0,
        totalStaked: 0,
        epoch: 0,
        TotalClaimed: 0,
      },
    ],
    totalStaked: 0,
    currentFPRAmount: 0,
    minEpochsToClaim: 1,
    minEpochsToUnstake: 1,
    minEpochsToWithdraw: 2,
  },
  properties: {
    canFreeze: true,
    canWipe: false,
    canPause: false,
    canMint: true,
    canBurn: true,
    canChangeOwner: false,
    canAddRoles: false,
  },
  attributes: {
    isPaused: false,
    isNFTMintStopped: true,
  },
};

const DVK = {
  assetType: 'NonFungible',
  assetId: 'DVK-f67214',
  name: 'Devikins',
  ticker: 'DVK',
  ownerAddress:
    'klv1fpwjz234gy8aaae3gx0e8q9f52vymzzn3z5q0s5h60pvktzx0n0qwvtux5',
  logo: '',
  uris: {
    '0': '',
  },
  precision: 0,
  initialSupply: 0,
  circulatingSupply: 5,
  maxSupply: 0,
  mintedValue: 5,
  burnedValue: 0,
  issueDate: 0,
  royalties: 0,
  staking: {
    minEpochsToWithdraw: 2,
  },
  properties: {
    canFreeze: true,
    canWipe: false,
    canPause: true,
    canMint: true,
    canBurn: true,
    canChangeOwner: true,
    canAddRoles: true,
  },
  attributes: {
    isPaused: false,
    isNFTMintStopped: false,
  },
};

const SNTEST = {
  assetType: 'NonFungible',
  assetId: 'SNTEST-4c9dd8',
  name: 'SNTEST',
  ticker: 'SNTEST',
  ownerAddress:
    'klv1pz2qmsd6tuta2dplfk5j8dt5wwapfhdasu78j5e8mlpuvvlf5frsyyfe0r',
  logo: '',
  uris: {
    '0': '',
  },
  precision: 0,
  initialSupply: 0,
  circulatingSupply: 4,
  maxSupply: 2000,
  mintedValue: 4,
  burnedValue: 0,
  issueDate: 0,
  royalties: 0,
  staking: {
    minEpochsToWithdraw: 2,
  },
  properties: {
    canFreeze: false,
    canWipe: true,
    canPause: true,
    canMint: true,
    canBurn: true,
    canChangeOwner: true,
    canAddRoles: true,
  },
  attributes: {
    isPaused: false,
    isNFTMintStopped: false,
  },
  roles: [
    {
      address: 'klv1pz2qmsd6tuta2dplfk5j8dt5wwapfhdasu78j5e8mlpuvvlf5frsyyfe0r',
      hasRoleMint: true,
      hasRoleSetITOPrices: false,
    },
    {
      address: 'klv1dtj4m5jl252aqa5d0kp0u76eczfup9hg6w4q9ffm94nmtkccx7rqrf7jpf',
      hasRoleMint: true,
      hasRoleSetITOPrices: false,
    },
  ],
};

const specialAsset = {
  assetType: 'test',
  assetId: 'some id, that/ need"s: @ encoding ?? ?',
  name: 'test',
  ticker: 'test',
  ownerAddress:
    'TESTpz2qmsd6tuta2dplfk5j8dt5wwapfhdasu78j5e8mlpuvvlf5frsyyfe0r',
  logo: '',
  uris: {
    '0': '',
  },
  precision: 0,
  initialSupply: 0,
  circulatingSupply: 4,
  maxSupply: 2000,
  mintedValue: 4,
  burnedValue: 0,
  issueDate: 0,
  royalties: 0,
  staking: {
    minEpochsToWithdraw: 2,
  },
  properties: {
    canFreeze: false,
    canWipe: true,
    canPause: true,
    canMint: true,
    canBurn: true,
    canChangeOwner: true,
    canAddRoles: true,
  },
  attributes: {
    isPaused: false,
    isNFTMintStopped: false,
  },
};

const assets = [KFI, DVK, SNTEST, specialAsset];

const mocks = {
  assets,
};

export default mocks;
