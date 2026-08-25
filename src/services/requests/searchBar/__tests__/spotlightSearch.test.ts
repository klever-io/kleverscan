jest.mock('@/utils/parseValues', () => ({
  parseAddress: (addr: string, len = 18) => {
    if (!addr || addr.length <= len) return addr;
    return `${addr.slice(0, Math.floor(len / 2))}…${addr.slice(-Math.floor(len / 2))}`;
  },
}));

const mockGet = jest.fn();

jest.mock('@/services/api', () => ({
  __esModule: true,
  default: { get: (...args: unknown[]) => mockGet(...args) },
}));

import {
  fetchSpotlightSearch,
  hrefForSpotlightItem,
  toDisplayItem,
  typeLabelForSpotlight,
  SpotlightApiItem,
} from '../spotlightSearch';

describe('typeLabelForSpotlight', () => {
  it('maps known types', () => {
    expect(typeLabelForSpotlight('asset')).toBe('Asset');
    expect(typeLabelForSpotlight('smartContract')).toBe('Smart Contract');
    expect(typeLabelForSpotlight('proposal')).toBe('Proposal');
  });

  it('falls back for unknown types', () => {
    expect(typeLabelForSpotlight('weird')).toBe('weird');
  });
});

describe('hrefForSpotlightItem', () => {
  it('prefers server href', () => {
    expect(
      hrefForSpotlightItem({
        type: 'asset',
        id: 'KLV',
        href: '/custom/path',
      }),
    ).toBe('/custom/path');
  });

  it('maps block by nonce', () => {
    expect(
      hrefForSpotlightItem({
        type: 'block',
        id: 'abc',
        block: { nonce: 42 },
      }),
    ).toBe('/block/42');
  });

  it('maps common entity paths', () => {
    expect(
      hrefForSpotlightItem({ type: 'asset', id: 'KLV' }),
    ).toBe('/asset/KLV');
    expect(
      hrefForSpotlightItem({ type: 'proposal', id: '28' }),
    ).toBe('/proposal/28');
    expect(
      hrefForSpotlightItem({ type: 'transaction', id: 'h'.repeat(64) }),
    ).toBe(`/transaction/${'h'.repeat(64)}`);
  });
});

describe('toDisplayItem', () => {
  it('renders verified assets with name and ticker', () => {
    const item: SpotlightApiItem = {
      type: 'asset',
      id: 'KLV',
      href: '/asset/KLV',
      asset: {
        assetId: 'KLV',
        name: 'Klever',
        ticker: 'KLV',
        logo: 'https://example.com/klv.png',
        verified: true,
      },
    };
    const display = toDisplayItem(item);
    expect(display.title).toBe('Klever');
    expect(display.subtitle).toContain('KLV');
    expect(display.verified).toBe(true);
    expect(display.logo).toContain('example.com');
    expect(display.typeLabel).toBe('Asset');
  });

  it('uses Proposal #id as title and description as subtitle', () => {
    const long =
      'A very long governance proposal description that should be truncated when it exceeds seventy two characters of text';
    const item: SpotlightApiItem = {
      type: 'proposal',
      id: '19',
      proposal: {
        proposalId: 19,
        description: long,
        proposalStatus: 'DeniedProposal',
      },
    };
    const display = toDisplayItem(item);
    expect(display.title).toBe('Proposal #19');
    expect(display.subtitle).toContain('DeniedProposal');
    expect(display.subtitle.length).toBeLessThanOrEqual(
      'DeniedProposal · '.length + 72,
    );
    expect(display.completeValue).toBe('19');
  });

  it('renders block title and truncated hash', () => {
    const hash = 'a'.repeat(64);
    const display = toDisplayItem({
      type: 'block',
      id: '100',
      block: { nonce: 100, hash },
    });
    expect(display.title).toBe('Block #100');
    expect(display.subtitle).toContain('…');
    expect(display.completeValue).toBe('100');
    expect(display.href).toBe('/block/100');
  });

  it('renders epoch', () => {
    const display = toDisplayItem({
      type: 'epoch',
      id: '1',
      epoch: { epoch: 1 },
    });
    expect(display.title).toBe('Epoch #1');
    expect(display.typeLabel).toBe('Epoch');
  });

  it('renders smart contract with name and tx count', () => {
    const addr =
      'klv1qqqqqqqqqqqqqpgqexamplecontractaddressxxxxxxxxxxxxxxxx';
    const display = toDisplayItem({
      type: 'smartContract',
      id: addr,
      smartContract: {
        contractAddress: addr,
        name: 'SwapRouter',
        totalTransactions: 1200,
      },
    });
    expect(display.title).toBe('SwapRouter');
    expect(display.subtitle).toContain('1,200 txs');
  });

  it('falls back to legacy title/subtitle', () => {
    const display = toDisplayItem({
      type: 'asset',
      id: 'X',
      title: 'Legacy Title',
      subtitle: 'Legacy Sub',
    });
    expect(display.title).toBe('Legacy Title');
    expect(display.subtitle).toBe('Legacy Sub');
  });
});

describe('fetchSpotlightSearch', () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  it('returns empty without calling API for blank query', async () => {
    const res = await fetchSpotlightSearch('  ');
    expect(res.suggestions).toEqual([]);
    expect(mockGet).not.toHaveBeenCalled();
  });

  it('maps API success payload', async () => {
    mockGet.mockResolvedValue({
      data: {
        query: 'KLV',
        bestMatch: { type: 'asset', id: 'KLV' },
        suggestions: [{ type: 'asset', id: 'KFI' }],
        counts: { asset: 2 },
      },
      error: '',
    });

    const res = await fetchSpotlightSearch('KLV', { limit: 12 });
    expect(res.bestMatch?.id).toBe('KLV');
    expect(res.suggestions).toHaveLength(1);
    expect(res.counts.asset).toBe(2);
    expect(res.unavailable).toBeUndefined();
    expect(mockGet).toHaveBeenCalledWith(
      expect.objectContaining({
        route: expect.stringContaining('search?q=KLV'),
        tries: 1,
      }),
    );
  });

  it('marks unavailable when API returns error', async () => {
    mockGet.mockResolvedValue({
      data: null,
      error: 'not found',
    });

    const res = await fetchSpotlightSearch('KLV');
    expect(res.unavailable).toBe(true);
    expect(res.suggestions).toEqual([]);
    expect(res.bestMatch).toBeNull();
  });

  it('marks unavailable on thrown network error', async () => {
    mockGet.mockRejectedValue(new Error('network'));
    const res = await fetchSpotlightSearch('KLV');
    expect(res.unavailable).toBe(true);
  });

  it('forwards types filter in query string', async () => {
    mockGet.mockResolvedValue({
      data: { query: '1', suggestions: [], counts: {} },
      error: '',
    });
    await fetchSpotlightSearch('1', { types: ['block'], limit: 5 });
    expect(mockGet).toHaveBeenCalledWith(
      expect.objectContaining({
        route: expect.stringMatching(/types=block/),
      }),
    );
    expect(mockGet.mock.calls[0][0].route).toMatch(/limit=5/);
  });
});
