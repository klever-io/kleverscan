import {
  parseData,
  parseHardCodedInfo,
  parseHolders,
  parseValidators,
} from '.';
import mocks from '../mocks';

describe('test parseValues', () => {
  describe('test parseHolders', () => {
    const { data, pagination } = mocks.holdersList;
    const holders = [
      {
        index: 0,
        address:
          'klv1rquwyta7kh4jueua76xpqkfgcwsws9yadtuxtp5g2cyt5ps04cpq5ywg5x',
        balance: 500000000000000,
        frozenBalance: 0,
        totalBalance: 500000000000000,
        rank: 1,
      },
      {
        index: 1,
        address:
          'klv1edd0ymfmv9r2mxk7mdtsk4zfeql5cp9vyn7t4y4adq58vp2r9alslfglw8',
        balance: 500000000000000,
        frozenBalance: 0,
        totalBalance: 500000000000000,
        rank: 2,
      },
      {
        index: 2,
        address:
          'klv14ragd2rgqat485vu6ssh4vu9rhmc68mg6vrmkmuhdqda9eeykucqvewgsh',
        balance: 500000000000000,
        frozenBalance: 0,
        totalBalance: 500000000000000,
        rank: 3,
      },
    ];
    test('if correct array is returned', () => {
      const result = parseHolders(data.accounts, 'KLV', pagination);
      expect(result).toStrictEqual(holders);
    });
  });

  describe('test parseValidators', () => {
    const validators = [
      {
        ownerAddress:
          'klv1tyajtxfsuslwqu8jmvp4xq87dppua0mwugx7ntv5dqt5cx200xfqayxflh',
        parsedAddress: 'klv1tyajtx...0xfqayxflh',
        name: 'PLC-Node',
        rank: 1,
        cumulativeStaked: 0.3923,
        staked: 10000000000000,
        rating: 10000000,
        canDelegate: true,
        selfStake: 1500000000000,
        status: 'elected',
        totalProduced: 586576,
        totalMissed: 1824,
        commission: 0,
        maxDelegation: 10000000000000,
      },
      {
        ownerAddress:
          'klv1qh2va63uesnzydz9pykqmszcphewse9f87mqxmkyhh0qfmv5l28s35r5r2',
        parsedAddress: 'klv1qh2va6...l28s35r5r2',
        name: 'Skywalker',
        rank: 2,
        cumulativeStaked: 0.3923,
        staked: 10000000000000,
        rating: 10000000,
        canDelegate: true,
        selfStake: 1500000000000,
        status: 'elected',
        totalProduced: 436141,
        totalMissed: 1096,
        commission: 0,
        maxDelegation: 10000000000000,
      },
    ];
    test('if correct array is returned', () => {
      const result = parseValidators(mocks.validator);
      expect(result).toHaveLength(2);
      expect(result).toStrictEqual(validators);
    });
  });

  describe('test parseData function', () => {
    test('if Object whose values are saved as string and convert them to their content', () => {
      const data = {
        test: '',
        test2: 'test2',
      };
      const data2 = {
        test: {
          test3: 'Test number 3',
        },
      };
      const data3 = {
        test: 123124124,
      };
      const data4 = {
        test4: '1999-01-01',
      };
      expect(parseData(data)).toEqual({ test2: 'test2' });
      expect(parseData(data2)).toEqual({ test: { test3: 'Test number 3' } });
      expect(parseData(data3)).toEqual({ test: 123124124 });
      expect(parseData(data4)).toEqual({ test4: 915148800 });
    });
  });

  describe('test parseHardCodedInfo', () => {
    test('array of assets', () => {
      const parsedArray = parseHardCodedInfo(mocks.assets);
      const arrayOfResults = [
        'KFI',
        'DVK-f67214',
        'SNTEST-4c9dd8',
        'some%20id%2C%20that%2F%20need%22s%3A%20%40%20encoding%20%3F%3F%20%3F',
      ];

      parsedArray.forEach((asset, index) => {
        expect(asset.assetId).toEqual(arrayOfResults[index]);
      });
    });
  });
});
