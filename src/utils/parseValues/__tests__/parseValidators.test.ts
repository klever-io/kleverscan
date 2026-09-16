/* The module reaches `@/services/requests/ito`, whose chain Jest cannot
   transform. Factory mocks never load the real modules, which is what makes
   this file importable at all; none of the mocked exports is on the path
   under test. */
jest.mock('@/services/requests/ito', () => ({
  processITOPrecisions: jest.fn(),
}));

jest.mock('@/services/api', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

import { IValidatorResponse } from '@/types';
import { parseValidators } from '../index';

const response = (
  rates: Partial<{
    totalLeaderSuccessRate: { numSuccess: number; numFailure: number };
    totalValidatorSuccessRate: { numSuccess: number; numFailure: number };
  }>,
): IValidatorResponse =>
  ({
    data: {
      validators: [
        {
          ownerAddress: 'klv1owner',
          name: 'Validator',
          totalStake: 1_000,
          rating: 10_000_000,
          canDelegate: true,
          selfStake: 100,
          list: 'elected',
          commission: 500,
          maxDelegation: 2_000,
          blsPublicKey: 'BLS',
          ...rates,
        },
      ],
      networkTotalStake: 10_000,
    },
    pagination: { self: 1, perPage: 10 },
  }) as unknown as IValidatorResponse;

/**
 * The hop from `validatorRates` onto `IValidator`, which nothing covered:
 * `services/requests/__tests__/validators.test.ts` mocks `parseValidators`
 * out, and the `summaryFigures` suites build `IValidator` by hand. Swapping
 * these four assignments puts the consensus-signature total back on the
 * summary tile, roughly 21x the chain height, and every other test stays
 * green.
 */
describe('parseValidators rate wiring', () => {
  const rates = {
    totalLeaderSuccessRate: { numSuccess: 100, numFailure: 5 },
    totalValidatorSuccessRate: { numSuccess: 2_000, numFailure: 35 },
  };

  it('puts leader slots on blocksProduced and the combined total on totalProduced', () => {
    const [validator] = parseValidators(response(rates));

    expect(validator.blocksProduced).toBe(100);
    expect(validator.totalProduced).toBe(2_100);
  });

  it('keeps the same split on the failure side', () => {
    const [validator] = parseValidators(response(rates));

    expect(validator.blocksMissed).toBe(5);
    expect(validator.totalMissed).toBe(40);
  });

  /* The two fields are not interchangeable and a swap has to be visible: the
     leader count is a block count, the total is not. */
  it('keeps the leader figures under the combined ones', () => {
    const [validator] = parseValidators(response(rates));

    expect(validator.blocksProduced).toBeLessThan(validator.totalProduced);
    expect(validator.blocksMissed).toBeLessThan(validator.totalMissed);
  });

  it('reads a missing rate as zero rather than NaN', () => {
    const [validator] = parseValidators(response({}));

    expect(validator.blocksProduced).toBe(0);
    expect(validator.totalProduced).toBe(0);
    expect(validator.blocksMissed).toBe(0);
    expect(validator.totalMissed).toBe(0);
  });
});
