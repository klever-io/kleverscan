export const mockAccountResponse = {
  data: {
    account: {
      address: 'klv18slsv4v8yxdarvvyxdwgvdeqwrna899k2vcshlrlc4xjuyjlhveqv78t8s',
      nonce: 1,
      rootHash:
        'd95254e5b77d007395467102ebcfcc632162ac63aef9529c9d05c3842bb2eb00',
      balance: 10000000000000,
      frozenBalance: 10000000000000,
      allowance: 0,
      permissions: [],
      timestamp: 1671114785000,
      assets: {
        KLV: {
          address:
            'klv18slsv4v8yxdarvvyxdwgvdeqwrna899k2vcshlrlc4xjuyjlhveqv78t8s',
          assetId: 'KLV',
          collection: 'KLV',
          assetName: 'KLEVER',
          assetType: 0,
          balance: 20000000000000,
          precision: 6,
          frozenBalance: 10000000000000,
          unfrozenBalance: 0,
          lastClaim: {
            timestamp: 0,
            epoch: 0,
          },
          buckets: [
            {
              id: 'f9b9af152412066175a0728b731a2310af223b7bb15a936495c1144c21fbd648',
              stakeAt: 1671114785,
              stakedEpoch: 0,
              unstakedEpoch: 4294967295,
              balance: 10000000000000,
              delegation:
                'klv18slsv4v8yxdarvvyxdwgvdeqwrna899k2vcshlrlc4xjuyjlhveqv78t8s',
              validatorName: '',
            },
          ],
        },
      },
    },
  },
  error: '',
  code: 'successful',
};

export const mockAssetsOwnerResponse = {
  data: {
    assets: [],
  },
  pagination: {
    self: 1,
    next: 1,
    previous: 1,
    perPage: 10,
    totalPages: 1,
    totalRecords: 0,
  },
  error: '',
  code: 'successful',
};
