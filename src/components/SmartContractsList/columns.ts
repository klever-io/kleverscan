export type ContractColumnKey =
  | 'contract'
  | 'deployed'
  | 'deployer'
  | 'deployTx'
  | 'upgrades'
  | 'transactions';

export interface IContractColumn {
  key: ContractColumnKey;
  /** English literal, and the fallback the heading hook translates against. */
  header: string;
  i18nKey: string;
  /** Fixed cell width; the contract column takes what is left. */
  width?: number;
  span?: number;
  /** Numeric columns sit against the right edge, values under their heading. */
  rightAligned?: boolean;
}

/**
 * The column layout of the deployed-contracts list, in one place, so a heading
 * cannot drift from the cell under it.
 *
 * Single line per row, one datum per column. The page used to stack two values
 * in two of its four cells, which made the row 83px against the 60px every
 * other list here uses. Same move as blocks in #701 and transactions in #692.
 *
 * Identity left, numbers right-aligned at the end, matching accounts and
 * blocks. `upgrades` is new: the field was already in the response and already
 * destructured by the old row builder, but never rendered.
 */
export const CONTRACT_COLUMNS: IContractColumn[] = [
  {
    key: 'contract',
    header: 'Contract',
    i18nKey: 'smartContracts:Table.Contract',
    span: 2,
  },
  {
    key: 'deployed',
    header: 'Deployed',
    i18nKey: 'smartContracts:Table.Deployed',
    width: 120,
  },
  {
    key: 'deployer',
    header: 'Deployer',
    i18nKey: 'smartContracts:Table.Deployer',
    width: 210,
  },
  {
    key: 'deployTx',
    header: 'Deploy Tx',
    i18nKey: 'smartContracts:Table.DeployTx',
    width: 190,
  },
  {
    key: 'upgrades',
    header: 'Upgrades',
    i18nKey: 'smartContracts:Table.Upgrades',
    width: 110,
    rightAligned: true,
  },
  {
    key: 'transactions',
    header: 'Transactions',
    i18nKey: 'smartContracts:Table.Transactions',
    width: 150,
    rightAligned: true,
  },
];

/** Indexes the skin right-aligns, and the loading bars have to follow. */
export const RIGHT_ALIGNED_COLUMNS = CONTRACT_COLUMNS.reduce<number[]>(
  (indexes, column, index) =>
    column.rightAligned ? [...indexes, index] : indexes,
  [],
);
