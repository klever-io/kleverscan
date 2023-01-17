// CREATE ASSET:
export const createAsset1 = {
  hash: '86a5348a2df3a3d2447620b822c5b6b00793dc6b34517cb3e7a4610b4aed7eb3',
  blockNum: 3582035,
  sender: 'klv14jrn22pha6k8lked8ek4ym64hekcdeldm464jr0zdtmu5r0mvrfqx5duwm',
  nonce: 60,
  data: [''],
  timestamp: 1671045260000,
  kAppFee: 20000000000,
  bandwidthFee: 1000000,
  status: 'success',
  resultCode: 'Ok',
  version: 1,
  chainID: '108',
  signature: [
    '65febf2337e61279a6e5766adf78cf3c9186a58c35cbec97988090daf89446641fe39b5ce000160528b483ba29faa93bc735a6439ff367be2009f58d41e3d705',
  ],
  searchOrder: 0,
  receipts: [
    {
      signer: 'klv14jrn22pha6k8lked8ek4ym64hekcdeldm464jr0zdtmu5r0mvrfqx5duwm',
      type: 19,
      weight: '1',
    },
    {
      assetId: 'BIZZZX-186R',
      from: 'klv1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpgm89z',
      to: 'klv14jrn22pha6k8lked8ek4ym64hekcdeldm464jr0zdtmu5r0mvrfqx5duwm',
      type: 0,
      value: 100000000000000000,
    },
    {
      assetId: 'BIZZZX-186R',
      type: 1,
    },
  ],
  contract: [
    {
      type: 1,
      typeString: 'CreateAssetContractType',
      parameter: {
        attributes: null,
        burnedValue: 0,
        circulatingSupply: 0,
        initialSupply: 100000000000000000,
        issueDate: 1671045260,
        logo: 'http://knotary.com/wp-content/uploads/2022/12/bizxlogo.jpg',
        maxSupply: 100000000000000000,
        mintedValue: 100000000000000000,
        name: 'BizX Test',
        ownerAddress:
          'klv14jrn22pha6k8lked8ek4ym64hekcdeldm464jr0zdtmu5r0mvrfqx5duwm',
        precision: 8,
        properties: {
          canAddRoles: false,
          canBurn: false,
          canChangeOwner: true,
          canFreeze: false,
          canMint: false,
          canPause: true,
          canWipe: false,
        },
        roles: null,
        royalties: {
          address:
            'klv14jrn22pha6k8lked8ek4ym64hekcdeldm464jr0zdtmu5r0mvrfqx5duwm',
        },
        staking: {
          apr: 0,
          minEpochsToClaim: 0,
          minEpochsToUnstake: 0,
          minEpochsToWithdraw: 0,
          type: 'APRI',
        },
        ticker: 'BIZZZX',
        type: 'Fungible',
        uris: null,
      },
    },
  ],
};

//CONFIG VALIDATOR:
export const configValidator1 = {
  hash: 'afce386f0d00284aa0448cc974a6eda31be55a849f320db3bbc3c9dfb0631657',
  blockNum: 3556001,
  sender: 'klv1pn2xw7zktt2839wn9zkhajrz8gdlwgdn0vvekg3yycrgny4avrtqqn9c32',
  nonce: 168,
  timestamp: 1670941028000,
  kAppFee: 1000000000,
  bandwidthFee: 1000000,
  status: 'success',
  resultCode: 'Ok',
  version: 1,
  chainID: '108',
  signature: [
    'c027c758d82e86ebfcaf723e0b75e9227d67d9937b19526189f71fc8a0d7cbb8d0ffa04947df92fb70ed71fed43fbb07da752a3486317148b02fe25191dd5e00',
  ],
  searchOrder: 1,
  receipts: [
    {
      signer: 'klv1pn2xw7zktt2839wn9zkhajrz8gdlwgdn0vvekg3yycrgny4avrtqqn9c32',
      type: 19,
      weight: '1',
    },
    {
      id: 'klv1pn2xw7zktt2839wn9zkhajrz8gdlwgdn0vvekg3yycrgny4avrtqqn9c32',
      type: 12,
    },
  ],
  contract: [
    {
      type: 3,
      typeString: 'ValidatorConfigContractType',
      parameter: {
        config: {
          blsPublicKey:
            '2fd3f2f2bbbd198ec092ab48e780331fde7f9318701838a6c6aa3c24f9cf22b7bbda86e313397781069d651b04476806dea1229dfdca707a16fa4d6edc6cb06b9157d6587ef13f38d03ed80c83662612acd35cc9068a23845ae4f3b61af2128e',
          canDelegate: true,
          commission: 1000,
          logo: 'https://cdn-images-1.medium.com/max/720/1*2Wu5yLlLrfsfz6wMYFlYtQ.png',
          maxDelegationAmount: 12500000000000,
          name: 'TOKENPORT-I',
          rewardAddress:
            'klv1up5zhs4shc9z7rpjq75yswxhvsn0t3j87y4esqcyjg4e4pfdpu0sefjftm',
          uris: [
            {
              key: 'Twitter',
              value: 'twitter.com/tokenportapp',
            },
          ],
        },
      },
    },
  ],
};

