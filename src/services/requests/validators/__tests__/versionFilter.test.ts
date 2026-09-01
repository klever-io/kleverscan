import { IValidator } from '@/types/index';
import {
  canFilterByVersion,
  DEFAULT_PAGE_LIMIT,
  filterByName,
  filterByVersion,
  paginateValidators,
  usablePageNumber,
  versionFilteredPage,
} from '../versionFilter';

const validator = (
  index: number,
  overrides: Partial<IValidator> = {},
): IValidator =>
  ({
    ownerAddress: `klv1owner${index}`,
    parsedAddress: `klv1...${index}`,
    name: `Validator ${index}`,
    rank: index,
    staked: 1_000,
    cumulativeStaked: 1,
    rating: 10_000_000,
    selfStake: 100,
    status: 'elected',
    totalProduced: 10,
    totalMissed: 0,
    canDelegate: true,
    commission: 500,
    maxDelegation: 2_000,
    blsPublicKey: `BLS${index}`,
    ...overrides,
  }) as IValidator;

const many = (count: number): IValidator[] =>
  Array.from({ length: count }, (_, i) => validator(i + 1));

describe('usablePageNumber', () => {
  it('takes a sane integer as-is', () => {
    expect(usablePageNumber(3, 1)).toBe(3);
    expect(usablePageNumber(1, 1)).toBe(1);
  });

  it('floors a fractional value', () => {
    expect(usablePageNumber(2.9, 1)).toBe(2);
  });

  // The whole domain of the type, not the cases the code suggests: these
  // arrive from `router.query`, where anything can be typed.
  it.each([
    ['zero', 0],
    ['negative', -5],
    ['fractional below one', 0.4],
    ['NaN', NaN],
    ['Infinity', Infinity],
    ['-Infinity', -Infinity],
  ])('falls back on %s', (_label, value) => {
    expect(usablePageNumber(value as number, 7)).toBe(7);
  });
});

describe('paginateValidators', () => {
  it('cuts the page and reports the totals', () => {
    const page = paginateValidators(many(25), 2, 10);
    expect(page.data.validators).toHaveLength(10);
    expect((page.data.validators as IValidator[])[0].rank).toBe(11);
    expect(page.pagination.totalRecords).toBe(25);
    expect(page.pagination.totalPages).toBe(3);
    expect(page.pagination.self).toBe(2);
  });

  it('clamps a page past the end onto the last page', () => {
    const page = paginateValidators(many(25), 99, 10);
    expect(page.pagination.self).toBe(3);
    expect(page.data.validators).toHaveLength(5);
  });

  // The #696 regression, in this module: a limit of Infinity survived every
  // `> 0` test, made `start` NaN and the page empty, while the pager beside it
  // still announced every record. Rows and the count must agree.
  it.each([
    ['Infinity', Infinity],
    ['NaN', NaN],
    ['zero', 0],
    ['negative', -20],
    ['fractional', 0.5],
  ])('still returns rows when the limit is %s', (_label, limit) => {
    const page = paginateValidators(many(25), 1, limit as number);
    expect(page.pagination.totalRecords).toBe(25);
    expect(page.data.validators).toHaveLength(DEFAULT_PAGE_LIMIT);
    expect(page.pagination.perPage).toBe(DEFAULT_PAGE_LIMIT);
  });

  it('never reports more pages than the rows can fill', () => {
    [1, 5, 10, 25, 1_000].forEach(limit => {
      const page = paginateValidators(many(25), 1, limit);
      expect(page.pagination.totalPages).toBe(Math.ceil(25 / limit));
    });
  });

  it('holds an empty list at one page rather than zero', () => {
    const page = paginateValidators([], 1, 10);
    expect(page.pagination.totalPages).toBe(1);
    expect(page.pagination.totalRecords).toBe(0);
    expect(page.data.validators).toHaveLength(0);
  });

  it('keeps the incoming order, so rank matches its row', () => {
    const shuffled = [validator(9), validator(2), validator(7)];
    const page = paginateValidators(shuffled, 1, 10);
    expect((page.data.validators as IValidator[]).map(v => v.rank)).toEqual([
      9, 2, 7,
    ]);
  });
});

