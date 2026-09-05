export type ValidatorColumnKey =
  | 'rank'
  | 'validator'
  | 'status'
  | 'rating'
  | 'stake'
  | 'commission'
  | 'capacity'
  | 'produced'
  | 'missed'
  | 'version';

export interface IValidatorColumn {
  key: ValidatorColumnKey;
  /** English literal, and the fallback the heading hook translates against. */
  header: string;
  i18nKey: string;
  /** Fixed cell width; the validator column takes what is left. */
  width?: number;
  span?: number;
  /** Numeric columns sit against the right edge, values under their heading. */
  rightAligned?: boolean;
}

/**
 * The column layout of the validator list, in one place, so a heading cannot
 * drift from the cell under it. Single line per row, one datum per column,
 * the same move as blocks in #701 and smart-contracts in #703.
 *
 * `canDelegate` rides along as a badge in the validator cell. `capacity`
 * replaces "Cumulative Stake", which never held a cumulative figure: how full
 * a validator's delegation cap is answers the question this page is opened
 * for, and it spreads (74 validators at or above 99,5 percent, 71 below 25,
 * median 86,2).
 *
 * The row fits from `ROW_LAYOUT_MIN_WIDTH` (measured min-content 1185px plus
 * margin); a new column or a wider cell moves that measurement.
 */
export const VALIDATOR_COLUMNS: IValidatorColumn[] = [
  { key: 'rank', header: 'Rank', i18nKey: 'validators:Table.Rank', width: 65 },
  {
    key: 'validator',
    header: 'Validator',
    i18nKey: 'validators:Table.Validator',
    span: 2,
    width: 320,
  },
  {
    key: 'status',
    header: 'Status',
    i18nKey: 'validators:Table.Status',
    width: 97,
  },
  {
    key: 'rating',
    header: 'Rating',
    i18nKey: 'validators:Table.Rating',
    width: 83,
    rightAligned: true,
  },
  {
    key: 'stake',
    header: 'Stake',
    i18nKey: 'validators:Table.Stake',
    width: 140,
    rightAligned: true,
  },
  {
    key: 'commission',
    header: 'Commission',
    i18nKey: 'validators:Table.Commission',
    width: 109,
    rightAligned: true,
  },
  {
    key: 'capacity',
    header: 'Capacity',
    i18nKey: 'validators:Table.Capacity',
    width: 166,
  },
  {
    key: 'produced',
    header: 'Produced',
    i18nKey: 'validators:Table.Produced',
    width: 96,
    rightAligned: true,
  },
  {
    key: 'missed',
    header: 'Missed',
    i18nKey: 'validators:Table.Missed',
    width: 89,
    rightAligned: true,
  },
  {
    key: 'version',
    header: 'Version',
    i18nKey: 'validators:Table.Version',
    width: 113,
  },
];

/** Indexes the skin right-aligns, and the loading bars have to follow. */
export const RIGHT_ALIGNED_COLUMNS = VALIDATOR_COLUMNS.reduce<number[]>(
  (indexes, column, index) =>
    column.rightAligned ? [...indexes, index] : indexes,
  [],
);
