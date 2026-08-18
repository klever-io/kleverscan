import api from '@/services/api';
import { parseAddress } from '@/utils/parseValues';

/**
 * Matches klever-proxy-go data.Spotlight* (GET /v1.0/search).
 * Server returns structured per-type payloads; client owns presentation.
 */
export type SpotlightApiType =
  | 'asset'
  | 'account'
  | 'validator'
  | 'block'
  | 'transaction'
  | 'epoch'
  | 'proposal'
  | 'smartContract';

export type SpotlightAssetData = {
  assetId?: string;
  name?: string;
  ticker?: string;
  logo?: string;
  assetType?: string;
  precision?: number;
  verified?: boolean;
};

export type SpotlightAccountData = {
  address?: string;
  name?: string;
  balance?: number;
  frozenBalance?: number;
};

export type SpotlightValidatorData = {
  ownerAddress?: string;
  name?: string;
  logo?: string;
  list?: string;
  totalStake?: number;
  commission?: number;
  rating?: number;
  canDelegate?: boolean;
};

export type SpotlightBlockData = {
  nonce?: number;
  hash?: string;
  timestamp?: number;
  epoch?: number;
  txCount?: number;
};

export type SpotlightTransactionData = {
  hash?: string;
  status?: string;
  sender?: string;
  to?: string;
  amount?: number;
  assetId?: string;
  blockNum?: number;
  timestamp?: number;
};

export type SpotlightEpochData = {
  epoch?: number;
  timestamp?: number;
};

export type SpotlightProposalData = {
  proposalId?: number;
  description?: string;
  proposalStatus?: string;
  proposer?: string;
  epochStart?: number;
  epochEnd?: number;
  parameters?: Record<string, string>;
};

export type SpotlightSmartContractData = {
  contractAddress?: string;
  name?: string;
  deployer?: string;
  totalTransactions?: number;
};

export type SpotlightApiItem = {
  type: SpotlightApiType | string;
  id: string;
  score?: number;
  href?: string;
  /** @deprecated Presentation fields — prefer typed nested payloads. */
  title?: string;
  subtitle?: string;
  logo?: string;
  asset?: SpotlightAssetData;
  account?: SpotlightAccountData;
  validator?: SpotlightValidatorData;
  block?: SpotlightBlockData;
  transaction?: SpotlightTransactionData;
  epoch?: SpotlightEpochData;
  proposal?: SpotlightProposalData;
  smartContract?: SpotlightSmartContractData;
};

export type SpotlightSearchResponse = {
  query: string;
  bestMatch?: SpotlightApiItem | null;
  suggestions: SpotlightApiItem[];
  counts: Record<string, number>;
};

export type SpotlightSearchResult = {
  query: string;
  bestMatch: SpotlightApiItem | null;
  suggestions: SpotlightApiItem[];
  counts: Record<string, number>;
  /** True when the request failed (network / 4xx / 5xx) — distinct from empty hits. */
  unavailable?: boolean;
};

/** UI-ready row derived from a server hit. */
export type SpotlightDisplayItem = {
  type: string;
  id: string;
  title: string;
  subtitle: string;
  href: string;
  typeLabel: string;
  completeValue: string;
  logo?: string;
  logoTicker?: string;
  logoName?: string;
  verified?: boolean;
};

const emptyResult = (
  query: string,
  opts?: { unavailable?: boolean },
): SpotlightSearchResult => ({
  query,
  bestMatch: null,
  suggestions: [],
  counts: {},
  unavailable: opts?.unavailable,
});

const KLV_PRECISION = 6;

const formatBalance = (raw?: number, precision = KLV_PRECISION): string => {
  if (raw === undefined || raw === null || Number.isNaN(raw)) return '';
  const value = raw / 10 ** precision;
  return `${value.toLocaleString(undefined, {
    maximumFractionDigits: Math.min(precision, 4),
  })} KLV`;
};

const truncateMiddle = (s: string, head = 10, tail = 8): string => {
  if (!s || s.length <= head + tail + 3) return s;
  return `${s.slice(0, head)}…${s.slice(-tail)}`;
};

/**
 * Global server-side spotlight search.
 * Falls back to empty results when the endpoint errors so UI stays usable.
 */
export const fetchSpotlightSearch = async (
  q: string,
  options?: { types?: string[]; limit?: number },
): Promise<SpotlightSearchResult> => {
  const query = q.trim();
  if (!query) return emptyResult('');

  const params = new URLSearchParams();
  params.set('q', query);
  if (options?.types?.length) {
    params.set('types', options.types.join(','));
  }
  if (options?.limit !== undefined) {
    params.set('limit', String(options.limit));
  }

  try {
    // tries:1 — default api.get retries 3× with 500ms gaps (~2–4s) on 404/errors.
    // Search is typeahead; fail fast rather than spin on missing route.
    const res = await api.get({
      route: `search?${params.toString()}`,
      tries: 1,
    });

    if (res?.error && res.error !== '') {
      return emptyResult(query, { unavailable: true });
    }

    const data = (res?.data || {}) as SpotlightSearchResponse;
    return {
      query: data.query || query,
      bestMatch: data.bestMatch ?? null,
      suggestions: Array.isArray(data.suggestions) ? data.suggestions : [],
      counts: data.counts || {},
    };
  } catch {
    return emptyResult(query, { unavailable: true });
  }
};

export const typeLabelForSpotlight = (type: string): string => {
  switch (type) {
    case 'asset':
      return 'Asset';
    case 'account':
      return 'Account';
    case 'validator':
      return 'Validator';
    case 'block':
      return 'Block';
    case 'transaction':
      return 'Transaction';
    case 'epoch':
      return 'Epoch';
    case 'proposal':
      return 'Proposal';
    case 'smartContract':
      return 'Smart Contract';
    default:
      return type || 'Result';
  }
};

