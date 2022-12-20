// TRANSFER:
const transferReceipt = [
  {
    signer: 'klv1fg7tyrw07flxf8nzpdljzrth762u35ycnxgj8qnqssdzyystpals5x8rs0', // signer is sender
    type: 19, // signedBy receipt
    weight: '1', // weight of the signature (for multisign cases)
  },
  {
    assetId: 'KLV',
    from: 'klv1fg7tyrw07flxf8nzpdljzrth762u35ycnxgj8qnqssdzyystpals5x8rs0', // from is sender
    to: 'klv190e3u9hx3almkd6xsdycssey9lmtzcrwm36x3gq57tt3y0s70lhqphl47f', // to is receiver
    type: 0, // transfer receipt
    value: 100000000,
  },
];

const createAssetRecept1 = [
  {
    signer: 'klv14jrn22pha6k8lked8ek4ym64hekcdeldm464jr0zdtmu5r0mvrfqx5duwm',
    type: 19,
    weight: '1',
  },
  {
    assetId: 'BIZZZX-186R',
    from: 'klv1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpgm89z', // genesis address, default address to create asset and send to the owner SAMUEL
    to: 'klv14jrn22pha6k8lked8ek4ym64hekcdeldm464jr0zdtmu5r0mvrfqx5duwm', // owner of the asset, sender of the tx
    type: 0, // transfer receipt
    value: 100000000000000000,
  },
  {
    assetId: 'BIZZZX-186R', // KDA created
    type: 1, // create KDA receipt
  },
];

const createAssetRecept2 = [
  {
    signer: 'klv19x04g3kp4mgddtsfedzzhz9tllvvjplxgp7pahj3nwty2y4ana9qkvy4ar',
    type: 19,
    weight: '1',
  },
  // not always there will be a transfer receipt
  {
    assetId: 'BFST-34PM',
    type: 1, // create KDA receipt
  },
];

const createValidatorReceipt = [
  {
    signer: 'klv17ke3wrhnnz5qd0c2u8vku6fk9ngwzrlxduz79t4djadgdtm8hf2ssy0a6k',
    type: 19,
    weight: '1',
  },
  {
    id: 'klv17ke3wrhnnz5qd0c2u8vku6fk9ngwzrlxduz79t4djadgdtm8hf2ssy0a6k', // id is the address of the validator owner SAMUEL
    type: 12, // UpdateValidator receipt
  },
];

const configValidatorReceipt = [
  // sames as createValidator
  {
    signer: 'klv1wafywrex8g0y50ykh6aqwjmedgnjq6nk45xd68fxt0dnwyujgueskwv5f8',
    type: 19,
    weight: '1',
  },
  {
    id: 'klv1wafywrex8g0y50ykh6aqwjmedgnjq6nk45xd68fxt0dnwyujgueskwv5f8',
    type: 12, // UpdateValidator receipt
  },
];

const freezeReceiptReceipt = [
  {
    signer: 'klv1d70zzs839cvv2w8alvg6p9xvz5pt5sxfagz8e3t0q3un3tz8hwtq5kch5e',
    type: 19,
    weight: '1',
  },
  {
    assetId: 'DVK-34ZH', // freeze is not just KLV/KFI
    bucketId: '44564b2d33345a48', // every freeze is separated into buckets because you can do multiple freezes in your account with the same asset
    from: 'klv1d70zzs839cvv2w8alvg6p9xvz5pt5sxfagz8e3t0q3un3tz8hwtq5kch5e', // account owner who freezed his assets
    type: 3, // freeze receipt
    value: '9182000000',
  },
];

const unfreezeReceipt = [
  {
    signer: 'klv10lgajgdvsshtyccsqf97m9srncxw9alsqrpwhn678h9pjl49k7tqtr5sya',
    type: 19,
    weight: '1',
  },
  {
    assetId: 'KFI',
    availableEpoch: '687',
    bucketId:
      '6325a3743feaf99a0da295a2ae4abb0233eedfaa63c36f076b11d5cb5f0982b3',
    from: 'klv10lgajgdvsshtyccsqf97m9srncxw9alsqrpwhn678h9pjl49k7tqtr5sya',
    type: 4, // unfreeze receipt
    value: '52000000',
  },
  {
    assetId: 'KLV', // rewards are in KLV
    from: 'klv1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpgm89z', // genesis address, will give the rewards to the account who unfreezed
    to: 'klv10lgajgdvsshtyccsqf97m9srncxw9alsqrpwhn678h9pjl49k7tqtr5sya', // account who freezed the KFI
    type: 0, // transfer receipt, unfreeze generate a transfer tx to give the rewards
    value: 17855840,
  },
  {
    amount: 17855840, // after unfreeze, the rewards must be claimed, after claim the transfer contract is generated??? SAMUEL
    assetId: 'KFI', // freezed asset
    assetIdReceived: 'KLV', // rewards asset
    marketplaceId: '', // if it was a buy/sell contract with an order in a marketplace
    orderId: '', // if it was a buy/sell contract with an order in a marketplace
    type: 17, // claim receipt
  },
];

const unfreezeReceipt2 = [
  {
    signer: 'klv1k9xj8mlmcy8y69sgwdq9as7x3tplmj4tjzlv2nmr5jct55ar5e5s78yz43',
    type: 19,
    weight: '1',
  },
  {
    assetId: 'KLV',
    availableEpoch: '687',
    bucketId:
      '46eaa340a4ca1a6d9d254b00ce894fe3bb5913110047a32b9efe2187dab9423a',
    from: 'klv1k9xj8mlmcy8y69sgwdq9as7x3tplmj4tjzlv2nmr5jct55ar5e5s78yz43',
    type: 4,
    value: '50000000000',
  },
  {
    amountDelegated: '50000000000',
    bucketId:
      '46eaa340a4ca1a6d9d254b00ce894fe3bb5913110047a32b9efe2187dab9423a',
    delegate: '',
    from: 'klv1k9xj8mlmcy8y69sgwdq9as7x3tplmj4tjzlv2nmr5jct55ar5e5s78yz43',
    type: 7,
  },
];

export { transferReceipt };
