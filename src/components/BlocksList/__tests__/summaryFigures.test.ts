import { IBlockDayStats } from '@/services/requests/block';
import { feeSplit } from '../summaryFigures';

// 2026-08-27 on mainnet, read from block/statistics-by-day.
const day = (overrides: Partial<IBlockDayStats> = {}): IBlockDayStats => ({
  date: 1787788800000,
  totalBlocks: 21597,
  totalMinted: 647910000000,
  totalBurned: 145531094085,
  totalBlockRewards: 323955000000,
  totalStakingRewards: 323955000000,
  totalTxFees: 81741289738,
  totalKappsFees: 13415000000,
  totalTxRewards: 40870643872,
  ...overrides,
});

describe('feeSplit', () => {
  it('splits a real day into three segments that add up to the total', () => {
    const split = feeSplit(day());

    expect(split?.total).toBe(81741289738 + 13415000000);
    expect(split?.segments).toEqual([
      { key: 'burned', amount: 81741289738 - 40870643872 },
      { key: 'validators', amount: 40870643872 },
      { key: 'kapp', amount: 13415000000 },
    ]);
    const summed = split!.segments.reduce((acc, s) => acc + s.amount, 0);
    expect(summed).toBe(split!.total);
  });

  it('reads the validator share from its own field, not from halving the fee', () => {
    // A chain that stops splitting in half must report its own number.
    const split = feeSplit(day({ totalTxFees: 1000, totalTxRewards: 250 }));

    expect(split?.segments).toEqual([
      { key: 'burned', amount: 750 },
      { key: 'validators', amount: 250 },
      { key: 'kapp', amount: 13415000000 },
    ]);
  });

  it('never draws a segment backwards when rewards exceed the fee they come from', () => {
    const split = feeSplit(day({ totalTxFees: 100, totalTxRewards: 900 }));

    expect(split?.segments[0]).toEqual({ key: 'burned', amount: 0 });
  });

  it('returns undefined for a missing day', () => {
    expect(feeSplit(undefined)).toBeUndefined();
  });

  it('returns undefined for a day that carried no fees at all', () => {
    expect(
      feeSplit(day({ totalTxFees: 0, totalKappsFees: 0, totalTxRewards: 0 })),
    ).toBeUndefined();
  });

  it('still reports a day that carried only kApp fees', () => {
    const split = feeSplit(
      day({ totalTxFees: 0, totalTxRewards: 0, totalKappsFees: 5000 }),
    );

    expect(split?.total).toBe(5000);
    expect(split?.segments).toEqual([
      { key: 'burned', amount: 0 },
      { key: 'validators', amount: 0 },
      { key: 'kapp', amount: 5000 },
    ]);
  });

  it.each([
    ['undefined', undefined],
    ['null', null],
    ['NaN', NaN],
    ['Infinity', Infinity],
    ['a negative', -1],
    ['a string', '81741289738'],
  ])(
    'treats %s in a fee field as nothing rather than propagating it',
    (_label, value) => {
      const split = feeSplit(
        day({ totalTxFees: value as number, totalTxRewards: 0 }),
      );

      expect(split?.total).toBe(13415000000);
      expect(split?.segments[0]).toEqual({ key: 'burned', amount: 0 });
    },
  );
});
