import api from '@/services/api';

/**
 * A contract's own name, for lists that would otherwise show nothing but a
 * bech32 address.
 *
 * Only the single-contract endpoint carries the name: `sc/list` returns the
 * deployer, the timestamps and the transaction count, but no name at all, so
 * a list cannot be resolved in one request and each address is asked for on
 * its own. That is cheaper than it sounds, because a page of transactions
 * repeats the same few contracts: measured on mainnet, 300 consecutive
 * contract calls came from 12 distinct addresses.
 *
 * Roughly one contract in eight is named, but the named ones are the busy
 * ones: those same 300 calls were three quarters covered by three names.
 */

/** Names change only when a contract is redeployed under the same address. */
export const CONTRACT_NAME_STALE_TIME = 60 * 60 * 1000;

export const contractNameQueryKey = (address: string): [string, string] => [
  'smartContractName',
  address,
];

/**
 * The contract's name, or null when it genuinely has none. A failed lookup
 * throws instead of answering null: null is a settled answer good for the
 * hour, an error is not, and collapsing the two left busy contracts unnamed
 * for the rest of the session.
 */
export const smartContractNameCall = async (
  address: string,
): Promise<string | null> => {
  if (!address) return null;

  const response = await api.get({
    route: `sc/${encodeURIComponent(address)}`,
    // One attempt, against api.get's default of three with a 500ms gap:
    // measured on mainnet, 3 of 9 contracts on a single page answer 500 here,
    // and retrying each twice more spends nine requests over a second and a
    // half on a decoration the row does not need.
    tries: 1,
  });
  if (response?.error) throw new Error('contract name unavailable');
  // `||`, not `??`: a contract that carries an empty name has no name, and the
  // caller renders the address instead. `??` would hand it an empty string.
  return response?.data?.sc?.name || null;
};
