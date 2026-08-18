import { IStaking } from '@/types';
import { exactAmount } from '@/components/DataList/format';
import { getCapUsage, getLatestAprPercent, getRewardsModel } from '../helpers';

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

describe('exactAmount', () => {
  it('renders the exact value with the asset precision', () => {
    expect(exactAmount(9663317768717496, 6)).toBe('9,663,317,768.717496');
    expect(exactAmount(350, 0)).toBe('350');
  });
});
