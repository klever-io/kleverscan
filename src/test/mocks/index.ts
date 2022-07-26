import {
  Contract,
  EnumClaimType,
  EnumICOStatus,
  EnumBuyType,
  EnumMarketType,
  EnumAssetType,
  IDataCards,
  IAsset,
  IAccountAsset,
  ITransaction,
  IHomeTransactions,
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
    type: Contract.ConfigICO,
    sender: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
    parameter: {
      assetId: 'KLV',
      status: EnumICOStatus.DefaultICO,
    },
  },
  setIcoPricesContract: {
    type: Contract.SetICOPrices,
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
      buyType: EnumBuyType.ICOBuy,
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

export const mockedHomeDataCards: IDataCards = {
  totalAccounts: 100,
  totalTransactions: 20000,
  tps: '0 / 3000',
  epochInfo: {
    currentSlot: 20,
    epochFinishSlot: 200,
    epochLoadPercent: 30,
    remainingTime: 'two days',
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

export const mockedProposals = [
  {
    proposalId: 0,
    description: 'Test description',
    epochStart: 4,
    epochEnd: 8,
    proposalStatus: 'sucess',
    proposer: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jquca668',
    votes: { '0': 2000000000000 },
    totalStaked: 2000000,
  },
  {
    proposalId: 1,
    description: '',
    epochStart: 10,
    epochEnd: 14,
    proposalStatus: 'pending',
    proposer: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waa5s89w5s25',
    votes: { '0': 1500000000000 },
    totalStaked: 2000000,
  },
  {
    proposalId: 1,
    description: '',
    epochStart: 24,
    epochEnd: 28,
    proposalStatus: 'fail',
    proposer: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waa5s89w5s25',
    votes: { '0': 1000000000000 },
    totalStaked: 2000000,
  },
  {
    proposalId: 1,
    description: '',
    epochStart: 15,
    epochEnd: 19,
    proposalStatus: 'ApprovedProposal',
    proposer: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waa5s89w5s25',
    votes: { '0': 3000000000000 },
    totalStaked: 3000000,
  },
];

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