// FREEZE:
export const freeze1 = {
  hash: 'fc96be47d97e20097efa5e1db961f36b98c7556cc95dc5c53e6b024a5fd8496a',
  blockNum: 3919351,
  sender: 'klv1zaex4y5ts0hgh3yfeljh2dz738kqytmnfac2v0g6pp5dmdfp9rtqg7httv',
  nonce: 109,
  timestamp: 1672404244000,
  kAppFee: 1000000,
  bandwidthFee: 1000000,
  status: 'success',
  resultCode: 'Ok',
  version: 1,
  chainID: '108',
  signature: [
    '81db13d3722f41617fb652090d201ef75e894cb72f115518b35a368a5f75ae01d57cd717edff30ae8438f418a3ee69b7d5c6ec26a040e2061d4f3eb17ec4050f',
  ],
  searchOrder: 0,
  receipts: [
    {
      signer: 'klv1zaex4y5ts0hgh3yfeljh2dz738kqytmnfac2v0g6pp5dmdfp9rtqg7httv',
      type: 19,
      weight: '1',
    },
    {
      assetId: 'KLV',
      bucketId:
        '88c6663e7cfa68412b89afea32b1695446874aaf7c7419ce9b770b96cedd23cd',
      from: 'klv1zaex4y5ts0hgh3yfeljh2dz738kqytmnfac2v0g6pp5dmdfp9rtqg7httv',
      type: 3,
      value: '12820000000',
    },
  ],
  contract: [
    {
      type: 4,
      typeString: 'FreezeContractType',
      parameter: {
        amount: 12820000000,
        assetId: 'KLV',
      },
    },
  ],
};

// UNFREEZE:
export const unfreeze1 = {
  hash: '0142c2e994bdbc7957c1db37c68b0a74c8ea84709bb7cf865bb1a335d131290a',
  blockNum: 3919281,
  sender: 'klv1nx9j3nq55ylywkfkwjxtya5k0gxwn49k7mc8kxar3anjp3j7hxlqyedvz6',
  nonce: 33,
  timestamp: 1672403964000,
  kAppFee: 1000000,
  bandwidthFee: 1000000,
  status: 'success',
  resultCode: 'Ok',
  version: 1,
  chainID: '108',
  signature: [
    'fc01c7ed4477d512b40c235a63a222d8424e74206ae6c52982935eb854d3f0d0437709d8190c5f00f4a7340cdfa5483b8ec16834676f139924cd0c95abf4d705',
  ],
  searchOrder: 0,
  receipts: [
    {
      signer: 'klv1nx9j3nq55ylywkfkwjxtya5k0gxwn49k7mc8kxar3anjp3j7hxlqyedvz6',
      type: 19,
      weight: '1',
    },
    {
      assetId: 'KLV',
      availableEpoch: '729',
      bucketId:
        '8bf070552ae73864455cfc08b247f0f12d53743a3bf536e91785cba9e04fcc63',
      from: 'klv1nx9j3nq55ylywkfkwjxtya5k0gxwn49k7mc8kxar3anjp3j7hxlqyedvz6',
      type: 4,
      value: '5271203485',
    },
    {
      assetId: 'KLV',
      from: 'klv1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpgm89z',
      to: 'klv1nx9j3nq55ylywkfkwjxtya5k0gxwn49k7mc8kxar3anjp3j7hxlqyedvz6',
      type: 0,
      value: 33044706,
    },
    {
      amount: 33044706,
      assetId: 'KLV',
      assetIdReceived: 'KLV',
      marketplaceId: '',
      orderId: '',
      type: 17,
    },
  ],
  contract: [
    {
      type: 5,
      typeString: 'UnfreezeContractType',
      parameter: {
        assetId: 'KLV',
        bucketID:
          '8bf070552ae73864455cfc08b247f0f12d53743a3bf536e91785cba9e04fcc63',
      },
    },
  ],
};

// CLAIM:
export const claim1 = {
  hash: '13a41c340cf202a2018578cf22d5e3a0c7141828b272d678e3de602be0a3f28b',
  blockNum: 3919257,
  sender: 'klv1nvg0w0uzwdcmt5dtt35m0e6amtejy08t7hvkq9szpa80syuklc4qtsn4z5',
  nonce: 2651,
  timestamp: 1672403868000,
  kAppFee: 1000000,
  bandwidthFee: 1000000,
  status: 'success',
  resultCode: 'Ok',
  version: 1,
  chainID: '108',
  signature: [
    '2681ab37c6eb80958d88bb0d0d2495e51f79bd7740b2c648a72ab9c67b1089162b92b6a799255a99914c5268325cad1d1edecd895bc158b5b508bd2a0abf9e09',
  ],
  searchOrder: 0,
  receipts: [
    {
      signer: 'klv1nvg0w0uzwdcmt5dtt35m0e6amtejy08t7hvkq9szpa80syuklc4qtsn4z5',
      type: 19,
      weight: '1',
    },
    {
      assetId: 'KLV',
      from: 'klv1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpgm89z',
      to: 'klv1nvg0w0uzwdcmt5dtt35m0e6amtejy08t7hvkq9szpa80syuklc4qtsn4z5',
      type: 0,
      value: 47573703,
    },
    {
      amount: 47573703,
      assetId: 'KLV',
      assetIdReceived: 'KLV',
      marketplaceId: '',
      orderId: '',
      type: 17,
    },
  ],
  contract: [
    {
      type: 9,
      typeString: 'ClaimContractType',
      parameter: {
        claimType: 'StakingClaim',
      },
    },
  ],
};

