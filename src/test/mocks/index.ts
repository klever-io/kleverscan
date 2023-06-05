import {
  IAccountAsset,
  IAsset,
  ICoinInfo,
  IDataCards,
  IHomeTransactions,
  IMetrics,
  ITransaction,
} from '@/types';
import { IBlock } from '@/types/blocks';
import {
  Contract,
  ContractsIndex,
  EnumAssetType,
  EnumClaimType,
  EnumITOStatus,
} from '@/types/contracts';

export const CoinTest: ICoinInfo[] = [
  {
    name: 'Klever',
    shortname: 'KLV',
    price: 0.02012557,
    variation: 1.04801,
    marketCap: {
      price: 108822166,
      variation: 0.96403,
    },
    volume: {
      price: 6535768,
      variation: 0,
    },
    prices: [
      {
        value: 0.019916836880262877,
      },
      {
        value: 0.019849745804499344,
      },
    ],
  },
  {
    name: 'Klever Finance',
    shortname: 'KFI',
    price: 102,
    variation: 0,
    marketCap: {
      price: 15415500,
      variation: 0,
    },
    volume: {
      price: 4.41,
      variation: 0,
    },
    prices: [
      {
        value: 100,
      },
    ],
  },
];

export const assetsData = {
  klv: {
    prices: {
      todaysPrice: null,
      yesterdayPrice: null,
      variation: null,
    },
    staking: {
      totalStaking: 10000000000000,
      dayBeforeTotalStaking: 5000000000000,
    },
    volume: null,
    circulatingSupply: null,
    estimatedAprYesterday: 5.5,
    estimatedAprBeforeYesterday: 5.6,
  },
  kfi: {
    prices: {
      todaysPrice: null,
      yesterdayPrice: null,
      variation: null,
    },
    staking: {
      totalStaking: 10000000000000,
      dayBeforeTotalStaking: 5000000000000,
    },
    volume: null,
    circulatingSupply: null,
    estimatedAprYesterday: 5.5,
    estimatedAprBeforeYesterday: 5.6,
  },
};

export const mockTxItem: ITransaction = {
  chainID: '10020',
  blockNum: 123,
  nonce: 123123,
  signature:
    'b66845fe95baef343b35393eb861f8bee4c41b06c8efab47aa243fe3560ff4e45518bfc7d89010dadaea37d2d0bf5be7d35c13b38b2f65d6baa9baa65s8d452w',
  searchOrder: 35,
  kAppFee: 0,
  bandwidthFee: 150000,
  status: 'success',
  resultCode: 'Ok',
  precision: 6,
  receipts: [
    {
      assetId: 'KLV',
      type: 0,
      amount: '3000000',
      from: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jquca668',
    },
  ],
  hash: 'a632bece34e0716fc465113e418f31911425783ea70624cb1555506225beeb4b',
  sender: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jquca668',
  timestamp: 1653331031000,
  contract: [
    {
      sender: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jquca668',
      type: 0,
      typeString: Contract.Transfer,
      parameter: {
        amount: 3000000,
        assetId: 'KLV',
        toAddress:
          'klv1t4cykcfs6k9kglwrcg95d5sas68d7w4a2rkv7v5qqqyj0gw4hd3s4uas4w',
      },
    },
  ],
};

