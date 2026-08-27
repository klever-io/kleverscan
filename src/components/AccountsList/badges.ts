import type { ValidatorOwners } from '@/services/requests/accounts';
import { toMilliseconds } from '@/utils/timeFunctions';

export const isFoundationAccount = (
  accountTimestamp: number | undefined,
  genesisTimestamp: number | undefined,
): boolean => {
  if (
    !Number.isFinite(accountTimestamp) ||
    !Number.isFinite(genesisTimestamp)
  ) {
    return false;
  }
  return (
    toMilliseconds(accountTimestamp as number) ===
    toMilliseconds(genesisTimestamp as number)
  );
};

export interface IAccountBadges {
  foundation: boolean;
  validator: boolean;
  genesisValidator: boolean;
  /** `elected`, `eligible`, `jailed`; empty when not a validator. */
  validatorList: string;
}

export const accountBadges = (
  address: string,
  accountTimestamp: number | undefined,
  genesisTimestamp: number | undefined,
  // Undefined while the validator set loads, which means "not known yet",
  // never "not a validator".
  owners: ValidatorOwners | undefined,
): IAccountBadges => {
  const validator = owners?.[address];

  return {
    // True for the 21 genesis validators too: they were created in block 0
    // like every other genesis account, so they carry both badges.
    foundation: isFoundationAccount(accountTimestamp, genesisTimestamp),
    validator: !!validator,
    genesisValidator: !!validator?.isGenesis,
    validatorList: validator?.list ?? '',
  };
};
