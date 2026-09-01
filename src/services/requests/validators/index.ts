import api from '@/services/api';
import { IPaginatedResponse, IValidator } from '@/types/index';
import { parseValidators } from '@/utils/parseValues';
import { NextParsedUrlQuery } from 'next/dist/server/request-meta';

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
 *
 * Returns the list whole, jailed included. It used to drop them to match
 * `validatorsCall`, which made this the second source of a number the table
 * already had: on mainnet the summary counted 180 where the rows listed 209,
 * and which figure the page showed depended on whichever request answered
 * first. `validatorsCall` still filters, because it feeds the delegation form
 * and a jailed validator cannot be delegated to.
 */
export const fetchAllValidators = async (): Promise<{
  validators: IValidator[];
  totalRecords: number;
  networkTotalStake: number;
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

  const validators = pages.flat();

  return {
    validators,
    // The rows themselves, not the header the API sent: they are the set every
    // figure on the page is computed from.
    totalRecords: validators.length || totalRecords,
    // Passed through rather than re-derived: this is the same denominator
    // `parseValidators` divides each row by, so the summary tile and the
    // per-row shares agree by construction.
    networkTotalStake: first.data?.networkTotalStake ?? 0,
  };
};

/**
 * What narrows this list, named rather than inherited. An allowlist so the
 * request carries filters only: the page keeps other state in the URL, and
 * forwarding that would hand the API this table's view state as if it were a
 * filter. `version` is deliberately absent, it has no server-side counterpart
 * and is resolved against the heartbeat join in `versionFilter.ts`.
 */
const FILTER_PARAMS = ['name'];

export const validatorsTableRequest = async (
  page: number,
  limit: number,
  query: NextParsedUrlQuery,
): Promise<IPaginatedResponse> => {
  const parsedQuery: Record<string, unknown> = { sort: 'elected' };

  FILTER_PARAMS.forEach(key => {
    const value = query?.[key];
    if (typeof value === 'string' && value !== '') {
      parsedQuery[key] = value;
    }
  });

  // Last, so a spoofed page or limit in the URL cannot reach the API through
  // the allowlist above; they come from the caller's arguments instead.
  parsedQuery.page = page;
  parsedQuery.limit = limit;

  const response = await api.get({
    route: 'validator/list',
    query: parsedQuery,
  });

  if (response.error) return response;

  return { ...response, data: { validators: parseValidators(response) } };
};