export const mockedTxContractComponents = {
  transferContract: {
    type: Contract.Transfer,
    sender: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
    parameter: {
      amount: 100000000,
      assetId: 'KLV',
      toAddress:
        'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jquca668',
    },
  },
  createAssetContract: {
    type: Contract.CreateValidator,
    sender: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
    parameter: {
      type: EnumAssetType.NonFungible,
      name: 'New KLV',
      ticker: 'nKLV',
      ownerAddress:
        'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
      precision: 6,
      initialSupply: 1000000,
      maxSupply: 3000000000000000,
    },
  },
  createValidatorContract: {
    type: Contract.CreateValidator,
    sender: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
    parameter: {
      ownerAddress:
        'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
      config: {
        blsPublicKey: 'mockPublickey',
        rewardAddress:
          'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
        canDelegate: true,
        commission: 500,
        maxDelegationAmount: 12000000000000,
        name: 'Name',
      },
    },
  },
  freezeContract: {
    type: Contract.Freeze,
    sender: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
    parameter: {
      amount: 700000000,
      assetId: 'KLV',
    },
  },
  unfreezeContract: {
    type: Contract.Unfreeze,
    sender: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
    parameter: {
      bucketID:
        '241ef463625511e08ca53f81e7ed0b40ee9cbf798c383e3595e7275as52d147',
      assetId: 'KLV',
    },
    receipts: [
      {
        availableEpoch: 102,
        bucketID:
          '241ef463625511e08ca53f81e7ed0b40ee9cbf798c383e3595e7275as52d147',
      },
    ],
  },
  delegateContract: {
    type: Contract.Delegate,
    sender: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
    parameter: {
      bucketID:
        '241ef463625511e08ca53f81e7ed0b40ee9cbf798c383e3595e7275as52d147',
      toAddress:
        'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
    },
  },
  undelegateContract: {
    type: Contract.Undelegate,
    sender: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
    parameter: {
      bucketID:
        '241ef463625511e08ca53f81e7ed0b40ee9cbf798c383e3595e7275as52d147',
    },
  },
  widthdrawContract: {
    type: Contract.Withdraw,
    sender: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
    parameter: {
      assetId: 'KLV',
    },
  },
  claimContract: {
    type: Contract.Claim,
    sender: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
    parameter: {
      claimType: EnumClaimType.AllowanceClaim,
      id: 'KLV',
    },
  },
  unjailContract: {
    type: Contract.Unjail,
  },

  proposalContract: {
    type: Contract.Proposal,
    sender: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
    parameter: {
      description: 'quality proposal',
      epochsDuration: 40,
      parameters: {
        19: '50000000000',
        amount: 4000000,
      },
    },
  },
  voteContract: {
    type: Contract.Vote,
    sender: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
    parameter: {
      proposalId: 10,
      amount: 4000000,
    },
  },
  configIcoContract: {
    type: ContractsIndex['Config ITO'],
    typeString: Contract.ConfigITO,
    sender: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
    contractIndex: 0,
    parameter: {
      assetId: 'KLV',
      status: EnumITOStatus.DefaultITO,
    },
  },
  setIcoPricesContract: {
    type: Contract.SetITOPrices,
    sender: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
    parameter: {
      assetId: 'KLV',
      packInfo: [
        {
          key: 'KLV2',
          packs: [
            {
              amount: 2131231,
              price: 3131313000000,
            },
            {
              amount: 110000,
              price: 2222000000,
            },
          ],
        },
        {
          key: 'TBLC-14IV',
          packs: [
            {
              amount: 5,
              price: 550,
            },
            {
              amount: 2,
              price: 222220,
            },
            {
              amount: 6663,
              price: 424110,
            },
          ],
        },
      ],
    },
  },
  buyContract: {
    type: Contract.Buy,
    sender: 'klv15lgs4a0qe9ufs5l6qmngnptc76sel0tpgwppsdq9nhfyryp20fcsmcjeny',
    parameter: {
      buyType: 'ITOBuy',
      id: '1bcf565e5263856f',
      currencyID: 'KLV',
      amount: 320000000,
    },
  },

  ITOBuyReceipts: [
    {
      signer: 'klv15lgs4a0qe9ufs5l6qmngnptc76sel0tpgwppsdq9nhfyryp20fcsmcjeny',
      type: 19,
      weight: '1',
    },
    {
      assetId: 'KLV',
      from: 'klv15lgs4a0qe9ufs5l6qmngnptc76sel0tpgwppsdq9nhfyryp20fcsmcjeny',
      to: 'klv1un8gk5mmyhllmsjw8f0d9hyu6wzc590cyvvfuvgndth8w0jthvssquhjlw',
      type: 0,
      value: 20000000,
    },
    {
      assetId: 'KID-36W3',
      type: 2,
    },
    {
      assetId: 'KID-36W3',
      from: 'klv1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpgm89z',
      to: 'klv15lgs4a0qe9ufs5l6qmngnptc76sel0tpgwppsdq9nhfyryp20fcsmcjeny',
      type: 0,
      value: 1000,
    },
  ],

  validatorConfigContract: {
    type: Contract.ValidatorConfig,
    sender: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
    parameter: {
      config: {
        name: 'Klever Config',
        blsPublicKey: 'pubkey',
        uris: [{ Twitter: 'www.twitter.com' }],
        logo: 'www.image.png',
      },
    },
  },
  setAccountNameContract: {
    type: Contract.SetAccountName,
    sender: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
    parameter: {
      name: 'Klever',
    },
  },
  assetTriggerContract: {
    type: Contract.AssetTrigger,
    sender: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
    parameter: {
      triggerType: 0,
    },
  },
  sellContract: {
    type: Contract.Sell,
    sender: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
    parameter: {
      marketType: 'BuyItNowMarket',
      assetId: 'KPNFT-13Z0/9016',
      currencyID: 'KLV',
      endTime: 1673968772,
      marketplaceID: 'd4f2bab340c55fde',
      price: 450000000,
    },
  },
  cancelMarketOrderContract: {
    type: Contract.CancelMarketOrder,
    sender: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
    parameter: {
      orderID: 'asdkanslkdmaisdjqpwdknajsndidj234',
    },
  },
  createMarketplaceContract: {
    type: Contract.CreateMarketplace,
    sender: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
    parameter: {
      name: 'kleverPlace',
      referralAddress:
        'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
      referralpercentage: 100,
    },
  },
  configMarketplaceContract: {
    type: Contract.ConfigMarketplace,
    sender: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
    parameter: {
      marketplaceID: 'askdjaknsdkczmcas65e1231jnd1837481rhfn',
      name: 'kleverPlace',
      referralAddress:
        'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
      referralPercentage: 100,
    },
  },
};

export const mockedMetrics = {
  data: {
    overview: {
      slotAtEpochStart: 0,
      slotsPerEpoch: 5400,
      currentSlot: 0,
      slotDuration: 4000,
    } as IMetrics,
  },
};
export const mockedDataMetrics = {
  currentSlot: 0,
  epochFinishSlot: 0,
  epochLoadPercent: 0,
  remainingTime: '6h',
} as IDataMetrics;

export const mockedHomeDataCards: IDataCards = {
  totalAccounts: 100,
  totalTransactions: 20000,
  blocks: [
    {
      nonce: 15222,
      timestamp: Date.now() / 1000,
      hash: '456s2d4895be5a559c12e7c695037d930d5d5a05389fe17901ed03365s42589s',
      parentHash:
        '456s2d4895be5a559c12e7c695037d930d5d5a05389fe17901ed03365s42589v',

      blockRewards: 15,
      txCount: 0,
      txBurnedFees: 0,
      slot: 0,
      epoch: 0,
      isEpochStart: false,
      size: 300,
      sizeTxs: 0,
      transactions: [],
      txRootHash: 'txRoot',
      trieRoot: 'trieRoot',
      validatorsTrieRoot: 'validatorsTrieRoot',
      stakingTrieRoot: 'stakingTrieRoot',
      kappsTrieRoot: 'kappsTrieRoot',
      producerSignature: 'producerSignature',
      signature: 'signature',
      prevRandSeed: 'prevRandSeed',
      randSeed: 'randSeed',
      txHashes: [],
      softwareVersion: '0',
      chainID: '10008',
      producerName: 'producerName',
      producerOwnerAddress: 'producerAddress',
      validators: ['validatorBLS'],
    },
  ],
  actualTPS: '0 / 3000',
  counterEpoch: 0,
  newTransactions: 20,
  newAccounts: 2,
  beforeYesterdayTransactions: 10,
  metrics: mockedDataMetrics,
};

export interface IDataMetrics {
  currentSlot: number;
  epochFinishSlot: number;
  epochLoadPercent: number;
  remainingTime: string;
}

