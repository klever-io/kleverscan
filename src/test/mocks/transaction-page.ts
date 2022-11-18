// BUY CONTRACT:
// MARKETBUY TYPE WITH MULTICONTRACT:
export const marketbuy1 = {
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
          assetId: 'KUSD',
          from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          to: 'klv13gk22xsy2hjjj8vecjr86tgcd4qrn6zj7207t7j9czvza4dc3tkqpjzmkc',
          type: 14,
          value: 1500000, // probably wrong fee here
        },
        {
          assetId: 'KUSD',
          from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          to: 'klv19rzdkruwq3c0hd629cxslzr5ag8yenhkaglycu2jgay9086mqt4qw0u2mh',
          type: 14,
          value: 30000000, // probably wrong fee here
        },
        {
          assetId: 'KUSD',
          from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          to: 'klv19rzdkruwq3c0hd629cxslzr5ag8yenhkaglycu2jgay9086mqt4qw0u2mh',
          type: 14,
          value: 0,
        },
        {
          assetId: 'KUSD',
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
          assetId: 'BCWNFT-13YH/1316',
          from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          marketplaceId: 'd4f2bab340c55fde',
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
export const itobuy1 = {
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

export const marketbuy1AndItobuy1 = {
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
          assetId: 'KUSD-2S58',
          from: 'klv1cr3ndzncn23mzqg03r497zuxyx48mu7v8rh8pn8fsj97pxhdaxts8ptkq2',
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
          to: 'klv13gk22xsy2hjjj8vecjr86tgcd4qrn6zj7207t7j9czvza4dc3tkqpjzmkc',
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
          assetId: 'BCWNFT-13YH/1316',
          from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
          marketplaceId: 'd4f2bab340c55fde',
          orderId: 'd639b325d3793e1e',
          to: 'klv1cr3ndzncn23mzqg03r497zuxyx48mu7v8rh8pn8fsj97pxhdaxts8ptkq2',
          type: 14,
          value: 1,
        },
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
