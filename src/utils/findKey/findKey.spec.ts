import { findNextSiblingReceipt } from '.';
import { IReceipt } from '../../types';
import {
  marketBuyFail1,
  marketBuyMulti1,
  marketBuySingle1,
  unfreezeWithClaimMulti1,
  unfreezeWithClaimMulti2,
  unfreezeWithClaimSingle1,
} from '../mocks/findKeyMocks';
import { receiverIsSender } from '../validateSender';

describe('test findNextSiblingReceipt function', () => {
  describe('early return cases', () => {
    it('should return null when tx fail', () => {
      const result = findNextSiblingReceipt(
        marketBuyFail1.receipts as IReceipt[],
        0,
        16,
        14,
        [marketBuySingle1.sender],
        receiverIsSender,
      );

      expect(result).toBe(null);
    });
    it('should return null when a second base receipt is found before the first search receipt', () => {
      const result = findNextSiblingReceipt(
        unfreezeWithClaimMulti2.receipts as IReceipt[],
        0,
        4,
        17,
      );
      expect(result).toBe(null);
    });
  });

  describe('marketBuy cases', () => {
    it('should return the correct receipt in a single contract scenario', () => {
      const correctReceipt = {
        assetId: 'KPNFT-13Z0/2822',
        from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
        marketplaceId: 'd4f2bab340c55fde',
        orderId: '38bce0376e17d056',
        to: 'klv1f4qmlgqngkjcwsaw202r976zaelj69mn7rsdcym8u44kue3992xqdgvfh7',
        type: 14,
        value: 1,
      };
      const result = findNextSiblingReceipt(
        marketBuySingle1.receipts as IReceipt[],
        0,
        16,
        14,
        [marketBuySingle1.sender],
        receiverIsSender,
      );
      expect(result).toStrictEqual(correctReceipt);
    });
    it('should return the receipts in correct order in a multi contract scenario', () => {
      const correctReceiptIndex0 = {
        assetId: 'KPNFT-13Z0/1361',
        from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
        marketplaceId: 'd4f2bab340c55fde',
        orderId: 'b1cba887cb941811',
        to: 'klv12vvt68gyvtxn7ntj8p00c9jgw09cy52f2nh8xvutwhdw3usfv0gqryxxst',
        type: 14,
        value: 1,
      };

      const correctReceiptIndex1 = {
        assetId: 'KPNFT-13Z0/4128',
        from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
        marketplaceId: 'd4f2bab340c55fde',
        orderId: '4d3afd53c18d9d76',
        to: 'klv12vvt68gyvtxn7ntj8p00c9jgw09cy52f2nh8xvutwhdw3usfv0gqryxxst',
        type: 14,
        value: 1,
      };

      const correctReceiptIndex2 = {
        assetId: 'KPNFT-13Z0/7140',
        from: 'klv1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqylllsymmgky',
        marketplaceId: 'd4f2bab340c55fde',
        orderId: '963869df0bdfcf2a',
        to: 'klv12vvt68gyvtxn7ntj8p00c9jgw09cy52f2nh8xvutwhdw3usfv0gqryxxst',
        type: 14,
        value: 1,
      };

      const result1 = findNextSiblingReceipt(
        marketBuyMulti1.receipts as IReceipt[],
        0,
        16,
        14,
        [marketBuyMulti1.sender],
        receiverIsSender,
      );
      expect(result1).toStrictEqual(correctReceiptIndex0);

      const result2 = findNextSiblingReceipt(
        marketBuyMulti1.receipts as IReceipt[],
        1,
        16,
        14,
        [marketBuyMulti1.sender],
        receiverIsSender,
      );
      expect(result2).toStrictEqual(correctReceiptIndex1);

      const result3 = findNextSiblingReceipt(
        marketBuyMulti1.receipts as IReceipt[],
        2,
        16,
        14,
        [marketBuyMulti1.sender],
        receiverIsSender,
      );
      expect(result3).toStrictEqual(correctReceiptIndex2);
    });
  });

  describe('unfreeze cases', () => {
    it('should return the correct receipt in a single contract scenario', () => {
      const correctReceipt = {
        amount: 162747,
        assetId: 'KFI',
        assetIdReceived: 'KLV',
        marketplaceId: '',
        orderId: '',
        type: 17,
      };
      const result = findNextSiblingReceipt(
        unfreezeWithClaimSingle1.receipts as IReceipt[],
        0,
        4,
        17,
      );

      expect(result).toStrictEqual(correctReceipt);
    });

    it('should return the receipts in correct order in a multi contract scenario', () => {
      const correctReceipt1 = {
        amount: 1438480,
        assetId: 'KLV',
        assetIdReceived: 'KLV',
        marketplaceId: '',
        orderId: '',
        type: 17,
      };

      const correctReceipt2 = null;

      const result1 = findNextSiblingReceipt(
        unfreezeWithClaimMulti1.receipts as IReceipt[],
        0,
        4,
        17,
      );
      expect(result1).toStrictEqual(correctReceipt1);

      const result2 = findNextSiblingReceipt(
        unfreezeWithClaimMulti1.receipts as IReceipt[],
        1,
        4,
        17,
      );
      expect(result2).toStrictEqual(correctReceipt2);
    });
  });
});
