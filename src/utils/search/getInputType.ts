export type SearchEntityType =
  | 'block'
  | 'smartContract'
  | 'transaction'
  | 'account'
  | 'asset';

/**
 * Normalize free-text search: trim, drop whitespace/newlines, strip 0x.
 */
export const normalizeSearchQuery = (value: string): string =>
  value.trim().replace(/\s+/g, '').replace(/^0x/i, '');

const isHex = (value: string): boolean => /^[0-9a-fA-F]+$/.test(value);

/**
 * Infer explorer entity type from a free-text search string.
 * Shared by header search tooltip and Spotlight (Cmd+K).
 */
export const getInputType = (value: string): SearchEntityType | undefined => {
  const trimmed = normalizeSearchQuery(value);
  if (!trimmed) return undefined;

  const addressLength = 62;
  const txLength = 64;

  // Block height (decimal only)
  if (/^\d+$/.test(trimmed) && Number(trimmed) !== 0) {
    return 'block';
  }

  if (trimmed.includes('qqqqqqqqqqqqq')) {
    return 'smartContract';
  }

  // Transaction hash: Klever uses 64 hex chars. Also accept nearby lengths so
  // slightly incomplete pastes still hit the API instead of a dead-end message.
  if (isHex(trimmed) && trimmed.length === txLength) {
    return 'transaction';
  }
  if (isHex(trimmed) && trimmed.length >= 48 && trimmed.length <= 66) {
    return 'transaction';
  }

  if (trimmed.length === addressLength && !trimmed.includes('qqqqqqqqqqqqq')) {
    return 'account';
  }

  // Partial bech32 addresses (klv1…) — not an asset ticker. Exact lookup only
  // works at full length; Spotlight handles typeahead separately.
  if (/^klv1[a-z0-9]*$/i.test(trimmed) && trimmed.length < addressLength) {
    return undefined;
  }

  if (trimmed.toUpperCase() === 'KLV' || trimmed.toUpperCase() === 'KFI') {
    return 'asset';
  }

  // Short tickers / symbols — do not treat klv1… prefixes as assets
  if (trimmed.length <= 15 && !trimmed.toLowerCase().startsWith('klv')) {
    return 'asset';
  }

  return undefined;
};

export const SEARCH_ENTITY_LABELS: Record<SearchEntityType, string> = {
  block: 'Block',
  smartContract: 'Smart Contract',
  transaction: 'Transaction',
  account: 'Account',
  asset: 'Asset',
};