export const mockedStatistics = {
  data: {
    statistics: {
      chainStatistics: {
        liveTPS: 3,
        peakTPS: 100,
      },
    },
  },
  error: '',
};

export const mockedNewAccountsCall = {
  data: {
    number_by_day: [
      {
        doc_count: 33,
      },
    ],
  },

  error: '',
};

export const mockedTransactionsCall = {
  data: {
    transactions: {},
  },
  pagination: {
    totalRecords: 23,
  },
  error: '',
};

export const mockedYesterdayTxCall = {
  //TODO: Remove this when the API is fixed and probably change to comment below
  data: {
    transactions: {},
  },
  pagination: {
    totalRecords: 23,
  },
  error: '',
  // yesterdayTransactions: {
  //   data: {
  //     number_by_day: [
  //       {
  //         doc_count: 444,
  //       },
  //     ],
  //   },
  // },
  // error: '',
};
export const klvAsset: IAsset = {
  assetType: '',
  assetId: 'KLV',
  name: 'Klever',
  ticker: 'KLV',
  ownerAddress: '',
  logo: '',
  precision: 6,
  uris: [],
  initialSupply: 0,
  circulatingSupply: 0,
  maxSupply: 0,
  royalties: {},
  mintedValue: 0,
  issueDate: 0,
  burnedValue: 0,
  verified: false,
  hidden: false,
  properties: {
    canAddRoles: true,
    canBurn: true,
    canChangeOwner: true,
    canFreeze: true,
    canMint: true,
    canPause: true,
    canWipe: false,
  },
  attributes: {
    isNFTMintStopped: false,
    isPaused: false,
  },
  staking: {
    interestType: 'FPRI',
    totalStaked: 130000000000000,
    currentFPRAmount: 0,
    minEpochsToClaim: 1,
    minEpochsToUnstake: 1,
    minEpochsToWithdraw: 2,
    fpr: [
      {
        totalAmount: 313000000000,
        totalStaked: 213000000000,
        TotalClaimed: 0,
        epoch: 0,
        kda: [],
      },
    ],
    apr: [],
  },
  roles: [],
};

export const mockedHolders: IAccountAsset[] = [
  {
    address: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
    assetId: 'KLV',
    assetType: EnumAssetType.Fungible,
    balance: 10000000000000,
    precision: 6,
    frozenBalance: 10000000000000,
    unfrozenBalance: 0,
    lastClaim: {
      timestamp: 0,
      epoch: 0,
    },
  },
  {
    address: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
    assetId: 'KLV',
    assetType: EnumAssetType.Fungible,
    balance: 10000000000000,
    precision: 6,
    frozenBalance: 10000000000000,
    unfrozenBalance: 0,
    lastClaim: {
      timestamp: 0,
      epoch: 0,
    },
  },
  {
    address: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
    assetId: 'KLV',
    assetType: EnumAssetType.Fungible,
    balance: 10000000000000,
    precision: 6,
    frozenBalance: 10000000000000,
    unfrozenBalance: 0,
    lastClaim: {
      timestamp: 0,
      epoch: 0,
    },
  },
  {
    address: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
    assetId: 'KLV',
    assetType: EnumAssetType.Fungible,
    balance: 10000000000000,
    precision: 6,
    frozenBalance: 10000000000000,
    unfrozenBalance: 0,
    lastClaim: {
      timestamp: 0,
      epoch: 0,
    },
  },
  {
    address: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
    assetId: 'KLV',
    assetType: EnumAssetType.Fungible,
    balance: 10000000000000,
    precision: 6,
    frozenBalance: 10000000000000,
    unfrozenBalance: 0,
    lastClaim: {
      timestamp: 0,
      epoch: 0,
    },
  },
];

export const mockedTransactions = [
  {
    hash: '9854s785a325fc96520aa8c1d61669944113995dc67038a6d1beafas52147895',
    blockNum: 36552,
    timestamp: Date.now(),
    kAppFee: 1000000,
    bandwidthFee: 1000000,
    sender: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
    contract: [
      {
        type: 6,
        sender:
          'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
        parameter: {
          bucketID:
            '241ef463625511e08ca53f81e7ed0b40ee9cbf798c383e3595e7275as52d147',
          toAddress:
            'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
        },
      },
    ],
    status: 'success',
    chainID: '12565',
    signature:
      '452s658695cd0f9c467a8a0741d07fcae2448f51681b068bd70daf7aeaa1e2d2cf2cb92d71aa78fbbc29eba2521f38b5a4b5dc4f3e29bfa5c2a031855458s665',
  },
  {
    hash: '9854s785a325fc96520aa8c1d61669944113995dc67038a6d1beafs358a66587',
    blockNum: 45245,
    kAppFee: 1000000,
    bandwidthFee: 1000000,
    timestamp: Date.now(),
    sender: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
    contract: [
      {
        type: 6,
        sender:
          'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
        parameter: {
          bucketID:
            '241ef463625511e08ca53f81e7ed0b40ee9cbf798c383e3595e7275as52d147',
          toAddress: '',
        },
      },
      {
        type: 0,
        sender:
          'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
        parameter: {
          bucketID:
            '241ef463625511e08ca53f81e7ed0b40ee9cbf798c383e3595e7275as52d147',
          toAddress:
            'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
        },
      },
    ],
    status: 'success',
    chainID: '12565',
    signature:
      '452s658695cd0f9c467a8a0741d07fcae2448f51681b068bd70daf7aeaa1e2d2cf2cb92d71aa78fbbc29eba2521f38b5a4b5dc4f3e29bfa5c2a031855458s665',
  },
  {
    hash: '9854s785a325fc96520aa8c1d61669944113995dc67038a6d1beaf452s364863',
    blockNum: '',
    kAppFee: 1000000,
    bandwidthFee: 1000000,
    timestamp: Date.now(),
    sender: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
    contract: [
      {
        type: 0,
        sender:
          'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
        parameter: {
          amount: 1000000000,
          bucketID:
            '241ef463625511e08ca53f81e7ed0b40ee9cbf798c383e3595e7275as52d147',
          toAddress:
            'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
        },
      },
    ],
    status: 'success',
    chainID: '12565',
    signature:
      '452s658695cd0f9c467a8a0741d07fcae2448f51681b068bd70daf7aeaa1e2d2cf2cb92d71aa78fbbc29eba2521f38b5a4b5dc4f3e29bfa5c2a031855458s665',
  },
];

