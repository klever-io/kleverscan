import {
  addCommasToNumber,
  breakText,
  capitalizeString,
  hexToString,
  setCharAt,
} from '.';
import { parseAddress } from '../parseValues';
import { timestampToDate } from '../timeFunctions';

describe('test convertsString', () => {
  const timestamp1 = 1556322834000;
  const timestamp2 = 1654194050246;
  const timestamp3 = 1654195050246;
  const timestamp4 = 1654205050246;

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

  describe('test setCharAt function', () => {
    test('if return new string', () => {
      const test = setCharAt('1500000', 5, '4000');
      const test2 = setCharAt('2000', 5, '4000');
      expect(test).toEqual('1500040000');
      expect(test2).toEqual('2000');
    });
  });

  describe('test capitalizeString function', () => {
    test('if it returns a string with the first character capitalized', () => {
      expect(capitalizeString('hello world')).toEqual('Hello world');
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

  describe('test breakText function', () => {
    test('when limit threshold is not surpassed', () => {
      expect(breakText('Hello World!', 12)).toEqual('Hello World!');
    });
    test('when limit threshold is surpassed', () => {
      expect(breakText('Hello World!', 11)).toEqual('Hello World...');
    });
  });
});
