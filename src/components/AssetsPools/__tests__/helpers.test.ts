import { IAssetPoolRow } from '@/types';
import {
  formatRate,
  getPoolRate,
  hasSeparateAdmin,
  summarizePools,
} from '../helpers';

const pool = (overrides: Partial<IAssetPoolRow> = {}): IAssetPoolRow =>
  ({
    ownerAddress: 'klv1owner',
    adminAddress: 'klv1owner',
    kda: 'TEST-1234',
    active: true,
    klvBalance: 0,
    kdaBalance: 0,
    convertedFees: 0,
    fRatioKLV: 1000000,
    fRatioKDA: 1000000,
    hidden: false,
    verified: false,
    ratio: 1,
    ...overrides,
  }) as IAssetPoolRow;

describe('getPoolRate', () => {
  it('matches the raw ratio when the asset shares KLV precision', () => {
    // BLOCK-31F6 on mainnet: precision 6, raw ratio 0.2.
    expect(getPoolRate(1000000, 200000, 6)).toBeCloseTo(0.2);
    expect(getPoolRate(1000000, 1000000, 6)).toBe(1);
  });

  it('corrects the raw ratio for assets with another precision', () => {
    // BPGOK-1OPP: precision 8, API ratio says 100000, really 1000 per KLV.
    expect(getPoolRate(1000000, 100000000000, 8)).toBe(1000);
    // CCB-1R4R: precision 3, API ratio says 0.01, really 10 per KLV.
    expect(getPoolRate(1000000, 10000, 3)).toBe(10);
    // CFL-16IP: precision 2, API ratio says 0.0001, really 1 per KLV.
    expect(getPoolRate(1000000, 100, 2)).toBe(1);
  });

  it('returns nothing without a precision or a usable KLV side', () => {
    expect(getPoolRate(1000000, 100, undefined)).toBeUndefined();
    expect(getPoolRate(0, 100, 6)).toBeUndefined();
  });
});

describe('formatRate', () => {
  it('groups large rates and keeps small ones readable', () => {
    expect(formatRate(1000)).toBe('1,000');
    expect(formatRate(1)).toBe('1');
    expect(formatRate(0.2)).toBe('0.2');
    expect(formatRate(0.000033)).toBe('0.000033');
  });

  it('floors rates below the last shown decimal', () => {
    expect(formatRate(0.0000001)).toBe('<0.000001');
  });

  it('handles zero and missing rates', () => {
    expect(formatRate(0)).toBe('0');
    expect(formatRate(undefined)).toBe('--');
    expect(formatRate(NaN)).toBe('--');
  });
});

describe('hasSeparateAdmin', () => {
  it('only reports an admin that differs from the owner', () => {
    expect(hasSeparateAdmin(pool())).toBe(false);
    expect(hasSeparateAdmin(pool({ adminAddress: 'klv1admin' }))).toBe(true);
    expect(hasSeparateAdmin(pool({ adminAddress: '' }))).toBe(false);
  });
});

describe('summarizePools', () => {
  it('counts pools and sums only the KLV reserves', () => {
    const summary = summarizePools([
      pool({ klvBalance: 928000, kdaBalance: 0 }),
      pool({ klvBalance: 1521351804, kdaBalance: 9797001599 }),
      pool({ klvBalance: 0, active: false, kdaBalance: 5 }),
    ]);
    expect(summary.total).toBe(3);
    expect(summary.active).toBe(2);
    expect(summary.klvReserves).toBeCloseTo(1522.279804);
  });

  it('handles an empty pool set', () => {
    expect(summarizePools([])).toEqual({
      total: 0,
      active: 0,
      klvReserves: 0,
    });
  });
});