// BUY CONTRACT:
//MARKETBUY TYPE SINGLE CONTRACT:
export const marketbuy1 = {
  hash: '000da763e1b8e647c7596bf9eef960d245916e1f46932ec52cafa780a02d2b14',
  blockNum: 3899670,
  sender: 'klv18rctdpht2lyp0kunyys09me43wnkerxaw9mng4nadpa8rqygjhcs79nx3t',
  nonce: 288,
  timestamp: 1672324476000,
  kAppFee: 1000000,
  bandwidthFee: 1000000,
  status: 'success',
  resultCode: 'Ok',
  version: 1,
  chainID: '108',
  signature: [
    'c1119d52d9e46899c8ac655a0cf0b9726550caf1748cfa755a705a6a843530403dab35f2ce513a21f35f8897b7df13061cb0f2e33e5e5a600388bdfe04de9a0f',
  ],
  searchOrder: 1,
  receipts: [
    {
      signer: 'klv18rctdpht2lyp0kunyys09me43wnkerxaw9mng4nadpa8rqygjhcs79nx3t',
      type: 19,
      weight: '1',
    },
    {
      assetId: 'KLV',
      from: 'klv18rctdpht2lyp0kunyys09me43wnkerxaw9mng4nadpa8rqygjhcs79nx3t',
      marketplaceId: 'd4f2bab340c55fde',
      orderId: 'c357bd00d13d9270',
      to: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
      type: 14,
      value: 320000000,
    },
    {
      marketplaceId: 'd4f2bab340c55fde',
      orderId: 'c357bd00d13d9270',
      type: 16,
    },
    {
      assetId: 'KLV',
      from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
      marketplaceId: 'd4f2bab340c55fde',
      orderId: 'c357bd00d13d9270',
      to: 'klv13gk22xsy2hjjj8vecjr86tgcd4qrn6zj7207t7j9czvza4dc3tkqpjzmkc',
      type: 14,
      value: 6400000,
    },
    {
      assetId: 'KLV',
      from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
      marketplaceId: 'd4f2bab340c55fde',
      orderId: 'c357bd00d13d9270',
      to: 'klv1f9yggfzfx0a2afzcjew8jg7rw4hhykusxt6n028kmh8fe2ezelks8t6jc6',
      type: 14,
      value: 64000000,
    },
    {
      assetId: 'KLV',
      from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
      marketplaceId: 'd4f2bab340c55fde',
      orderId: 'c357bd00d13d9270',
      to: 'klv1f9yggfzfx0a2afzcjew8jg7rw4hhykusxt6n028kmh8fe2ezelks8t6jc6',
      type: 14,
      value: 0,
    },
    {
      assetId: 'KLV',
      from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
      marketplaceId: 'd4f2bab340c55fde',
      orderId: 'c357bd00d13d9270',
      to: 'klv18dugepkv8q74z734e3q2e2dzzjgha8fwr6uhyjhm6vyzz8pm4drs6etc48',
      type: 14,
      value: 249600000,
    },
    {
      assetId: 'KPNFT-13Z0/1339',
      from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
      marketplaceId: 'd4f2bab340c55fde',
      orderId: 'c357bd00d13d9270',
      to: 'klv18rctdpht2lyp0kunyys09me43wnkerxaw9mng4nadpa8rqygjhcs79nx3t',
      type: 14,
      value: 1,
    },
  ],
  contract: [
    {
      type: 17,
      typeString: 'BuyContractType',
      parameter: {
        amount: 320000000,
        buyType: 'MarketBuy',
        currencyID: 'KLV',
        id: 'c357bd00d13d9270',
      },
    },
  ],
};

