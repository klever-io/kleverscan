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
 * drift from the cell under it.
 *
 * Single line per row, one datum per column. The page stacked two values in
 * four of its seven cells, which measured 83px per row against the 60px every
 * other list here uses. Same move as blocks in #701 and smart-contracts in
 * #703.
 *
 * `canDelegate` lost its column in that change: it is a yes/no that now rides
 * along as a badge in the validator cell, the way accounts carries its badges.
 *
 * `capacity` replaces the old "Cumulative Stake". That column never held a
 * cumulative figure: `parseValidators` fills it with the validator's own share
 * of network stake, which measured 0,35 percent per row on mainnet and drew a
 * 0,47px fill on a 134px track. How full a validator's delegation cap already
 * is answers the question this page is actually opened for, and it spreads:
 * 74 validators sit at or above 99,5 percent, 71 below 25 percent, median 86,2.
 * It sits beside Commission because the two together are the delegation story.
 */
/**
 * The viewport width from which a validator fits on one row.
 *
 * Measured over 50 rows: the row's min-content is 1185px against a content box
 * of `viewport - 32`, and the page stops scrolling sideways at 1220. 1240
 * leaves margin, and matches what the transactions row needs, so the two lists
 * change shape at the same width.
 *
 * Below this the list renders as cards. It used to squeeze instead, between
 * the tablet breakpoint and 1300px, by truncating cells, narrowing the
 * capacity track and dropping the cell padding to 7px. That squeeze still left
 * the page 119px too wide at 1026, because nothing bounded the validator name;
 * `AddressLink` is capped in the wrapper now, and the row is not asked to fit
 * a viewport it does not fit.
 *
 * This lives next to the column list because that is what it measures: a new
 * column or a wider cell moves it.
 */
export const ROW_LAYOUT_MIN_WIDTH = 1240;

export const VALIDATOR_COLUMNS: IValidatorColumn[] = [
  { key: 'rank', header: 'Rank', i18nKey: 'validators:Table.Rank', width: 70 },
  {
    key: 'validator',
    header: 'Validator',
    i18nKey: 'validators:Table.Validator',
    span: 2,
  },
  {
    key: 'status',
    header: 'Status',
    i18nKey: 'validators:Table.Status',
    width: 110,
  },
  {
    key: 'rating',
    header: 'Rating',
    i18nKey: 'validators:Table.Rating',
    width: 90,
    rightAligned: true,
  },
  {
    key: 'stake',
    header: 'Stake',
    i18nKey: 'validators:Table.Stake',
    width: 160,
    rightAligned: true,
  },
  {
    key: 'commission',
    header: 'Commission',
    i18nKey: 'validators:Table.Commission',
    width: 100,
    rightAligned: true,
  },
  {
    key: 'capacity',
    header: 'Capacity',
    i18nKey: 'validators:Table.Capacity',
    width: 150,
  },
  {
    key: 'produced',
    header: 'Produced',
    i18nKey: 'validators:Table.Produced',
    width: 100,
    rightAligned: true,
  },
  {
    key: 'missed',
    header: 'Missed',
    i18nKey: 'validators:Table.Missed',
    width: 100,
    rightAligned: true,
  },
  {
    key: 'version',
    header: 'Version',
    i18nKey: 'validators:Table.Version',
    width: 130,
  },
];

/** Indexes the skin right-aligns, and the loading bars have to follow. */
export const RIGHT_ALIGNED_COLUMNS = VALIDATOR_COLUMNS.reduce<number[]>(
  (indexes, column, index) =>
    column.rightAligned ? [...indexes, index] : indexes,
  [],
);