export const mockedBlocks = [
  {
    nonce: 15222,
    timestamp: Date.now() / 1000,
    hash: '456s2d4895be5a559c12e7c695037d930d5d5a05389fe17901ed03365s42589s',
    blockRewards: 15,
    blockIndex: 42,
    txCount: 0,
    txBurnedFees: 0,
  },
  {
    nonce: 14526,
    timestamp: Date.now() / 1000 - 500,
    hash: '456s2d4895be5a559c12e7c695037d930d5d5a05389fe17901ed03365s42589s',
    blockRewards: 15,
    blockIndex: 48,
    txCount: 0,
    txBurnedFees: 0,
  },
] as unknown as IBlock[];

export const mockedFetchBlocks = {
  data: {
    blocks: [
      {
        nonce: 5055,
        timestamp: Date.now() / 1000,
        hash: '456s2d4895be5a559c12e7c695037d930d5d5a05389fe17901ed03365s42589s',
        blockRewards: 98,
        blockIndex: 55,
        txCount: 0,
        txBurnedFees: 0,
      },
      {
        nonce: 98562,
        timestamp: Date.now() / 1000 - 500,
        hash: '456s2d4895be5a559c12e7c695037d930d5d5a05389fe17901ed03365s42589s',
        blockRewards: 55,
        blockIndex: 74,
        txCount: 0,
        txBurnedFees: 0,
      },
    ],
  },
} as unknown as {
  data: {
    blocks: IBlock[];
  };
};

const mockedPagination = {
  self: 1,
  next: 1,
  previous: 1,
  perPage: 10,
  totalPages: 1,
  totalRecords: 1,
};
//this function mocks /proposals/${number}
export const mockGetMockedProposal = (
  routerEnd: string,
  voteType?: 0 | 1,
): any => {
  const selectedProposal = mockedProposalsList.data.proposals[routerEnd];

  return {
    data: {
      proposal: {
        ...selectedProposal,
        voters:
          voteType !== undefined
            ? selectedProposal.voters.filter(
                (voter: { type: number }) => voter.type === voteType,
              )
            : selectedProposal.voters,
      },
    },
    error: '',
    pagination: mockedPagination,
  };
};

