import {
  getInputType,
  normalizeSearchQuery,
  SEARCH_ENTITY_LABELS,
} from '../getInputType';

describe('normalizeSearchQuery', () => {
  it('trims and strips whitespace', () => {
    expect(normalizeSearchQuery('  ab  cd  ')).toBe('abcd');
  });

  it('strips 0x prefix case-insensitively', () => {
    expect(normalizeSearchQuery('0xabc')).toBe('abc');
    expect(normalizeSearchQuery('0XABC')).toBe('ABC');
  });

  it('returns empty for blank input', () => {
    expect(normalizeSearchQuery('   ')).toBe('');
  });
});

describe('getInputType', () => {
  it('returns undefined for empty input', () => {
    expect(getInputType('')).toBeUndefined();
    expect(getInputType('   ')).toBeUndefined();
  });

  it('detects block height for positive decimal', () => {
    expect(getInputType('100')).toBe('block');
    expect(getInputType('1')).toBe('block');
  });

  it('does not treat zero as a block', () => {
    expect(getInputType('0')).not.toBe('block');
  });

  it('detects smart contracts with qqqqqqqqqqqqq marker', () => {
    expect(
      getInputType('klv1qqqqqqqqqqqqqpgqexamplecontractaddressxxxxxxxx'),
    ).toBe('smartContract');
  });

  it('detects 64-char hex as transaction', () => {
    const hash = 'a'.repeat(64);
    expect(getInputType(hash)).toBe('transaction');
    expect(getInputType(`0x${hash}`)).toBe('transaction');
  });

  it('detects partial hex (48–66) as transaction', () => {
    expect(getInputType('ab'.repeat(24))).toBe('transaction'); // 48
  });

  it('detects full-length bech32 account', () => {
    const addr =
      'klv1nnu8d0mcqnxunqyy5tc7kj7vqtp4auy4a24gv35fn58n2qytl9xsx7wsjl';
    expect(addr.length).toBe(62);
    expect(getInputType(addr)).toBe('account');
  });

  it('returns undefined for partial klv1 addresses (Spotlight typeahead)', () => {
    expect(getInputType('klv1nnu8d0mcq')).toBeUndefined();
  });

  it('detects KLV and KFI as assets', () => {
    expect(getInputType('KLV')).toBe('asset');
    expect(getInputType('kfi')).toBe('asset');
  });

  it('detects short tickers as assets', () => {
    expect(getInputType('USDT')).toBe('asset');
    expect(getInputType('ABC')).toBe('asset');
  });

  it('exposes entity labels for all types', () => {
    expect(SEARCH_ENTITY_LABELS.block).toBe('Block');
    expect(SEARCH_ENTITY_LABELS.asset).toBe('Asset');
    expect(Object.keys(SEARCH_ENTITY_LABELS)).toHaveLength(5);
  });
});
