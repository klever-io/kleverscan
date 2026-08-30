import { NUMBER_LOCALE } from '@/components/DataList/format';
import { AmountMuted, AmountPrimary } from '@/components/DataList/styles';
import { CustomFieldWrapper } from '@/components/Table/styles';
import Tooltip from '@/components/Tooltip';
import { Mono } from '@/styles/common';
import { IRowSection } from '@/types/index';
import { SmartContractsList } from '@/types/smart-contract';
import { formatDate, formatDateWithSeconds } from '@/utils/formatFunctions';
import { parseAddress } from '@/utils/parseValues';
import Link from 'next/link';
import React from 'react';
import { ContractCell, DeployerCell } from './cells';
import { CONTRACT_COLUMNS, ContractColumnKey } from './columns';
import { NumericCell } from './styles';

/**
 * Widths and spans with no cell content. The shared Table calls `rowSections`
 * with a header string to read them, twice per header cell on every render,
 * and answering from here keeps the real builder off that path.
 */
export const COLUMN_LAYOUT: IRowSection[] = CONTRACT_COLUMNS.map(column => ({
  element: () => null,
  span: column.span ?? 1,
  width: column.width,
}));

export interface IContractRowContext {
  /** The deployer this whole list is already narrowed to by its caller, the
   *  way the account tab scopes by route segment rather than by `?deployer=`. */
  scopedTo?: string;
  /** False while the table's own request is still in flight, so the per-row
   *  name and deployer-count lookups stay off that path. */
  deferred: boolean;
}

export const contractRowSections = (
  contract: SmartContractsList | string,
  { deferred, scopedTo }: IContractRowContext = { deferred: false },
): IRowSection[] => {
  // The header-string probe above. Handled explicitly so a future dereference
  // of the argument cannot take the page down while rendering its own header.
  if (typeof contract !== 'object' || contract === null) return COLUMN_LAYOUT;

  const {
    name,
    contractAddress,
    deployer,
    deployTxHash,
    timestamp,
    upgrades,
    totalTransactions,
  } = contract;

  // Computed per row, not inside the tooltip: the body mounts on hover, and a
  // fresh formatDate there makes the visible elapsed time jump on pointer entry.
  const elapsed = formatDate(timestamp, { showElapsedTime: true }).split(
    ' (',
  )[0];

  // Defensive despite the type: this is the API boundary, `upgrades` is the
  // field three declarations here got wrong until now, and a row that throws
  // takes the whole table with it.
  const upgradeCount = Array.isArray(upgrades) ? upgrades.length : 0;

  // The key set pinned, not erased: a column added or renamed without a cell
  // is a compile error here, where an unchecked index made it a whole-page
  // render crash at runtime.
  const cells: Record<ContractColumnKey, IRowSection['element']> = {
    contract: () => (
      <ContractCell
        address={contractAddress}
        listName={name}
        deferred={deferred}
      />
    ),
    deployed: () => (
      <Tooltip
        msg={formatDateWithSeconds(timestamp)}
        focusable
        Component={() => <CustomFieldWrapper>{elapsed}</CustomFieldWrapper>}
      />
    ),
    deployer: () => (
      <DeployerCell
        deployer={deployer}
        deferred={deferred}
        scopedTo={scopedTo}
      />
    ),
    deployTx: () => (
      <Link href={`/transaction/${deployTxHash}`} title={deployTxHash}>
        <Mono>{parseAddress(deployTxHash, 12)}</Mono>
      </Link>
    ),
    // Muted, and a dash rather than a zero: most contracts are never
    // redeployed, and a column of zeros reads as missing data.
    upgrades: () => (
      <AmountMuted>
        {upgradeCount > 0 ? (
          <NumericCell>
            {upgradeCount.toLocaleString(NUMBER_LOCALE)}
          </NumericCell>
        ) : (
          '- -'
        )}
      </AmountMuted>
    ),
    transactions: () => (
      <AmountPrimary>
        <NumericCell>
          {(totalTransactions ?? 0).toLocaleString(NUMBER_LOCALE)}
        </NumericCell>
      </AmountPrimary>
    ),
  };

  return CONTRACT_COLUMNS.map(column => ({
    element: cells[column.key],
    span: column.span ?? 1,
    width: column.width,
  }));
};
