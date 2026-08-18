import { IAsset } from '@/types';
import { getCirculatingSupply, hasVoidSupply } from '../voidSupply';

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
