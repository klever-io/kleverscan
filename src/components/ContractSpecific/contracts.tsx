const options = [
  {
    label: 'Transfer',
    value: 'TransferContract',
  },
  {
    label: 'Create Asset',
    value: 'CreateAssetContract',
  },
  {
    label: 'Create Validator',
    value: 'CreateValidatorContract',
  },
  {
    label: 'Validator Config',
    value: 'ValidatorConfigContract',
  },
  {
    label: 'Freeze',
    value: 'FreezeContract',
  },
  {
    label: 'Unfreeze',
    value: 'UnfreezeContract',
  },
  {
    label: 'Delegate',
    value: 'DelegateContract',
  },
  {
    label: 'Undelegate',
    value: 'UndelegateContract',
  },
  {
    label: 'Withdraw',
    value: 'WithdrawContract',
  },
  {
    label: 'Claim',
    value: 'ClaimContract',
  },
  {
    label: 'Unjail',
    value: 'UnjailContract',
  },
  {
    label: 'Asset Trigger',
    value: 'AssetTriggerContract',
  },
  {
    label: 'Set Account Name',
    value: 'SetAccountNameContract',
  },
  {
    label: 'Proposal',
    value: 'ProposalContract',
  },
  {
    label: 'Vote',
    value: 'VoteContract',
  },
  {
    label: 'Config ITO',
    value: 'ConfigITOContract',
  },
  {
    label: 'Set ITO Prices',
    value: 'SetITOPricesContract',
  },
  {
    label: 'Buy',
    value: 'BuyContract',
  },
  {
    label: 'Sell',
    value: 'SellContract',
  },
  {
    label: 'Cancel Market Order',
    value: 'CancelMarketOrderContract',
  },
  {
    label: 'Create Marketplace',
    value: 'CreateMarketplaceContract',
  },
  {
    label: 'Config Marketplace',
    value: 'ConfigMarketplaceContract',
  },
  {
    label: 'Update Account Permission',
    value: 'UpdateAccountPermissionContract',
  },
];

const contracts = {
  TransferContract: {
    amount: 0,
    assetID: '',
    receiver: '',
  },
  AssetTriggerContract: {
    triggerType: 0,
    assetId: '',
    receiver: '',
    amount: 0,
    mime: '',
    logo: '',
    uris: {},
    role: {
      address: '',
      hasRoleMint: false,
      hasRoleSetITOPrices: false,
    },
    staking: {
      apr: 0,
      minEpochsToClaim: 0,
      minEpochsToUnstake: 0,
      minEpochsToWithdraw: 0,
    },
  },
  CreateValidatorContract: {
    ownerAddress: '',
    config: {
      BLSPublicKey: '',
      rewardAddress: '',
      canDelegate: false,
      commission: 0,
      maxDelegationAmount: 0,
      logo: '',
      uris: {},
      name: '',
    },
  },
  ValidatorConfigContract: {
    config: {
      BLSPublicKey: '',
      rewardAddress: '',
      canDelegate: false,
      commission: 0,
      maxDelegationAmount: 0,
      logo: '',
      uris: {},
      name: '',
    },
  },
  CreateAssetContract: {
    type: 0,
    name: '',
    ticker: '',
    owner: '',
    logo: '',
    precision: 0,
    initialSupply: 0,
    maxSupply: 0,
    uris: {},
    royalties: {
      address: '',
      transferPercentage: [],
      transferFixed: 0,
      marketPercentage: 0,
      marketFixed: 0,
    },
    properties: {
      canFreeze: false,
      canWipe: false,
      canPause: false,
      canMint: false,
      canBurn: false,
      canChangeOwner: false,
      canAddRoles: false,
    },
    attributes: {
      isPaused: false,
      isNFTMintStopped: false,
    },
    staking: {
      APR: 0,
      minEpochsToClaim: 0,
      minEpochsToUnstake: 0,
      minEpochsToWithdraw: 0,
    },
    roles: [],
  },
  UnjailContract: {},
  FreezeContract: {
    assetId: '',
    amount: 0,
  },
  UnfreezeContract: {
    assetID: '',
    bucketID: '',
  },
  DelegateContract: {
    receiver: '',
    bucketID: '',
  },
  UndelegateContract: {
    bucketID: '',
  },
  WithdrawContract: {
    assetId: '',
  },
  ClaimContract: {
    claimType: 0,
    id: '',
  },
  SetAccountNameContract: {
    name: '',
  },
  ProposalContract: {
    description: '',
    epochsDuration: 0,
    parameters: {},
  },
  ConfigITOContract: {
    assetID: '',
    receiverAddress: '',
    status: 0,
    maxAmount: 0,
    packInfo: {},
  },
  VoteContract: {
    proposalID: 0,
    amount: 0,
    type: 0,
  },
  BuyContract: {
    buyType: 0,
    id: '',
    currencyId: '',
    amount: 0,
  },
  SellContract: {
    marketType: 0,
    marketPlaceId: '',
    assetId: '',
    currencyId: '',
    price: 0,
    reservePrice: 0,
    endTime: 0,
  },
  CancelMarketOrderContract: {
    orderId: '',
  },
  CreateMarketplaceContract: {
    name: '',
    referralAddress: '',
    referralPercentage: 0,
  },
  ConfigMarketplaceContract: {
    marketplaceID: '',
    name: '',
    referralAddress: '',
    referralPercentage: 0,
  },
  SetITOPricesContract: {
    assetID: '',
    packInfo: {},
  },
  UpdateAccountPermissionContract: {
    permissions: [
      {
        permissionName: '',
        threshold: '',
        operations: '',
        type: '',
        signers: [
          {
            address: '',
            weight: 0,
          },
        ],
      },
    ],
  },
};

export { options, contracts };