// MARKETBUY TYPE WITH MULTICONTRACT:
export const multicontractMarketbuy1 = {
  data: {
    transaction: {
      hash: '3982dfa4de0597a4d392316e1e0b952041046664b8cb1ec94315b0292deda31a',
      blockNum: 2650018,
      sender: 'klv1cr3ndzncn23mzqg03r497zuxyx48mu7v8rh8pn8fsj97pxhdaxts8ptkq2',
      nonce: 1346,
      timestamp: 1667309556000,
      kAppFee: 1000000,
      bandwidthFee: 1000000,
      status: 'success',
      resultCode: 'Ok',
      version: 1,
      chainID: '108',
      signature: [
        'b39c0951488a9857756d8cb324944da750276b6243cf2a4eec82d83fbddcd53dfc004ee7280fccd9fff4a54739fcba207a2e8395f4ca007a4a1daaa14c5e600e',
      ],
      searchOrder: 8,
      receipts: [
        {
          signer:
            'klv1cr3ndzncn23mzqg03r497zuxyx48mu7v8rh8pn8fsj97pxhdaxts8ptkq2',
          type: 19,
          weight: '1',
        },
        {
          assetId: 'KLV',
          from: 'klv1cr3ndzncn23mzqg03r497zuxyx48mu7v8rh8pn8fsj97pxhdaxts8ptkq2',
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          to: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          type: 14,
          value: 2500000000,
        },
        {
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          type: 16,
        },
        {
          assetId: 'KLV',
          from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          to: 'klv13gk22xsy2hjjj8vecjr86tgcd4qrn6zj7207t7j9czvza4dc3tkqpjzmkc',
          type: 14,
          value: 50000000,
        },
        {
          assetId: 'KLV',
          from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          to: 'klv19rzdkruwq3c0hd629cxslzr5ag8yenhkaglycu2jgay9086mqt4qw0u2mh',
          type: 14,
          value: 250000000,
        },
        {
          assetId: 'KLV',
          from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          to: 'klv19rzdkruwq3c0hd629cxslzr5ag8yenhkaglycu2jgay9086mqt4qw0u2mh',
          type: 14,
          value: 0,
        },
        {
          assetId: 'KLV',
          from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          to: 'klv1hyj8skg8ukuac79e5fsn6dt8yt85pvr5jlkrawwlw3w96vcl4uaqaxgqjw',
          type: 14,
          value: 2200000000,
        },
        {
          assetId: 'BCWNFT-13YH/1315',
          from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          to: 'klv1cr3ndzncn23mzqg03r497zuxyx48mu7v8rh8pn8fsj97pxhdaxts8ptkq2',
          type: 14,
          value: 1,
        },
        // receipts for contract 2:
        {
          signer:
            'klv1cr3ndzncn23mzqg03r497zuxyx48mu7v8rh8pn8fsj97pxhdaxts8ptkq2',
          type: 19,
          weight: '1',
        },
        {
          assetId: 'KUSD',
          from: 'klv1cr3ndzncn23mzqg03r497zuxyx48mu7v8rh8pn8fsj97pxhdaxts8ptkq2',
          marketplaceId: 'd4f2bab340c50002',
          orderId: 'd639b325d3793e1e',
          to: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          type: 14,
          value: 300000000,
        },
        {
          marketplaceId: 'd4f2bab340c50002',
          orderId: 'd639b325d3793e1e',
          type: 16,
        },
        {
          assetId: 'KUSD',
          from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          marketplaceId: 'd4f2bab340c50002',
          orderId: 'd639b325d3793e1e',
          to: 'klv13gk22xsy2hjjj8vecjr86tgcd4qrn6zj7207t7j9czvza4dc3tkqpjzmkc',
          type: 14,
          value: 1500000, // probably wrong fee here
        },
        {
          assetId: 'KUSD',
          from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          marketplaceId: 'd4f2bab340c50002',
          orderId: 'd639b325d3793e1e',
          to: 'klv19rzdkruwq3c0hd629cxslzr5ag8yenhkaglycu2jgay9086mqt4qw0u2mh',
          type: 14,
          value: 30000000, // probably wrong fee here
        },
        {
          assetId: 'KUSD',
          from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          marketplaceId: 'd4f2bab340c55f2',
          orderId: 'd639b325d3793e1e',
          to: 'klv19rzdkruwq3c0hd629cxslzr5ag8yenhkaglycu2jgay9086mqt4qw0u2mh',
          type: 14,
          value: 0,
        },
        {
          assetId: 'KUSD',
          from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          marketplaceId: 'd4f2bab340c50002',
          orderId: 'd639b325d3793e1e',
          to: 'klv1hyj8skg8ukuac79e5fsn6dt8yt85pvr5jlkrawwlw3w96vcl4uaqaxgqjw',
          type: 14,
          value: 268500000,
        },
        {
          assetId: 'ABCNFT-11AA/1',
          from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          marketplaceId: 'd4f2bab340c50002',
          orderId: 'd639b325d3793e1e',
          to: 'klv1cr3ndzncn23mzqg03r497zuxyx48mu7v8rh8pn8fsj97pxhdaxts8ptkq2',
          type: 14,
          value: 1,
        },
        // receipts for contract 3:
        {
          signer:
            'klv1cr3ndzncn23mzqg03r497zuxyx48mu7v8rh8pn8fsj97pxhdaxts8ptkq2',
          type: 19,
          weight: '1',
        },
        {
          assetId: 'KLV',
          from: 'klv1cr3ndzncn23mzqg03r497zuxyx48mu7v8rh8pn8fsj97pxhdaxts8ptkq2',
          marketplaceId: 'd4f2bab340c0003',
          orderId: 'd639b325d3793e1e',
          to: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          type: 14,
          value: 3500000000,
        },
        {
          marketplaceId: 'd4f2bab340c0003',
          orderId: 'd639b325d3793e1e',
          type: 16,
        },
        {
          assetId: 'KLV',
          from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          marketplaceId: 'd4f2bab340c0003',
          orderId: 'd639b325d3793e1e',
          to: 'klv13gk22xsy2hjjj8vecjr86tgcd4qrn6zj7207t7j9czvza4dc3tkqpjzmkc',
          type: 14,
          value: 50000000,
        },
        {
          assetId: 'KLV',
          from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          marketplaceId: 'd4f2bab340c0003',
          orderId: 'd639b325d3793e1e',
          to: 'klv19rzdkruwq3c0hd629cxslzr5ag8yenhkaglycu2jgay9086mqt4qw0u2mh',
          type: 14,
          value: 250000000,
        },
        {
          assetId: 'KLV',
          from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          marketplaceId: 'd4f2bab340c0003',
          orderId: 'd639b325d3793e1e',
          to: 'klv19rzdkruwq3c0hd629cxslzr5ag8yenhkaglycu2jgay9086mqt4qw0u2mh',
          type: 14,
          value: 0,
        },
        {
          assetId: 'KLV',
          from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          marketplaceId: 'd4f2bab340c0003',
          orderId: 'd639b325d3793e1e',
          to: 'klv1hyj8skg8ukuac79e5fsn6dt8yt85pvr5jlkrawwlw3w96vcl4uaqaxgqjw',
          type: 14,
          value: 2200000000,
        },
        {
          assetId: 'BCWNFT-13YH/1316',
          from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          marketplaceId: 'd4f2bab340c0003',
          orderId: 'd639b325d3793e1e',
          to: 'klv1cr3ndzncn23mzqg03r497zuxyx48mu7v8rh8pn8fsj97pxhdaxts8ptkq2',
          type: 14,
          value: 1,
        },
      ],
      contract: [
        {
          type: 17,
          typeString: 'BuyContractType',
          parameter: {
            amount: 2500000000,
            buyType: 'MarketBuy',
            currencyID: 'KLV',
            id: 'd639b325d3793klv',
          },
        },
        {
          type: 17,
          typeString: 'BuyContractType',
          parameter: {
            amount: 10000000000,
            buyType: 'MarketBuy',
            currencyID: 'KUSD',
            id: 'd639b325d379kusd',
          },
        },
        {
          type: 17,
          typeString: 'BuyContractType',
          parameter: {
            amount: 5000000000,
            buyType: 'MarketBuy',
            currencyID: 'KLV',
            id: 'd639b325d3793klv',
          },
        },
      ],
      // tests results for this multicontract marketbuy should be:
      // prices(which is the amount field in the contracts) must be displayed separately:
      //  2,500,   10,000,   5,000
      // amount should not be displayed
    },
  },
};

