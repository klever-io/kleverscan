import {
  getContractType,
  getEpochInfo,
  getSelectedTab,
  getVariation,
} from '../index';

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

describe('test util index', () => {
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
      const headers = ['Assets', 'Transactions'];
      const assetsTab = getSelectedTab('Assets', headers);
      const transactionsTab = getSelectedTab('Transactions', headers);
      const emptyTab = getSelectedTab([''], headers);
      const emptyString = getSelectedTab('', headers);
      expect(assetsTab).toEqual(0);
      expect(transactionsTab).toEqual(1);
      expect(emptyTab).toEqual(0);
      expect(emptyString).toEqual(0);
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
});
