export interface ISuccessRate {
  numSuccess: number;
  numFailure: number;
}

export interface IValidatorRates {
  /** Leader slots, which is what "a block this validator produced" means. */
  leaderSuccess: number;
  leaderFailure: number;
  /** Leader slots plus consensus signatures. Useful per validator, useless as
   *  a network block count: every block is signed by the rest of the group, so
   *  summed over the set this lands at roughly 21x the chain height (measured
   *  687.379.910 against a height of 32.806.707 on mainnet). */
  totalSuccess: number;
  totalFailure: number;
}

const count = (rate: ISuccessRate | undefined, key: keyof ISuccessRate) => {
  const value = rate?.[key];
  return Number.isFinite(value) ? (value as number) : 0;
};

/**
 * The two different things a validator's success rates measure, kept apart.
 *
 * A leaf module with no imports, so it is reachable by Jest: `parseValues`
 * pulls in `@/services/api` and the ITO chain, which the transform cannot
 * follow, and that is why this mapping had no test while it silently drove
 * every produced/missed figure on the site.
 */
export const validatorRates = (delegation: {
  totalLeaderSuccessRate?: ISuccessRate;
  totalValidatorSuccessRate?: ISuccessRate;
}): IValidatorRates => {
  const leaderSuccess = count(delegation.totalLeaderSuccessRate, 'numSuccess');
  const leaderFailure = count(delegation.totalLeaderSuccessRate, 'numFailure');
  const signedSuccess = count(
    delegation.totalValidatorSuccessRate,
    'numSuccess',
  );
  const signedFailure = count(
    delegation.totalValidatorSuccessRate,
    'numFailure',
  );

  return {
    leaderSuccess,
    leaderFailure,
    totalSuccess: leaderSuccess + signedSuccess,
    totalFailure: leaderFailure + signedFailure,
  };
};