// BUY CONTRACT:
// ITOBUY TYPE WITH MULTICONTRACT:
export const multicontractITObuy1 = {
  data: {
    transaction: {
      hash: '62ca725591007b6b9064231a9001d9e7acae11d81c1f0a3bc0d09796107196b2',
      blockNum: 2657491,
      sender: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
      nonce: 77,
      timestamp: 1667339448000,
      kAppFee: 1000000,
      bandwidthFee: 1000000,
      status: 'success',
      resultCode: 'Ok',
      version: 1,
      chainID: '108',
      signature: [
        '720a291f6df744c09822bd0a0526629c5cc792be39812289df28147db219df7b23dcd0aeb4bd461fbec64af9cd4412dd378afb08d791f9593dc98e8e1116660a',
      ],
      searchOrder: 1,
      receipts: [
        {
          signer:
            'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          type: 19,
          weight: '1',
        },
        {
          assetId: 'KLV',
          from: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          to: 'klv12e8nhj89yt68crdx2dpx8vlwdjy3z6ft69d3sqzedjzn68enuqxs8a5nxl',
          type: 0,
          value: 9000000000,
        },
        {
          assetId: 'FWZG-2Y4P',
          type: 2,
        },
        {
          assetId: 'FWZG-2Y4P/299',
          from: 'klv1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpgm89z',
          to: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          type: 0,
          value: 1,
        },
        {
          assetId: 'FWZG-2Y4P/300',
          from: 'klv1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpgm89z',
          to: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          type: 0,
          value: 1,
        },
        // receipts from contract 2:
        {
          signer:
            'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          type: 19,
          weight: '1',
        },
        {
          assetId: 'KUSD',
          from: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          to: 'klv12e8nhj89yt68crdx2dpx8vlwdjy3z6ft69d3sqzedjzn68enuqxs8a5nxl',
          type: 0,
          value: 2000000000,
        },
        {
          assetId: 'ABCD-ID11',
          type: 2,
        },
        {
          assetId: 'ABCD-ID11/1',
          from: 'klv1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpgm89z',
          to: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          type: 0,
          value: 1,
        },
        {
          assetId: 'ABCD-ID11/2',
          from: 'klv1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpgm89z',
          to: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          type: 0,
          value: 1,
        },
        {
          assetId: 'ABCD-ID11/3',
          from: 'klv1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpgm89z',
          to: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          type: 0,
          value: 1,
        },
        // receipts from contract3:
        {
          signer:
            'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          type: 19,
          weight: '1',
        },
        {
          assetId: 'KLV',
          from: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          to: 'klv12e8nhj89yt68crdx2dpx8vlwdjy3z6ft69d3sqzedjzn68enuqxs8a5nxl',
          type: 0,
          value: 30000000000,
        },
        {
          assetId: 'FWZG-2Y4P',
          type: 2,
        },
        {
          assetId: 'FWZG-2Y4P/301',
          from: 'klv1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpgm89z',
          to: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          type: 0,
          value: 1,
        },
        {
          assetId: 'FWZG-2Y4P/302',
          from: 'klv1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpgm89z',
          to: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          type: 0,
          value: 1,
        },
        {
          assetId: 'FWZG-2Y4P/303',
          from: 'klv1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpgm89z',
          to: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          type: 0,
          value: 1,
        },
        {
          assetId: 'FWZG-2Y4P/304',
          from: 'klv1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpgm89z',
          to: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          type: 0,
          value: 1,
        },
        {
          assetId: 'FWZG-2Y4P/305',
          from: 'klv1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpgm89z',
          to: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          type: 0,
          value: 1,
        },
      ],
      contract: [
        {
          type: 17,
          typeString: 'BuyContractType',
          parameter: {
            amount: 2,
            buyType: 'ITOBuy',
            currencyID: 'KLV',
            id: 'FWZG-2Y4P',
          },
        },
        {
          type: 17,
          typeString: 'BuyContractType',
          parameter: {
            amount: 3,
            buyType: 'ITOBuy',
            currencyID: 'KUSD',
            id: 'ABCD-ID11',
          },
        },
        {
          type: 17,
          typeString: 'BuyContractType',
          parameter: {
            amount: 5,
            buyType: 'ITOBuy',
            currencyID: 'KLV',
            id: 'FWZG-2Y4P',
          },
        },
      ],
      // tests results for this multicontract itobuy should be:
      // display every contract amount separately 2,3,5
      // prices should be display only by total, separated only buy currencyID, hence the result must be:
      // 9000000000 + 30000000000 = 9,000 +30,000 = 39,0000 KLV price and:
      // 2000000000               = 2000          = 2,000 KUSD price
    },
  },
};

