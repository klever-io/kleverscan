import { IAsset, IStaking } from '@/types';
import {
  assetSupplyViews,
  getCapUsage,
  getLatestAprPercent,
  getRewardsModel,
} from '../helpers';

const staking = (overrides: Partial<IStaking>): IStaking =>
  ({
    interestType: 'FPRI',
    apr: [],
    fpr: [],
    totalStaked: 0,
    ...overrides,
  }) as IStaking;

describe('getCapUsage', () => {
  it('reports no cap for unlimited supplies', () => {
    expect(getCapUsage(100, 0)).toEqual({ hasCap: false, usedShare: 0 });
  });

  it('returns the circulating share of the maximum supply', () => {
    expect(getCapUsage(840, 1000)).toEqual({ hasCap: true, usedShare: 0.84 });
  });

  it('clamps an overflowing circulating supply to a full track', () => {
    expect(getCapUsage(1500, 1000)).toEqual({ hasCap: true, usedShare: 1 });
  });
});

describe('getLatestAprPercent', () => {
  it('reads the latest epoch and converts to percent', () => {
    const withHistory = staking({
      interestType: 'APRI',
      apr: [
        { timestamp: 1, epoch: 0, value: 500 },
        { timestamp: 2, epoch: 1, value: 825 },
      ],
    });
    expect(getLatestAprPercent(withHistory)).toBe('8.25%');
  });

  it('returns nothing without history or staking', () => {
    expect(
      getLatestAprPercent(staking({ interestType: 'APRI' })),
    ).toBeUndefined();
    expect(getLatestAprPercent(undefined)).toBeUndefined();
    expect(getLatestAprPercent(null)).toBeUndefined();
  });
});

describe('getRewardsModel', () => {
  it('returns the real rate for APR assets with history', () => {
    const apri = staking({
      interestType: 'APRI',
      apr: [{ timestamp: 1, epoch: 0, value: 800 }],
    });
    expect(getRewardsModel(apri)).toEqual({ kind: 'apr', rate: '8.00%' });
  });

  it('marks configured APR without history', () => {
    expect(getRewardsModel(staking({ interestType: 'APRI' }))).toEqual({
      kind: 'apr-configured',
    });
  });

  it('marks FPR assets and assets without staking', () => {
    expect(getRewardsModel(staking({ interestType: 'FPRI' }))).toEqual({
      kind: 'fpr',
    });
    expect(getRewardsModel(null)).toEqual({ kind: 'none' });
    expect(getRewardsModel(undefined)).toEqual({ kind: 'none' });
  });
});

describe('assetSupplyViews', () => {
  // The bug this guards against: measuring the cap against the net supply
  // reads a fully minted asset as nearly empty. BLOCK-31F6 showed 2.09% of
  // its cap used while it is at 99.99%.
  it('measures the cap gross and displays circulating net', () => {
    const views = assetSupplyViews({
      circulatingSupply: 1000,
      netCirculatingSupply: 21,
      voidedSupply: 979,
      maxSupply: 1000,
    } as IAsset);

    expect(views.capBasis).toBe(1000);
    expect(views.circulating).toBe(21);
    expect(getCapUsage(views.capBasis, 1000).usedShare).toBe(1);
    expect(getCapUsage(views.circulating, 1000).usedShare).toBeCloseTo(0.021);
  });

  it('falls back to the raw supply for both when the API omits the fields', () => {
    const views = assetSupplyViews({
      circulatingSupply: 1000,
      maxSupply: 1000,
    } as IAsset);

    expect(views.capBasis).toBe(1000);
    expect(views.circulating).toBe(1000);
  });
});