export const mockedProposalsList = {
  data: {
    proposals: [
      {
        // dont test this proposal, start by index 1
        proposalId: 1,
        proposer:
          'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjpp',
        txHash:
          'e46c6e4d389de415b04417562047fe1c9492f25cc477f7a838a2d7c18392f458',
        proposalStatus: 'ApprovedProposal',
        parameters: {
          '6': '15000000',
          '7': '40000000',
          '15': '5000000',
          '16': '7',
          '17': '1111',
        },
        description: 'Proposal to change bandwidth fee - automated test',
        epochStart: 8207,
        epochEnd: 8217,
        timestamp: 0,
        votes: { '0': 8000000000, '1': 4000000000 },
        voters: [
          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjsr',
            type: 0,
            amount: 2000000000,
            timestamp: 1656082815000,
          },
          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjs1',
            type: 0,
            amount: 2000000000,
            timestamp: 1656082815000,
          },
          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjs2',
            type: 0,
            amount: 2000000000,
            timestamp: 1656082815000,
          },
          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjs3',
            type: 0,
            amount: 2000000000,
            timestamp: 1656082815000,
          },
          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjs4',
            type: 1,
            amount: 2000000000,
            timestamp: 1656082815000,
          },
          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjs5',
            type: 1,
            amount: 2000000000,
            timestamp: 1656082815000,
          },
        ],
        totalStaked: 12000000000,
        votersPage: {
          self: 1,
          next: 2,
          previous: 0,
          perPage: 10,
          totalPages: 2,
          totalRecords: 12,
        },
      },
      {
        proposalId: 1,
        proposer:
          'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjpp',
        txHash:
          'e46c6e4d389de415b04417562047fe1c9492f25cc477f7a838a2d7c18392f458',
        proposalStatus: 'ApprovedProposal',
        parameters: {
          '6': '15000000',
          '7': '40000000',
          '15': '5000000',
          '16': '7',
          '17': '1111',
        },
        description: 'Proposal to change bandwidth fee - automated test',
        epochStart: 8207,
        epochEnd: 8217,
        timestamp: 0,
        votes: { '0': 8000000000, '1': 4000000000 },
        voters: [
          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjsr',
            type: 0,
            amount: 2000000000,
            timestamp: 1656082815000,
          },
          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjs1',
            type: 0,
            amount: 2000000000,
            timestamp: 1656082815000,
          },
          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjs2',
            type: 0,
            amount: 2000000000,
            timestamp: 1656082815000,
          },
          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjs3',
            type: 0,
            amount: 2000000000,
            timestamp: 1656082815000,
          },
          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjs4',
            type: 1,
            amount: 2000000000,
            timestamp: 1656082815000,
          },
          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjs5',
            type: 1,
            amount: 2000000000,
            timestamp: 1656082815000,
          },
        ],
        totalStaked: 12000000000,
        votersPage: {
          self: 1,
          next: 2,
          previous: 0,
          perPage: 10,
          totalPages: 2,
          totalRecords: 12,
        },
      },
      {
        proposalId: 2,
        proposer:
          'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjpp',
        txHash:
          '9c74d9b6021e03ef58044e153731b1f5e93bb7fba787d5d2332dd277938e0a22',
        proposalStatus: 'ApprovedProposal',
        parameters: {
          '0': '100000',
          '1': '0',
          '2': '15000000',
        },
        description: 'Proposal to change bandwidth fee - automated test',
        epochStart: 8009,
        epochEnd: 8019,
        timestamp: 1656082115000,
        votes: { '0': 6500000000 },
        voters: [
          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjsr',
            type: 0,
            amount: 2000000000,
            timestamp: 1656082815000,
          },
          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjs1',
            type: 0,
            amount: 2000000000,
            timestamp: 1656082815000,
          },
          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjs2',
            type: 0,
            amount: 2000000000,
            timestamp: 1656082815000,
          },
          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjs3',
            type: 0,
            amount: 500000000,
            timestamp: 1656082815000,
          },
        ],
        totalStaked: 8000000000000,
        votersPage: {
          self: 1,
          next: 1,
          previous: 0,
          perPage: 10,
          totalPages: 1,
          totalRecords: 12,
        },
      },
      {
        proposalId: 3,
        proposer:
          'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjpp',
        txHash:
          '520b5991a02e61f1d723231ed4b6d2d3d4a4e5db38cfabc4ea2a57bf327234af',
        proposalStatus: 'DeniedProposal',
        parameters: {
          '6': '15000000',
        },
        description: 'Proposal to change bandwidth fee - automated test',
        epochStart: 93,
        epochEnd: 103,
        votes: {
          '0': 1,
        },
        timestamp: 313151433211341412,
        voters: [
          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjsr',
            type: 0,
            amount: 1,
            timestamp: 1656082815000,
          },
        ],
        totalStaked: 2,
        votersPage: {
          self: 1,
          next: 1,
          previous: 0,
          perPage: 10,
          totalPages: 1,
          totalRecords: 12,
        },
      },
      {
        proposalId: 4,
        proposer:
          'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjpp',
        txHash:
          '030e210a47b2729e16b7bc2feb1ab4e18033dcd0f20ef3563687a71e47a06fd7',
        proposalStatus: 'ApprovedProposal',
        parameters: {
          '6': '15000000',
          '34': '233333',
          '17': '2311',
        },
        description: 'Proposal to change bandwidth fee - automated test',
        epochStart: 324,
        epochEnd: 334,
        voters: [
          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjsr',
            type: 1,
            amount: 200,
            timestamp: 1656110807000,
          },
        ],
        timestamp: 0,
        votes: { '1': 200 },
        totalStaked: 1000000000000,
        votersPage: {
          self: 1,
          next: 1,
          previous: 0,
          perPage: 10,
          totalPages: 1,
          totalRecords: 12,
        },
      },
      {
        proposalId: 5,
        proposer:
          'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjpp',
        txHash:
          '714b3efc00fcd3f5f4cf08638c2c3919268d61bba6a440e2073349f16c2e7e6e',
        proposalStatus: 'DeniedProposal',
        parameters: {
          '6': '15000000',
        },
        description: 'Proposal to change bandwidth fee - automated test',
        epochStart: 325,
        epochEnd: 335,
        votes: {
          '0': 1,
        },
        timestamp: 0,
        voters: [
          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjsr',
            type: 1,
            amount: 200,
            timestamp: 1656110807000,
          },
        ],
        totalStaked: 1000000000000,
        votersPage: {
          self: 1,
          next: 1,
          previous: 0,
          perPage: 10,
          totalPages: 1,
          totalRecords: 12,
        },
      },
      {
        proposalId: 6,
        proposer:
          'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjpp',
        txHash:
          '2fa0b31d444bdaf3ed232904e8aa94c01a5f50f4979a7695fd81c994447fc330',
        proposalStatus: 'DeniedProposal',
        parameters: {
          '6': '15000000',
        },
        description: 'Proposal to change bandwidth fee - automated test',
        epochStart: 8860,
        epochEnd: 8870,
        votes: {
          '0': 1,
        },
        timestamp: 0,
        voters: [
          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjsr',
            type: 0,
            amount: 1,
            timestamp: 1657138339000,
          },
        ],
        totalStaked: 6000000000000,
        votersPage: {
          self: 1,
          next: 1,
          previous: 0,
          perPage: 10,
          totalPages: 1,
          totalRecords: 12,
        },
      },
      {
        proposalId: 7,
        proposer:
          'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjpp',
        txHash:
          'd5015129b6cc4381ca90755548234a3b02c3faca41455012c2643d222a123854',
        proposalStatus: 'ActiveProposal',
        parameters: {
          '6': '15000000',
        },
        description: 'Proposal to change bandwidth fee - automated test',
        epochStart: 8911,
        epochEnd: 8921,
        votes: {
          '0': 1,
        },
        timestamp: 0,
        voters: [
          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjsr',
            type: 0,
            amount: 60123000,
            timestamp: 1657144539000,
          },
          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjs1',
            type: 0,
            amount: 60513100,
            timestamp: 1657144329000,
          },
        ],
        totalStaked: 6000000000000,
        votersPage: {
          self: 1,
          next: 1,
          previous: 0,
          perPage: 10,
          totalPages: 1,
          totalRecords: 12,
        },
      },
      {
        proposalId: 8,
        proposer:
          'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjpp',
        txHash:
          '871640d46a5d747766cd5a9b806860c2a4e255d489e26d9821a41519e7e35914',
        proposalStatus: 'DeniedProposal',
        parameters: {
          '6': '15000000',
        },
        description: 'Proposal to change bandwidth fee - automated test',
        epochStart: 89,
        epochEnd: 99,
        votes: {
          '0': 112213412311,
          '1': 4968256329000,
        },
        timestamp: 0,
        voters: [
          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjsr',
            type: 0,
            amount: 112213412311,
            timestamp: 1656082443000,
          },
          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjs1',
            type: 1,
            amount: 100105003300,
            timestamp: 1656085443000,
          },
          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjs2',
            type: 1,
            amount: 200105003300,
            timestamp: 1656085443000,
          },
          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjs3',
            type: 1,
            amount: 300105003300,
            timestamp: 1656085443000,
          },
        ],
        totalStaked: 1001050033000,
        votersPage: {
          self: 1,
          next: 1,
          previous: 0,
          perPage: 10,
          totalPages: 1,
          totalRecords: 12,
        },
      },
      {
        proposalId: 9,
        proposer:
          'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjpp',
        txHash:
          'ec1ea2b93a0d95fe309782e2b538bec31e47fdc20c8c6d812ed142cbd1b71a4f',
        proposalStatus: 'DeniedProposal',
        parameters: {
          '6': '15000000',
        },
        description: 'Proposal to change bandwidth fee - automated test',
        epochStart: 8011,
        epochEnd: 8021,
        voters: [
          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjsr',
            type: 0,
            amount: 10000001,
            timestamp: 1656082443000,
          },
          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjs1',
            type: 1,
            amount: 50000000,
            timestamp: 1656082543000,
          },
        ],
        timestamp: 0,
        votes: { '0': 10000001, '1': 50000000 },
        totalStaked: 4000000000000,
        votersPage: {
          next: 1,
          previous: 0,
          perPage: 10,
          totalPages: 1,
          totalRecords: 12,
        },
      },
      {
        proposalId: 10,
        proposer:
          'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjpp',
        txHash:
          '476a971df4d2f7fb56fc6014e0f29d0269405c42351fabd53c50706741d83784',
        proposalStatus: 'DeniedProposal',
        parameters: {
          '6': '15000000',
        },
        description: 'Proposal to change bandwidth fee - automated test',
        epochStart: 8211,
        epochEnd: 8221,
        votes: {
          '0': 3550886967051,
          '1': 263028664226,
        },
        timestamp: 0,
        voters: [
          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjsr10',
            type: 0,
            amount: 131514332113,
            timestamp: 1657060171000,
          },

          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmj11',
            type: 0,
            amount: 131514332113,
            timestamp: 1657060171000,
          },

          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmj12',
            type: 0,
            amount: 131514332113,
            timestamp: 1657060171000,
          },

          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmj13',
            type: 0,
            amount: 131514332113,
            timestamp: 1657060171000,
          },

          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmj14',
            type: 0,
            amount: 131514332113,
            timestamp: 1657060171000,
          },

          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmj15',
            type: 0,
            amount: 131514332113,
            timestamp: 1657060171000,
          },

          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmj16',
            type: 0,
            amount: 131514332113,
            timestamp: 1657060171000,
          },

          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmj17',
            type: 0,
            amount: 131514332113,
            timestamp: 1657060171000,
          },

          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmj21',
            type: 0,
            amount: 131514332113,
            timestamp: 1657060171000,
          },

          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmj22',
            type: 0,
            amount: 131514332113,
            timestamp: 1657060171000,
          },

          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmj23',
            type: 0,
            amount: 131514332113,
            timestamp: 1657060171000,
          },

          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmj24',
            type: 0,
            amount: 131514332113,
            timestamp: 1657060171000,
          },

          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmj25',
            type: 0,
            amount: 131514332113,
            timestamp: 1657060171000,
          },

          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmj26',
            type: 0,
            amount: 131514332113,
            timestamp: 1657060171000,
          },

          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmj27',
            type: 0,
            amount: 131514332113,
            timestamp: 1657060171000,
          },

          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmj31',
            type: 0,
            amount: 131514332113,
            timestamp: 1657060171000,
          },

          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmj32',
            type: 0,
            amount: 131514332113,
            timestamp: 1657060171000,
          },

          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmj33',
            type: 0,
            amount: 131514332113,
            timestamp: 1657060171000,
          },

          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmj34',
            type: 0,
            amount: 131514332113,
            timestamp: 1657060171000,
          },

          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmj35',
            type: 0,
            amount: 131514332113,
            timestamp: 1657060171000,
          },

          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmj36',
            type: 0,
            amount: 131514332113,
            timestamp: 1657060171000,
          },

          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmj37',
            type: 0,
            amount: 131514332113,
            timestamp: 1657060171000,
          },

          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmj41',
            type: 0,
            amount: 131514332113,
            timestamp: 1657060171000,
          },

          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmj44',
            type: 0,
            amount: 131514332113,
            timestamp: 1657060171000,
          },

          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmj47',
            type: 0,
            amount: 131514332113,
            timestamp: 1657060171000,
          },

          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjx1',
            type: 1,
            amount: 131514332113,
            timestamp: 1657060171000,
          },
          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjx2',
            type: 0,
            amount: 131514332113,
            timestamp: 1657060171000,
          },

          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjx3',
            type: 1,
            amount: 131514332113,
            timestamp: 1657060171000,
          },

          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjx4',
            type: 0,
            amount: 131514332113,
            timestamp: 1657060171000,
          },
        ],
        totalStaked: 4000000000000,
        votersPage: {
          self: 1,
          next: 2,
          previous: 1,
          perPage: 10,
          totalPages: 4,
          totalRecords: 58,
        },
      },
    ],
  },
  pagination: {
    self: 1,
    next: 1,
    previous: 0,
    perPage: 10,
    totalPages: 2,
    totalRecords: 12,
  },
  error: '',
  code: 'successful',
};

