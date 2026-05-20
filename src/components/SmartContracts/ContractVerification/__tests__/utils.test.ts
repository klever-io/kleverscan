import { isSafeUrl, buildBlockchainVersions } from '../utils';

describe('isSafeUrl', () => {
  it.each([
    ['https://example.com', true],
    ['http://example.com', true],
    ['javascript:alert(1)', false],
    ['data:text/html,<h1>hi</h1>', false],
    ['ftp://files.example.com', false],
    ['not-a-url', false],
    ['', false],
  ])('isSafeUrl(%s) → %s', (url, expected) => {
    expect(isSafeUrl(url)).toBe(expected);
  });
});

describe('buildBlockchainVersions', () => {
  it('returns empty array when scData is undefined', () => {
    expect(buildBlockchainVersions(undefined)).toEqual([]);
  });

  it('returns empty array when deployTxHash is missing', () => {
    expect(buildBlockchainVersions({} as any)).toEqual([]);
  });

  it('returns deploy entry only when there are no upgrades', () => {
    const result = buildBlockchainVersions({
      deployTxHash: 'abc123',
      timestamp: 1700000000,
      upgrades: [],
    } as any);
    expect(result).toHaveLength(1);
    expect(result[0].txHash).toBe('abc123');
    expect(result[0].label).toMatch(/Deploy/);
  });

  it('lists upgrades in reverse order before the deploy entry', () => {
    const result = buildBlockchainVersions({
      deployTxHash: 'deploy',
      timestamp: 1700000000,
      upgrades: [
        { upgradeTxHash: 'up1', timestamp: 1700001000 },
        { upgradeTxHash: 'up2', timestamp: 1700002000 },
      ],
    } as any);
    expect(result).toHaveLength(3);
    expect(result[0].txHash).toBe('up2');
    expect(result[1].txHash).toBe('up1');
    expect(result[2].txHash).toBe('deploy');
  });
});
