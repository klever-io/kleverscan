import { IAsset } from '@/types';
import {
  formatHolderPercentage,
  getCirculatingSupply,
  hasVoidSupply,
} from '../voidSupply';

const asset = (fields: Partial<IAsset>): IAsset =>
  ({ assetId: 'TOKEN-1234', circulatingSupply: 1000, ...fields }) as IAsset;

describe('hasVoidSupply', () => {
  it('is true when the API reports both fields', () => {
    expect(
      hasVoidSupply(asset({ voidedSupply: 0, netCirculatingSupply: 1000 })),
    ).toBe(true);
  });

  it('is false when an older API build omits them', () => {
    expect(hasVoidSupply(asset({}))).toBe(false);
  });

  it('is false when only one of the two is present', () => {
    expect(hasVoidSupply(asset({ voidedSupply: 250 }))).toBe(false);
  });

  it('is false without an asset', () => {
    expect(hasVoidSupply(undefined)).toBe(false);
  });
});

describe('getCirculatingSupply', () => {
  it('uses the void-adjusted supply when the API reports it', () => {
    expect(
      getCirculatingSupply(
        asset({ voidedSupply: 250, netCirculatingSupply: 750 }),
      ),
    ).toBe(750);
  });

  it('uses the adjusted supply even when it is zero', () => {
    expect(
      getCirculatingSupply(
        asset({ voidedSupply: 1000, netCirculatingSupply: 0 }),
      ),
    ).toBe(0);
  });

  it('falls back to the raw supply when the fields are absent', () => {
    expect(getCirculatingSupply(asset({}))).toBe(1000);
  });
});

describe('formatHolderPercentage', () => {
  it('formats the share of total supply with two decimals', () => {
    expect(formatHolderPercentage(250, 1000)).toBe('25.00%');
  });

  it('gives the void address a real share, since it is measured against the total supply', () => {
    // BLOCK-31F6 holds 97.9% of its supply in the void.
    expect(formatHolderPercentage(9790000, 10000000)).toBe('97.90%');
  });

  it('returns a placeholder instead of dividing by a zero supply', () => {
    expect(formatHolderPercentage(250, 0)).toBe('--');
  });

  it('returns a placeholder for a negative supply', () => {
    expect(formatHolderPercentage(250, -10)).toBe('--');
  });
});
