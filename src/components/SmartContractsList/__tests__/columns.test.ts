import {
  CONTRACT_COLUMNS,
  ContractColumnKey,
  RIGHT_ALIGNED_COLUMNS,
} from '../columns';

describe('CONTRACT_COLUMNS', () => {
  it('carries every key exactly once', () => {
    const keys = CONTRACT_COLUMNS.map(column => column.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('gives every column a heading and a locale key', () => {
    CONTRACT_COLUMNS.forEach(column => {
      expect(column.header).not.toBe('');
      expect(column.i18nKey.startsWith('smartContracts:Table.')).toBe(true);
    });
  });

  it('leaves exactly one column free to take the remaining width', () => {
    // On desktop a cell without a width is `fit-content`; more than one of
    // those and the columns share the slack unpredictably.
    const flexible = CONTRACT_COLUMNS.filter(column => !column.width);
    expect(flexible).toHaveLength(1);
    expect(flexible[0].key).toBe('contract');
  });
});

describe('RIGHT_ALIGNED_COLUMNS', () => {
  it('lists the index of every right-aligned column', () => {
    const expected = CONTRACT_COLUMNS.reduce<number[]>(
      (acc, column, index) => (column.rightAligned ? [...acc, index] : acc),
      [],
    );
    expect(RIGHT_ALIGNED_COLUMNS).toEqual(expected);
  });

  it('names the two numeric columns and nothing else', () => {
    // The skin right-aligns by nth-child and the loading bars follow the same
    // list, so an index that drifts misaligns the header, the cell and the
    // skeleton all at once.
    const keys = RIGHT_ALIGNED_COLUMNS.map(
      index => CONTRACT_COLUMNS[index].key,
    );
    expect(keys).toEqual<ContractColumnKey[]>(['upgrades', 'transactions']);
  });

  it('points only at columns that exist', () => {
    RIGHT_ALIGNED_COLUMNS.forEach(index => {
      expect(CONTRACT_COLUMNS[index]).toBeDefined();
    });
  });
});