export const mockedProposalsListPage2 = {
  data: {
    proposals: [
      {
        proposalId: 10,
        proposer:
          'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjpp',
        txHash:
          'd5015129b6cc4381ca90755548234a3b02c3faca41455012c2643d222a123854',
        proposalStatus: 'ActiveProposal',
        parameters: {
          '6': '15000000',
        },
        description: 'Proposal to change bandwidth fee - automated test',
        epochStart: 8911,
        epochEnd: 8921,
        votes: {
          '0': 1,
        },
        timestamp: 0,
        voters: [
          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjsr',
            type: 0,
            amount: 60123000,
            timestamp: 1657144539000,
          },
          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjs1',
            type: 0,
            amount: 60513100,
            timestamp: 1657144329000,
          },
        ],
        totalStaked: 6000000000000,
        votersPage: {
          self: 1,
          next: 1,
          previous: 0,
          perPage: 10,
          totalPages: 1,
          totalRecords: 12,
        },
      },
      {
        proposalId: 11,
        proposer:
          'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjpp',
        txHash:
          'd5015129b6cc4381ca90755548234a3b02c3faca41455012c2643d222a123854',
        proposalStatus: 'ActiveProposal',
        parameters: {
          '6': '15000000',
        },
        description: 'Proposal to change bandwidth fee - automated test',
        epochStart: 8911,
        epochEnd: 8921,
        votes: {
          '0': 1,
        },
        timestamp: 0,
        voters: [
          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjsr',
            type: 0,
            amount: 60123000,
            timestamp: 1657144539000,
          },
          {
            address:
              'klv1vq9f7xtazuk9y3n46ukthgf2l30ev2s0qxvs6dfp4f2e76sfu3xshpmjs1',
            type: 0,
            amount: 60513100,
            timestamp: 1657144329000,
          },
        ],
        totalStaked: 3000000000000,
        votersPage: {
          self: 1,
          next: 1,
          previous: 0,
          perPage: 10,
          totalPages: 1,
          totalRecords: 12,
        },
      },
    ],
  },
  pagination: {
    self: 2,
    next: 3,
    previous: 0,
    perPage: 10,
    totalPages: 2,
    totalRecords: 12,
  },
  error: '',
  code: 'successful',
};
export const mockOverViewParameters = {
  data: {
    overview: {
      baseTxSize: 250,
      chainID: '108',
      currentSlot: 2342011,
      epochNumber: 433,
      nonce: 2334860,
      nonceAtEpochStart: 2331052,
      slotAtEpochStart: 2338203,
      slotCurrentTimestamp: 1666048444,
      slotDuration: 4000,
      slotsPerEpoch: 5400,
      startTime: 1656680400,
    },
  },
  error: '',
  code: 'successful',
};