// MIXED  BUY MULTICONTRACT:
export const multicontractMarketbuyAndItobuy1 = {
  data: {
    transaction: {
      hash: '62ca725591007b6b9064231a9001d9e7acae11d81c1f0a3bc0d09796107196b2',
      blockNum: 2657491,
      sender: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
      nonce: 77,
      timestamp: 1667339448000,
      kAppFee: 1000000,
      bandwidthFee: 1000000,
      status: 'success',
      resultCode: 'Ok',
      version: 1,
      chainID: '108',
      signature: [
        '720a291f6df744c09822bd0a0526629c5cc792be39812289df28147db219df7b23dcd0aeb4bd461fbec64af9cd4412dd378afb08d791f9593dc98e8e1116660a',
      ],
      searchOrder: 1,
      receipts: [
        {
          signer:
            'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          type: 19,
          weight: '1',
        },
        {
          assetId: 'KLV',
          from: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          to: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          type: 14,
          value: 2500000000,
        },
        {
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          type: 16,
        },
        {
          assetId: 'KLV',
          from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          to: '"klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68www"',
          type: 14,
          value: 50000000,
        },
        {
          assetId: 'KLV',
          from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          to: 'klv19rzdkruwq3c0hd629cxslzr5ag8yenhkaglycu2jgay9086mqt4qw0u2mh',
          type: 14,
          value: 250000000,
        },
        {
          assetId: 'KLV',
          from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          to: 'klv19rzdkruwq3c0hd629cxslzr5ag8yenhkaglycu2jgay9086mqt4qw0u2mh',
          type: 14,
          value: 0,
        },
        {
          assetId: 'KLV',
          from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          to: 'klv1hyj8skg8ukuac79e5fsn6dt8yt85pvr5jlkrawwlw3w96vcl4uaqaxgqjw',
          type: 14,
          value: 2200000000,
        },
        {
          assetId: 'BCWNFT-13YH/1315',
          from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          to: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          type: 14,
          value: 1,
        },
        // receipts for contract 2:
        {
          assetId: 'KUSD-2S58',
          from: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          to: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          type: 14,
          value: 300000000,
        },
        {
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          type: 16,
        },
        {
          assetId: 'KUSD-2S58',
          from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          to: '"klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xwww"',
          type: 14,
          value: 1500000, // probably wrong fee here
        },
        {
          assetId: 'KUSD-2S58',
          from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          to: 'klv19rzdkruwq3c0hd629cxslzr5ag8yenhkaglycu2jgay9086mqt4qw0u2mh',
          type: 14,
          value: 30000000, // probably wrong fee here
        },
        {
          assetId: 'KUSD-2S58',
          from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          to: 'klv19rzdkruwq3c0hd629cxslzr5ag8yenhkaglycu2jgay9086mqt4qw0u2mh',
          type: 14,
          value: 0,
        },
        {
          assetId: 'KUSD-2S58',
          from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          to: 'klv1hyj8skg8ukuac79e5fsn6dt8yt85pvr5jlkrawwlw3w96vcl4uaqaxgqjw',
          type: 14,
          value: 268500000,
        },
        {
          assetId: 'ABCNFT-11AA/1',
          from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          to: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          type: 14,
          value: 1,
        },
        // receipts for contract 3:
        {
          signer:
            'klv1cr3ndzncn23mzqg03r497zuxyx48mu7v8rh8pn8fsj97pxhdaxts8ptkq2',
          type: 19,
          weight: '1',
        },
        {
          assetId: 'KLV',
          from: 'klv1cr3ndzncn23mzqg03r497zuxyx48mu7v8rh8pn8fsj97pxhdaxts8ptkq2',
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          to: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          type: 14,
          value: 3500000000,
        },
        {
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          type: 16,
        },
        {
          assetId: 'KLV',
          from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          to: '"klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c"',
          type: 14,
          value: 50000000,
        },
        {
          assetId: 'KLV',
          from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          to: 'klv19rzdkruwq3c0hd629cxslzr5ag8yenhkaglycu2jgay9086mqt4qw0u2mh',
          type: 14,
          value: 250000000,
        },
        {
          assetId: 'KLV',
          from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          to: 'klv19rzdkruwq3c0hd629cxslzr5ag8yenhkaglycu2jgay9086mqt4qw0u2mh',
          type: 14,
          value: 0,
        },
        {
          assetId: 'KLV',
          from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          to: 'klv1hyj8skg8ukuac79e5fsn6dt8yt85pvr5jlkrawwlw3w96vcl4uaqaxgqjw',
          type: 14,
          value: 2200000000,
        },
        {
          assetId: 'BCWNFT-13YH/1316',
          from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          to: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          type: 14,
          value: 1,
        },

        // ITO contracts start:

        {
          signer:
            'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          type: 19,
          weight: '1',
        },
        {
          assetId: 'KLV',
          from: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          to: 'klv12e8nhj89yt68crdx2dpx8vlwdjy3z6ft69d3sqzedjzn68enuqxs8a5nxl',
          type: 0,
          value: 9000000000,
        },
        {
          assetId: 'FWZG-2Y4P',
          type: 2,
        },
        {
          assetId: 'FWZG-2Y4P/299',
          from: 'klv1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpgm89z',
          to: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          type: 0,
          value: 1,
        },
        {
          assetId: 'FWZG-2Y4P/300',
          from: 'klv1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpgm89z',
          to: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          type: 0,
          value: 1,
        },
        // receipts from contract 2:
        {
          signer:
            'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          type: 19,
          weight: '1',
        },
        {
          assetId: 'KUSD-2S58',
          from: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          to: 'klv12e8nhj89yt68crdx2dpx8vlwdjy3z6ft69d3sqzedjzn68enuqxs8a5nxl',
          type: 0,
          value: 2000000000,
        },
        {
          assetId: 'ABCD-ID11',
          type: 2,
        },
        {
          assetId: 'ABCD-ID11/1',
          from: 'klv1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpgm89z',
          to: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          type: 0,
          value: 1,
        },
        {
          assetId: 'ABCD-ID11/2',
          from: 'klv1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpgm89z',
          to: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          type: 0,
          value: 1,
        },
        {
          assetId: 'ABCD-ID11/3',
          from: 'klv1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpgm89z',
          to: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          type: 0,
          value: 1,
        },
        // receipts from contract3:
        {
          signer:
            'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          type: 19,
          weight: '1',
        },
        {
          assetId: 'KLV',
          from: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          to: 'klv12e8nhj89yt68crdx2dpx8vlwdjy3z6ft69d3sqzedjzn68enuqxs8a5nxl',
          type: 0,
          value: 30000000000,
        },
        {
          assetId: 'FWZG-2Y4P',
          type: 2,
        },
        {
          assetId: 'FWZG-2Y4P/301',
          from: 'klv1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpgm89z',
          to: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          type: 0,
          value: 1,
        },
        {
          assetId: 'FWZG-2Y4P/302',
          from: 'klv1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpgm89z',
          to: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          type: 0,
          value: 1,
        },
        {
          assetId: 'FWZG-2Y4P/303',
          from: 'klv1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpgm89z',
          to: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          type: 0,
          value: 1,
        },
        {
          assetId: 'FWZG-2Y4P/304',
          from: 'klv1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpgm89z',
          to: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          type: 0,
          value: 1,
        },
        {
          assetId: 'FWZG-2Y4P/305',
          from: 'klv1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpgm89z',
          to: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          type: 0,
          value: 1,
        },
      ],
      contract: [
        {
          type: 17,
          typeString: 'BuyContractType',
          parameter: {
            amount: 2500000000,
            buyType: 'MarketBuy',
            currencyID: 'KLV',
            id: 'd639b325d3793klv',
          },
        },
        {
          type: 17,
          typeString: 'BuyContractType',
          parameter: {
            amount: 10000000000,
            buyType: 'MarketBuy',
            currencyID: 'KUSD-2S58',
            id: 'd639b325d379kusd',
          },
        },
        {
          type: 17,
          typeString: 'BuyContractType',
          parameter: {
            amount: 5000000000,
            buyType: 'MarketBuy',
            currencyID: 'KLV',
            id: 'd639b325d3793klv',
          },
        },
        {
          type: 17,
          typeString: 'BuyContractType',
          parameter: {
            amount: 2,
            buyType: 'ITOBuy',
            currencyID: 'KLV',
            id: 'FWZG-2Y4P',
          },
        },
        {
          type: 17,
          typeString: 'BuyContractType',
          parameter: {
            amount: 3,
            buyType: 'ITOBuy',
            currencyID: 'KUSD-2S58',
            id: 'ABCD-ID11',
          },
        },
        {
          type: 17,
          typeString: 'BuyContractType',
          parameter: {
            amount: 5,
            buyType: 'ITOBuy',
            currencyID: 'KLV',
            id: 'FWZG-2Y4P',
          },
        },
      ],
      // tests results for this multicontract itobuy should be:
      // display every contract amount separately 2,3,5
      // prices should be display only by total, separated only buy currencyID, hence the result must be:
      // 9000000000 + 30000000000 = 9,000 +30,000 = 39,0000 KLV price and:
      // 2000000000               = 2000          = 2,000 KUSD price
    },
  },
};

