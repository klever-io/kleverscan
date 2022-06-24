import {
  breakText,
  timestampToDate,
  getVariation,
  getAge,
  formatAmount,
  toLocaleFixed,
  hexToString,
  parseHardCodedInfo,
  parseAddress,
  capitalizeString,
  getEpochInfo,
} from '../index';

import mocks from './mocks';

describe('unit tests for util funcs in index file', () => {
  const timestamp1 = 1556322834000;
  const timestamp2 = 1654194050246;
  const timestamp3 = 1654195050246;
  const timestamp4 = 1654205050246;

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
      expect(timestampToDate(timestamp1)).toEqual('2019-04-26');
      expect(timestampToDate(timestamp2)).toEqual('2022-06-02');
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
    let realDate;
    test('with fixed date through mocked Date constructor', () => {
      const fixedDate = new Date(timestamp2);
      realDate = Date;
      // TODO - Fix TYPE
      (global.Date as any) = class extends Date {
        constructor(...args: any) {
          if (args.length > 0) {
            return super(...args);
          }
          return fixedDate;
        }
      };

      expect(getAge(new Date(timestamp2))).toEqual('0 sec');
      expect(getAge(new Date(timestamp3))).toEqual('17 mins');
      expect(getAge(new Date(timestamp4))).toEqual('4 hours');

      global.Date = realDate;
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
      expect(toLocaleFixed(4141414, 6)).toEqual('4.141.414,000000');
      expect(toLocaleFixed(30000.65, 2)).toEqual('30.000,65');
      expect(toLocaleFixed(1e9, 6)).toEqual('1.000.000.000,000000');
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
      klv_slot_at_epoch_start: 220503,
      klv_slots_per_epoch: 150,
      klv_current_slot: 220651,
      klv_slot_duration: 4000,
    };
    const parsedMetrics2 = {
      klv_slot_at_epoch_start: 220653,
      klv_slots_per_epoch: 150,
      klv_current_slot: 220669,
      klv_slot_duration: 4000,
    };

    const parsedMetrics3 = {
      klv_slot_at_epoch_start: 220453,
      klv_slots_per_epoch: 150,
      klv_current_slot: 220670,
      klv_slot_duration: 4000,
    };

    const parsedMetrics4 = {
      klv_slot_at_epoch_start: 9220755,
      klv_slots_per_epoch: 2500,
      klv_current_slot: 9221670,
      klv_slot_duration: 4000,
    };

    const result1 = {
      currentSlot: 220651,
      epochFinishSlot: 220653,
      epochLoadPercent: 98.66666666666667,
      remainingTime: '8 seconds  ',
    };
    const result2 = {
      currentSlot: 220669,
      epochFinishSlot: 220803,
      epochLoadPercent: 10.666666666666671,
      remainingTime: '8 minutes 56 seconds  ',
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
      remainingTime: '1 hour 45 minutes 40 seconds  ',
    };
    test('if correct object is returned', () => {
      expect(getEpochInfo(parsedMetrics1)).toStrictEqual(result1);
      expect(getEpochInfo(parsedMetrics2)).toStrictEqual(result2);
      expect(getEpochInfo(parsedMetrics3)).toStrictEqual(result3);
      expect(getEpochInfo(parsedMetrics4)).toStrictEqual(result4);
    });
  });
});
