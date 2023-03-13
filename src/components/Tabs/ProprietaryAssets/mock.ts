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
    assets: [
      {
        assetType: 'Fungible',
        assetId: 'TOA-2HLR',
        name: 'Test Owned Assets',
        ticker: 'TOA',
        ownerAddress:
          'klv1nnu8d0mcqnxunqyy5tc7kj7vqtp4auy4a24gv35fn58n2qytl9xsx7wsjl',
        logo: '',
        precision: 2,
        initialSupply: 0,
        circulatingSupply: 2000000000,
        maxSupply: 0,
        mintedValue: 0,
        burnedValue: 0,
        issueDate: 1678582726,
        royalties: {
          address:
            'klv1nnu8d0mcqnxunqyy5tc7kj7vqtp4auy4a24gv35fn58n2qytl9xsx7wsjl',
        },
        staking: {
          interestType: 'APRI',
          apr: [
            {
              timestamp: 1678582726,
              epoch: 0,
              value: 0,
            },
          ],
          fpr: [],
          totalStaked: 0,
          currentFPRAmount: 0,
          minEpochsToClaim: 0,
          minEpochsToUnstake: 0,
          minEpochsToWithdraw: 0,
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
          isRoyaltiesChangeStopped: false,
        },
        hidden: false,
        verified: false,
      },
    ],
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
