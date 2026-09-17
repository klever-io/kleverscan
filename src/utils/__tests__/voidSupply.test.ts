import { IAsset } from '@/types';
import {
  getCirculatingSupply,
  hasVoidSupply,
  voidRowState,
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

describe('voidRowState', () => {
  it('is loading while there is no asset yet, so the rows keep a skeleton', () => {
    expect(voidRowState(undefined)).toBe('loading');
  });

  it('is ready when the API reports both figures', () => {
    expect(
      voidRowState(asset({ voidedSupply: 250, netCirculatingSupply: 750 })),
    ).toBe('ready');
  });

  // Zero is a real answer: an asset whose entire supply sits on the void
  // address still has a circulating supply, and it is 0.
  it('is ready when the net supply is zero', () => {
    expect(
      voidRowState(asset({ voidedSupply: 1000, netCirculatingSupply: 0 })),
    ).toBe('ready');
  });

  it('is hidden for a loaded asset from an API build without the fields', () => {
    expect(voidRowState(asset({}))).toBe('hidden');
  });

  it('is hidden when only one of the two figures is reported', () => {
    expect(voidRowState(asset({ voidedSupply: 250 }))).toBe('hidden');
    expect(voidRowState(asset({ netCirculatingSupply: 750 }))).toBe('hidden');
  });
});