export const mockNetworkParameters = {
  data: {
    parameters: {
      BlockRewards: {
        type: 'Int64',
        value: '15000000',
      },
      FeePerDataByte: {
        type: 'Int64',
        value: '4000',
      },
      KAppFeeAssetTrigger: {
        type: 'Int64',
        value: '2000000',
      },
      KAppFeeBuy: {
        type: 'Int64',
        value: '1000000',
      },
      KAppFeeCancelMarketOrder: {
        type: 'Int64',
        value: '50000000',
      },
      KAppFeeClaim: {
        type: 'Int64',
        value: '1000000',
      },
      KAppFeeConfigITO: {
        type: 'Int64',
        value: '20000000000',
      },
      KAppFeeConfigMarketplace: {
        type: 'Int64',
        value: '1000000000',
      },
      KAppFeeCreateAsset: {
        type: 'Int64',
        value: '20000000000',
      },
      KAppFeeCreateMarketplace: {
        type: 'Int64',
        value: '50000000000',
      },
      KAppFeeCreateValidator: {
        type: 'Int64',
        value: '50000000000',
      },
      KAppFeeDelegate: {
        type: 'Int64',
        value: '1000000',
      },
      KAppFeeFreeze: {
        type: 'Int64',
        value: '1000000',
      },
      KAppFeeProposal: {
        type: 'Int64',
        value: '500000000',
      },
      KAppFeeSell: {
        type: 'Int64',
        value: '10000000',
      },
      KAppFeeSetAccountName: {
        type: 'Int64',
        value: '100000000',
      },
      KAppFeeSetITOPrices: {
        type: 'Int64',
        value: '1000000',
      },
      KAppFeeTransfer: {
        type: 'Int64',
        value: '500000',
      },
      KAppFeeUndelegate: {
        type: 'Int64',
        value: '1000000',
      },
      KAppFeeUnfreeze: {
        type: 'Int64',
        value: '1000000',
      },
      KAppFeeUnjail: {
        type: 'Int64',
        value: '10000000000',
      },
      KAppFeeUpdateAccountPermission: {
        type: 'Int64',
        value: '1000000000',
      },
      KAppFeeValidatorConfig: {
        type: 'Int64',
        value: '1000000000',
      },
      KAppFeeVote: {
        type: 'Int64',
        value: '1000000',
      },
      KAppFeeWithdraw: {
        type: 'Int64',
        value: '1000000',
      },
      LeaderValidatorRewardsPercentage: {
        type: 'Uint32',
        value: '6000',
      },
      MaxBucketSize: {
        type: 'Int64',
        value: '100',
      },
      MaxEpochsUnclaimed: {
        type: 'Int64',
        value: '100',
      },
      MaxNFTMintBatch: {
        type: 'Int64',
        value: '50',
      },
      MinKFIStakedToEnableProposals: {
        type: 'Int64',
        value: '1000000000000',
      },
      MinKLVBucketAmount: {
        type: 'Int64',
        value: '1000000000',
      },
      MinSelfDelegatedAmount: {
        type: 'Int64',
        value: '1500000000000',
      },
      MinTotalDelegatedAmount: {
        type: 'Int64',
        value: '10000000000000',
      },
      ProposalMaxEpochsDuration: {
        type: 'Uint32',
        value: '40',
      },
      StakingRewards: {
        type: 'Int64',
        value: '15000000',
      },
    },
  },
  error: '',
  code: 'successful',
};

export const mockHomeTxs: IHomeTransactions = {
  setTotalTransactions: () => ({}),
  transactions: [],
  transactionsList: [
    {
      doc_count: 9,
      key: 1652140800000,
    },
    {
      doc_count: 32,
      key: 1652227200000,
    },
  ],
  precision: 6,
};

