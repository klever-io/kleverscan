import {
  Contract,
  EnumAssetType,
  EnumBuyType,
  EnumClaimType,
  EnumITOStatus,
  EnumMarketType,
  IAccountAsset,
  IAsset,
  IDataCards,
  IHomeTransactions,
  ITransaction,
} from '../../types';

export const CoinTest = [
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
    },
  ],
  hash: 'a632bece34e0716fc465113e418f31911425783ea70624cb1555506225beeb4b',
  sender: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jquca668',
  timestamp: 1653331031000,
  contract: [
    {
      sender: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jquca668',
      type: Contract.Transfer,
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
      circulatingSupply: 10000000000,
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
  proposalContract: {
    type: Contract.Proposal,
    sender: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
    parameter: {
      value: 1231,
      epochsDuration: 100,
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
    type: Contract.ConfigITO,
    sender: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
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
      packInfo: {
        price: 245,
      },
    },
  },
  buyContract: {
    type: Contract.Buy,
    sender: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
    parameter: {
      buyType: EnumBuyType.ITOBuy,
      id: 'KLV',
    },
  },
  validatorConfigContract: {
    type: Contract.ValidatorConfig,
    sender: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
    parameter: {
      name: 'Klever Config',
      blsPublicKey: 'pubkey',
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
      marketType: EnumMarketType.BuyItNowMarket,
      assetId: 'KLV',
    },
  },
  cancelMarketOrderContract: {
    type: Contract.CancelMarketOrder,
    sender: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
    parameter: {
      orderId: 'asdkanslkdmaisdjqpwdknajsndidj234',
    },
  },
  createMarketplaceContract: {
    type: Contract.CreateMarketplace,
    sender: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
    parameter: {
      name: 'kleverPlace',
      referralAddress:
        'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
      referralpercentage: 1,
    },
  },
  configMarketplaceContract: {
    type: Contract.ConfigMarketplace,
    sender: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
    parameter: {
      marketplaceId: 'askdjaknsdkczmcas65e1231jnd1837481rhfn',
      name: 'kleverPlace',
      referralAddress:
        'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
      referralpercentage: 1,
    },
  },
};

const assetsData = {
  klv: {
    prices: {
      todaysPrice: null,
      yesterdayPrice: null,
      variation: null,
    },
    staking: {
      totalStaking: null,
      dayBeforeTotalStaking: null,
    },
    volume: null,
    circulatingSupply: null,
  },
  kfi: {
    prices: {
      todaysPrice: null,
      yesterdayPrice: null,
      variation: null,
    },
    staking: {
      totalStaking: null,
      dayBeforeTotalStaking: null,
    },
    volume: null,
    circulatingSupply: null,
  },
};

export const mockedHomeDataCards: IDataCards = {
  totalAccounts: 100,
  totalTransactions: 20000,
  block: {
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
  tps: '0 / 3000',
  epochInfo: {
    currentSlot: 20,
    epochFinishSlot: 200,
    epochLoadPercent: 30,
    remainingTime: 'two days',
  },
  assetsData: {
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
    },
  },
  coinsData: [
    {
      name: 'Klever',
      shortname: 'KLV',
      price: 0.23,
      variation: 8,
      marketCap: {
        price: 97137477,
        variation: 45.81105,
      },
      volume: {
        price: 4372976,
        variation: 0,
      },
      prices: [
        { value: 0.012372596929497385 },
        { value: 0.012404993140008574 },
        { value: 0.012240615957263926 },
      ],
    },
    {
      name: 'Klever Finance',
      shortname: 'KFI',
      price: 97.78,
      variation: 0,
      marketCap: {
        price: 14667000,
        variation: 0,
      },
      volume: {
        price: 0.673435,
        variation: 0,
      },
      prices: [
        {
          value: 97.7800584108219,
        },
      ],
    },
  ],
  yesterdayTransactions: 20,
  yesterdayAccounts: 2,
};

export const mockedMetrics =
  'klv_slot_at_epoch_start{chainID="100015"} 486155\nklv_slots_per_epoch{chainID="100015"} 150\nklv_current_slot{chainID="100015"} 486191\nklv_slot_duration{chainID="100015"} 4000';

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
  yesterdayAccounts: {
    data: {
      number_by_day: [
        {
          doc_count: 33,
        },
      ],
    },
  },
  error: '',
};

export const mockedTransactionsCall = {
  transactions: {
    pagination: {
      totalRecords: 22,
    },
  },
  error: '',
};

export const mockedYesterdayTxCall = {
  yesterdayTransactions: {
    data: {
      number_by_day: [
        {
          doc_count: 444,
        },
      ],
    },
  },
  error: '',
};
export const klvAsset: IAsset = {
  assetType: '',
  assetId: '',
  name: 'Klever',
  ticker: 'KLV',
  ownerAddress: '',
  logo: '',
  precision: 6,
  uris: null,
  initialSupply: 0,
  circulatingSupply: 0,
  maxSupply: 0,
  royalties: 0,
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
    minEpochsToWithdraw: 0,
    totalStaked: 0,
  },
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
];

export const mockedTransactions = [
  {
    hash: '9854s785a325fc96520aa8c1d61669944113995dc67038a6d1beafas52147895',
    blockNum: 36552,
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
];

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
};

//this function mocks /proposals/${number}
export const getMockedProposal = (number: number, serverSide = true): any => {
  const selectedProposal = mockedProposalsList.data.proposals[number];
  return { data: { proposal: selectedProposal } };
};

export const mockedProposalsList = {
  data: {
    proposals: [
      {
        proposalId: 0,
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
        proposalId: 2,
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
        proposalId: 3,
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
        proposalId: 4,
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
        proposalId: 5,
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
        proposalId: 6,
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
        proposalId: 7,
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
        proposalId: 8,
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
        proposalId: 9,
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
export const overViewParametersMock = {
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

export const networkParametersMock = {
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