/** Prefer server href; fall back to type/id mapping. */
export const hrefForSpotlightItem = (item: SpotlightApiItem): string => {
  if (item.href) return item.href;

  const id = item.id;
  switch (item.type) {
    case 'asset':
      return `/asset/${id}`;
    case 'account':
      return `/account/${id}`;
    case 'validator':
      return `/validator/${id}`;
    case 'transaction':
      return `/transaction/${id}`;
    case 'proposal':
      return `/proposal/${id}`;
    case 'smartContract':
      return `/smart-contract/${id}`;
    case 'block': {
      const nonce = item.block?.nonce;
      if (nonce !== undefined) return `/block/${nonce}`;
      if (/^\d+$/.test(id)) return `/block/${id}`;
      return `/block/${id}`;
    }
    case 'epoch':
      return `/blocks`;
    default:
      return '/';
  }
};

/** Build title/subtitle/logo for the Spotlight UI from nested payloads. */
export const toDisplayItem = (item: SpotlightApiItem): SpotlightDisplayItem => {
  const type = item.type || 'result';
  const typeLabel = typeLabelForSpotlight(type);
  const href = hrefForSpotlightItem(item);
  const base = {
    type,
    id: item.id,
    href,
    typeLabel,
    completeValue: item.id,
  };

  if (type === 'asset' && item.asset) {
    const a = item.asset;
    const name = (a.name || '').trim();
    const ticker = (a.ticker || '').trim();
    const assetId = a.assetId || item.id;
    const title = name || ticker || assetId;
    const subtitle =
      ticker && ticker !== name ? `${ticker} · ${assetId}` : assetId;
    return {
      ...base,
      title,
      subtitle,
      logo: a.logo || '',
      logoTicker: ticker || assetId,
      logoName: title,
      verified: a.verified,
    };
  }

  if (type === 'account' && item.account) {
    const a = item.account;
    const addr = a.address || item.id;
    const name = (a.name || '').trim();
    const title = name && name !== addr ? name : parseAddress(addr, 18) || addr;
    const bal = formatBalance(a.balance);
    const subtitle = bal
      ? `${parseAddress(addr, 12)} · ${bal}`
      : parseAddress(addr, 18) || addr;
    return {
      ...base,
      title,
      subtitle,
      completeValue: addr,
    };
  }

  if (type === 'validator' && item.validator) {
    const v = item.validator;
    const addr = v.ownerAddress || item.id;
    const name = (v.name || '').trim();
    const title = name || parseAddress(addr, 18) || addr;
    const list = (v.list || '').trim();
    const stake = formatBalance(v.totalStake);
    const parts = [list, stake].filter(Boolean);
    const subtitle =
      parts.length > 0 ? parts.join(' · ') : parseAddress(addr, 18) || addr;
    return {
      ...base,
      title,
      subtitle,
      logo: v.logo || '',
      logoTicker: (name || 'V').slice(0, 3),
      logoName: title,
      completeValue: addr,
    };
  }

  if (type === 'block' && item.block) {
    const b = item.block;
    const nonce = b.nonce ?? item.id;
    const title = `Block #${nonce}`;
    const subtitle = b.hash ? truncateMiddle(b.hash) : `nonce ${nonce}`;
    return {
      ...base,
      title,
      subtitle,
      completeValue: String(nonce),
      href: item.href || `/block/${nonce}`,
    };
  }

  if (type === 'transaction' && item.transaction) {
    const t = item.transaction;
    const hash = t.hash || item.id;
    const title = truncateMiddle(hash);
    const parts = [t.status, t.assetId].filter(Boolean);
    const subtitle = parts.length ? parts.join(' · ') : 'Transaction';
    return {
      ...base,
      title,
      subtitle,
      completeValue: hash,
    };
  }

  if (type === 'epoch' && item.epoch) {
    const e = item.epoch.epoch ?? item.id;
    return {
      ...base,
      title: `Epoch #${e}`,
      subtitle: 'Epoch',
      completeValue: String(e),
    };
  }

  if (type === 'proposal' && item.proposal) {
    const p = item.proposal;
    const id = p.proposalId ?? item.id;
    const desc = (p.description || '').trim();
    // Stable title (id); description is secondary so long text does not dominate.
    const title = `Proposal #${id}`;
    const status = (p.proposalStatus || '').trim();
    const shortDesc = desc.length > 72 ? `${desc.slice(0, 69)}…` : desc;
    const subtitle = [status, shortDesc].filter(Boolean).join(' · ') || title;
    return {
      ...base,
      title,
      subtitle,
      completeValue: String(id),
    };
  }

  if (type === 'smartContract' && item.smartContract) {
    const sc = item.smartContract;
    const addr = sc.contractAddress || item.id;
    const name = (sc.name || '').trim();
    const title = name || parseAddress(addr, 18) || addr;
    const txs =
      sc.totalTransactions !== undefined
        ? `${sc.totalTransactions.toLocaleString()} txs`
        : '';
    const subtitle = [parseAddress(addr, 14), txs].filter(Boolean).join(' · ');
    return {
      ...base,
      title,
      subtitle: subtitle || 'Smart contract',
      completeValue: addr,
    };
  }

  // Legacy flat title/subtitle if still returned
  return {
    ...base,
    title: item.title || item.id,
    subtitle: item.subtitle || typeLabel,
    logo: item.logo,
    logoTicker: item.title?.slice(0, 3),
    logoName: item.title,
  };
};
