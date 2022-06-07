
import { Contract,
  EnumClaimType,
  EnumICOStatus,
  EnumBuyType,
  EnumMarketType,
  EnumAssetType,
} from '../../types'

export const mockedTxContractComponents = {
  transferContract: {
    type: Contract.Transfer,
    sender: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
    parameter: {
      amount: 100000000,
      toAddress: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jquca668',
    },
  },
  createAssetContract: {
    type: Contract.CreateValidator,
    sender: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
    parameter: {
      type: EnumAssetType.NonFungible,
      name: 'New KLV',
      ticker: 'nKLV',
      ownerAddress: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
      precision: 6,
      circulatingSupply: 10000000000,
      initialSupply: 1000000,
      maxSupply: 3000000000000000,
    }
  },
  createValidatorContract: {
    type: Contract.CreateValidator,
    sender: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
    parameter: {
      ownerAddress: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
      config: {
        blsPublicKey: 'mockPublickey',
        rewardAddress: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
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
    }
  },
  unfreezeContract: {
    type: Contract.Unfreeze,
    sender: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
    parameter: {
      bucketID: '241ef463625511e08ca53f81e7ed0b40ee9cbf798c383e3595e7275as52d147',
      assetId: 'KLV',
    },
    receipts: [
      {
        availableEpoch: 102,
        bucketID: '241ef463625511e08ca53f81e7ed0b40ee9cbf798c383e3595e7275as52d147'
      },
    ],
  },
  delegateContract: {
    type: Contract.Delegate,
    sender: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
    parameter: {
      bucketID: '241ef463625511e08ca53f81e7ed0b40ee9cbf798c383e3595e7275as52d147',
      toAddress: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
    }
  },
  undelegateContract: {
    type: Contract.Undelegate,
    sender: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
    parameter: {
      bucketID: '241ef463625511e08ca53f81e7ed0b40ee9cbf798c383e3595e7275as52d147',
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
     }
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
      orderId: 'asdkanslkdmaisdjqpwdknajsndidj234'
    },
  },
  createMarketplaceContract: {
    type: Contract.CreateMarketplace,
    sender: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
    parameter: {
      name: 'kleverPlace',
      referralAddress: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
      referralpercentage: 1,
    },
  },
  configMarketplaceContract: {
    type: Contract.ConfigMarketplace,
    sender: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
    parameter: {
      marketplaceId: 'askdjaknsdkczmcas65e1231jnd1837481rhfn',
      name: 'kleverPlace',
      referralAddress: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jsdfr741',
      referralpercentage: 1,
    },
  },
};