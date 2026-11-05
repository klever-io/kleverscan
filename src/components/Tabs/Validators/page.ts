import { IBlockValidatorRow } from './row';

export interface IKnownValidator {
  name?: string;
  ownerAddress: string;
}

export interface IBlockValidatorPage {
  rows: IBlockValidatorRow[];
  pagination: {
    self: number;
    next: number;
    previous: number;
    perPage: number;
    totalPages: number;
    totalRecords: number;
  };
}

/**
 * One page of a block's validator keys. The block leader stays on page 1.
 * Every other key keeps the chain's order. A key the directory does not
 * know stays in place and is not marked as the leader.
 */
export const buildBlockValidatorPage = (
  validators: readonly string[],
  producerOwnerAddress: string | undefined,
  byKey: ReadonlyMap<string, IKnownValidator>,
  page: number,
  limit: number,
): IBlockValidatorPage => {
  const leaderFirst = producerOwnerAddress
    ? [
        ...validators.filter(
          key =>
            byKey.get(key.toLowerCase())?.ownerAddress === producerOwnerAddress,
        ),
        ...validators.filter(
          key =>
            byKey.get(key.toLowerCase())?.ownerAddress !== producerOwnerAddress,
        ),
      ]
    : validators;
  const start = (page - 1) * limit;
  const totalPages = limit > 0 ? Math.ceil(leaderFirst.length / limit) : 0;
  const rows: IBlockValidatorRow[] = leaderFirst
    .slice(start, start + limit)
    .map(blsKey => {
      const known = byKey.get(blsKey.toLowerCase());
      return {
        blsKey,
        name: known?.name,
        ownerAddress: known?.ownerAddress,
        leader:
          !!producerOwnerAddress &&
          known?.ownerAddress === producerOwnerAddress,
      };
    });
  return {
    rows,
    pagination: {
      self: page,
      next: page < totalPages ? page + 1 : 0,
      previous: page > 1 ? page - 1 : 0,
      perPage: limit,
      totalPages,
      totalRecords: validators.length,
    },
  };
};