export const mockedValidators = [
  '517d232711337b969c5fba23d10671c78b46f790a37906bf05789e14d979e114fc9f18b19028ce214e23bb01b7c88312391a185c99225507e85f23ddfb1561c5a933ead1aef0f51663d14f79f3d4a440a2ecddafc01b9626d38d5084db141012',
  'f9971f7114759d5402cba744ec061c61b1fd56cc4e4e775c92bf2ca83603a7d00e3fc0031ca054906b77541051678100442180be2af5e464b43ae7b94e0b4a58d6f41b858a5789d548f6537590c406672587975eb2dc45da8f6388b1bca10104',
  '1b442dceadd0b29fd5c1cfc6468496ac6e5e9f528ce514fb3a8d97ca6f26d596978409441e9b650047d0ab704d6f320d455dc6a570eb92c5a74a83e5e8a8e6230b0c3a1dc888f4a02f0c604f1edd4f09ee7b136a292ecef2204d9aba7c20488a',
  'f51de675af5cec645f1119a8d6150b7ca39f9521898c84224df83412861951e2439c8300d6b00f2344051b918dbdc00ebeb325d5524459542526108e5d527b0ae457566677541a3d2efa335eedc9b8c26f393deefebcccef6bcecaff59632206',
  '63ee6df2a1bc281f1b627da0dea6ecc564a13051d9aaf00de2500e75724bb37f72ec2d80d4f29d95a91ba70c96038502e1b8fe1e9a404d7629619b064a1d7aacfb7fa9909e3c48461b11a1c312f55a73ad466716035092a764af5bbdb112480e',
  'a1bb69e9cd89e6806ad1f724ddc3ba5c6ca161fe0071a93207d4d2cad97235610b0f6b8a4e28bff683e5c6b550d8ff18fd11a9a2f13c0cd595610535ad260034ea778a1202a6b00b62b4dadacd4d8534c26f7e8d9f3e578679b3fbfe3c232802',
  'e7deebf785dc3818741362076d60392e67db638d1d3835993a72b44876d074aea944513d3f9744497589c1ca92ddac0fc29892c1d72ead91079326c159d9b409325e365042bcca008df74b3498b137d8a3a6b5bbdb65f16153cb6001b6ae8001',
  '663130f2fb9e35d9d736ecef676466a89e7c4fcfbc7c848eabbd17124e2358dd380359a5bb2ee569f1a381a4a243480d5ef1388fe670faed35ecf411cb3b24ac2e77b2b6cbae55a506bc983abfb4f1bf9b1e2897e19f836d959aa952dad8bf99',
  'f0bef6b6f3a22f92d66c466d90e8fe785e37fe8a1eb406985cdb37f8afb7bd30d2a7fe0a722e2eded5b2dbfd76a0a00658ec326857910b01ef4afd999b29e7a9437fc199b2c98018b73cd76a350bdf62c2eb1210d6bef3aa3bb19f1555d36e0b',
  'dfc5100dd96a075b2ac00deb92e4b5747349d0a6c10bd4083b5acfd2ebd69f38421f64bfd43730d25433cc37862a0c130ca014363c77b8894a5ffbe6912779f39e2fe6602dd8186fa30c27a6e1d2588ec4554b3e79cafc3d3d8e1b6c0b1b4b8c',
  '88ae0f3c4cfecfa62767eeeadad79bfc8f5376b7ddf62af942731141278a83014080984ef58f6e8521df14990aaedd115b4ddf736dba500410e42d6bcf20c557f51f6cd8ac8d9b70befbbad6196eab99c773da121d888e6612dccd5bc41a5080',
  '3352f1840fe0ecf9ce2accb65a545e278814d18479e512af7de1f54f99d901f56716ec44c7cf14b5b3494f946392c20e97a5fbcb05994a90b719d7e000fa15b64b88741da6fd5953869e327a4f5aaf64deb88aa0e40d3ad7a0e228fd7c1a738f',
  'baea11a5b0d5f28d0f1b37ad97c5075a44543ec903f4d2d548efc9fe591a5d371687e87427727f66b01d04cdb02626081acee18fe26db124326c56a642fad71d815e9a64c3f7e9d584cbfd53e2c48d04d6a688ba6c9ae41642c9da13ae1ace83',
  '2fd3f2f2bbbd198ec092ab48e780331fde7f9318701838a6c6aa3c24f9cf22b7bbda86e313397781069d651b04476806dea1229dfdca707a16fa4d6edc6cb06b9157d6587ef13f38d03ed80c83662612acd35cc9068a23845ae4f3b61af2128e',
  'f995e94dfed7270def51b95aa22ced29bdbb7fa97881efd6c8c30a9af797f3378e418dae60f77d0603ea3cf726f5eb13352a51b4bb33233c6b0be5834ff963482ebc387810d2b17a8b4b81f257f745f2e366af4f144c37d079d8bfe8bf60db88',
  '105824d7bd72277c0ad3328eae3ebafd9890141128cf388509a8ee04853845d60cf72241a215a04fe776e2b1f539a7069b68dc64b264d6100dd6f653399cb353df61176285fc6343c92e29e1be1e2dae25a7503de09bfd3d04163036adc52094',
  '33ba1725f89ee49907f3f9cf3b0b11c5093aeb3f7481f77eebb3bcba951e0a12735278da4c758f5f34f45a7160fd4408ad7d22df518e0a13e1976ab6ba6fcec21d8d6fec5de039e8a03c6321e75651257d1a6104368a9fbb50e75fae923cc50d',
  '04ef0d1bc213f7d2498b2b93d4dff8a8e99f5d7abbfcc5eabc9fc562dbe1a6253f089ad7c6f882e4377f9f957f882714df3fc268667ca165cb043132a83ad8ab1824ba088e6e92264862925071127985fa2f42ee99ec3103beba54d43e3f3b05',
  '8491cb8bc60515d233755d1b3a5388eb8ca23434fac88a4abb3ba20ecd687ac9e744bf55d3881ac4fea9acce94fcbd06964a26650a3bdae6bc13994b382c4fe8e6465e3c56d1ce4503079f0c8c9d4937e3380b7b63a9f9b27db5d6567884b188',
  'c9316ba8c1248b4912c409954a63682f3aab5415b2a5e0a33154d08fca6435fe28d2b9f23e92647d0ad9cc657b32bf0c7b72776773a671097ae8f61c3f7ca8a36d1d5ac2b3165f69e38a56971389352c32629abbf7724036db23474bee2a258b',
  '839cfac0ecd84d3af7b1419eb7764d5a68c1e5cc9a3066133d3d0dc7e2a9d372b0b30949f01f141dca422398af9d16008669685134e1144a0c94be9e507ee888f95dbbdfb30a3e57858861c650ed7ad892f8be7e76e65d4dacea8bd677fa8581',
];
