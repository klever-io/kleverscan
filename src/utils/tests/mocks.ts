import { Contract } from '@/types/contracts';
import { IAsset, ITransactionResponse } from '@/types/index';

const KFI: IAsset = {
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
  royalties: {},
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
  hidden: false,
  verified: false,
};

const DVK: IAsset = {
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
  royalties: {},
  staking: {
    minEpochsToWithdraw: 2,
    totalStaked: 1234567,
    interestType: 'APRI',
    apr: [],
    fpr: [
      {
        totalAmount: 0,
        totalStaked: 0,
        epoch: 0,
        TotalClaimed: 0,
      },
    ],
    currentFPRAmount: 0,
    minEpochsToClaim: 0,
    minEpochsToUnstake: 0,
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

  hidden: false,
  verified: false,
};

const SNTEST: IAsset = {
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
  royalties: {},
  staking: {
    minEpochsToWithdraw: 2,
    totalStaked: 1234567,
    fpr: [
      {
        totalAmount: 0,
        totalStaked: 0,
        epoch: 0,
        TotalClaimed: 0,
      },
    ],
    apr: [],
    interestType: 'APRI',
    currentFPRAmount: 0,
    minEpochsToClaim: 0,
    minEpochsToUnstake: 0,
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
  hidden: false,
  verified: false,
};

const specialAsset: IAsset = {
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
  royalties: {},
  staking: {
    minEpochsToWithdraw: 2,
    totalStaked: 1234567,
    currentFPRAmount: 0,
    interestType: 'APRI',
    minEpochsToClaim: 0,
    minEpochsToUnstake: 0,
    apr: [],
    fpr: [
      {
        totalAmount: 0,
        totalStaked: 0,
        epoch: 0,
        TotalClaimed: 0,
      },
    ],
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
  hidden: false,
  verified: false,
};
const validator = {
  data: {
    networkTotalStake: 2549193827673156,
    validators: [
      {
        ownerAddress:
          'klv1tyajtxfsuslwqu8jmvp4xq87dppua0mwugx7ntv5dqt5cx200xfqayxflh',
        blsPublicKey:
          'd7f61d25bf968303c17412631a816c9a45b83653eb06c8e2299d69e35ffdf9237aed9f545e7e99e74c85b50f27816d05fdd91e770bccc0a621112cce66a86599b92c6eef7a1876fb1bc3d7c088ff1dc243a1e68ee0562fe78075ec1f3cb4b790',
        rewardsAddress:
          'klv1tyajtxfsuslwqu8jmvp4xq87dppua0mwugx7ntv5dqt5cx200xfqayxflh',
        registerNonce: 551357,
        selfStaked: true,
        selfStake: 1500000000000,
        totalStake: 10000000000000,
        jailedEpoch: 4294967295,
        jailed: false,
        waiting: false,
        numJailed: 0,
        totalSlash: 0,
        canDelegate: true,
        maxDelegation: 10000000000000,
        commission: 0,
        totalRewards: 497613861635,
        name: 'PLC-Node',
        logo: '',
        uris: null,
        list: 'elected',
        index: 0,
        accumulatedFees: 4862473411,
        validatorSuccessRate: {
          numSuccess: 848,
          numFailure: 0,
        },
        leaderSuccessRate: {
          numSuccess: 60,
          numFailure: 0,
        },
        validatorIgnoredSignaturesRate: 1,
        rating: 10000000,
        tempRating: 10000000,
        numSelectedInSuccessBlocks: 909,
        consecutiveProposerMisses: 0,
        totalValidatorSuccessRate: {
          numSuccess: 558622,
          numFailure: 0,
        },
        totalLeaderSuccessRate: {
          numSuccess: 27954,
          numFailure: 1824,
        },
        totalValidatorIgnoredSignaturesRate: 199,
      },
      {
        ownerAddress:
          'klv1qh2va63uesnzydz9pykqmszcphewse9f87mqxmkyhh0qfmv5l28s35r5r2',
        blsPublicKey:
          'f51de675af5cec645f1119a8d6150b7ca39f9521898c84224df83412861951e2439c8300d6b00f2344051b918dbdc00ebeb325d5524459542526108e5d527b0ae457566677541a3d2efa335eedc9b8c26f393deefebcccef6bcecaff59632206',
        rewardsAddress:
          'klv1qh2va63uesnzydz9pykqmszcphewse9f87mqxmkyhh0qfmv5l28s35r5r2',
        registerNonce: 636861,
        selfStaked: true,
        selfStake: 1500000000000,
        totalStake: 10000000000000,
        jailedEpoch: 4294967295,
        jailed: false,
        waiting: false,
        numJailed: 5,
        totalSlash: 0,
        canDelegate: true,
        maxDelegation: 10000000000000,
        commission: 0,
        totalRewards: 429612946644,
        name: 'Skywalker',
        logo: '',
        uris: null,
        list: 'elected',
        index: 3,
        accumulatedFees: 3415993326,
        validatorSuccessRate: {
          numSuccess: 882,
          numFailure: 0,
        },
        leaderSuccessRate: {
          numSuccess: 27,
          numFailure: 0,
        },
        validatorIgnoredSignaturesRate: 0,
        rating: 10000000,
        tempRating: 10000000,
        numSelectedInSuccessBlocks: 909,
        consecutiveProposerMisses: 0,
        totalValidatorSuccessRate: {
          numSuccess: 415597,
          numFailure: 0,
        },
        totalLeaderSuccessRate: {
          numSuccess: 20544,
          numFailure: 1096,
        },
        totalValidatorIgnoredSignaturesRate: 161,
      },
    ],
  },
  pagination: {
    self: 1,
    next: 2,
    previous: 1,
    perPage: 10,
    totalPages: 11,
    totalRecords: 102,
  },
  error: '',
  code: 'successful',
};

const holdersList = {
  data: {
    accounts: [
      {
        address:
          'klv1rquwyta7kh4jueua76xpqkfgcwsws9yadtuxtp5g2cyt5ps04cpq5ywg5x',
        assetId: 'KLV',
        assetName: 'KLEVER',
        assetType: 0,
        balance: 500000000000000,
        precision: 6,
        frozenBalance: 0,
        unfrozenBalance: 0,
        lastClaim: {
          timestamp: 0,
          epoch: 0,
        },
      },
      {
        address:
          'klv1edd0ymfmv9r2mxk7mdtsk4zfeql5cp9vyn7t4y4adq58vp2r9alslfglw8',
        assetId: 'KLV',
        assetName: 'KLEVER',
        assetType: 0,
        balance: 500000000000000,
        precision: 6,
        frozenBalance: 0,
        unfrozenBalance: 0,
        lastClaim: {
          timestamp: 0,
          epoch: 0,
        },
      },
      {
        address:
          'klv14ragd2rgqat485vu6ssh4vu9rhmc68mg6vrmkmuhdqda9eeykucqvewgsh',
        assetId: 'KLV',
        assetName: 'KLEVER',
        assetType: 0,
        balance: 500000000000000,
        precision: 6,
        frozenBalance: 0,
        unfrozenBalance: 0,
        lastClaim: {
          timestamp: 0,
          epoch: 0,
        },
      },
      {
        address:
          'klv14ragd2rgqat485vu6ssh4vu9rhmc68mg6vrmkmuhdqda9eeykucqvewgsz',
        assetId: 'KFI',
        assetName: 'KLEVER FINANCE',
        assetType: 0,
        balance: 2000000000000,
        precision: 6,
        frozenBalance: 0,
        unfrozenBalance: 0,
        lastClaim: {
          timestamp: 0,
          epoch: 0,
        },
        buckets: [],
      },
    ],
  },
  pagination: {
    self: 1,
    next: 2,
    previous: 1,
    perPage: 10,
    totalPages: 1588,
    totalRecords: 15871,
  },
  error: '',
  code: 'successful',
};

const precisionAsset = {
  data: {
    asset: {
      assetType: 'NonFungible',
      assetId: 'PVM-GVCI',
      name: 'PravaMint',
      ticker: 'PVM',
      ownerAddress:
        'klv1un8gk5mmyhllmsjw8f0d9hyu6wzc590cyvvfuvgndth8w0jthvssquhjlw',
      logo: 'https://i.ibb.co/0qL3Qyj/Pvm.jpg',
      uris: [
        {
          key: 'details',
          value:
            'https://ipfs.io/ipfs/QmYfL7ZVgByh7mSkZxFnS17CUv7NeoAkB1r9it2AoK5Xhz?filename=PravaMint',
        },
      ],
      precision: 10,
      initialSupply: 0,
      circulatingSupply: 76,
      maxSupply: 0,
      mintedValue: 76,
      burnedValue: 0,
      issueDate: 1661062876,
      royalties: {
        address:
          'klv1un8gk5mmyhllmsjw8f0d9hyu6wzc590cyvvfuvgndth8w0jthvssquhjlw',
        transferFixed: 1000000,
        marketPercentage: 500,
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
      hidden: false,
      verified: false,
      metadata:
        '{"name":"Pastel Lake","image":"https://i.ibb.co/3R8gnb2/20220820-204734.jpg","description":"PravaMint, a collection of NFTs Made by the community!"} ',
      mime: 'application/json',
    },
  },
  error: '',
  code: 'successful',
};

const transactionsList: ITransactionResponse = {
  data: {
    transactions: [
      {
        hash: '5dfbadbd749e88178cacd998232d891793770a0a9d217301e3dea4b4be1562ed',
        blockNum: 2420055,
        sender:
          'klv1862fx9d57n55k8rxprh6h7lycrppwddp5rnh3nqgguhzdl8sgl9qxl0c6h',
        nonce: 11,
        timestamp: 1666389544000,
        kAppFee: 1000000,
        bandwidthFee: 1000000,
        status: 'success',
        resultCode: 'Ok',
        chainID: '108',
        signature:
          'bf12fad6604e773b48026fa78c1046816c8fdc5f7937b0a15fc0e6d997bb163e0d2dab73c3f1ca172dd712cdc6774e3c6fb426a8c3a76df906da935b59ecd40d',

        searchOrder: 0,
        receipts: [
          {
            assetId: 'KLV',
          },
        ],
        contract: [
          {
            sender: '',
            type: 9,
            typeString: Contract.Claim,
            parameter: {},
            precision: 6,
          },
          {
            sender: '',
            type: 9,
            typeString: Contract.Claim,
            parameter: {},
            precision: 6,
          },
        ],
      },
      {
        hash: 'f89b74bd7ae09d37242b453ace11ee3662c53881b8aebfc4adb0435b5752eab7',
        blockNum: 2420052,
        sender:
          'klv1862fx9d57n55k8rxprh6h7lycrppwddp5rnh3nqgguhzdl8sgl9qxl0c6h',
        nonce: 10,
        timestamp: 1666389532000,
        kAppFee: 1000000,
        bandwidthFee: 1000000,
        status: 'success',
        resultCode: 'Ok',
        chainID: '108',
        signature:
          'b07d91ae6075f6a6cce6ee13a093f993134c730858d024809456e1b90a75105056b0290a767421d6675530c941bb486666cf187a90024ea891a3fcfa8696410e',

        searchOrder: 0,
        receipts: [
          {
            assetId: 'KLV',
          },
        ],
        contract: [
          {
            sender: '',
            type: 9,
            typeString: Contract.Claim,
            parameter: {},
            precision: 6,
          },
        ],
      },
      {
        hash: 'a8a0bdd8e4bcc863eb749fca8523c417499c13a3177f9c3bafaa9a962b1efbb5',
        blockNum: 2420047,
        sender:
          'klv1a6nw0mlpp97eamjjt52ey9ch0yrdyahmcerdrkdzmu8me59jr5cs0sk7jl',
        nonce: 7,
        timestamp: 1666389512000,
        kAppFee: 1000000,
        bandwidthFee: 1000000,
        status: 'success',
        resultCode: 'Ok',
        chainID: '108',
        signature:
          'f8c9387e001ac029de8f2417837dc6dbf881dc4c1da796412e828c2f786a22cfe51f4e2b59a28b622422e53b842904dd615661381a576b115f044356f91f6309',

        searchOrder: 1,
        receipts: [
          {
            assetId: 'PVM-GVCI',
          },
        ],
        contract: [
          {
            sender: '',
            type: 4,
            typeString: Contract.Freeze,
            parameter: {
              amount: 58376726,
              assetId: 'PVM-GVCI',
            },
            precision: 0,
          },
        ],
      },
    ],
  },
  pagination: {
    self: 1,
    next: 2,
    previous: 1,
    perPage: 10,
    totalPages: 1000,
    totalRecords: 17648287,
  },
  error: '',
  code: 'successful',
};

const addressList = {
  data: {
    accounts: [
      {
        address:
          'klv16sd7crk4jlc8csrv7lwskqrpjgjklvcsmlhexuesa9p6a3dm57rs5vh0hq',
        nonce: 1,
        rootHash:
          '4a4a61b8a0c73508f515f31752e481be78cd501b7b42d319f97d09e86ee6b9f4',
        balance: 500000001000000,
        frozenBalance: 0,
        allowance: 0,
        permissions: [
          {
            id: 0,
            type: 0,
            permissionName: 'owner',
            Threshold: 3,
            operations: '',
            signers: [
              {
                address:
                  'klv1qrmnur2m94r8mh9p3yyxnyw68vquk8j3pp3efcxt8f6jy4w4c8yqegjelw',
                weight: 2,
              },
              {
                address:
                  'klv1jcyyv4652vkmysxf33uhenmuyu8pvvsv4efw32vvx8mxt88yqv9sptfya3',
                weight: 1,
              },
              {
                address:
                  'klv1hze2n777uhmqral8veevt6sqphyav24u0la2fj85uk3m48edr2xs4kcumc',
                weight: 1,
              },
              {
                address:
                  'klv1mnh6dqgr6ec94ag4ak0dfa2rg4yw2ynwsre6zdr87uf6knuu8kmsv59g3t',
                weight: 1,
              },
              {
                address:
                  'klv1urkpgcnttana98l6nr7a23ef8d3w0td6zw4j66gejhj0sll6lsasgtjgl2',
                weight: 1,
              },
              {
                address:
                  'klv1ahwmklhxc9lv2p09v9xxqqx0mcfdn7p533j97hxkg7qc6nck6a3qpzvgvk',
                weight: 1,
              },
            ],
          },
        ],
        timestamp: 1656680400000,
        assets: {},
      },
      {
        address:
          'klv1rquwyta7kh4jueua76xpqkfgcwsws9yadtuxtp5g2cyt5ps04cpq5ywg5x',
        nonce: 1,
        balance: 500000000000000,
        frozenBalance: 0,
        allowance: 0,
        permissions: [
          {
            id: 0,
            type: 0,
            permissionName: 'owner',
            Threshold: 3,
            operations: '',
            signers: [
              {
                address:
                  'klv1qrmnur2m94r8mh9p3yyxnyw68vquk8j3pp3efcxt8f6jy4w4c8yqegjelw',
                weight: 2,
              },
              {
                address:
                  'klv1jcyyv4652vkmysxf33uhenmuyu8pvvsv4efw32vvx8mxt88yqv9sptfya3',
                weight: 1,
              },
              {
                address:
                  'klv1hze2n777uhmqral8veevt6sqphyav24u0la2fj85uk3m48edr2xs4kcumc',
                weight: 1,
              },
              {
                address:
                  'klv1mnh6dqgr6ec94ag4ak0dfa2rg4yw2ynwsre6zdr87uf6knuu8kmsv59g3t',
                weight: 1,
              },
              {
                address:
                  'klv1urkpgcnttana98l6nr7a23ef8d3w0td6zw4j66gejhj0sll6lsasgtjgl2',
                weight: 1,
              },
              {
                address:
                  'klv1ahwmklhxc9lv2p09v9xxqqx0mcfdn7p533j97hxkg7qc6nck6a3qpzvgvk',
                weight: 1,
              },
            ],
          },
        ],
        timestamp: 1656680400000,
        assets: {},
      },
      {
        address:
          'klv1edd0ymfmv9r2mxk7mdtsk4zfeql5cp9vyn7t4y4adq58vp2r9alslfglw8',
        nonce: 1,
        balance: 500000000000000,
        frozenBalance: 0,
        allowance: 0,
        permissions: [
          {
            id: 0,
            type: 0,
            permissionName: 'owner',
            Threshold: 3,
            operations: '',
            signers: [
              {
                address:
                  'klv1qrmnur2m94r8mh9p3yyxnyw68vquk8j3pp3efcxt8f6jy4w4c8yqegjelw',
                weight: 2,
              },
              {
                address:
                  'klv1jcyyv4652vkmysxf33uhenmuyu8pvvsv4efw32vvx8mxt88yqv9sptfya3',
                weight: 1,
              },
              {
                address:
                  'klv1hze2n777uhmqral8veevt6sqphyav24u0la2fj85uk3m48edr2xs4kcumc',
                weight: 1,
              },
              {
                address:
                  'klv1mnh6dqgr6ec94ag4ak0dfa2rg4yw2ynwsre6zdr87uf6knuu8kmsv59g3t',
                weight: 1,
              },
              {
                address:
                  'klv1urkpgcnttana98l6nr7a23ef8d3w0td6zw4j66gejhj0sll6lsasgtjgl2',
                weight: 1,
              },
              {
                address:
                  'klv1ahwmklhxc9lv2p09v9xxqqx0mcfdn7p533j97hxkg7qc6nck6a3qpzvgvk',
                weight: 1,
              },
            ],
          },
        ],
        timestamp: 1656680400000,
        assets: {},
      },
    ],
  },
  pagination: {
    self: 1,
    next: 2,
    previous: 1,
    perPage: 10,
    totalPages: 2024,
    totalRecords: 20231,
  },
  error: '',
  code: 'successful',
};
const assets: IAsset[] = [KFI, DVK, SNTEST, specialAsset];

const mocks = {
  assets,
  validator,
  holdersList,
  precisionAsset,
  transactionsList,
  addressList,
};

export default mocks;
