import {
  buildRowBar,
  computeHoldersSummary,
  concentrationLevel,
  getMedalTier,
  isVoidAddress,
} from '../holdersMath';
import { IBalance } from '@/types';
import { VOID_ADDRESS } from '@/utils/globalVariables';

const holder = (
  rank: number,
  totalBalance: number,
  frozenBalance = 0,
  address = `klv1holder${rank}`,
): IBalance => ({
  index: rank - 1,
  address,
  balance: totalBalance - frozenBalance,
  frozenBalance,
  totalBalance,
  rank,
});

describe('concentrationLevel', () => {
  it('maps the thresholds to the right verdicts', () => {
    expect(concentrationLevel(0.7)).toEqual({
      label: 'Very high',
      tone: 'high',
    });
    expect(concentrationLevel(0.4)).toEqual({ label: 'High', tone: 'high' });
    expect(concentrationLevel(0.15)).toEqual({
      label: 'Moderate',
      tone: 'moderate',
    });
    expect(concentrationLevel(0.149)).toEqual({ label: 'Low', tone: 'low' });
  });
});

describe('computeHoldersSummary', () => {
  const asset = {
    circulatingSupply: 1_000,
    staking: undefined as any,
  };

  it('derives net supply and shifts medals when void is rank 1', () => {
    const holders = [
      holder(1, 900, 0, VOID_ADDRESS),
      holder(2, 50),
      holder(3, 30),
      holder(4, 10),
      holder(5, 5),
      holder(6, 5),
    ];
    const summary = computeHoldersSummary(asset, holders, 123);

    expect(summary.totalHolders).toBe(123);
    expect(summary.voidAmount).toBe(900);
    expect(summary.netSupply).toBe(100);
    expect(summary.medalRanks).toEqual([2, 3, 4]);
    expect(summary.top10ShareNet).toBe(1);
    expect(summary.top50Amount).toBe(100);
  });

  it('prefers the API net supply fields when present', () => {
    const summary = computeHoldersSummary(
      { ...asset, voidedSupply: 250, netCirculatingSupply: 750 },
      [holder(1, 300), holder(2, 150)],
    );
    expect(summary.netSupply).toBe(750);
    expect(summary.voidAmount).toBe(250);
    expect(summary.top50Amount).toBe(450);
  });

  it('builds distribution segments on the gross supply, burned included', () => {
    const holders = [
      holder(1, 900, 0, VOID_ADDRESS),
      holder(2, 50),
      holder(3, 30),
    ];
    const summary = computeHoldersSummary(asset, holders);
    expect(summary.segments.map(segment => segment.key)).toEqual([
      'largest',
      'ranks2to10',
      'rest',
      'burned',
    ]);
    expect(summary.segments[0].share).toBeCloseTo(0.05);
    expect(summary.segments[2].amount).toBe(20);
    expect(summary.segments[3]).toMatchObject({ amount: 900, share: 0.9 });
  });

  it('degrades to empty analytics without holder data', () => {
    const summary = computeHoldersSummary(asset, []);
    expect(summary.top10ShareNet).toBeUndefined();
    expect(summary.top50Amount).toBe(0);
    expect(summary.segments).toEqual([]);
    expect(summary.medalRanks).toEqual([]);
  });
});

describe('getMedalTier', () => {
  it('only awards medals under the total balance sort', () => {
    expect(getMedalTier(1, false, false, [1, 2, 3])).toBeUndefined();
  });

  it('never awards the void row and follows the shifted ranks', () => {
    expect(getMedalTier(1, true, true, [2, 3, 4])).toBeUndefined();
    expect(getMedalTier(2, false, true, [2, 3, 4])).toBe('gold');
    expect(getMedalTier(4, false, true, [2, 3, 4])).toBe('bronze');
    expect(getMedalTier(5, false, true, [2, 3, 4])).toBeUndefined();
  });

  it('falls back to the plain top 3 without top-50 data', () => {
    expect(getMedalTier(1, false, true, [])).toBe('gold');
    expect(getMedalTier(3, false, true, [])).toBe('bronze');
    expect(getMedalTier(4, false, true, [])).toBeUndefined();
  });
});

describe('buildRowBar', () => {
  it('fills the track with the holder share of the supply', () => {
    // 100 of 1000 is 10% of the supply, so the bar reads 10% full and
    // matches the percentage printed above it.
    expect(buildRowBar(holder(5, 100, 40), 1_000)).toEqual({
      fillRatio: 0.1,
      liquidFraction: 0.6,
    });
  });

  it('only fills the whole track for a holder owning everything', () => {
    expect(buildRowBar(holder(1, 1_000), 1_000)?.fillRatio).toBe(1);
    expect(buildRowBar(holder(1, 262), 1_000)?.fillRatio).toBeCloseTo(0.262);
  });

  it('returns nothing for empty rows or a zero supply', () => {
    expect(buildRowBar(holder(5, 0), 1_000)).toBeUndefined();
    expect(buildRowBar(holder(5, 100), 0)).toBeUndefined();
  });
});

describe('isVoidAddress', () => {
  it('matches only the void address', () => {
    expect(isVoidAddress(VOID_ADDRESS)).toBe(true);
    expect(isVoidAddress('klv1holder1')).toBe(false);
  });
});
