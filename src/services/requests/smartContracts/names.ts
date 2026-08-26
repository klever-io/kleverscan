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
 * Answers null rather than throwing for a contract without a name or an
 * address the node does not know. The name decorates a link that already
 * works without it, so a failure here must never surface as an error.
 */
export const smartContractNameCall = async (
  address: string,
): Promise<string | null> => {
  if (!address) return null;

  try {
    const response = await api.get({
      route: `sc/${encodeURIComponent(address)}`,
      // One attempt, against api.get's default of three with a 500ms gap.
      // Measured on mainnet, 3 of 9 contracts on a single page answer 500
      // here, and retrying each of them twice more spends nine requests over
      // a second and a half on a decoration the row does not need.
      tries: 1,
    });
    if (response?.error) return null;
    return response?.data?.sc?.name || null;
  } catch (error) {
    return null;
  }
};
