import {
  RIGHT_ALIGNED_COLUMNS,
  VALIDATOR_COLUMNS,
  ValidatorColumnKey,
} from '../columns';

describe('VALIDATOR_COLUMNS', () => {
  it('carries every key exactly once', () => {
    const keys = VALIDATOR_COLUMNS.map(column => column.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('gives every column a heading and a locale key', () => {
    VALIDATOR_COLUMNS.forEach(column => {
      expect(column.header).not.toBe('');
      expect(column.i18nKey.startsWith('validators:Table.')).toBe(true);
    });
  });

  /* Every column carries a width, and none is left to absorb the remainder.
     An unhinted column takes whatever the others leave, and that differs
     between a row of skeleton bars and a row of real values: measured at 1440,
     the validator column stood at 295px while loading and 320 once loaded, and
     every heading after it slid up to 56px sideways when the data arrived.
     Pinned, the loading and loaded headings sit on the same pixel. */
  it('gives every column a width, leaving no column to absorb the slack', () => {
    const flexible = VALIDATOR_COLUMNS.filter(column => !column.width);
    expect(flexible.map(column => column.key)).toEqual<ValidatorColumnKey[]>(
      [],
    );
  });

  /* And they have to add up to the row, or `auto` starts redistributing the
     difference by content again, which is the same defect by another route. */
  it('adds up to the width the row actually occupies', () => {
    const total = VALIDATOR_COLUMNS.reduce(
      (sum, column) => sum + (column.width ?? 0),
      0,
    );
    expect(total).toBe(1278);
  });

  it('puts capacity directly after commission', () => {
    // The two together are the delegation story: what a validator charges and
    // whether it still has room. Split apart they read as unrelated numbers.
    const keys = VALIDATOR_COLUMNS.map(column => column.key);
    expect(keys.indexOf('capacity')).toBe(keys.indexOf('commission') + 1);
  });
});

describe('RIGHT_ALIGNED_COLUMNS', () => {
  it('lists the index of every right-aligned column', () => {
    const expected = VALIDATOR_COLUMNS.reduce<number[]>(
      (acc, column, index) => (column.rightAligned ? [...acc, index] : acc),
      [],
    );
    expect(RIGHT_ALIGNED_COLUMNS).toEqual(expected);
  });

  it('names the five numeric columns and nothing else', () => {
    // The skin right-aligns by nth-child and the loading bars follow the same
    // list, so an index that drifts misaligns the header, the cell and the
    // skeleton all at once.
    const keys = RIGHT_ALIGNED_COLUMNS.map(
      index => VALIDATOR_COLUMNS[index].key,
    );
    expect(keys).toEqual<ValidatorColumnKey[]>([
      'rating',
      'stake',
      'commission',
      'produced',
      'missed',
    ]);
  });

  it('points only at columns that exist', () => {
    RIGHT_ALIGNED_COLUMNS.forEach(index => {
      expect(VALIDATOR_COLUMNS[index]).toBeDefined();
    });
  });
});
