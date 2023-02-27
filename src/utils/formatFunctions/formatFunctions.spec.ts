import {
  filterDate,
  formatAmount,
  formatLabel,
  regexImgUrl,
  toLocaleFixed,
} from '.';

describe('test FormatFunctions', () => {
  describe('test formatAmount function', () => {
    test('when parameter number is below zero or equal to zero', () => {
      expect(formatAmount(0)).toEqual('0');
      expect(formatAmount(-5)).toEqual('0');
      expect(formatAmount(-1.31512)).toEqual('0');
    });

    test('minification numbers', () => {
      expect(formatAmount(1)).toEqual('1 ');
      expect(formatAmount(10 ** 3)).toEqual('1 K');
      expect(formatAmount(10 ** 6)).toEqual('1 Mi');
      expect(formatAmount(10 ** 9)).toEqual('1 Bi');
      expect(formatAmount(10 ** 12)).toEqual('1 Tri');
      expect(formatAmount(10 ** 15)).toEqual('1 P');
      expect(formatAmount(10 ** 18)).toEqual('1 E');
    });

    test('arbitrary numbers', () => {
      expect(formatAmount(31531441)).toEqual('31.53 Mi');
      expect(formatAmount(3441)).toEqual('3.44 K');
      expect(formatAmount(31578313.13267)).toEqual('31.58 Mi');
    });
  });

  describe('test formatLabel function', () => {
    const isNFTMintStopped = 'isNFTMintStopped';
    const assetID = 'assetID';
    const bucketID = 'bucketID';
    const apr = 'APR';
    const blsPublicKey = 'BLSPublicKey';
    const marketPlaceID = 'marketplaceID';
    test.each`
      string              | expected
      ${isNFTMintStopped} | ${'Is NFT Mint Stopped'}
      ${assetID}          | ${'AssetID'}
      ${bucketID}         | ${'BucketID'}
      ${apr}              | ${'APR'}
      ${blsPublicKey}     | ${'BLS Public Key'}
      ${marketPlaceID}    | ${'MarketplaceID'}
      ${'KLV'}            | ${'K L V'}
      ${'assetId'}        | ${'AssetID'}
    `('if return correct string', ({ string, expected }) => {
      expect(formatLabel(string)).toEqual(expected);
    });
  });

  describe('test regexImgUrl function', () => {
    test('Validates URL extension with regex', () => {
      const logo1 = regexImgUrl(
        'https://cdn-images-1.medium.com/max/720/1*2Wu5yLlLrfsfz6wMYFlYtQ.png',
      );
      const logo2 = regexImgUrl(
        'https://cdn-images-1.medium.com/max/720/1*2Wu5yLlLrfsfz6wMYFlYtQ.gif',
      );
      const logo3 = regexImgUrl(
        'https://cdn-images-1.medium.com/max/720/1*2Wu5yLlLrfsfz6wMYFlYtQ.jpg',
      );
      const logo4 = regexImgUrl(
        'https://cdn-images-1.medium.com/max/720/1*2Wu5yLlLrfsfz6wMYFlYtQ.jpeg',
      );
      const logo5 = regexImgUrl(
        'https://cdn-images-1.medium.com/max/720/1*2Wu5yLlLrfsfz6wMYFlYtQ.tiff',
      );
      const logo6 = regexImgUrl(
        'https://cdn-images-1.medium.com/max/720/1*2Wu5yLlLrfsfz6wMYFlYtQ.webp',
      );
      const logo7 = regexImgUrl(
        'https://cdn-images-1.medium.com/max/720/1*2Wu5yLlLrfsfz6wMYFlYtQ.html',
      );
      expect(logo1).toEqual(true);
      expect(logo2).toEqual(true);
      expect(logo3).toEqual(true);
      expect(logo4).toEqual(true);
      expect(logo5).toEqual(true);
      expect(logo6).toEqual(true);
      expect(logo7).toEqual(false);
    });
  });

  describe('test filterDate', () => {
    test('return the filter as object with "startdate" and "enddate"', () => {
      const dateFilter1 = {
        start: new Date('2022-10-02T03:00:00.000Z'),
        end: new Date('2022-10-03T03:00:00.000Z'),
        values: [
          new Date('2022-10-02T03:00:00.000Z'),
          new Date('2022-10-03T03:00:00.000Z'),
        ],
      };
      const dateFilter2 = {
        start: new Date('2022-10-02T03:00:00.000Z'),
        end: null,
        values: [new Date('2022-10-02T03:00:00.000Z')],
      };
      expect(filterDate(dateFilter1)).toEqual({
        startdate: '1664679600000',
        enddate: '1664852400000',
      });
      expect(filterDate(dateFilter2)).toEqual({
        startdate: '1664679600000',
        enddate: '1664766000000',
      });
    });
  });

  describe('test toLocaleFixed function', () => {
    test('arbitrary numbers where English is the default language', () => {
      let mockLocaleFixed = toLocaleFixed;
      mockLocaleFixed = jest.fn().mockImplementation((value, precision) => {
        return value.toLocaleString('en-US', {
          minimumFractionDigits: precision,
        });
      });
      expect(mockLocaleFixed(4141414, 6)).toEqual('4,141,414.000000');
      expect(mockLocaleFixed(30000.65, 2)).toEqual('30,000.65');
      expect(mockLocaleFixed(1e9, 6)).toEqual('1,000,000,000.000000');
    });
  });
});
