import api from '@/services/api';
import { IValidator } from '@/types/index';
import { parseValidators } from '@/utils/parseValues';

const VALIDATOR_PAGE_LIMIT = 100;

export class FetchAllValidatorsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FetchAllValidatorsError';
  }
}

export const validatorsCall = async (
  pageParam = 1,
  partialName = '',
): Promise<any> => {
  try {
    const validatorsResponse = await api.get({
      route: 'validator/list',
      query: { sort: 'elected', page: pageParam, name: partialName },
    });

    if (!validatorsResponse.error) {
      validatorsResponse.data.validators =
        validatorsResponse.data.validators.filter(
          (e: any) => e.list !== 'jailed',
        );
      const parsedValidators = parseValidators(validatorsResponse);

      return { ...validatorsResponse, data: { validators: parsedValidators } };
    } else {
      return validatorsResponse;
    }
  } catch (error) {
    console.error(error);
  }
};

/**
 * Fetch every page of the validator list (API caps at 100 per page).
 * Used for version stats, stake-weighting, and client-side version filters.
 * First page is sequential (to learn totalPages); remaining pages load in parallel.
 * Throws on any page failure so callers do not treat partial data as complete.
 */
export const fetchAllValidators = async (): Promise<{
  validators: IValidator[];
  totalRecords: number;
}> => {
  const first = await api.get({
    route: 'validator/list',
    query: { sort: 'elected', page: 1, limit: VALIDATOR_PAGE_LIMIT },
  });

  if (first?.error || !first?.data?.validators) {
    throw new FetchAllValidatorsError(
      typeof first?.error === 'string'
        ? first.error
        : 'Failed to load validator list',
    );
  }

  const totalPages = first.pagination?.totalPages ?? 1;
  const totalRecords =
    first.pagination?.totalRecords ?? first.data.validators.length;

  const pages = [parseValidators(first)];

  if (totalPages > 1) {
    const rest = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, i) =>
        api.get({
          route: 'validator/list',
          query: {
            sort: 'elected',
            page: i + 2,
            limit: VALIDATOR_PAGE_LIMIT,
          },
        }),
      ),
    );

    for (let i = 0; i < rest.length; i++) {
      const response = rest[i];
      if (response?.error || !response?.data?.validators) {
        throw new FetchAllValidatorsError(
          `Failed to load validator list page ${i + 2}`,
        );
      }
      pages.push(parseValidators(response));
    }
  }

  // Match validatorsCall: exclude jailed so version stats/filters align with the list.
  const validators = pages
    .flat()
    .filter(validator => validator.status !== 'jailed');

  return {
    validators,
    // Prefer filtered count so totals match the dataset used for aggregation.
    totalRecords: validators.length || totalRecords,
  };
};