describe('filterByName', () => {
  it('matches a case-insensitive prefix, like the API does', () => {
    const list = [
      validator(1, { name: 'Alpha Node' }),
      validator(2, { name: 'alphabet' }),
      validator(3, { name: 'Beta' }),
    ];
    expect(filterByName(list, 'alpha')).toHaveLength(2);
  });

  it('does not match in the middle of a name', () => {
    const list = [validator(1, { name: 'Klever Alpha' })];
    expect(filterByName(list, 'alpha')).toHaveLength(0);
  });

  it('returns everything when no name is given', () => {
    const list = many(3);
    expect(filterByName(list, undefined)).toBe(list);
    expect(filterByName(list, '')).toBe(list);
  });

  it('survives a validator without a name', () => {
    const list = [validator(1, { name: undefined })];
    expect(() => filterByName(list, 'a')).not.toThrow();
    expect(filterByName(list, 'a')).toHaveLength(0);
  });
});

describe('filterByVersion', () => {
  const map = { bls1: 'v1.7.21', bls2: 'v1.7.20', bls3: 'v1.7.21' };

  it('keeps only the validators on that version', () => {
    expect(filterByVersion(many(3), map, 'v1.7.21')).toHaveLength(2);
  });

  it('matches case-insensitively', () => {
    expect(filterByVersion(many(3), map, 'V1.7.21')).toHaveLength(2);
  });

  // The inverse of the guard's purpose: Unknown is the largest group on
  // mainnet, so it has to be selectable rather than silently dropped.
  it('treats Unknown as a bucket that can be filtered on', () => {
    const withoutHeartbeat = [validator(4)];
    expect(filterByVersion(withoutHeartbeat, map, 'Unknown')).toHaveLength(1);
  });

  it('returns everything when no version is given', () => {
    const list = many(3);
    expect(filterByVersion(list, map, undefined)).toBe(list);
  });
});

describe('versionFilteredPage', () => {
  it('applies name and version together, then pages', () => {
    const list = [
      validator(1, { name: 'Alpha', blsPublicKey: 'BLS1' }),
      validator(2, { name: 'Alpine', blsPublicKey: 'BLS2' }),
      validator(3, { name: 'Beta', blsPublicKey: 'BLS3' }),
    ];
    const map = { bls1: 'v1.7.21', bls2: 'v1.7.21', bls3: 'v1.7.21' };
    const page = versionFilteredPage(
      list,
      map,
      { name: 'alp', version: 'v1.7.21' },
      1,
      10,
    );
    expect(page.pagination.totalRecords).toBe(2);
    expect((page.data.validators as IValidator[]).map(v => v.name)).toEqual([
      'Alpha',
      'Alpine',
    ]);
  });
});

/**
 * The guard that keeps an outage from reading as a result. Both halves of the
 * join have to be there, and the reverse case matters as much as the happy
 * one: a filter that stayed off after recovery would leave the page ignoring
 * the URL it was opened with.
 */
describe('canFilterByVersion', () => {
  const both = { heartbeatAvailable: true, validatorsAvailable: true };

  it('applies the filter when both halves of the join answered', () => {
    expect(canFilterByVersion({ version: 'v1.7.21', ...both })).toBe(true);
  });

  it('does not apply it when the heartbeat is down', () => {
    expect(
      canFilterByVersion({
        version: 'v1.7.21',
        heartbeatAvailable: false,
        validatorsAvailable: true,
      }),
    ).toBe(false);
  });

  it('does not apply it when the validator list is down', () => {
    expect(
      canFilterByVersion({
        version: 'v1.7.21',
        heartbeatAvailable: true,
        validatorsAvailable: false,
      }),
    ).toBe(false);
  });

  it('has nothing to apply without a version', () => {
    expect(canFilterByVersion({ version: undefined, ...both })).toBe(false);
    expect(canFilterByVersion({ version: '', ...both })).toBe(false);
  });

  /* The bucket the empty map produces. `?version=Unknown` with the heartbeat
     down would otherwise filter every row against an empty join and answer a
     successful empty page. */
  it('does not apply the Unknown bucket while the heartbeat is down', () => {
    expect(
      canFilterByVersion({
        version: 'Unknown',
        heartbeatAvailable: false,
        validatorsAvailable: true,
      }),
    ).toBe(false);
  });
});
