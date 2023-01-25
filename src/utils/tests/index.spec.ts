import FakeTimers from '@sinonjs/fake-timers';
import api from '../../services/api';
import {
  addCommasToNumber,
  asyncDoIf,
  breakText,
  capitalizeString,
  doIf,
  fetchPartialAsset,
  filterDate,
  formatAmount,
  formatLabel,
  getAge,
  getContractType,
  getEpochInfo,
  getPrecisionFromApi,
  getSelectedTab,
  getVariation,
  hexToString,
  isDataEmpty,
  isImage,
  parseAddress,
  parseData,
  parseHardCodedInfo,
  parseHolders,
  parseValidators,
  regexImgUrl,
  resetDate,
  setCharAt,
  timestampToDate,
  toLocaleFixed,
  validateImgRequestHeader,
  validateImgUrl,
} from '../index';
import mocks from './mocks';

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
    };
  },
}));

jest.mock('@/services/api', () => {
  return {
    getCached: jest.fn(),
    get: jest.fn(),
    post: jest.fn(),
  };
});

describe('unit tests for util funcs in index file', () => {
  const timestamp1 = 1556322834000;
  const timestamp2 = 1654194050246;
  const timestamp3 = 1654195050246;
  const timestamp4 = 1654205050246;

  const clock = FakeTimers.install();
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('test breakText function', () => {
    test('when limit threshold is not surpassed', () => {
      expect(breakText('Hello World!', 12)).toEqual('Hello World!');
    });
    test('when limit threshold is surpassed', () => {
      expect(breakText('Hello World!', 11)).toEqual('Hello World...');
    });
  });

  describe('test timestampToDate function', () => {
    test('using old dates timestamps as parameters', () => {
      expect(timestampToDate(timestamp1)).toMatch(
        /11\/27\/51287, 3:20:00( | )PM/,
      );
      expect(timestampToDate(timestamp2)).toMatch(
        /4\/28\/54389, 8:17:26( | )AM/,
      );
    });
  });

  describe('test getVariation function', () => {
    test('when positive number is passed as parameter', () => {
      expect(getVariation(2.00604)).toEqual('+ 2.01%');
    });
    test('when 0 is passed as parameter', () => {
      expect(getVariation(0)).toEqual('+ --%');
    });
    test('when negative number is passed as parameter', () => {
      expect(getVariation(-1.3161)).toEqual('- 1.32%');
    });
    test('rounding cases', () => {
      expect(getVariation(2.004)).toEqual('+ 2.00%');
      expect(getVariation(2.005)).toEqual('+ 2.00%');
      expect(getVariation(2.006)).toEqual('+ 2.01%');
      expect(getVariation(2.6666)).toEqual('+ 2.67%');
    });
  });

  describe('test getAge function', () => {
    clock.setSystemTime(new Date(timestamp2));
    test('with fixed date through mocked Date constructor', () => {
      expect(getAge(new Date(timestamp2))).toEqual('0 sec');
      expect(getAge(new Date(timestamp3))).toEqual('16 mins');
      expect(getAge(new Date(timestamp4))).toEqual('3 hours');
    });
  });

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

  describe('test hexToString function', () => {
    test('some transactions cases', () => {
      const bytesArray1 =
        '53656e64696e67206b6c76316b667630797061656a376138376d6e3779706679677238687278646a7266727a71326a637677396b6a64323532646d70757639736b75746b6633202d3e206b6c76313275307264306c347a36346c336d336379756c667a6c6c3639346d757363363535346e6b6b3030773272747a3867793233676e7134637a3778323a203236';
      const bytesArray2 =
        '53656e64696e67206b6c763130343665356e783239676b7575797873783374673365737166796c7137326339656e38796733376c67343663397877647735657379337a617879202d3e206b6c763171613965357938767a77687372377361677179616c7533673867327a33393275683032376c73767a327a66637974736564676e737465743375373a2035';

      expect(hexToString(bytesArray1)).toEqual(
        'Sending klv1kfv0ypaej7a87mn7ypfygr8hrxdjrfrzq2jcvw9kjd252dmpuv9skutkf3 -> klv12u0rd0l4z64l3m3cyulfzll694musc6554nkk00w2rtz8gy23gnq4cz7x2: 26',
      );
      expect(hexToString(bytesArray2)).toEqual(
        'Sending klv1046e5nx29gkuuyxsx3tg3esqfylq72c9en8yg37lg46c9xwdw5esy3zaxy -> klv1qa9e5y8vzwhsr7sagqyalu3g8g2z392uh027lsvz2zfcytsedgnstet3u7: 5',
      );
    });

    describe('test parseAddress function', () => {
      test('if the passed hash is correctly sliced and filled with ellipsis', () => {
        const hash1 =
          'f406047d72163153f0f4ea83055cc8e04f66cd4733fcbcd957f933cdceb4053a';
        const hash2 =
          '521fde97330af171f7ff643d661d8d708cf145f632efd8f04b9546d32bd6c2fd';
        expect(parseAddress(hash1, 6)).toEqual('f40...53a');
        expect(parseAddress(hash2, 12)).toEqual('521fde...d6c2fd');
      });
      test('if a small string is returned entirely', () => {
        expect(parseAddress('hello', 6)).toEqual('hello');
      });
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

  describe('test capitalizeString function', () => {
    test('if it returns a string with the first character capitalized', () => {
      expect(capitalizeString('hello world')).toEqual('Hello world');
    });
  });

  describe('test getEpochInfo function', () => {
    const parsedMetrics1 = {
      slotAtEpochStart: 220503,
      slotsPerEpoch: 150,
      currentSlot: 220651,
      slotDuration: 4000,
    };
    const parsedMetrics2 = {
      slotAtEpochStart: 220653,
      slotsPerEpoch: 150,
      currentSlot: 220669,
      slotDuration: 4000,
    };

    const parsedMetrics3 = {
      slotAtEpochStart: 220453,
      slotsPerEpoch: 150,
      currentSlot: 220670,
      slotDuration: 4000,
    };

    const parsedMetrics4 = {
      slotAtEpochStart: 9220755,
      slotsPerEpoch: 2500,
      currentSlot: 9221670,
      slotDuration: 4000,
    };

    const result1 = {
      currentSlot: 220651,
      epochFinishSlot: 220653,
      epochLoadPercent: 98.66666666666667,
      remainingTime: ' 8s ',
    };
    const result2 = {
      currentSlot: 220669,
      epochFinishSlot: 220803,
      epochLoadPercent: 10.666666666666671,
      remainingTime: ' 8m 56s ',
    };
    const result3 = {
      currentSlot: 220670,
      epochFinishSlot: 220603,
      epochLoadPercent: 100,
      remainingTime: ' ',
    };

    const result4 = {
      currentSlot: 9221670,
      epochFinishSlot: 9223255,
      epochLoadPercent: 36.6,
      remainingTime: '1h 45m 40s ',
    };
    test('if correct object is returned', () => {
      expect(getEpochInfo(parsedMetrics1)).toStrictEqual(result1);
      expect(getEpochInfo(parsedMetrics2)).toStrictEqual(result2);
      expect(getEpochInfo(parsedMetrics3)).toStrictEqual(result3);
      expect(getEpochInfo(parsedMetrics4)).toStrictEqual(result4);
    });
  });

  describe('test addCommasToNumber function', () => {
    test('if the number returned a string', () => {
      const num = 12000000;
      const num2 = 20000000;
      const num3 = 80000000;
      expect(addCommasToNumber(num)).toEqual('12,000,000');
      expect(addCommasToNumber(num2)).toEqual('20,000,000');
      expect(addCommasToNumber(num3)).toEqual('80,000,000');
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

  describe('test isDataEmpty function', () => {
    test('return true if array of strings is empty', () => {
      const empty: any[] = [];
      const data = ['3030303830'];
      const data2 = [''];
      expect(isDataEmpty(empty)).toEqual(true);
      expect(isDataEmpty(data)).toEqual(false);
      expect(isDataEmpty(data2)).toEqual(true);
    });
  });

  describe('test setCharAt function', () => {
    test('if return new string', () => {
      const test = setCharAt('1500000', 5, '4000');
      const test2 = setCharAt('2000', 5, '4000');
      expect(test).toEqual('1500040000');
      expect(test2).toEqual('2000');
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

  describe('test getContractType function', () => {
    test.each`
      contract                  | expected
      ${'TransferContractType'} | ${true}
      ${'FreezeContractType'}   | ${true}
      ${'FreezeContractType'}   | ${true}
      ${'UnjailContractType'}   | ${false}
      ${'VoteContractType'}     | ${false}
    `(
      'check if contract is Transfer, Freeze or Unfreeze',
      ({ contract, expected }) => {
        expect(getContractType(contract)).toEqual(expected);
      },
    );
  });

  describe('test getSelectedTab function', () => {
    test('return boolean when selecting a tab', () => {
      const assetsTab = getSelectedTab('Assets');
      const transactionsTab = getSelectedTab('Transactions');
      const emptyTab = getSelectedTab(['']);
      const emptyString = getSelectedTab('');
      expect(assetsTab).toEqual(0);
      expect(transactionsTab).toEqual(1);
      expect(emptyTab).toEqual(2);
      expect(emptyString).toEqual(2);
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

  describe('test validateImgUrl', () => {
    test('return true if url is valid', async () => {
      const url1 = await validateImgUrl(
        'https://cdn-images-1.medium.com/max/720/1*2Wu5yLlLrfsfz6wMYFlYtQ.png',
        2000,
      );
      expect(url1).toEqual(true);
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
      },
    ];
    test('if correct array is returned', () => {
      const result = parseValidators(mocks.validator);
      expect(result).toHaveLength(2);
      expect(result).toStrictEqual(validators);
    });
  });

  describe('test resetDate function', () => {
    const query = {
      account: 'klv16sd7crk4jlc8csrv7lwskqrpjgjklvcsmlhexuesa9p6a3dm57rs5vh0hq',
      tab: 'Transactions',
      startdate: '1665457200000',
      enddate: '1666321200000',
    };
    test('check if "RESET" the date filter', () => {
      const result = resetDate(query);
      expect(result).toEqual({
        account:
          'klv16sd7crk4jlc8csrv7lwskqrpjgjklvcsmlhexuesa9p6a3dm57rs5vh0hq',
        tab: 'Transactions',
      });
    });
  });

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

  describe('test getPrecisionFromApi function ', () => {
    const mockPrecision = {
      data: {
        precisions: {
          'PVM-GVCI': 10,
          KLV: 6,
        },
      },
      error: '',
      code: 'successful',
    };
    test('return precision asset', async () => {
      (api.post as jest.Mock).mockReturnValue(mockPrecision);
      const precision = (await getPrecisionFromApi(['PVM-GVCI', 'KLV'])) as any;
      expect(precision).toEqual({ precisions: mockPrecision.data.precisions });
    });
  });

  describe('test fetchPartialAsset function', () => {
    let fetchPartialAssetTimeout: ReturnType<typeof setTimeout>;
    test('if returns correct asset', async () => {
      (api.getCached as jest.Mock).mockReturnValueOnce({
        data: {
          assets: mocks.assets[0],
        },
      });
      const result = fetchPartialAsset(fetchPartialAssetTimeout, 'KFI');
      await clock.tickAsync(5000);

      await expect(result).resolves.toStrictEqual(mocks.assets[0]);
    });
  });

  describe('test isImage function', () => {
    const url =
      'https://cdn-images-1.medium.com/max/720/1*2Wu5yLlLrfsfz6wMYFlYtQ.png';
    test("if return false, if it's not a html image src", async () => {
      const expected = false;
      (global.fetch = jest.fn() as jest.Mock).mockReturnValueOnce(url);
      const result = isImage(url, 2000);
      await clock.tickAsync(5000);

      await expect(result).resolves.toEqual(expected);
    });
  });

  describe('test validateImgRequestHeader function', () => {
    test('return true if url type is "image"', async () => {
      const expected = true;
      (global.fetch = jest.fn() as jest.Mock).mockReturnValueOnce({
        headers: {
          get: (contentType: string) => (contentType = 'image/klv'),
        },
      });
      const result = validateImgRequestHeader('/assets/klv-logo.png', 2000);
      await clock.tickAsync(5000);

      await expect(result).resolves.toEqual(expected);
    });
    test('return false if url type is not "image"', async () => {
      const expected = false;
      (global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ headers: '/klv' }),
        }),
      ) as jest.Mock).mockReturnValueOnce({
        headers: {
          get: (contentType: string) => (contentType = 'klv'),
        },
      });
      const result = validateImgRequestHeader('/assets/klv-logo.png', 2000);
      await clock.tickAsync(5000);

      await expect(result).resolves.toEqual(expected);
    });
  });
  describe('test doIf function', () => {
    test('return Promise void', async () => {
      const expected = undefined;
      const result = doIf(
        () => true,
        () => undefined,
        () => true,
        100,
        200,
      );
      await clock.tickAsync(5000);

      await expect(result).resolves.toBe(expected);
    });
  });
  describe('test asyncDoIf function', () => {
    (api.get as jest.Mock).mockReturnValueOnce(mocks.addressList);
    const request = async () => {
      return await api.get({
        route: 'address/list',
      });
    };
    let results: any;
    test('Return Promise void', async () => {
      asyncDoIf(
        res => (results = res),
        err => (results = err),
        () => request(),
      );
      await clock.tickAsync(5000);
      expect(results).toStrictEqual(mocks.addressList);
    });
  });
});
