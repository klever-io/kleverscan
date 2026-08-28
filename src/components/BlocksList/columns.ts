export type BlockColumnKey =
  | 'block'
  | 'age'
  | 'txs'
  | 'size'
  | 'producer'
  | 'kAppFees'
  | 'burnedFees'
  | 'feeRewards'
  | 'blockRewards';

export interface IBlockColumn {
  key: BlockColumnKey;
  /** English literal, and the fallback the heading hook translates against. */
  header: string;
  i18nKey: string;
  /** Fixed cell width; the producer column takes what is left. */
  width?: number;
  span?: number;
  /** Numeric columns sit against the right edge, values under their heading. */
  rightAligned?: boolean;
}

/**
 * The column layout of the blocks list, in one place, so a heading cannot
 * drift from the cell under it.
 *
 * Single line per row, one datum per column. The page used to stack two
 * values in each of five cells, which made the row 83px against the 60px
 * every other list here uses. Same move as the transactions table in #692.
 *
 * `epoch` lost its column in that change: it is derivable from the nonce and
 * the rarest reason to open this page. It survives in the mobile card and in
 * the block cell's tooltip.
 */
export const BLOCK_COLUMNS: IBlockColumn[] = [
  { key: 'block', header: 'Block', i18nKey: 'blocks:Table.Block', width: 110 },
  { key: 'age', header: 'Age', i18nKey: 'blocks:Table.Age', width: 120 },
  // Left, like Block and Age: both are short values in wide-enough columns,
  // and the amounts on the right are what the right edge is reserved for.
  { key: 'txs', header: 'Txs', i18nKey: 'blocks:Table.Txs', width: 80 },
  { key: 'size', header: 'Size', i18nKey: 'blocks:Table.Size', width: 100 },
  {
    key: 'producer',
    header: 'Produced by',
    i18nKey: 'blocks:Table.ProducedBy',
    span: 2,
  },
  {
    key: 'kAppFees',
    header: 'kApp Fees',
    i18nKey: 'blocks:Table.KAppFees',
    width: 120,
    rightAligned: true,
  },
  {
    key: 'burnedFees',
    header: 'Burned Fees',
    i18nKey: 'blocks:Table.BurnedFees',
    width: 130,
    rightAligned: true,
  },
  {
    key: 'feeRewards',
    header: 'Fee Rewards',
    i18nKey: 'blocks:Table.FeeRewards',
    width: 130,
    rightAligned: true,
  },
  {
    key: 'blockRewards',
    header: 'Block Rewards',
    i18nKey: 'blocks:Table.BlockRewards',
    width: 140,
    rightAligned: true,
  },
];

/** Indexes the skin right-aligns, and the loading bars have to follow. */
export const RIGHT_ALIGNED_COLUMNS = BLOCK_COLUMNS.reduce<number[]>(
  (indexes, column, index) =>
    column.rightAligned ? [...indexes, index] : indexes,
  [],
);