export const multicontractMarketbuyAndItobuy2 = {
  data: {
    transaction: {
      hash: '62ca725591007b6b9064231a9001d9e7acae11d81c1f0a3bc0d09796107196b2',
      blockNum: 2657491,
      sender: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
      nonce: 77,
      timestamp: 1667339448000,
      kAppFee: 1000000,
      bandwidthFee: 1000000,
      status: 'success',
      resultCode: 'Ok',
      version: 1,
      chainID: '108',
      signature: [
        '720a291f6df744c09822bd0a0526629c5cc792be39812289df28147db219df7b23dcd0aeb4bd461fbec64af9cd4412dd378afb08d791f9593dc98e8e1116660a',
      ],
      searchOrder: 1,
      receipts: [
        {
          signer:
            'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          type: 19,
          weight: '1',
        },
        // ITO contracts start:

        {
          signer:
            'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          type: 19,
          weight: '1',
        },
        {
          assetId: 'KLV',
          from: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          to: 'klv12e8nhj89yt68crdx2dpx8vlwdjy3z6ft69d3sqzedjzn68enuqxs8a5nxl',
          type: 0,
          value: 9000000000,
        },
        {
          assetId: 'FWZG-2Y4P',
          type: 2,
        },
        {
          assetId: 'FWZG-2Y4P/299',
          from: 'klv1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpgm89z',
          to: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          type: 0,
          value: 1,
        },
        {
          assetId: 'FWZG-2Y4P/300',
          from: 'klv1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpgm89z',
          to: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          type: 0,
          value: 1,
        },
        // receipts from contract 2:
        {
          signer:
            'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          type: 19,
          weight: '1',
        },
        {
          assetId: 'KUSD-2S58',
          from: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          to: 'klv12e8nhj89yt68crdx2dpx8vlwdjy3z6ft69d3sqzedjzn68enuqxs8a5nxl',
          type: 0,
          value: 2000000000,
        },
        {
          assetId: 'ABCD-ID11',
          type: 2,
        },
        {
          assetId: 'ABCD-ID11/1',
          from: 'klv1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpgm89z',
          to: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          type: 0,
          value: 1,
        },
        {
          assetId: 'ABCD-ID11/2',
          from: 'klv1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpgm89z',
          to: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          type: 0,
          value: 1,
        },
        {
          assetId: 'ABCD-ID11/3',
          from: 'klv1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpgm89z',
          to: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          type: 0,
          value: 1,
        },
        // receipts from contract3:
        {
          signer:
            'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          type: 19,
          weight: '1',
        },
        {
          assetId: 'KLV',
          from: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          to: 'klv12e8nhj89yt68crdx2dpx8vlwdjy3z6ft69d3sqzedjzn68enuqxs8a5nxl',
          type: 0,
          value: 30000000000,
        },
        {
          assetId: 'FWZG-2Y4P',
          type: 2,
        },
        {
          assetId: 'FWZG-2Y4P/301',
          from: 'klv1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpgm89z',
          to: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          type: 0,
          value: 1,
        },
        {
          assetId: 'FWZG-2Y4P/302',
          from: 'klv1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpgm89z',
          to: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          type: 0,
          value: 1,
        },
        {
          assetId: 'FWZG-2Y4P/303',
          from: 'klv1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpgm89z',
          to: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          type: 0,
          value: 1,
        },
        {
          assetId: 'FWZG-2Y4P/304',
          from: 'klv1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpgm89z',
          to: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          type: 0,
          value: 1,
        },
        {
          assetId: 'FWZG-2Y4P/305',
          from: 'klv1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpgm89z',
          to: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          type: 0,
          value: 1,
        },
        // marketbuy start:
        {
          assetId: 'KLV',
          from: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          to: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          type: 14,
          value: 2500000000,
        },
        {
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          type: 16,
        },
        {
          assetId: 'KLV',
          from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          to: '"klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68www"',
          type: 14,
          value: 50000000,
        },
        {
          assetId: 'KLV',
          from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          to: 'klv19rzdkruwq3c0hd629cxslzr5ag8yenhkaglycu2jgay9086mqt4qw0u2mh',
          type: 14,
          value: 250000000,
        },
        {
          assetId: 'KLV',
          from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          to: 'klv19rzdkruwq3c0hd629cxslzr5ag8yenhkaglycu2jgay9086mqt4qw0u2mh',
          type: 14,
          value: 0,
        },
        {
          assetId: 'KLV',
          from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          to: 'klv1hyj8skg8ukuac79e5fsn6dt8yt85pvr5jlkrawwlw3w96vcl4uaqaxgqjw',
          type: 14,
          value: 2200000000,
        },
        {
          assetId: 'BCWNFT-13YH/1315',
          from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          to: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          type: 14,
          value: 1,
        },
        // receipts for contract 2:
        {
          assetId: 'KUSD-2S58',
          from: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          to: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          type: 14,
          value: 300000000,
        },
        {
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          type: 16,
        },
        {
          assetId: 'KUSD-2S58',
          from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          to: '"klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xwww"',
          type: 14,
          value: 1500000, // probably wrong fee here
        },
        {
          assetId: 'KUSD-2S58',
          from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          to: 'klv19rzdkruwq3c0hd629cxslzr5ag8yenhkaglycu2jgay9086mqt4qw0u2mh',
          type: 14,
          value: 30000000, // probably wrong fee here
        },
        {
          assetId: 'KUSD-2S58',
          from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          to: 'klv19rzdkruwq3c0hd629cxslzr5ag8yenhkaglycu2jgay9086mqt4qw0u2mh',
          type: 14,
          value: 0,
        },
        {
          assetId: 'KUSD-2S58',
          from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          to: 'klv1hyj8skg8ukuac79e5fsn6dt8yt85pvr5jlkrawwlw3w96vcl4uaqaxgqjw',
          type: 14,
          value: 268500000,
        },
        {
          assetId: 'ABCNFT-11AA/1',
          from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          to: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          type: 14,
          value: 1,
        },
        // receipts for contract 3:
        {
          signer:
            'klv1cr3ndzncn23mzqg03r497zuxyx48mu7v8rh8pn8fsj97pxhdaxts8ptkq2',
          type: 19,
          weight: '1',
        },
        {
          assetId: 'KLV',
          from: 'klv1cr3ndzncn23mzqg03r497zuxyx48mu7v8rh8pn8fsj97pxhdaxts8ptkq2',
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          to: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          type: 14,
          value: 3500000000,
        },
        {
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          type: 16,
        },
        {
          assetId: 'KLV',
          from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          to: '"klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c"',
          type: 14,
          value: 50000000,
        },
        {
          assetId: 'KLV',
          from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          to: 'klv19rzdkruwq3c0hd629cxslzr5ag8yenhkaglycu2jgay9086mqt4qw0u2mh',
          type: 14,
          value: 250000000,
        },
        {
          assetId: 'KLV',
          from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          to: 'klv19rzdkruwq3c0hd629cxslzr5ag8yenhkaglycu2jgay9086mqt4qw0u2mh',
          type: 14,
          value: 0,
        },
        {
          assetId: 'KLV',
          from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          to: 'klv1hyj8skg8ukuac79e5fsn6dt8yt85pvr5jlkrawwlw3w96vcl4uaqaxgqjw',
          type: 14,
          value: 2200000000,
        },
        {
          assetId: 'BCWNFT-13YH/1316',
          from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          to: 'klv1u7xmsnj8lm5rch97hlrmzv6n5aktj0z3gw622ccyawvnulsegxfs68xc3c',
          type: 14,
          value: 1,
        },
      ],
      contract: [
        {
          type: 17,
          typeString: 'BuyContractType',
          parameter: {
            amount: 2,
            buyType: 'ITOBuy',
            currencyID: 'KLV',
            id: 'FWZG-2Y4P',
          },
        },
        {
          type: 17,
          typeString: 'BuyContractType',
          parameter: {
            amount: 3,
            buyType: 'ITOBuy',
            currencyID: 'KUSD-2S58',
            id: 'ABCD-ID11',
          },
        },
        {
          type: 17,
          typeString: 'BuyContractType',
          parameter: {
            amount: 5,
            buyType: 'ITOBuy',
            currencyID: 'KLV',
            id: 'FWZG-2Y4P',
          },
        },
        {
          type: 17,
          typeString: 'BuyContractType',
          parameter: {
            amount: 2500000000,
            buyType: 'MarketBuy',
            currencyID: 'KLV',
            id: 'd639b325d3793klv',
          },
        },
        {
          type: 17,
          typeString: 'BuyContractType',
          parameter: {
            amount: 10000000000,
            buyType: 'MarketBuy',
            currencyID: 'KUSD-2S58',
            id: 'd639b325d379kusd',
          },
        },
        {
          type: 17,
          typeString: 'BuyContractType',
          parameter: {
            amount: 5000000000,
            buyType: 'MarketBuy',
            currencyID: 'KLV',
            id: 'd639b325d3793klv',
          },
        },
      ],
    },
  },
};
