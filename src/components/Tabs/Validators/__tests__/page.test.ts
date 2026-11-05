import { buildBlockValidatorPage, IKnownValidator } from '../page';

const directory = (
  entries: Array<[string, IKnownValidator]>,
): Map<string, IKnownValidator> => new Map(entries);

// The leader is last on purpose. A page-2 assertion only fails when the
// leader was not pulled forward: with the leader already inside page 1,
// page 2 looks the same either way.
const keys = ['aa', 'cc', 'dd', 'bb'];

describe('buildBlockValidatorPage', () => {
  const byKey = directory([
    ['aa', { name: 'Alpha', ownerAddress: 'klv1alpha' }],
    ['bb', { name: 'Leader', ownerAddress: 'klv1leader' }],
    ['cc', { name: 'Gamma', ownerAddress: 'klv1gamma' }],
  ]);

  it('puts the block leader first and keeps the chain order of the rest', () => {
    const page = buildBlockValidatorPage(keys, 'klv1leader', byKey, 1, 10);
    expect(page.rows.map(row => row.blsKey)).toEqual(['bb', 'aa', 'cc', 'dd']);
    expect(page.rows.map(row => row.leader)).toEqual([
      true,
      false,
      false,
      false,
    ]);
    expect(page.rows[0]).toMatchObject({
      name: 'Leader',
      ownerAddress: 'klv1leader',
    });
    expect(page.pagination).toMatchObject({
      self: 1,
      next: 0,
      previous: 0,
      totalPages: 1,
      totalRecords: 4,
    });
  });

  it('points at the next page while one remains', () => {
    const page = buildBlockValidatorPage(keys, 'klv1leader', byKey, 1, 2);
    expect(page.rows.map(row => row.blsKey)).toEqual(['bb', 'aa']);
    expect(page.pagination.next).toBe(2);
    expect(page.pagination.previous).toBe(0);
  });

  it('keeps the leader on page 1, so page 2 starts at the next key', () => {
    const page = buildBlockValidatorPage(keys, 'klv1leader', byKey, 2, 2);
    expect(page.rows.map(row => row.blsKey)).toEqual(['cc', 'dd']);
    expect(page.rows.every(row => !row.leader)).toBe(true);
    expect(page.pagination).toMatchObject({
      self: 2,
      next: 0,
      previous: 1,
      totalPages: 2,
      totalRecords: 4,
    });
  });

  it('leaves the chain order alone when the block has no producer', () => {
    const page = buildBlockValidatorPage(keys, undefined, byKey, 1, 10);
    expect(page.rows.map(row => row.blsKey)).toEqual(keys);
    expect(page.rows.every(row => !row.leader)).toBe(true);
  });

  it('does not mark an unknown key as leader when the directory has not loaded', () => {
    const page = buildBlockValidatorPage(
      keys,
      'klv1leader',
      directory([]),
      1,
      10,
    );
    expect(page.rows.map(row => row.blsKey)).toEqual(keys);
    expect(page.rows.every(row => !row.leader && !row.ownerAddress)).toBe(
      true,
    );
  });

  it('joins a block key to the directory without caring about case', () => {
    const page = buildBlockValidatorPage(
      ['BB'],
      'klv1leader',
      byKey,
      1,
      10,
    );
    expect(page.rows[0]).toMatchObject({
      blsKey: 'BB',
      name: 'Leader',
      leader: true,
    });
  });

  it('returns no rows when the page size is zero', () => {
    const page = buildBlockValidatorPage(keys, 'klv1leader', byKey, 1, 0);
    expect(page.rows).toEqual([]);
    expect(page.pagination.totalPages).toBe(0);
  });
});
