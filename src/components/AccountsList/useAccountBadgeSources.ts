import type { ValidatorOwners } from '@/services/requests/accounts';
import { useDeferred } from '@/components/DataList/useDeferred';
import { useQuery } from '@tanstack/react-query';
import { genesisTimestampQuery, validatorOwnersQuery } from './badgeQueries';

export interface IAccountBadgeSources {
  owners: ValidatorOwners | undefined;
  genesisTimestamp: number | undefined;
}

export const useAccountBadgeSources = (
  /** Skips the wait. A filtered list resolves these itself before it has rows,
   *  so deferring there only delays badges the reader is already looking at. */
  eager = false,
): IAccountBadgeSources => {
  const tableSettled = useDeferred();

  // Runs with the table: one 5KB request feeding the only badge that shows on
  // page one.
  const { data: genesisTimestamp } = useQuery(genesisTimestampQuery);

  // Waits: three requests, 58.5KB over the wire, feeding badges that appear 8
  // times in the top 500 and never on the first page.
  const { data: owners } = useQuery({
    ...validatorOwnersQuery,
    enabled: eager || tableSettled,
  });

  return {
    owners: owners ?? undefined,
    genesisTimestamp: genesisTimestamp ?? undefined,
  };
};
