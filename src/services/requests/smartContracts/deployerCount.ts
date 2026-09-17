import api from '@/services/api';

/**
 * How many contracts one address has deployed.
 *
 * There is no aggregate endpoint for this, so the count comes from the total
 * record count of the deployer-filtered list. `limit: 1` because only
 * `pagination.totalRecords` is read: the unlimited call ships a full page of
 * rows for one number.
 *
 * Cheap in practice because deployers repeat: measured on mainnet, 207
 * contracts came from 33 distinct deployers, and the two busiest cover 75 of
 * the rows. React Query deduplicates by address, so a page asks once per
 * deployer rather than once per row.
 */

/** A deployer's contract count changes only when it deploys another one. */
export const DEPLOYER_COUNT_STALE_TIME = 60 * 60 * 1000;

export const deployerCountQueryKey = (deployer: string): [string, string] => [
  'smartContractDeployerCount',
  deployer,
];

export const deployerContractCountCall = async (
  deployer: string,
): Promise<number | null> => {
  if (!deployer) return null;

  const response = await api.get({
    route: 'sc/list',
    query: { deployer, limit: 1 },
    // One attempt, like the name lookup beside it: this is a decoration on a
    // row that reads fine without it, and a page can fire several at once.
    tries: 1,
  });
  if (response?.error) throw new Error('deployer count unavailable');

  const total = response?.pagination?.totalRecords;
  // A count is only usable as a whole number: the cell prints it and the link
  // beside it is suppressed at 1, so a fraction or a NaN would do both wrong.
  return Number.isInteger(total) && total >= 0 ? total : null;
};
