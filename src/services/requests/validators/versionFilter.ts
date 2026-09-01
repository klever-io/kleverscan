import {
  resolveValidatorVersion,
  UNKNOWN_VERSION,
} from '@/services/requests/heartbeat';
import { IPaginatedResponse, IValidator } from '@/types/index';

/** Page size to fall back on when the URL carries something unusable. */
export const DEFAULT_PAGE_LIMIT = 10;

/**
 * A page or limit that reached us from `router.query`, reduced to a usable
 * integer.
 *
 * `Number.isFinite` first, and deliberately: `Infinity` is the value that got
 * past the equivalent guard on the accounts list (#696). It survives every
 * `> 0` and `Math.max` test, then turns `(page - 1) * limit` into `NaN` and
 * `slice(NaN, NaN)` into an empty page, while the pager beside it still
 * reports the full record count.
 */
export const usablePageNumber = (value: number, fallback: number): number => {
  if (!Number.isFinite(value)) return fallback;
  const floored = Math.floor(value);
  return floored >= 1 ? floored : fallback;
};

/** Mirrors the API's own name matching: case-insensitive prefix. */
export const filterByName = (
  validators: IValidator[],
  name?: string,
): IValidator[] => {
  if (!name) return validators;
  const needle = name.toLowerCase();
  return validators.filter(validator =>
    validator.name?.toLowerCase().startsWith(needle),
  );
};

/**
 * Validators running one software version.
 *
 * `Unknown` is a selectable bucket, not an absence: on mainnet roughly a third
 * of the list has no heartbeat at all, so a filter that silently dropped them
 * would hide its largest group.
 */
export const filterByVersion = (
  validators: IValidator[],
  versionMap: Record<string, string>,
  version?: string,
): IValidator[] => {
  if (!version) return validators;
  const wanted = version.toLowerCase();
  return validators.filter(
    validator =>
      resolveValidatorVersion(
        validator.blsPublicKey,
        versionMap,
      ).toLowerCase() === wanted,
  );
};

/**
 * One page of an already-filtered list, in the shape the shared Table expects.
 *
 * The row order is left alone: `parseValidators` numbered these by their
 * position in the network election, and re-sorting here would print a rank
 * that does not match the row it sits on.
 */
export const paginateValidators = (
  validators: IValidator[],
  page: number,
  limit: number,
): IPaginatedResponse => {
  const safeLimit = usablePageNumber(limit, DEFAULT_PAGE_LIMIT);
  const totalRecords = validators.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / safeLimit));
  const safePage = Math.min(usablePageNumber(page, 1), totalPages);
  const start = (safePage - 1) * safeLimit;

  return {
    data: { validators: validators.slice(start, start + safeLimit) },
    pagination: {
      self: safePage,
      next: Math.min(safePage + 1, totalPages),
      previous: Math.max(safePage - 1, 1),
      perPage: safeLimit,
      totalPages,
      totalRecords,
    },
    error: '',
    code: 'successful',
  };
};

/** The whole client-side path in one call, so the page holds none of it. */
export const versionFilteredPage = (
  validators: IValidator[],
  versionMap: Record<string, string>,
  { version, name }: { version?: string; name?: string },
  page: number,
  limit: number,
): IPaginatedResponse =>
  paginateValidators(
    filterByVersion(filterByName(validators, name), versionMap, version),
    page,
    limit,
  );

export { UNKNOWN_VERSION };
